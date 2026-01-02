import type { Env, GitHubRepo, GitHubUser, LanguageEdge, LanguageStats, UserStats } from '../types';
import { calculateRank } from '../utils';
import type { Observability } from '../utils/observability';

const GITHUB_API = 'https://api.github.com/graphql';

interface GitHubApiMetrics {
  endpoint: string;
  status: number;
  duration: number;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
}

let observabilityInstance: Observability | null = null;

export function setObservability(obs: Observability): void {
  observabilityInstance = obs;
}

function recordGitHubMetrics(metrics: GitHubApiMetrics): void {
  if (observabilityInstance) {
    observabilityInstance.recordGitHubApiCall(
      metrics.endpoint,
      metrics.status,
      metrics.duration,
      metrics.rateLimitRemaining
    );
  }

  // Always log rate limit warnings
  if (metrics.rateLimitRemaining !== undefined && metrics.rateLimitRemaining < 100) {
    console.log(
      JSON.stringify({
        level: 'warn',
        type: 'github_rate_limit',
        timestamp: new Date().toISOString(),
        remaining: metrics.rateLimitRemaining,
        reset: metrics.rateLimitReset,
        endpoint: metrics.endpoint,
      })
    );
  }
}

const USER_STATS_QUERY = `
query userStats($login: String!) {
  user(login: $login) {
    login
    name
    avatarUrl
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
    }
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
    followers {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
      totalCount
      nodes {
        stargazerCount
        forkCount
      }
    }
  }
}
`;

const TOP_LANGUAGES_QUERY = `
query topLanguages($login: String!, $first: Int!) {
  user(login: $login) {
    repositories(first: $first, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
      nodes {
        languages(first: 10, orderBy: {direction: DESC, field: SIZE}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

const REPO_QUERY = `
query repoInfo($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    nameWithOwner
    description
    primaryLanguage {
      name
      color
    }
    stargazerCount
    forkCount
    isArchived
    isFork
    isTemplate
  }
}
`;

const fetchGitHub = async <T>(
  query: string,
  variables: Record<string, unknown>,
  token?: string,
  endpoint = 'graphql'
): Promise<T> => {
  if (!token) {
    throw new Error('GitHub token is required');
  }

  const start = Date.now();
  let status = 0;
  let rateLimitRemaining: number | undefined;
  let rateLimitReset: number | undefined;

  try {
    const response = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'devcard',
      },
      body: JSON.stringify({ query, variables }),
    });

    status = response.status;

    // Extract rate limit headers
    rateLimitRemaining =
      parseInt(response.headers.get('X-RateLimit-Remaining') || '', 10) || undefined;
    rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset') || '', 10) || undefined;

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { data: T; errors?: Array<{ message: string }> };

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    return data.data;
  } finally {
    const duration = Date.now() - start;
    recordGitHubMetrics({
      endpoint,
      status: status || 0,
      duration,
      rateLimitRemaining,
      rateLimitReset,
    });
  }
};

export const fetchUserStats = async (
  username: string,
  env: Env,
  includeAllCommits: boolean = false
): Promise<UserStats> => {
  const data = await fetchGitHub<{ user: GitHubUser }>(
    USER_STATS_QUERY,
    { login: username },
    env.GITHUB_TOKEN,
    'user_stats'
  );

  const user = data.user;
  if (!user) {
    throw new Error(`User "${username}" not found`);
  }

  const totalStars = user.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);
  const totalForks = user.repositories.nodes.reduce((acc, repo) => acc + repo.forkCount, 0);

  const totalCommits = includeAllCommits
    ? user.contributionsCollection.totalCommitContributions +
      user.contributionsCollection.restrictedContributionsCount
    : user.contributionsCollection.totalCommitContributions;

  const stats = {
    name: user.name || user.login,
    username: user.login,
    totalStars,
    totalForks,
    totalCommits,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    totalReviews: user.contributionsCollection.totalPullRequestReviewContributions,
    contributedTo: user.repositoriesContributedTo.totalCount,
    followers: user.followers.totalCount,
    rank: { level: 'C', percentile: 100, score: 0 },
  };

  stats.rank = calculateRank(stats);

  return stats;
};

export const fetchTopLanguages = async (
  username: string,
  env: Env,
  _excludeRepos: string[] = [],
  langsCount: number = 5
): Promise<LanguageStats> => {
  const data = await fetchGitHub<{
    user: {
      repositories: {
        nodes: Array<{
          languages: {
            edges: LanguageEdge[];
          };
        }>;
      };
    };
  }>(TOP_LANGUAGES_QUERY, { login: username, first: 100 }, env.GITHUB_TOKEN, 'top_languages');

  if (!data.user) {
    throw new Error(`User "${username}" not found`);
  }

  const langSizes: Record<string, { name: string; color: string; size: number }> = {};

  for (const repo of data.user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const lang = edge.node.name;
      if (!langSizes[lang]) {
        langSizes[lang] = {
          name: lang,
          color: edge.node.color || '#858585',
          size: 0,
        };
      }
      langSizes[lang].size += edge.size;
    }
  }

  const sorted = Object.values(langSizes)
    .sort((a, b) => b.size - a.size)
    .slice(0, langsCount);

  const totalSize = sorted.reduce((acc, lang) => acc + lang.size, 0);

  const result: LanguageStats = {};
  for (const lang of sorted) {
    result[lang.name] = {
      ...lang,
      percentage: totalSize === 0 ? 0 : Math.round((lang.size / totalSize) * 1000) / 10,
    };
  }

  return result;
};

export const fetchRepo = async (owner: string, name: string, env: Env): Promise<GitHubRepo> => {
  const data = await fetchGitHub<{ repository: GitHubRepo }>(
    REPO_QUERY,
    { owner, name },
    env.GITHUB_TOKEN,
    'repo_info'
  );

  if (!data.repository) {
    throw new Error(`Repository "${owner}/${name}" not found`);
  }

  return data.repository;
};
