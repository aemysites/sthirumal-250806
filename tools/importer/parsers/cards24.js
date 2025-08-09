/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards24)'];

  // Find all cards (direct children <a>)
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cards.map(card => {
    // Get image or icon (always first child div with img inside)
    const imgDiv = card.querySelector('div.utility-aspect-2x3');
    // Use the entire div for the image cell
    const imageCell = imgDiv;

    // Build right cell content
    const contentArr = [];
    // Row with tag and date
    const tagRow = card.querySelector('div.flex-horizontal');
    if (tagRow) contentArr.push(tagRow);
    // Title (h3)
    const heading = card.querySelector('h3');
    if (heading) contentArr.push(heading);
    // There is no additional description, CTA, or long text

    return [imageCell, contentArr];
  });

  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}