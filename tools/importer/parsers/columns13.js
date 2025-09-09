/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // Defensive: find main content wrapper
  let banner = element.querySelector('.eventdetail_top_banner');
  if (!banner) {
    // fallback: search deeper
    banner = element.querySelector('.eventdetail-section') || element;
  }

  // Find content and image columns
  let contentCol, imageCol;
  const contentWrap = banner.querySelector('.eventdetail__content');
  const imageWrap = banner.querySelector('.eventdetail__image');

  // First column: text content (title, description, button)
  const col1Els = [];
  if (contentWrap) {
    // Title
    const title = contentWrap.querySelector('.eventdetail__title');
    if (title) col1Els.push(title);
    // Description
    const desc = contentWrap.querySelector('.eventdetail__description');
    if (desc) col1Els.push(desc);
    // Button (if present)
    const action = contentWrap.querySelector('.eventdetail__action-container');
    if (action) col1Els.push(action);
  }

  // Second column: image
  let imgEl = null;
  if (imageWrap) {
    // Find <img> inside <picture>
    const picture = imageWrap.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }

  // Banner bottom content (Delivery Mode, Language)
  let bottomContent = element.querySelector('.eventdetail_banner_bottom_content');
  if (!bottomContent) {
    // fallback: search deeper
    bottomContent = element.querySelector('.eventdetail_banner_bottom_content');
  }

  // Compose columns for second row
  const columns = [];
  // First column: text content
  columns.push(col1Els);
  // Second column: image
  if (imgEl) {
    columns.push([imgEl]);
  } else {
    columns.push([]);
  }

  // Third row: bottom content, split into two columns
  let thirdRow = [];
  if (bottomContent) {
    // Find all .text blocks (should be two)
    const textBlocks = bottomContent.querySelectorAll('.text');
    thirdRow = Array.from(textBlocks).map(tb => [tb]);
    // If only one, pad to two columns
    if (thirdRow.length === 1) thirdRow.push(['']);
    // Flatten each cell
    thirdRow = thirdRow.map(cell => cell);
  } else {
    // fallback: empty cells
    thirdRow = ['', ''];
  }

  // Table header
  const headerRow = ['Columns (columns13)'];

  // Table rows
  const tableRows = [
    headerRow,
    columns,
    thirdRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
