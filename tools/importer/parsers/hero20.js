/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example block name exactly
  const headerRow = ['Hero (hero20)'];

  // --- Extract background images (all images in the hero grid) ---
  let backgroundImages = [];
  // Find the div that contains the grid of images
  const gridDiv = element.querySelector('.grid-layout.desktop-3-column');
  if (gridDiv) {
    backgroundImages = Array.from(gridDiv.querySelectorAll('img'));
  }
  // Create a fragment to hold all images, fallback to empty string if none
  let backgroundCell;
  if (backgroundImages.length > 0) {
    const frag = document.createDocumentFragment();
    backgroundImages.forEach(img => frag.appendChild(img));
    backgroundCell = frag;
  } else {
    backgroundCell = '';
  }

  // --- Extract content: heading, subheading, CTAs ---
  // The section with text and links is in a container with class 'container'
  let contentCell = '';
  const contentDiv = element.querySelector('.container');
  if (contentDiv) {
    contentCell = contentDiv; // Reference the existing element directly
  }

  // --- Compose and replace with the block table ---
  const cells = [
    headerRow,
    [backgroundCell],
    [contentCell]
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
