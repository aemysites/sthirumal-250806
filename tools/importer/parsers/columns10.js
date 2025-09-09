/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main event banner
  const banner = element.querySelector('.eventdetail_top_banner');
  if (!banner) return;

  // Left column: title, description, button
  const content = banner.querySelector('.eventdetail__content');
  // Defensive: if not found, fallback to banner
  const leftCol = content || banner;

  // Right column: image
  const imageWrap = banner.querySelector('.eventdetail__image');
  let rightCol = null;
  if (imageWrap) {
    // Find the <img> inside <picture>
    const img = imageWrap.querySelector('img');
    if (img) {
      rightCol = img;
    }
  }

  // Bottom row: Delivery Mode & Language
  const bottomContent = banner.parentElement.querySelector('.eventdetail_banner_bottom_content');
  let deliveryMode = null;
  let language = null;
  if (bottomContent) {
    const texts = bottomContent.querySelectorAll('.eventdetail-text');
    if (texts.length >= 2) {
      deliveryMode = texts[0];
      language = texts[1];
    }
  }

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const mainRow = [
    leftCol,
    rightCol
  ];
  const bottomRow = [
    deliveryMode,
    language
  ];

  // Only include columns that exist
  const cells = [
    headerRow,
    mainRow,
    bottomRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
