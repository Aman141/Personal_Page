// design a component that displays a short introduction about the user along with a picture of the user on the right side of the screen

export default function Intro() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 py-16 lg:py-24">
      {/* Left Side - Text Content */}
      <div className="lg:w-1/2 mb-12 lg:mb-0">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Hi, I&apos;m Aman
        </h1>

        {/* Emoji Row */}
        <div className="flex gap-3 mb-6 text-2xl">
          <span>💻</span>
          <span>🎸</span>
          <span>☕</span>
          <span>🧠</span>
          <span>❤️</span>
        </div>

        {/* Professional Info */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
          25 | Data Science | Software Engineering | Artificial Intelligence
        </p>

        {/* Contact Button */}
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Contact
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Right Side - Profile Image */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end">
        <div className="relative">
          {/* Purple blob background */}
          <div className="w-80 h-80 bg-purple-500 rounded-full opacity-20 absolute -inset-4 blur-xl"></div>
          <div className="w-72 h-72 bg-purple-400 rounded-full opacity-30 absolute -inset-2 blur-lg"></div>

          {/* Profile image placeholder */}
          <div className="relative w-64 h-64 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        </div>
      </div>
    </section>
  );
}
