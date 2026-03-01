import { PDFDocument, rgb } from "pdf-lib";
import type { PDFFont, PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type {
  EditorObject,
  TextObjectData,
  ImageObjectData,
} from "../../shared/types";
import { hexToRgb, sanitizeText } from "../../shared/utils";
import { isTextObject } from "../objects/TextObject";
import { isImageObject } from "../objects/ImageObject";

// service
import { fetchService } from "../../services/fetch";

// @ todo: will implement default fonts later
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf";

let cachedFontBytes: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (cachedFontBytes) return cachedFontBytes;
  const response = await fetchService.get(FONT_URL);
  if (!response.ok) throw new Error("Error loading font");
  cachedFontBytes = await response.arrayBuffer();
  return cachedFontBytes;
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  if (maxWidth <= 0) return [text];

  const lines: string[] = [];

  for (const rawLine of text.split("\n")) {
    const words = rawLine.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      let testWidth: number;
      try {
        testWidth = font.widthOfTextAtSize(testLine, fontSize);
      } catch {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
        continue;
      }

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    else if (rawLine === "") lines.push("");
  }

  return lines.length > 0 ? lines : [""];
}

async function fetchBytes(src: string): Promise<Uint8Array> {
  const res = await fetch(src);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

function drawTextObject(
  page: ReturnType<PDFDocument["addPage"]>,
  obj: TextObjectData,
  font: PDFFont,
  pageHeight: number,
): void {
  if (obj.text.trim().length === 0) return;

  const { r, g, b } = hexToRgb(obj.color);
  const color = rgb(r, g, b);
  const cleanText = sanitizeText(obj.text);
  const pdfY = pageHeight - obj.y - obj.fontSize;
  const lineHeight = obj.fontSize * 1.3;
  const align = obj.textAlign ?? "left";
  const lines = wrapText(cleanText, font, obj.fontSize, obj.width);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    let x = obj.x;
    if (align === "center" || align === "right") {
      try {
        const lineW = font.widthOfTextAtSize(line, obj.fontSize);
        if (align === "center") x = obj.x + (obj.width - lineW) / 2;
        else x = obj.x + obj.width - lineW;
      } catch {
        // fallback to left
        console.warn(`character not in font: ${line}`);
      }
    }

    try {
      page.drawText(line, {
        x,
        y: pdfY - i * lineHeight,
        size: obj.fontSize,
        font,
        color,
      });
    } catch {
      console.warn(`character not in font: ${line}`);
    }
  }
}

async function drawImageObject(
  pdfDoc: PDFDocument,
  page: ReturnType<PDFDocument["addPage"]>,
  obj: ImageObjectData,
  pageHeight: number,
): Promise<void> {
  try {
    const imgBytes = await fetchBytes(obj.src);
    let pdfImage: PDFImage;
    if (isPng(imgBytes)) {
      pdfImage = await pdfDoc.embedPng(imgBytes);
    } else {
      pdfImage = await pdfDoc.embedJpg(imgBytes);
    }
    const pdfY = pageHeight - obj.y - obj.height;
    page.drawImage(pdfImage, {
      x: obj.x,
      y: pdfY,
      width: obj.width,
      height: obj.height,
      opacity: obj.opacity,
    });
  } catch {
    // skip on embed failure
    console.warn("img embed failed");
  }
}

export async function exportToPdf(
  objects: EditorObject[],
  pageWidth: number,
  pageHeight: number,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await loadFont();
  const font = await pdfDoc.embedFont(new Uint8Array(fontBytes), {
    subset: false,
  });

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);

  for (const obj of sorted) {
    if (isTextObject(obj)) {
      drawTextObject(page, obj, font, pageHeight);
    } else if (isImageObject(obj)) {
      await drawImageObject(pdfDoc, page, obj, pageHeight);
    }
  }

  return pdfDoc.save();
}

export function downloadPdf(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
