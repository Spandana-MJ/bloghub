
export function calculateReadingTime(htmlContent) {
  if (!htmlContent) return 1;

  const text = htmlContent.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes < 1 ? 1 : minutes;
}