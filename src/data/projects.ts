// Single source of truth for project content, shared by the home-page slider
// and /projects so the two can't drift apart.
//
// Descriptions are deliberately factual and only claim what the linked code
// actually does. Any metric quoted here is one reported in the source notebook
// — see the caveats in plan.md before adding more.

export interface Project {
  slug: string;
  title: string;
  /** Card-length summary. Cards clamp to three lines, so keep it under ~180 chars. */
  description: string;
  tags: string[];
  repoUrl: string;
  /** Live deployment, when one exists. Preferred over repoUrl as the card's link. */
  demoUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "airconnect",
    title: "AirConnect",
    description:
      "Web app for browsing commercial aircraft and airline fleet specifications, with filtering by manufacturer and category plus per-aircraft detail pages.",
    tags: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
    repoUrl: "https://github.com/Aman141/AirConnect",
    demoUrl: "https://air-connect.vercel.app",
    featured: true,
  },
  {
    slug: "eeg-ms-classification",
    title: "EEG Multiple Sclerosis Classification",
    description:
      "Three CNN architectures compared for classifying nine-channel EEG epochs as multiple-sclerosis patient or healthy control. Shallow ConvNet led at 88.4% ± 2.4% under 5-fold cross-validation.",
    tags: ["TensorFlow/Keras", "CNN", "Signal Processing", "EEG"],
    repoUrl: "https://github.com/Aman141/ML_Projects/blob/master/EEG.ipynb",
    featured: true,
  },
  {
    slug: "bayesian-media-mix-model",
    title: "Bayesian Media Mix Model",
    description:
      "Estimates the revenue contribution of seven ad-spend channels across 104 weeks in PyMC3, with geometric adstock carryover implemented as a custom Theano scan recursion.",
    tags: ["PyMC3", "Bayesian Inference", "MCMC", "Prophet", "Time Series"],
    repoUrl:
      "https://github.com/Aman141/ML_Projects/blob/master/Bayesian_MMM.ipynb",
    featured: true,
  },
  {
    slug: "speech-emotion-recognition",
    title: "Speech Emotion Recognition",
    description:
      "Audio classification pipeline on the RAVDESS corpus: MFCC features extracted with librosa feed a 1D convolutional network across five emotional states, with noise and pitch-shift augmentation.",
    tags: ["librosa", "Audio ML", "MFCC", "1D CNN", "TensorFlow"],
    repoUrl:
      "https://github.com/Aman141/ML_Projects/blob/master/Sentiment%20Predictor%20for%20Stress%20Detection.ipynb",
    featured: true,
  },
  {
    slug: "deutschcard",
    title: "DeutschCard",
    description:
      "Browser-based German vocabulary flashcards with study and browse modes, CEFR A1–B2 filtering, and progress tracking. No build step and no backend — plain JavaScript and localStorage.",
    tags: ["JavaScript", "HTML/CSS", "localStorage"],
    repoUrl: "https://github.com/Aman141/DeutschCard",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/** Cards link to a live demo when there is one, otherwise the source. */
export const projectLink = (p: Project) => p.demoUrl ?? p.repoUrl;
