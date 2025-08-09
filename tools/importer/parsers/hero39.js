/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name matches the example
  const headerRow = ['Hero (hero39)'];

  // Find the background image (the prominent img inside the header)
  let bgImg = element.querySelector('img');

  // Second row: background image (if present)
  const rowBgImg = [bgImg ? bgImg : ''];

  // Third row: Hero content (headline, subheading, CTA)
  // Find the grid-layout, then the cell with the headline and CTA
  let gridContainers = element.querySelectorAll(':scope > .w-layout-grid > div');
  let contentContainer = null;
  if (gridContainers.length > 1) {
    // In the provided HTML, the second grid cell contains the text and CTA
    contentContainer = gridContainers[1];
  } else {
    // fallback: use the whole element
    contentContainer = element;
  }

  // Get the h1 (title)
  const h1 = contentContainer.querySelector('h1');
  // Get subheading (first paragraph, if any)
  const paragraph = contentContainer.querySelector('p');
  // Get CTA (button group, if any)
  const buttonGroup = contentContainer.querySelector('.button-group');

  // Compose content cell, keeping document-order and referencing existing elements
  const contentEls = [];
  if (h1) contentEls.push(h1);
  if (paragraph) contentEls.push(paragraph);
  if (buttonGroup) contentEls.push(buttonGroup);

  // If all are missing, fallback to empty string
  const rowContent = [contentEls.length ? contentEls : ''];

  // Assemble the table exactly as required
  const cells = [
    headerRow,
    rowBgImg,
    rowContent
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
