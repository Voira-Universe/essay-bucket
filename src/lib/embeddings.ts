
import { pipeline, env } from '@xenova/transformers';

// Skip local model checks since we are in the browser
env.allowLocalModels = false;

// Singleton to hold the pipeline instance
let embeddingPipeline: any = null;

export const loadEmbeddingModel = async () => {
  if (embeddingPipeline) return embeddingPipeline;

  console.log('Loading embedding model...');
  embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('Embedding model loaded.');
  return embeddingPipeline;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const pipe = await loadEmbeddingModel();
  
  // Clean the text and limit length to avoid token limits (model max is 512 tokens)
  // We'll take a reasonable chunk from the beginning and maybe the end, or just the first ~1000 chars roughly.
  // For RAG, the beginning is often most important, or we can just truncate.
  const cleanedText = text.replace(/\n+/g, ' ').trim().slice(0, 2000);

  const output = await pipe(cleanedText, { pooling: 'mean', normalize: true });
  
  // Convert Tensor to standard array
  return Array.from(output.data);
};
