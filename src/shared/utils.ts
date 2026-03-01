export const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, Times, serif' },
  { label: 'Calibri', value: 'Calibri, Segoe UI, sans-serif' },
  { label: 'Cambria', value: 'Cambria, Georgia, serif' },
  { label: 'Georgia', value: 'Georgia, Cambria, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { label: 'Courier New', value: 'Courier New, Courier, monospace' },
  { label: 'Segoe UI', value: 'Segoe UI, Helvetica, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, Arial, sans-serif' },
  { label: 'Noto Sans', value: 'Noto Sans, Arial, sans-serif' },
  { label: 'Lato', value: 'Lato, Arial, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, Arial, sans-serif' },
  { label: 'Garamond', value: 'Garamond, Georgia, serif' },
  { label: 'Palatino', value: 'Palatino Linotype, Palatino, serif' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { label: 'Impact', value: 'Impact, sans-serif' },
] as const;

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

export function sanitizeText(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      if (code > 0xffff) return '';
      return ch;
    })
    .join('');
}
