export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        👋 Hey, I am Aman Kumar
      </h1>

      <section className="mb-8 space-y-3 text-lg leading-relaxed">
        <p>
          An innovative software developer and machine learning engineer known
          for delivering impactful solutions. With expertise in development and
          machine learning, I work on cutting-edge technologies to create
          efficient and scalable software experiences. I am a problem solver at
          heart, and I thrive in dynamic and challenging environments. I am
          passionate about staying ahead of emerging technologies and trends,
          attending conferences, and participating in online communities to
          expand my knowledge and skills.
        </p>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-3xl">💼</span>
          <span>Experience</span>
        </h2>
        <div className="flex flex-col gap-6">
          {/* EvoLogics */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">
                  2025 – Present
                </span>
                <span className="font-semibold text-lg">EvoLogics</span>
                <span className="text-gray-500 dark:text-gray-400 text-base hidden sm:inline">—</span>
                <span className="text-base text-purple-700 dark:text-purple-300 font-medium">AI Engineer</span>
              </div>
            </div>
            <ul className="list-disc list-inside ml-5 mt-2 text-base space-y-1">
              <li>
                Designing AI algorithms for underwater event detection, object localization, and tracking using acoustic data.
              </li>
              <li>
                Working on innovative solutions for real-world marine challenges. <span className="inline-block">🌊</span>
              </li>
            </ul>
          </div>
          {/* Validaitor */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">
                  2023 – 2024
                </span>
                <span className="font-semibold text-lg">Validaitor</span>
                <span className="text-gray-500 dark:text-gray-400 text-base hidden sm:inline">—</span>
                <span className="text-base text-purple-700 dark:text-purple-300 font-medium">AI Software Engineer</span>
              </div>
            </div>
            <ul className="list-disc list-inside ml-5 mt-2 text-base space-y-1">
              <li>Led the development of evaluation frameworks for LLMs.</li>
              <li>Worked across the stack using Django and Node.js.</li>
              <li>Helped shape tools for AI safety and governance.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full max-w-2xl mb-10">
        <h3 className="text-xl font-semibold mb-3">🛠 Skills & Tools</h3>
        <ul className="flex flex-wrap gap-3 text-sm">
          {[
            "Python",
            "C++",
            "SQL",
            "TensorFlow",
            "PyTorch",
            "Sklearn",
            "Pandas",
            "Numpy",
            "React",
            "Django",
            "Node.js",
            "Docker",
            "Git",
            "MLOps",
            "Computer Vision",
            "NLP",
            "Data Analysis",
            "Testing (Pytest)",
            "TypeScript",
          ].map((skill) => (
            <li
              key={skill}
              className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <span className="text-3xl">🎓</span>
          <span>Education</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Master's */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">
                2020 – 2023
              </span>
              <span className="font-semibold text-lg">TUM</span>
            </div>
            <div className="mb-1 text-base font-medium text-gray-800 dark:text-gray-100">
              M.Sc. Computational Science and Engineering
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Specialized in Machine Learning & Deep Learning for graphics,
              sequences, and crowd modeling.
            </div>
          </div>
          {/* Bachelor's */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold">
                2014 – 2018
              </span>
              <span className="font-semibold text-lg">IIT (BHU)</span>
            </div>
            <div className="mb-1 text-base font-medium text-gray-800 dark:text-gray-100">
              B.Tech. Mechanical Engineering
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Where I first fell in love with optimization and probability.
            </div>
          </div>
        </div>
      </section>

      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">🎉 Fun Facts</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>I prefer tabs over spaces (it’s not even close 😎)</li>
          <li>Dark mode is my default lifestyle</li>
          <li>
            Big fan of teaching — I once ran science fairs for kids in Varanasi
            🔬
          </li>
        </ul>
      </section> */}

      <section className="text-center mt-12">
        <p className="text-xl">
          Curious about what I’ve built? <br />
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
