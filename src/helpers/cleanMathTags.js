export default function stripLatex(input) {
  if (!input) return '';

  return input
    // Remove LaTeX math delimiters
    .replace(/\$\$/g, '')
    .replace(/\\\(/g, '')
    .replace(/\\\)/g, '')

    // Remove HTML tags
    .replace(/<[^>]*>/g, '')

    // Replace HTML entities with plain text equivalents
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
