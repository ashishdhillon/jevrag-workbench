import { NextRequest, NextResponse } from "next/server";
import { defaultVectorStore, Chunk } from "@/lib/vector-store";
import { SAMPLE_CHUNKS, SAMPLE_HANDBOOK_NAME } from "@/lib/sample-doc";

export async function GET(req: NextRequest) {
  try {
    // If empty, auto-ingest sample chunks
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

    const allChunks = defaultVectorStore.getAll();
    const docName = defaultVectorStore.getActiveDocName() || SAMPLE_HANDBOOK_NAME;

    return NextResponse.json({
      success: true,
      docName,
      totalChunks: allChunks.length,
      chunks: allChunks.map((c) => ({
        id: c.id,
        text: c.text,
        metadata: c.metadata,
      })),
    });
  } catch (err: any) {
    console.error("Chunks API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch vector chunks." },
      { status: 500 }
    );
  }
}
