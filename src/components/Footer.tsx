// Not a client component: there is no state or handler here, and rendering on
// the server keeps the links in the HTML for crawlers.

interface FooterProps {
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export default function Footer({
  githubUrl,
  linkedinUrl,
  twitterUrl,
  instagramUrl,
}: FooterProps) {
  const links = [
    { label: "GitHub", href: githubUrl },
    { label: "LinkedIn", href: linkedinUrl },
    { label: "X", href: twitterUrl },
    { label: "Instagram", href: instagramUrl },
  ];

  // Evaluated when the page is built, not when it is viewed — these routes are
  // static. It goes stale on 1 January until the next deploy, which is still
  // better than a literal that goes stale silently and never self-corrects.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-subtle">
      <div className="shell mono-label flex flex-wrap items-center gap-x-6 gap-y-3 py-6 text-[12px] tracking-[0.08em]">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted transition-colors hover:text-action"
          >
            {label}
          </a>
        ))}
        <span className="text-ink-faint sm:ml-auto">
          © {year} Aman Kumar · Berlin
        </span>
      </div>
    </footer>
  );
}
