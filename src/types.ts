// GitHub API Response Types
export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  contributionsCollection: {
    totalCommitContributions: number;
    restrictedContributionsCount: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    totalIssueContributions: number;
  };
  repositoriesContributedTo: {
    totalCount: number;
  };
  pullRequests: {
    totalCount: number;
  };
  issues: {
    totalCount: number;
  };
  followers: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
    nodes: Array<{
      stargazerCount: number;
      forkCount: number;
    }>;
  };
}

export interface GitHubRepo {
  name: string;
  nameWithOwner: string;
  description: string | null;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  stargazerCount: number;
  forkCount: number;
  isArchived: boolean;
  isFork: boolean;
  isTemplate: boolean;
}

export interface LanguageNode {
  name: string;
  color: string;
}

export interface LanguageEdge {
  size: number;
  node: LanguageNode;
}

export interface RepoLanguages {
  languages: {
    edges: LanguageEdge[];
  };
}

// Stats Types
export interface UserStats {
  name: string;
  username: string;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  contributedTo: number;
  followers: number;
  rank: RankInfo;
}

export interface RankInfo {
  level: string;
  percentile: number;
  score: number;
}

export interface LanguageStats {
  [language: string]: {
    name: string;
    color: string;
    size: number;
    percentage: number;
  };
}

// Card Options
export interface CardOptions {
  titleColor?: string;
  textColor?: string;
  iconColor?: string;
  borderColor?: string;
  bgColor?: string;
  hideBorder?: boolean;
  hideTitle?: boolean;
  hideRank?: boolean;
  showIcons?: boolean;
  hide?: string[];
  show?: string[];
  theme?: string;
  locale?: string;
  cardWidth?: number;
  disableAnimations?: boolean;
}

export interface StatsCardOptions extends CardOptions {
  includeAllCommits?: boolean;
  rankIcon?: 'default' | 'github' | 'percentile';
  ringColor?: string;
  customTitle?: string;
}

export interface LanguagesCardOptions extends CardOptions {
  layout?: 'normal' | 'compact' | 'donut' | 'donut-vertical' | 'pie';
  langsCount?: number;
  excludeRepo?: string[];
  hideProgress?: boolean;
  sizeWeight?: number;
  countWeight?: number;
  customTitle?: string;
}

export interface RepoCardOptions extends CardOptions {
  showOwner?: boolean;
  descriptionLinesCount?: number;
}

// Theme
export interface Theme {
  titleColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  ringColor?: string;
}

// Environment
export interface Env {
  GITHUB_TOKEN?: string;
  CACHE?: KVNamespace;
  ASSETS: Fetcher;
}