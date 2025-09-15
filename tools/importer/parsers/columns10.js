/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the event detail block (main content)
  function findEventDetailBlock(root) {
    return root.querySelector('.eventDetailsAcademy.section');
  }

  // Defensive: find the main event detail block
  const eventBlock = findEventDetailBlock(element);
  if (!eventBlock) return;

  // Find the top banner section (contains columns)
  const topBanner = eventBlock.querySelector('.eventdetail_top_banner');
  if (!topBanner) return;

  // Find the main content (left column)
  const contentSection = topBanner.querySelector('.eventdetail-section');
  if (!contentSection) return;

  // Left column: Title, Description, Button
  const title = contentSection.querySelector('.eventdetail__title');
  const desc = contentSection.querySelector('.eventdetail__description');
  const actionContainer = contentSection.querySelector('.eventdetail__action-container');
  // Compose left column content
  const leftColumn = document.createElement('div');
  if (title) leftColumn.appendChild(title);
  if (desc) leftColumn.appendChild(desc);
  if (actionContainer) leftColumn.appendChild(actionContainer);

  // Right column: Image
  const imageSection = topBanner.querySelector('.eventdetail__image');
  let imageCol = null;
  if (imageSection) {
    // Use the <picture> element if present
    const picture = imageSection.querySelector('picture');
    if (picture) {
      imageCol = picture;
    } else {
      // Fallback: use the imageSection itself
      imageCol = imageSection;
    }
  }

  // Bottom row: Delivery Mode and Language
  const bannerBottom = eventBlock.querySelector('.eventdetail_banner_bottom_content');
  let bottomRow = [];
  if (bannerBottom) {
    // Each .text is a column
    const texts = bannerBottom.querySelectorAll('.text');
    bottomRow = Array.from(texts);
  }

  // Table header
  const headerRow = ['Columns (columns10)'];
  // Table columns (second row)
  const columnsRow = [leftColumn, imageCol];
  // Table bottom row (third row)
  if (bottomRow.length === 2) {
    // Two columns: Delivery Mode, Language
    const cells = [headerRow, columnsRow, bottomRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  } else {
    // Fallback: only header and main columns
    const cells = [headerRow, columnsRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
