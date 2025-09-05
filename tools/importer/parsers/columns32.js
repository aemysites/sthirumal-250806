/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main event detail block
  function findEventDetailBlock(el) {
    return el.querySelector('.eventDetailsAcademy.section') || el.querySelector('.eventdetail_top_banner');
  }

  // Defensive: find the main event detail block
  const eventDetailBlock = findEventDetailBlock(element);
  if (!eventDetailBlock) return;

  // Find the main banner (contains title, desc, image, etc)
  const topBanner = eventDetailBlock.querySelector('.eventdetail_top_banner') || eventDetailBlock;
  if (!topBanner) return;

  // Find the section that contains the two main columns (content and image)
  const section = topBanner.querySelector('.eventdetail-section');
  if (!section) return;

  // Left column: content (title, desc, button)
  const content = section.querySelector('.eventdetail__content');
  // Right column: image
  const image = section.querySelector('.eventdetail__image');

  // Compose left cell: content (title, desc, button if present)
  const leftCellContent = [];
  if (content) {
    // Title
    const title = content.querySelector('.eventdetail__title');
    if (title) leftCellContent.push(title);
    // Description
    const desc = content.querySelector('.eventdetail__description');
    if (desc) leftCellContent.push(desc);
    // Action button (if present)
    const action = content.querySelector('.eventdetail__action-container');
    if (action) leftCellContent.push(action);
  }

  // Compose right cell: image (picture only)
  let rightCellContent = [];
  if (image) {
    const picture = image.querySelector('picture');
    if (picture) rightCellContent.push(picture);
  }

  // Second row: two columns (left: content, right: image)
  const secondRow = [leftCellContent, rightCellContent];

  // Third row: delivery mode and language
  // Find the banner bottom content (contains two .text blocks)
  const bannerBottom = eventDetailBlock.querySelector('.eventdetail_banner_bottom_content');
  if (bannerBottom) {
    // Get all direct children with class .text
    const textBlocks = bannerBottom.querySelectorAll(':scope > .text');
    const thirdRow = Array.from(textBlocks);
    // Only add third row if there are at least two columns
    if (thirdRow.length >= 2) {
      const cells = [
        ['Columns (columns32)'],
        secondRow,
        thirdRow,
      ];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      element.replaceWith(table);
      return;
    }
  }

  // Fallback: if no bottom content, just two rows
  const cells = [
    ['Columns (columns32)'],
    secondRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
