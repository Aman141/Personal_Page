interface FooterProps {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export default function Footer({ email, githubUrl, linkedinUrl }: FooterProps) {
  return (
    <footer className="flex flex-col items-center gap-2 mb-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      <div className="flex gap-4">
        <a href={`mailto:${email}`} className="hover:underline">
          Email
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
