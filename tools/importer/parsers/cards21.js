/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (as <picture> or <img>) from a card
  function extractImage(card) {
    // Try to find the <picture> element first
    const picture = card.querySelector('.lp-sticky-card-img picture');
    if (picture) return picture;
    // Fallback: try to find an <img> directly
    const img = card.querySelector('.lp-sticky-card-img img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title and description) from a card
  function extractTextContent(card) {
    const content = card.querySelector('.lp-sticky-card-content');
    if (!content) return '';
    // We'll include the entire content block (h3 + p)
    return content;
  }

  // Find all direct card children
  const cards = Array.from(element.querySelectorAll(':scope > .lp-sticky-card'));

  // Build the table rows
  const rows = [];
  // Header row as per block requirements
  rows.push(['Cards (cards21)']);

  // Each card becomes a row: [image, text content]
  cards.forEach((card) => {
    const image = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      image,
      textContent,
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
