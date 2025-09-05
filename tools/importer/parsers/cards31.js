/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card items
  const cardItems = element.querySelectorAll('.lp__list_navigation_section');

  // Table header row as per requirements
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  cardItems.forEach((card) => {
    // Image cell: find the <img> inside the .lp__lg_horizontal_img
    const imgWrapper = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Text cell: build a div with title, hammer, blurb, and CTA link
    const contentWrapper = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentWrapper) {
      // Title (as heading, use <strong> for semantic emphasis)
      const titleDiv = contentWrapper.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        const titleLink = titleDiv.querySelector('a');
        if (titleLink) {
          const strong = document.createElement('strong');
          strong.appendChild(titleLink.cloneNode(true));
          textCellContent.push(strong);
        }
      }
      // Hammer (subtitle/category)
      const hammerDiv = contentWrapper.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use <div> for separation
        const hammer = document.createElement('div');
        hammer.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(hammer);
      }
      // Blurb (description)
      const blurbDiv = contentWrapper.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> as is
        const p = blurbDiv.querySelector('p');
        if (p) {
          textCellContent.push(p);
        }
      }
      // CTA (link at the bottom)
      // Use the overlay link (not the title link)
      const overlayLink = card.querySelector('a.lp__overlay-link');
      if (overlayLink) {
        // Only add if href is present
        const cta = document.createElement('div');
        const link = document.createElement('a');
        link.href = overlayLink.href;
        link.textContent = overlayLink.textContent;
        cta.appendChild(link);
        textCellContent.push(cta);
      }
    }
    // Add the row: [image, text content]
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
