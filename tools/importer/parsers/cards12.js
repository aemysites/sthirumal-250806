/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card elements
  const cards = Array.from(element.querySelectorAll('.lp__card'));

  // Build the header row as per block guidelines
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // --- IMAGE CELL ---
    let imgCell = '';
    const imgWrapper = card.querySelector('.lp__card_img');
    if (imgWrapper) {
      const picture = imgWrapper.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        imgCell = imgWrapper;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    const content = card.querySelector('.lp__card_content');
    if (content) {
      // Title
      const title = content.querySelector('.lp__card_title');
      if (title) textCellContent.push(title);
      // Description
      const desc = content.querySelector('.lp__card_description');
      if (desc) textCellContent.push(desc);
    }
    // CTA: overlay link (outside .lp__card_content)
    const cta = card.querySelector('a.lp__overlay-link');
    if (cta) {
      textCellContent.push(cta);
    }

    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
