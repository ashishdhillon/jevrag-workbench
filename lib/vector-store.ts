/**
 * Zero-config Local In-Memory Vector Store
 * Structured behind a clean VectorStore interface for easy plug-in of Chroma / Qdrant later.
 */

export interface ChunkMetadata {
  docName: string;
  section?: string;
  title?: string;
  chunkIndex: number;
  totalChunks: number;
}

export interface Chunk {
  id: string;
  text: string;
  metadata: ChunkMetadata;
  embedding?: number[];
}

export interface SearchResult {
  chunk: Chunk;
  score: number; // Cosine similarity 0.0 - 1.0
}

export interface IVectorStore {
  addChunks(chunks: Chunk[]): Promise<void>;
  similaritySearch(query: string, topK: number): Promise<SearchResult[]>;
  clear(): Promise<void>;
  count(): number;
  getAll(): Chunk[];
  getActiveDocName(): string | null;
}

/**
 * Fast, deterministic local text vectorizer (Term Frequency + Character N-Gram hashing)
 * Produces normalized 256-dimensional unit vectors for cosine similarity
 * Works out-of-the-box in Node.js / Next.js with zero dependencies or external calls.
 */
function createLocalEmbedding(text: string, dimensions = 256): number[] {
  const vec = new Float32Array(dimensions);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = normalized.split(/\s+/).filter(Boolean);

  // 1. Unigram hashing
  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vec[idx] += 1.0;
  }

  // 2. Bigram character shingles for fuzzy keyword matching
  for (let i = 0; i < normalized.length - 2; i++) {
    const shingle = normalized.substring(i, i + 3);
    let hash = 5381;
    for (let j = 0; j < shingle.length; j++) {
      hash = (hash * 33) ^ shingle.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vec[idx] += 0.4;
  }

  // 3. Normalize vector to unit length (L2 norm)
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vec[i] /= norm;
    }
  }

  return Array.from(vec);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  const sim = dot / denom;
  return Math.max(0, Math.min(1, (sim + 1) / 2)); // Calibrated to 0.0 - 1.0
}

export class InMemoryVectorStore implements IVectorStore {
  private chunks: Chunk[] = [];
  private activeDocName: string | null = null;

  async addChunks(chunks: Chunk[]): Promise<void> {
    for (const chunk of chunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        chunk.embedding = createLocalEmbedding(chunk.text);
      }
    }
    this.chunks = [...this.chunks, ...chunks];
    if (chunks.length > 0) {
      this.activeDocName = chunks[0].metadata.docName;
    }
  }

  async similaritySearch(query: string, topK: number = 15): Promise<SearchResult[]> {
    if (this.chunks.length === 0) return [];

    const queryVec = createLocalEmbedding(query);
    const scored: SearchResult[] = this.chunks.map((chunk) => {
      const score = cosineSimilarity(queryVec, chunk.embedding || createLocalEmbedding(chunk.text));
      return { chunk, score };
    });

    // Sort descending by cosine similarity score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }

  async clear(): Promise<void> {
    this.chunks = [];
    this.activeDocName = null;
  }

  count(): number {
    return this.chunks.length;
  }

  getAll(): Chunk[] {
    return this.chunks;
  }

  getActiveDocName(): string | null {
    return this.activeDocName;
  }
}

// Global singleton instance for Next.js hot module reloading
const globalForVectorStore = globalThis as unknown as {
  __jev_vector_store__?: InMemoryVectorStore;
};

export const defaultVectorStore: InMemoryVectorStore =
  globalForVectorStore.__jev_vector_store__ || new InMemoryVectorStore();

if (process.env.NODE_ENV !== "production") {
  globalForVectorStore.__jev_vector_store__ = defaultVectorStore;
}
