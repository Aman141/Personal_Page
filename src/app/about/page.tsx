export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        👋 Hey, I&apos;m Aman Kumar
      </h1>

      <section className="mb-8 space-y-3 text-lg leading-relaxed">
        <p>
          I&apos;m a <span className="font-semibold">full-stack developer</span>{" "}
          who loves building fast, friendly, and future-proof web experiences. I
          enjoy solving real-world problems with clean code and great design.
        </p>
        <p>
          Currently, I&apos;m working with technologies like{" "}
          <span className="text-blue-500">Next.js</span>,{" "}
          <span className="text-yellow-500">TypeScript</span>, and{" "}
          <span className="text-green-600">Tailwind CSS</span>. I also love
          tinkering with APIs, animations, and the occasional command-line tool.
        </p>
        <p>
          Outside of the code editor, you&apos;ll find me hunting for good
          coffee ☕, overthinking tweets 🧠, and obsessing over dark mode
          designs 🌙.
        </p>
      </section>
      <section className="w-full max-w-2xl mb-10">
        <h3 className="text-xl font-semibold mb-3">Skills</h3>
        <ul className="flex flex-wrap gap-3 text-sm">
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            Python
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            TensorFlow
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            PyTorch
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            Scikit-learn
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            NLP
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            Computer Vision
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            Data Analysis
          </li>
          <li className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">
            MLOps
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">📚 My Journey</h2>
        <p className="text-lg leading-relaxed">
          I started as a curious teen building websites on free hosting sites
          (remember those? 😅). After diving deeper into code, I turned that
          hobby into a career. Today, I focus on building clean, scalable apps
          and learning something new every week.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">🎉 Fun Facts</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>I prefer tabs over spaces (fight me 😎)</li>
          <li>Dark mode is my default aesthetic</li>
          <li>I once broke production and fixed it before anyone noticed 🙈</li>
          <li>I secretly enjoy writing documentation</li>
        </ul>
      </section>

      <section className="text-center mt-12">
        <p className="text-xl">
          🚀 Want to see what I&apos;ve built? <br />
          <a
            href="/projects"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Check out my projects →
          </a>
        </p>
      </section>
    </main>
  );
}
