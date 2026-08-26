// Single source of truth for project content: the home-page slider, /projects,
// the /projects/[slug] detail pages and the sitemap all read from here.
//
// Everything below is drawn from the linked source. Two rules, because this is
// a public professional claim:
//   1. Only quote a metric that the source actually reports.
//   2. If a metric is optimistic, say why in `limitations`. A reviewer who
//      opens the notebook will find the caveat anyway; better it comes from us.

export interface ProjectDetail {
  /** One or two sentences framing the problem. Rendered as the lead paragraph. */
  overview: string;
  /** What the thing does. For apps — user-facing capability. */
  features?: string[];
  /** How it was built. For research/ML work — method and design decisions. */
  approach?: string[];
  /** Quantitative results. Only figures reported in the source. */
  results?: { label: string; value: string }[];
  /** Required whenever `results` is set. See rule 2 above. */
  limitations?: string[];
  stack: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** Card-length summary. Cards clamp to three lines, so keep it under ~180 chars. */
  description: string;
  tags: string[];
  repoUrl: string;
  /** Live deployment, when one exists. */
  demoUrl?: string;
  featured: boolean;
  detail: ProjectDetail;
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
    detail: {
      overview:
        "A browsable reference for commercial aircraft and airline fleet data — specifications that are otherwise scattered across manufacturer documents and wiki tables. Aircraft are stored as typed local JSON rather than fetched at runtime, so pages render instantly and the data shape is checked at build time.",
      features: [
        "Browse and search major commercial aircraft across manufacturers",
        "Per-aircraft detail pages covering dimensions, range, engine types and seating configuration",
        "Filtering by manufacturer and category, plus search by name",
        "Responsive layout that holds up on a phone",
      ],
      stack: [
        "Next.js 15 (App Router)",
        "React 19",
        "TypeScript",
        "Tailwind CSS 4",
        "Vercel",
      ],
    },
  },
  {
    slug: "ragdemo",
    title: "RAGdemo",
    description:
      "Retrieval-augmented generation built from the parts up: PDF ingestion, local embeddings, raw FAISS retrieval and grounded answers, with no orchestration framework in between.",
    tags: ["Python", "RAG", "FAISS", "OpenAI", "FastAPI"],
    repoUrl: "https://github.com/Aman141/RAGdemo",
    featured: true,
    detail: {
      overview:
        "A retrieval-augmented generation pipeline assembled from its parts rather than from a framework — PDF in, grounded answer out. LangChain handles text splitting and nothing else: retrieval is raw FAISS, embeddings and generation call the OpenAI SDK directly, and every stage is a module small enough to read in one sitting. The corpus is Marcus Aurelius’ Meditations — 128 pages, 843 chunks.",
      features: [
        "Three console scripts covering the pipeline end to end: rag-ingest (PDF to chunks), rag-index (chunks to a FAISS index), rag-ask (question to a grounded answer with page citations)",
        "A retrieve-only mode that runs everything short of generation and needs no API key at all, since embeddings run locally by default",
        "A FastAPI web UI that always shows the retrieved chunks, tagging each one as kept or dropped so it is visible which chunks the model actually read rather than merely retrieved",
        "One-shot and interactive CLI prompts, plus a library API returning the answer, its citations and whether it was grounded",
      ],
      approach: [
        "Pages are stripped of recurring headers and footers and joined into a single document before splitting (600 characters, 100 overlap), so chunks are not severed at page breaks and the overlap window does not reset on every page. Each chunk still records the pages it spans.",
        "Two embedding backends sit behind one Protocol — all-MiniLM-L6-v2 locally at 384 dimensions by default, or OpenAI when the model name begins text-embedding-. Only the remote path is rate-paced.",
        "Vectors live in a FAISS IndexFlatIP alongside a JSON sidecar holding one record per index row; loading refuses a pair whose counts or dimensions disagree, and the retriever reads the embedding model name out of the sidecar so a query always lands in the same vector space as the corpus.",
        "Context assembly walks ranked chunks under a tiktoken budget and returns the subset it actually kept, which is what lets citations name only what the model read.",
        "The orchestrator distinguishes three outcomes deliberately: a grounded answer, nothing clearing retrieval (no model call at all), or a budget too small for even the top chunk (an error, since that is misconfiguration rather than absence).",
      ],
      limitations: [
        "Generation has never run live — the configured OpenAI account returns insufficient_quota, so the final stage is verified only against a stub client. Every stage before it is exercised against the real corpus.",
        "The OpenAI embedding backend reaches the API but no full remote index has ever been built, so that path is unproven end to end.",
        "Single document, no catalog and no conversation memory: every question is standalone.",
        "Retrieval is unconditional. Context is always fetched and stuffed; the model never decides whether it needs to search.",
        "A partial index can be written silently — embedding stops at the first error and returns what it has, and the caller indexes that subset without warning.",
      ],
      stack: [
        "Python 3.13",
        "FAISS",
        "sentence-transformers",
        "OpenAI API",
        "FastAPI",
        "pypdf",
        "pytest",
      ],
    },
  },
  {
    slug: "eeg-ms-classification",
    title: "EEG Multiple Sclerosis Classification",
    description:
      "Three CNN architectures compared for classifying nine-channel EEG epochs as multiple-sclerosis patient or healthy control. Shallow ConvNet led at 88.4% ± 2.4% under 5-fold cross-validation.",
    tags: ["TensorFlow/Keras", "CNN", "Signal Processing", "EEG"],
    repoUrl: "https://github.com/Aman141/ML_Projects/blob/master/EEG.ipynb",
    featured: true,
    detail: {
      overview:
        "Multiple sclerosis leaves signatures in EEG that are difficult to see by eye. This compares three published CNN architectures for raw multichannel biosignals on one dataset under identical cross-validation, to find which design actually transfers to a small clinical sample.",
      approach: [
        "Assembled 1,408 epochs of 9-channel EEG at 512 samples each from preprocessed recordings — 818 healthy control, 590 multiple sclerosis.",
        "Implemented all three architectures from scratch in Keras rather than importing them: a shallow ConvNet (temporal convolution → spatial filter → squaring → log-pooling, effectively a learned band-power filterbank), a deep ConvNet (four conv/pool blocks, 25 to 200 filters), and EEGNet (depthwise plus separable convolutions under max-norm constraints).",
        "Evaluated each under 5-fold stratified cross-validation plus a held-out split, holding optimiser, epoch count and batch size identical so the comparison isolates architecture.",
      ],
      results: [
        { label: "Shallow ConvNet — 5-fold CV", value: "88.4% ± 2.4%" },
        { label: "Deep ConvNet — 5-fold CV", value: "82.8% ± 4.4%" },
        { label: "EEGNet — 5-fold CV", value: "64.0% ± 8.8%" },
      ],
      limitations: [
        "Epochs were split at random rather than by subject, so recordings from one person can land in both train and test. These accuracies are therefore optimistic as a diagnostic claim — a subject-level split is the honest test.",
        "EEGNet's validation loss diverged during training, so its figure reflects an unstable fit rather than a fair architectural comparison.",
        "The provenance of the EEG recordings is not credited in the notebook.",
      ],
      stack: [
        "Python",
        "TensorFlow / Keras",
        "scikit-learn",
        "SciPy",
        "NumPy",
      ],
    },
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
    detail: {
      overview:
        "Media mix modelling has to separate the delayed effect of advertising spend from underlying trend and seasonality. This estimates the revenue contribution of seven channels across two years of weekly data, with carryover modelled explicitly rather than assumed away.",
      approach: [
        "Implemented geometric adstock — Yₜ = Xₜ + α·Yₜ₋₁ — as a custom Theano scan recursion, so each channel's decay rate is a parameter the sampler infers rather than a constant chosen up front.",
        "Extracted trend and yearly seasonality with Prophet (including German holidays) and passed both in as control regressors, so channel coefficients aren't quietly absorbing calendar effects.",
        "Fitted with PyMC3 NUTS using Beta(3,3) priors on decay rates and half-normal priors on channel coefficients to enforce non-negative contribution, following Jin et al.'s media-mix formulation.",
        "Checked prior predictive draws against observed revenue before sampling, then posterior predictive draws after.",
      ],
      results: [
        { label: "NRMSE", value: "0.099" },
        { label: "MAPE", value: "18.2%" },
      ],
      limitations: [
        "Both figures are in-sample: the model was fitted and evaluated on the same 104 weeks with no holdout. They describe goodness of fit, not predictive accuracy.",
        "Carryover is modelled but saturation is not — there is no Hill curve or ROI decomposition, so the model does not capture diminishing returns on spend.",
      ],
      stack: ["Python", "PyMC3", "Theano", "Prophet", "ArviZ", "pandas"],
    },
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
    detail: {
      overview:
        "Speech carries emotional state in spectral texture rather than in words. This builds an end-to-end audio classification pipeline on the RAVDESS corpus — feature extraction, augmentation, and a convolutional network over MFCC features.",
      approach: [
        "Parsed RAVDESS filename metadata into a structured table across 1,440 clips, then inspected waveforms, mel spectrograms and MFCC deltas before committing to a feature representation.",
        "Extracted 13 mean-pooled MFCCs per clip with librosa, yielding a 259-dimensional feature vector.",
        "Expanded the training set threefold with white-noise and pitch-shift augmentation.",
        "Trained a 1D convolutional network (256 down to 64 filters, batch normalisation, dropout, max pooling) with checkpointing on best validation loss and learning-rate reduction on plateau.",
      ],
      results: [
        { label: "Held-out accuracy (240 samples, 5 classes)", value: "87.9%" },
      ],
      limitations: [
        "Augmentation was applied before the train/test split, so noise and pitch variants of the same source clip appear on both sides. The held-out figure is inflated as a result.",
        "The notebook also reports a 94% figure — that one is in-sample, computed over the same clips used for training, and should not be read as performance.",
        "A clean subject-level holdout (two held-back actors) was prepared but never evaluated. That would be the honest test.",
      ],
      stack: [
        "Python",
        "librosa",
        "TensorFlow / Keras",
        "scikit-learn",
        "NumPy",
      ],
    },
  },
  {
    slug: "deutschcard",
    title: "DeutschCard",
    description:
      "Browser-based German vocabulary flashcards with study and browse modes, CEFR A1–B2 filtering, and progress tracking. No build step and no backend — plain JavaScript and localStorage.",
    tags: ["JavaScript", "HTML/CSS", "localStorage"],
    repoUrl: "https://github.com/Aman141/DeutschCard",
    featured: true,
    detail: {
      overview:
        "A vocabulary trainer that runs entirely in the browser — no build step, no backend, no dependencies. Opening the HTML file is the whole install, and everything persists to localStorage so it works offline.",
      features: [
        "Flashcard study mode with a 3D flip, marking each word Known or Still Learning",
        "Progress tracking: session summary, progress bar, and per-tag and per-level statistics",
        "Filtering by content tag and CEFR level (A1–B2), plus a shuffle mode",
        "Deck management — add, edit and delete words",
        "Colour coding for der / die / das, which is the part of German vocabulary that actually needs drilling",
        "50 seed words pre-loaded on first launch",
      ],
      stack: ["Vanilla JavaScript", "HTML", "CSS", "localStorage"],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

/** Cards link to the detail page; the demo and source live there as buttons. */
export const projectHref = (p: Pick<Project, "slug">) =>
  `/projects/${p.slug}`;
