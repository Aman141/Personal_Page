// Corpus and scorer for the toy retriever embedded on /projects/ragdemo.
//
// This is a demonstration of the SHAPE of retrieval, not of RAGdemo itself.
// The real project embeds text with all-MiniLM-L6-v2 and searches a FAISS
// index; neither can run in a browser tab. What survives the reduction is the
// part worth showing: a query is scored against an index, the top passages
// come back with scores attached, and the answer is assembled only from what
// came back. When nothing clears the threshold the demo abstains, which is the
// behaviour the real pipeline is built around.
//
// Keep the corpus describing projects that exist. It is read by visitors as a
// statement about the work, not as lorem ipsum.

export type Chunk = {
  id: string;
  text: string;
  /** Match terms. Prefix-matched, so "retrieval" is hit by "retriev". */
  keys: string[];
};

export type Hit = {
  id: string;
  text: string;
  /** Two decimals, presented as a cosine score would be. */
  score: string;
};

export const CORPUS: Chunk[] = [
  {
    id: "chunk_01",
    text: "Three CNN architectures were compared for classifying nine-channel EEG epochs as multiple-sclerosis patient or healthy control. Shallow ConvNet led at 88.4% ± 2.4% under 5-fold cross-validation.",
    keys: [
      "eeg",
      "cnn",
      "accuracy",
      "evaluated",
      "validation",
      "multiple",
      "sclerosis",
      "convnet",
      "folds",
      "classification",
    ],
  },
  {
    id: "chunk_02",
    text: "RAGdemo ingests PDFs, embeds them locally and retrieves with a raw FAISS index. No orchestration framework sits between the steps.",
    keys: [
      "rag",
      "ragdemo",
      "faiss",
      "index",
      "retrieval",
      "embeddings",
      "pdf",
      "vector",
      "framework",
      "local",
    ],
  },
  {
    id: "chunk_03",
    text: "The Bayesian media mix model estimates revenue contribution across seven ad-spend channels over 104 weeks in PyMC3, with geometric adstock carryover as a custom Theano scan recursion.",
    keys: [
      "bayesian",
      "media",
      "mix",
      "channels",
      "revenue",
      "pymc3",
      "adstock",
      "weeks",
      "carryover",
      "spend",
      "posterior",
    ],
  },
  {
    id: "chunk_04",
    text: "Speech emotion recognition on the RAVDESS corpus: MFCC features from librosa feed a 1D convolutional network across five emotional states, with noise and pitch-shift augmentation.",
    keys: [
      "speech",
      "emotion",
      "ravdess",
      "mfcc",
      "librosa",
      "audio",
      "augmentation",
      "pitch",
      "noise",
      "convolutional",
    ],
  },
  {
    id: "chunk_05",
    text: "DeutschCard is a browser-based German flashcard app with study and browse modes, CEFR A1–B2 filtering and progress in localStorage. No build step, no backend.",
    keys: [
      "deutschcard",
      "german",
      "flashcards",
      "cefr",
      "localstorage",
      "vocabulary",
      "backend",
      "build",
    ],
  },
  {
    id: "chunk_06",
    text: "AirConnect browses commercial aircraft and airline fleet specifications, filtering by manufacturer and category, with a detail page per aircraft. Built on Next.js and React 19.",
    keys: [
      "airconnect",
      "aircraft",
      "airline",
      "fleet",
      "next.js",
      "react",
      "manufacturer",
      "typescript",
      "web",
    ],
  },
];

export const SAMPLE_QUERIES = [
  "How was the EEG model evaluated?",
  "What retrieval index does RAGdemo use?",
  "How many channels does the media mix model cover?",
];

// Dropped before scoring. Without this every question scores every chunk,
// because "how", "what" and "the" appear in all of them.
// prettier-ignore
const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "how", "what", "which",
  "does", "do", "did", "of", "in", "on", "for", "to", "and", "with", "many",
  "much", "use", "used", "it", "its", "that", "this", "there",
]);

/** Top two chunks for a query, or an empty array when nothing matches. */
export function retrieve(query: string): Hit[] {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

  if (words.length === 0) return [];

  const scored = CORPUS.map((chunk) => {
    let raw = 0;
    for (const word of words) {
      // A key match is worth double a bare text match: keys are the terms the
      // chunk is actually about, whereas the body may mention a word once.
      if (chunk.keys.some((k) => k.startsWith(word) || word.startsWith(k))) {
        raw += 1;
      } else if (chunk.text.toLowerCase().includes(word)) {
        raw += 0.5;
      }
    }
    return { ...chunk, raw };
  })
    .filter((c) => c.raw > 0)
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 2);

  if (scored.length === 0) return [];

  // Presented as cosine similarity: normalised against the top hit, then
  // damped so a single weak term match cannot read as a confident 0.97.
  const top = scored[0].raw;
  return scored.map((c) => ({
    id: c.id,
    text: c.text,
    score: (0.42 + 0.55 * (c.raw / top) * Math.min(1, c.raw / 2)).toFixed(2),
  }));
}
