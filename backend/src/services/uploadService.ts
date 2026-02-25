import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import Assessment from "../models/Assessment";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function extractText(filePath: string, mimetype?: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (mimetype && mimetype.includes("pdf")) {
    const data = fs.readFileSync(filePath);
    const parsed = await pdf(data as Buffer);
    return parsed.text;
  }
  if (ext === ".pdf") {
    const data = fs.readFileSync(filePath);
    const parsed = await pdf(data as Buffer);
    return parsed.text;
  }
  // Fallback to text
  return fs.readFileSync(filePath, "utf8");
}

function extractJsonFromText(text: string) {
  // Try to find first JSON array or object in text
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
  if (arrayMatch) return arrayMatch[0];
  const objMatch = text.match(/\{[\s\S]*\}/m);
  if (objMatch) return objMatch[0];
  return null;
}

export async function processFile(
  filePath: string,
  mimetype: string | undefined,
  query: string,
  originalName: string,
) {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY not configured");
  const text = await extractText(filePath, mimetype);

  const prompt = `You are a helpful assistant. The user uploaded a file and asked: "${query}". File content follows between <<<FILE>>> markers. Read the file and create an array of assessments where each assessment is an object with these fields: controleOwner (string), type (string), note (string), status (string). Respond ONLY with a JSON array. \n<<<FILE>>>\n${text}\n<<<FILE>>>\n`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You output ONLY valid JSON arrays of assessment objects.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 0.2,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  const content =
    data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";

  // Try to parse JSON from content
  const jsonText = extractJsonFromText(content) || content;
  let assessments: any = [];
  try {
    assessments = JSON.parse(jsonText);
    if (!Array.isArray(assessments)) {
      // maybe object with key
      if (Array.isArray(assessments.assessments))
        assessments = assessments.assessments;
      else assessments = [assessments];
    }
  } catch (e) {
    // fallback: create a single assessment with raw content
    assessments = [
      {
        controleOwner: "unknown",
        type: "auto-generated",
        note: content.slice(0, 1000),
        status: "generated",
      },
    ];
  }

  // Save assessments to DB
  const saved = [] as any[];
  for (const a of assessments) {
    const doc = await Assessment.create({
      controleOwner: a.controleOwner || a.controlOwner || a.owner || "unknown",
      type: a.type || "generated",
      note: a.note || a.notes || JSON.stringify(a),
      status: a.status || "generated",
      sourceFile: originalName,
    });
    saved.push(doc);
  }

  return saved;
}
