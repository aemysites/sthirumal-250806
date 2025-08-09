/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example precisely
  const cells = [['Cards (cards10)']];

  // Each card is a top-level <a> child
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach(card => {
    // First cell: image (mandatory)
    const imageContainer = card.querySelector(':scope > div');
    const img = imageContainer ? imageContainer.querySelector('img') : null;
    // Prepare image cell (use actual image element from document, never clone)
    const imageCell = img ? img : '';

    // Second cell: text content (heading + description, and tag if present)
    const textParts = [];
    const content = card.querySelector('.utility-padding-all-1rem');
    if (content) {
      // Tag (optional)
      const tag = content.querySelector('.tag');
      if (tag) {
        // Use a <div> for separation, preserve the tag element
        textParts.push(tag);
      }
      // Heading (mandatory)
      const heading = content.querySelector('h3');
      if (heading) {
        textParts.push(heading);
      }
      // Description (mandatory)
      const desc = content.querySelector('p');
      if (desc) {
        textParts.push(desc);
      }
    }
    // Add the row only if both image and text are available
    if (imageCell && textParts.length > 0) {
      cells.push([imageCell, textParts]);
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
