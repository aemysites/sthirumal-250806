/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Card detection: All direct children with an <img> child are considered cards
  const cardDivs = Array.from(element.querySelectorAll(':scope > div')).filter(div => div.querySelector('img'));

  cardDivs.forEach(card => {
    const img = card.querySelector('img');
    // Defensive: Only process if there's an image
    if (!img) return;
    // Try to find a content container (div with heading or paragraph)
    let textCellContent = [];
    const contentDiv = card.querySelector('div.utility-padding-all-2rem')
      || card.querySelector('div.utility-position-relative > div')
      || card.querySelector('div');
    if (contentDiv) {
      // Extract all headings and paragraphs, in order
      const childNodes = Array.from(contentDiv.childNodes);
      childNodes.forEach(node => {
        if (node.nodeType === 1) {
          // Element node: keep h1-h6, p, or other elements as is
          textCellContent.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node (non-empty): create a text node element
          textCellContent.push(document.createTextNode(node.textContent));
        }
      });
      // Fallback: if nothing found, add the div as is
      if (textCellContent.length === 0) textCellContent = [contentDiv];
    } else {
      textCellContent = [''];
    }
    rows.push([img, textCellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
