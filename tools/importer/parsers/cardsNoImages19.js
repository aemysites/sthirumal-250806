/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // Get all direct child card containers
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // Find the relevant <p> element containing the card description
    // (Also handle if <p> is missing by skipping that card)
    const p = card.querySelector('p');
    if (p) {
      // Reference the <p> element directly for the cell
      rows.push([p]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
