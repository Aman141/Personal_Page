export default function ContactPage() {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
        <div className="flex flex-col items-center">
          <span className="text-6xl mb-4 animate-bounce">🚧</span>
          <h1 className="text-4xl font-bold mb-2 text-center">Contact Coming Soon</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl mb-6">
            This page is under construction. Check back soon for a contact form!
          </p>
          <div className="flex gap-2">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
              Stay tuned!
            </span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              🚀
            </span>
          </div>
        </div>
      </main>
    );
  }