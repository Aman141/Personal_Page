import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-12">
      {/* Main content */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Skills */}
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
        {/* Featured Projects */}
        <section className="w-full max-w-2xl mb-10">
          <h3 className="text-xl font-semibold mb-3">Featured Projects</h3>
          <div className="flex flex-col gap-5">
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <h4 className="font-bold">Image Classifier API</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                A RESTful API for image classification using deep learning,
                deployed with Docker and FastAPI.
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Python, TensorFlow, FastAPI, Docker
              </span>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <h4 className="font-bold">NLP Chatbot</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Conversational AI chatbot for customer support, leveraging
                transformer models and custom intent recognition.
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Python, PyTorch, HuggingFace, NLP
              </span>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <h4 className="font-bold">ML Pipeline Automation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Automated end-to-end ML pipeline for data preprocessing,
                training, and deployment using CI/CD tools.
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Python, Scikit-learn, MLflow, GitHub Actions
              </span>
            </div>
          </div>
          <a
            href="/projects"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            See all projects →
          </a>
        </section>
      </main>
      <Footer
        email="aman.kumar@email.com"
        githubUrl="https://github.com/your-github"
        linkedinUrl="https://linkedin.com/in/your-linkedin"
      />
    </div>
  );
}
