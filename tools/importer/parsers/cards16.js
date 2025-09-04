/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Table header row as per block guidelines
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Select all card list items
  const cardItems = element.querySelectorAll('.lp__list_navigation_section');

  cardItems.forEach((card) => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    const contentContainer = card.querySelector('.lp__list_navigation_content');

    // Title (as heading)
    const titleDiv = contentContainer && contentContainer.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        const heading = document.createElement('h3');
        heading.appendChild(link);
        textCellContent.push(heading);
      }
    }

    // Subtitle (lp__hammer)
    const subtitleDiv = contentContainer && contentContainer.querySelector('.lp__hammer');
    if (subtitleDiv) {
      textCellContent.push(subtitleDiv);
    }

    // Description (lp__blurb_text)
    const descDiv = contentContainer && contentContainer.querySelector('.lp__blurb_text');
    if (descDiv) {
      textCellContent.push(descDiv);
    }

    // Call-to-action (overlay link) - only if not already used as title
    const ctaLink = card.querySelector('.lp__overlay-link');
    if (ctaLink && (!titleDiv || !titleDiv.contains(ctaLink))) {
      textCellContent.push(ctaLink);
    }

    // Compose row: [image, text]
    rows.push([imgEl, textCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(block);
}
