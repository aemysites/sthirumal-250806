/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main banner/content wrapper
  const banner = element.querySelector('.eventdetail_top_banner');
  if (!banner) return;

  // Left column: Title, description, button
  const content = banner.querySelector('.eventdetail__content');
  // Defensive: Only proceed if content exists
  if (!content) return;

  // Right column: Image
  const imageWrap = banner.querySelector('.eventdetail__image');
  let imageEl = null;
  if (imageWrap) {
    // Find the <img> inside <picture>
    const picture = imageWrap.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }
  }

  // Second row: Delivery Mode & Language
  const bottomContent = element.querySelector('.eventdetail_banner_bottom_content');
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
  // First content row: left (content), right (image)
  const firstRow = [content, imageEl ? imageEl : ''];
  // Second content row: left (delivery), right (language)
  const secondRow = [deliveryMode ? deliveryMode : '', language ? language : ''];

  const cells = [
    headerRow,
    firstRow,
    secondRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
