/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the event detail main wrapper
  function findEventDetailBanner(el) {
    return el.querySelector('.eventdetail_top_banner');
  }

  // Helper to find the bottom content (Delivery Mode, Language)
  function findBannerBottomContent(el) {
    return el.querySelector('.eventdetail_banner_bottom_content');
  }

  // Defensive: Only parse if expected structure is present
  const banner = findEventDetailBanner(element);
  if (!banner) return;

  // Get the main section (left: text/button, right: image)
  const section = banner.querySelector('.eventdetail-section');
  if (!section) return;

  // Left: Content (title, description, button)
  const content = section.querySelector('.eventdetail__content');
  // Right: Image
  const image = section.querySelector('.eventdetail__image');

  // Compose left column: title, description, button
  const leftCol = [];
  if (content) {
    // Title
    const title = content.querySelector('.eventdetail__title');
    if (title) leftCol.push(title);
    // Description
    const desc = content.querySelector('.eventdetail__description');
    if (desc) leftCol.push(desc);
    // Button
    const action = content.querySelector('.eventdetail__action-container');
    if (action) leftCol.push(action);
  }

  // Compose right column: image
  let rightCol = [];
  if (image) {
    // Only the <img> inside <picture>
    const picture = image.querySelector('picture');
    if (picture) {
      // Find the <img> inside <picture>
      const img = picture.querySelector('img');
      if (img) rightCol.push(img);
    }
  }

  // Second row: columns
  const columnsRow = [leftCol, rightCol];

  // Third row: Delivery Mode / Language
  const bannerBottom = findBannerBottomContent(banner.parentElement || banner);
  let bottomRow = null;
  if (bannerBottom) {
    // There are two .text blocks, each with a .eventdetail-text
    const texts = bannerBottom.querySelectorAll('.text');
    const bottomCells = [];
    texts.forEach((text) => {
      const eventText = text.querySelector('.eventdetail-text');
      if (eventText) {
        bottomCells.push(eventText);
      }
    });
    // Only add the row if there is content
    if (bottomCells.length) {
      bottomRow = bottomCells;
    }
  }

  // Build table rows
  const rows = [];
  rows.push(['Columns (columns13)']);
  rows.push(columnsRow);
  if (bottomRow) rows.push(bottomRow);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
