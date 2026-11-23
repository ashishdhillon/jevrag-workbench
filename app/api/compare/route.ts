import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultVectorStore, Chunk } from "@/lib/vector-store";
import { SAMPLE_CHUNKS, SAMPLE_HANDBOOK_NAME } from "@/lib/sample-doc";
import { comparePipelines, PipelineOptions } from "@/lib/rag-pipelines";

const CompareRequestSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  sufficiencyThreshold: z.number().min(0.5).max(0.95).optional().default(0.7),
  demoMode: z.boolean().optional(),
  openAiApiKey: z.string().optional(),
  openAiBaseUrl: z.string().optional(),
  llmModel: z.string().optional(),
  jevApiKey: z.string().optional(),
  jevBaseUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CompareRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { query, sufficiencyThreshold, demoMode, openAiApiKey, openAiBaseUrl, llmModel, jevApiKey, jevBaseUrl } =
      parseResult.data;

    // Auto-ingest sample handbook if store is currently empty
    if (defaultVectorStore.count() === 0) {
      const chunks: Chunk[] = SAMPLE_CHUNKS.map((s, idx) => ({
        id: s.id,
        text: s.text,
        metadata: {
          docName: SAMPLE_HANDBOOK_NAME,
          section: s.section,
          title: s.title,
          chunkIndex: idx + 1,
          totalChunks: SAMPLE_CHUNKS.length,
        },
      }));
      await defaultVectorStore.addChunks(chunks);
    }

    const options: PipelineOptions = {
      sufficiencyThreshold,
      demoMode,
      openAiApiKey,
      openAiBaseUrl,
      llmModel,
      jevApiKey,
      jevBaseUrl,
    };

    const result = await comparePipelines(query, defaultVectorStore, options);

    return NextResponse.json({
      success: true,
      data: result,
      activeDocument: defaultVectorStore.getActiveDocName() || SAMPLE_HANDBOOK_NAME,
      totalChunksIndexed: defaultVectorStore.count(),
    });
  } catch (err: any) {
    console.error("Compare API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to execute RAG comparison pipeline.",
      },
      { status: 500 }
    );
  }
}
