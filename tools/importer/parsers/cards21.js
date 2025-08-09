/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards21)'];

  // Try to find the main card (should only be one in this HTML)
  // Find the first '.card' within the element
  const card = element.querySelector('.card');
  if (!card) return; // Defensive: If structure is different, do nothing

  // Extract image: the first <img> inside the card
  const img = card.querySelector('img');
  // Extract the heading/title
  const heading = card.querySelector('.h4-heading, h4, h5, .card-title');

  // Compose the text cell. In this minimal example, only a heading is present.
  // Reference the heading node directly if present, else just leave cell empty
  let textCell = '';
  if (heading) {
    textCell = heading;
  }

  // Card row: image in first cell, text in second
  const cardRow = [img, textCell];

  const rows = [headerRow, cardRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
