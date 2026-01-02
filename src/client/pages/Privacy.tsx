import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Privacy() {
  const { t, i18n } = useTranslation();
  const isJapanese = i18n.language === 'ja';

  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <Button asChild variant="ghost" className="mb-8 gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          {t('privacy.back', 'Back to Home')}
        </Link>
      </Button>

      <article className="prose prose-invert max-w-none">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">
          {t('privacy.title', 'Privacy Policy')}
        </h1>

        <p className="text-muted-foreground">
          {t('privacy.lastUpdated', 'Last updated')}: 2026-01-02
        </p>

        {isJapanese ? (
          <>
            <section className="mt-8">
              <h2 className="text-xl font-semibold">アナリティクスについて</h2>
              <p className="mt-4 text-muted-foreground">
                本サイトでは、サービス改善のために{' '}
                <a
                  href="https://www.cloudflare.com/web-analytics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Cloudflare Web Analytics
                </a>{' '}
                を使用しています。
              </p>
              <p className="mt-4 text-muted-foreground">
                Cloudflare Web Analytics は、プライバシーを重視した分析ツールです：
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>クッキーを使用しません</li>
                <li>個人を特定する情報を収集しません</li>
                <li>クロスサイトトラッキングを行いません</li>
                <li>ページビューやパフォーマンスメトリクスなどの集計データのみを収集します</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">収集するデータ</h2>
              <p className="mt-4 text-muted-foreground">
                本サービスでは、GitHubのパブリックAPIを通じてユーザー名に基づく公開情報のみを取得します。
                ユーザーの認証情報やプライベートリポジトリの情報は一切収集しません。
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">お問い合わせ</h2>
              <p className="mt-4 text-muted-foreground">
                プライバシーに関するご質問は、{' '}
                <a
                  href="https://github.com/paveg/devcard/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub Issues
                </a>{' '}
                までお問い合わせください。
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="mt-4 text-muted-foreground">
                This site uses{' '}
                <a
                  href="https://www.cloudflare.com/web-analytics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Cloudflare Web Analytics
                </a>{' '}
                to improve our service.
              </p>
              <p className="mt-4 text-muted-foreground">
                Cloudflare Web Analytics is a privacy-focused analytics tool:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Does not use cookies</li>
                <li>Does not collect personally identifiable information</li>
                <li>Does not track users across sites</li>
                <li>Only collects aggregated data such as page views and performance metrics</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">Data Collection</h2>
              <p className="mt-4 text-muted-foreground">
                This service only retrieves public information based on GitHub usernames through
                GitHub's public API. We do not collect any authentication credentials or private
                repository information.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">Contact</h2>
              <p className="mt-4 text-muted-foreground">
                For privacy-related questions, please contact us via{' '}
                <a
                  href="https://github.com/paveg/devcard/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub Issues
                </a>
                .
              </p>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
