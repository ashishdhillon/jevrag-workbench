import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractText } from "unpdf";
import { defaultVectorStore, Chunk } from "@/lib/vector-store";
import { SAMPLE_CHUNKS, SAMPLE_HANDBOOK_NAME } from "@/lib/sample-doc";

const IngestJsonSchema = z.object({
  load_sample: z.boolean().optional(),
});

function chunkText(text: string, docName: string, chunkSize = 500, overlap = 100): Chunk[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  const chunks: Chunk[] = [];

  let start = 0;
  let chunkIdx = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    let slice = clean.substring(start, end).trim();

    if (slice.length > 0) {
      chunks.push({
        id: `chunk-${String(chunkIdx + 1).padStart(2, "0")}`,
        text: slice,
        metadata: {
          docName,
          chunkIndex: chunkIdx + 1,
          totalChunks: 0, // updated below
        },
      });
      chunkIdx++;
    }

    if (end >= clean.length) break;
    start += chunkSize - overlap;
  }

  // Update total chunks count
  chunks.forEach((c) => {
    c.metadata.totalChunks = chunks.length;
  });

  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. JSON Request (e.g. load_sample: true)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const parsed = IngestJsonSchema.safeParse(body);

      if (parsed.success && parsed.data.load_sample) {
        await defaultVectorStore.clear();

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

        const totalChars = chunks.reduce((acc, c) => acc + c.text.length, 0);

        return NextResponse.json({
          success: true,
          docName: SAMPLE_HANDBOOK_NAME,
          chunkCount: chunks.length,
          characterCount: totalChars,
          isSample: true,
          message: `Successfully loaded sample policy handbook (${chunks.length} chunks indexed).`,
        });
      }
    }

    // 2. Multipart Form-Data (File Upload: PDF, TXT, MD)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form-data." },
          { status: 400 }
        );
      }

      const fileName = file.name;
      const lowerName = fileName.toLowerCase();
      let rawText = "";

      if (lowerName.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = await extractText(new Uint8Array(arrayBuffer));
        rawText = Array.isArray(pdfData.text) ? pdfData.text.join("\n\n") : String(pdfData.text || "");
      } else if (lowerName.endsWith(".txt") || lowerName.endsWith(".md") || lowerName.endsWith(".markdown")) {
        rawText = await file.text();
      } else {
        return NextResponse.json(
          { success: false, error: "Unsupported file type. Please upload a PDF, TXT, or MD document." },
          { status: 400 }
        );
      }

      if (!rawText || rawText.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "The uploaded document contains no readable text." },
          { status: 400 }
        );
      }

      // Split into 500-char chunks with 100-char overlap
      const chunks = chunkText(rawText, fileName, 500, 100);

      await defaultVectorStore.clear();
      await defaultVectorStore.addChunks(chunks);

      return NextResponse.json({
        success: true,
        docName: fileName,
        chunkCount: chunks.length,
        characterCount: rawText.length,
        isSample: false,
        message: `Successfully indexed ${fileName} into ${chunks.length} vector chunks.`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request content-type. Expected application/json or multipart/form-data." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Ingest API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process document ingestion." },
      { status: 500 }
    );
  }
}
