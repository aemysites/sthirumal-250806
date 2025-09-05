/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main event detail block
  const banner = element.querySelector('.eventdetail_top_banner');
  if (!banner) return;

  // Left column: title, description, button
  const content = banner.querySelector('.eventdetail__content');
  // Defensive: check for content
  if (!content) return;

  // Right column: image
  const imageWrapper = banner.querySelector('.eventdetail__image');
  let image = null;
  if (imageWrapper) {
    image = imageWrapper.querySelector('img');
  }

  // Bottom row: Delivery Mode and Language
  const bannerBottom = element.querySelector('.eventdetail_banner_bottom_content');
  let bottomCells = [];
  if (bannerBottom) {
    // Each .text is a column
    const texts = bannerBottom.querySelectorAll('.text');
    bottomCells = Array.from(texts).map(text => text);
  }

  // Build the columns block table
  const headerRow = ['Columns (columns10)'];
  // First row: left (content), right (image)
  const firstContentRow = [content, image];
  // Second row: delivery mode, language (if present)
  let tableRows = [headerRow, firstContentRow];
  if (bottomCells.length > 0) {
    tableRows.push(bottomCells);
  }

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
