
export function stripHtml(html) {
  if (!html) return "";

  // Remove all HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, " ") // replace tags with space
    .replace(/&nbsp;/g, " ")  // replace &nbsp;
    .replace(/&amp;/g, "&")   // replace &amp;
    .replace(/&lt;/g, "<")    // replace &lt;
    .replace(/&gt;/g, ">")    // replace &gt;
    .replace(/&quot;/g, '"')  // replace &quot;
    .replace(/\s+/g, " ")     // collapse multiple spaces
    .trim();
}