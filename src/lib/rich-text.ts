import DOMPurify from "dompurify";

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li"],
    ALLOWED_ATTR: ["start"],
  });
}

export function richTextContent(value: {
  readonly text: string;
  readonly html: string | null;
}): string {
  if (value.html !== null) return sanitizeRichText(value.html);
  const escaped = value.text.replace(/[&<>"]/g, (character) => {
    switch (character) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      default: return "&quot;";
    }
  });
  return `<p>${escaped.replace(/\r\n?|\n/g, "<br>")}</p>`;
}
