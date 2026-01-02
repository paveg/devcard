export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>
          Made with care by{' '}
          <a
            href="https://github.com/paveg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            paveg
          </a>
          {' · '}
          <a
            href="https://github.com/paveg/devcard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
