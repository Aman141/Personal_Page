import type { Metadata } from "next";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  PenLine,
} from "lucide-react";
import { availability, site } from "@/data/site";
import ContactForm from "./ContactForm";
import CopyEmailButton from "./CopyEmailButton";

const description =
  "Get in touch with Aman Kumar — AI Engineer in Berlin working on machine learning for underwater acoustics.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", description, url: "/contact" },
};

const channels = [
  {
    label: "LinkedIn",
    handle: "aman-aks-007",
    href: site.social.linkedin,
    Icon: Linkedin,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    label: "GitHub",
    handle: "Aman141",
    href: site.social.github,
    Icon: Github,
    gradient: "from-gray-600 to-gray-800",
  },
  {
    label: "Medium",
    handle: "@aman-ai",
    href: site.social.medium,
    Icon: PenLine,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function ContactPage() {
  // Read server-side so the form is never rendered when it cannot send.
  // Showing a dead form would silently lose messages — the one outcome this
  // page must not have.
  const formEnabled = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header>
        {availability && (
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {availability}
          </p>
        )}

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Let&apos;s talk
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Whether it&apos;s a role, a collaboration, or a question about
          something I&apos;ve built — I read everything that lands here.
        </p>
      </header>

      {/* 3/2 split rather than even halves: the form is the primary action and
          needs the room; the channel rail reads fine narrow. */}
      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {formEnabled ? (
            <ContactForm email={site.email} />
          ) : (
            <div className="flex h-full flex-col justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Email is the fastest way</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                I&apos;d rather point you somewhere that works than show you a
                form that quietly drops your message. Drop me a line directly
                and I&apos;ll pick it up.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                {site.email}
              </a>
            </div>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="flex flex-col gap-3">
            {/* Email sits apart from the social channels: it is the one that
                reaches a person rather than a profile. */}
            <div className="group relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-700">
              <a
                href={`mailto:${site.email}`}
                aria-label={`Email ${site.email}`}
                className="absolute inset-0 rounded-xl"
              />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Email</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {site.email}
                </span>
              </span>
              <CopyEmailButton value={site.email} />
            </div>

            {channels.map(({ label, handle, href, Icon, gradient }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-700"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${gradient}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                    {handle}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple-500" />
              </a>
            ))}

            <p className="mt-2 flex items-center gap-2 px-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Based in {site.location} · {site.timezone}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
