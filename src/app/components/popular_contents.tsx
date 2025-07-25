export default function PopularContents() {
  return (
    <>
      <section className="px-6 sm:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Image Classifier API",
                description:
                  "A RESTful API for image classification using deep learning, deployed with Docker and FastAPI.",
                tech: "Python, TensorFlow, FastAPI, Docker",
              },
              {
                title: "NLP Chatbot",
                description:
                  "Conversational AI chatbot for customer support, leveraging transformer models and custom intent recognition.",
                tech: "Python, PyTorch, HuggingFace, NLP",
              },
              {
                title: "ML Pipeline Automation",
                description:
                  "Automated end-to-end ML pipeline for data preprocessing, training, and deployment using CI/CD tools.",
                tech: "Python, Scikit-learn, MLflow, GitHub Actions",
              },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {project.description}
                </p>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {project.tech}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              See all projects
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
        </div>
      </section>
      <section className="px-6 sm:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Blogs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Blog 1",
                description: "This is a description of blog 1",
                tech: "Python, TensorFlow, FastAPI, Docker",
              },
              {
                title: "Blog 2",
                description: "This is a description of blog 2",
                tech: "Python, PyTorch, HuggingFace, NLP",
              },
              {
                title: "Blog 3",
                description: "This is a description of blog 3",
                tech: "Python, Scikit-learn, MLflow, GitHub Actions",
              },
            ].map((blog, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {blog.description}
                </p>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  {blog.tech}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/blogs"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
            >
              See all blogs
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
        </div>
      </section>
    </>
  );
}
