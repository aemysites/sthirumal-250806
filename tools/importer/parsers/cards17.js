/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the example
  const headerRow = ['Cards (cards17)'];

  // Get all direct card containers
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each card: get image and any card text content (title and description)
  // The HTML provided only has images in each card div, no other content
  // This function will check for any text nodes, headings, paragraphs, or other info after the image and include if present
  const cardRows = cardDivs.map(div => {
    const img = div.querySelector('img');
    // Find text content in the card div AFTER the image
    // Collect all elements except the img
    const cardContent = [];
    div.childNodes.forEach(node => {
      if (node !== img && node.nodeType === Node.ELEMENT_NODE) {
        cardContent.push(node);
      }
      // Optionally, include text nodes if not empty
      if (node !== img && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        cardContent.push(span);
      }
    });
    // If no content found, cell is empty string
    return [img || '', cardContent.length ? cardContent : ''];
  });

  // Assemble table
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
