/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main eventDetailsAcademy section
  const academySection = element.querySelector('.eventDetailsAcademy.section');
  if (!academySection) return;

  // Find the top banner (main content)
  const topBanner = academySection.querySelector('.eventdetail_top_banner');
  if (!topBanner) return;

  // Find the main content and image columns
  const eventSection = topBanner.querySelector('.eventdetail-section');
  if (!eventSection) return;

  // Left column: Title, Description, Button
  const content = eventSection.querySelector('.eventdetail__content');
  // Defensive: If not found, skip
  if (!content) return;

  // Right column: Image
  const imageWrapper = eventSection.querySelector('.eventdetail__image');
  let imageEl = null;
  if (imageWrapper) {
    // Find the <img> inside <picture>
    const img = imageWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // Bottom row: Delivery Mode & Language
  const bannerBottom = academySection.querySelector('.eventdetail_banner_bottom_content');
  let deliveryMode = null;
  let language = null;
  if (bannerBottom) {
    const texts = bannerBottom.querySelectorAll('.eventdetail-text');
    if (texts.length >= 2) {
      deliveryMode = texts[0];
      language = texts[1];
    }
  }

  // Build the header row
  const headerRow = ['Columns (columns32)'];

  // Build the main columns row
  const columnsRow = [
    // Left column: content (title, description, button)
    content,
    // Right column: image
    imageEl ? imageEl : ''
  ];

  // Build the bottom row (Delivery Mode, Language)
  const bottomRow = [
    deliveryMode ? deliveryMode : '',
    language ? language : ''
  ];

  // Compose the table cells
  const cells = [
    headerRow,
    columnsRow,
    bottomRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
