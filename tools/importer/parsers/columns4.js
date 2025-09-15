/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main section container
  const section = element.querySelector('.eventdetail-section') || element;

  // Get left column: content (title, description, button)
  const content = section.querySelector('.eventdetail__content');

  // Get right column: image (picture inside .eventdetail__image)
  const imageWrapper = section.querySelector('.eventdetail__image');
  let imageContent = '';
  if (imageWrapper) {
    // Use the <picture> or <img> directly as the image cell
    const picture = imageWrapper.querySelector('picture');
    if (picture) {
      imageContent = picture;
    } else {
      // fallback: try to find img
      const img = imageWrapper.querySelector('img');
      if (img) imageContent = img;
    }
  }

  // Table header row
  const headerRow = ['Columns (columns4)'];
  // Table content row: left = content, right = image
  const contentRow = [content, imageContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
