/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure element is present
  if (!element) return;

  // Header row as per block spec
  const headerRow = ['Columns (columns17)'];

  // --- COLUMN 1: Text Content ---
  // Find the main content container
  const content = element.querySelector('.eventdetail__content');
  let col1Content = [];
  if (content) {
    // Get the title
    const title = content.querySelector('.eventdetail__title');
    if (title) col1Content.push(title);
    // Get the description
    const desc = content.querySelector('.eventdetail__description');
    if (desc) col1Content.push(desc);
    // Get the action button (dropdown)
    const actionContainer = content.querySelector('.eventdetail__action-container');
    if (actionContainer) {
      // Find the dropdown button
      const dropdownBtn = actionContainer.querySelector('.eventdetail_dropdown-toggle');
      if (dropdownBtn) col1Content.push(dropdownBtn);
      // Find the dropdown menu
      const dropdownMenu = actionContainer.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        // For each dropdown item, create a link
        const links = Array.from(dropdownMenu.querySelectorAll('a')).map(a => {
          // Defensive: fix missing 'h' in 'href' for French link
          if (a.href && a.href.startsWith('ttps://')) {
            a.href = 'h' + a.href;
          }
          return a;
        });
        if (links.length) col1Content.push(...links);
      }
    }
  }
  // If nothing found, fallback to element's text
  if (!col1Content.length) {
    col1Content = [document.createTextNode(element.textContent.trim())];
  }

  // --- COLUMN 2: Image ---
  // Find the image container
  const imageContainer = element.querySelector('.eventdetail__image');
  let col2Content = [];
  if (imageContainer) {
    // Find the <img> inside <picture>
    const img = imageContainer.querySelector('img');
    if (img) col2Content.push(img);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [col1Content, col2Content]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
