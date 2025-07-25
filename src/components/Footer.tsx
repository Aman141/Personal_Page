"use client";

import { Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react";

interface FooterProps {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export default function Footer({
  email,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  instagramUrl,
}: FooterProps) {
  return (
    <>
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
      <footer className="flex flex-col items-center justify-center gap-4 py-10 sm:p-12 mx-4 sm:mx-12">
        <h3 className="text-lg font-semibold">Contact</h3>
        <div className="flex gap-8">
          <a
            href={`mailto:${email}`}
            className="hover:underline"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>
      </footer>
    </>
  );
}
