/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row (using exact example header)
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Get all tab panes (so all cards in all tabs are parsed)
  const tabPanes = element.querySelectorAll(':scope > div.w-tab-pane');
  tabPanes.forEach(tabPane => {
    // Each grid contains the cards
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // All direct card links
    const cards = grid.querySelectorAll(':scope > a');
    cards.forEach(card => {
      // Try to get img for first cell
      const img = card.querySelector('img');

      // Second cell: all content except the image (heading & description)
      // Get all headings and .paragraph-sm in order of appearance
      const textElements = [];
      card.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
        textElements.push(h);
      });
      card.querySelectorAll('.paragraph-sm').forEach(p => {
        // Prevent duplicate if already included
        if (!textElements.includes(p)) textElements.push(p);
      });
      // Fallback: if neither heading nor .paragraph-sm, push all text nodes
      if (textElements.length === 0) {
        Array.from(card.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
            textElements.push(document.createTextNode(node.nodeValue.trim()));
          }
        });
      }
      // Add the row (don't add empty rows)
      if (img || textElements.length) {
        rows.push([
          img || '',
          textElements.length === 1 ? textElements[0] : textElements
        ]);
      }
    });
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
