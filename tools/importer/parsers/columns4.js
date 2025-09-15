/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main section inside the block
  const section = element.querySelector('.eventdetail-section');
  if (!section) return;

  // Get left column content (title, description, button)
  const content = section.querySelector('.eventdetail__content');
  let leftColumnItems = [];
  if (content) {
    // Title
    const title = content.querySelector('.eventdetail__title');
    if (title) leftColumnItems.push(title);
    // Description
    const desc = content.querySelector('.eventdetail__description');
    if (desc) leftColumnItems.push(desc);
    // Button
    const actionContainer = content.querySelector('.eventdetail__action-container');
    if (actionContainer) {
      const btnWrapper = actionContainer.querySelector('.eventdetail_btn_wrapper');
      if (btnWrapper) {
        const btn = btnWrapper.querySelector('a');
        if (btn) leftColumnItems.push(btn);
      }
    }
  }

  // Get right column content (image)
  const imageContainer = section.querySelector('.eventdetail__image');
  let rightColumnItem = null;
  if (imageContainer) {
    // Defensive: Find the <img> inside <picture>
    const img = imageContainer.querySelector('img');
    if (img) {
      rightColumnItem = img;
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns4)'];
  const contentRow = [leftColumnItems, rightColumnItem];

  const cells = [headerRow, contentRow];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
