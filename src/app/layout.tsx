import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";
import { site, siteTitle } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Required for Open Graph and canonical URLs to resolve to absolute paths.
  metadataBase: new URL(site.url),
  // `template` gives every child page "<Page> · Aman Kumar" for free.
  title: { default: siteTitle, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.social.github }],
  creator: site.name,
  keywords: [
    "Aman Kumar",
    "AI Engineer",
    "Machine Learning",
    "Signal Processing",
    "Underwater Acoustics",
    "Berlin",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: siteTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: site.social.twitterHandle,
    title: siteTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

// Runs before the first paint so a dark-mode visitor never sees a white flash.
// Every `dark:` utility depends on this class, so it has to be applied
// synchronously rather than in an effect after hydration.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow px-6 sm:px-12">{children}</main>
            <Footer
              email={site.email}
              githubUrl={site.social.github}
              linkedinUrl={site.social.linkedin}
              twitterUrl={site.social.twitter}
              instagramUrl={site.social.instagram}
            />
          </div>
        </ThemeProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
