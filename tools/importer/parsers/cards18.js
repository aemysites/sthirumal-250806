/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the list of cards
  const listNav = element.querySelector('.lp__list_navcomponents ul');
  if (!listNav) return;

  // Table header
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Each card is a <li class="lp__list_navigation_section">
  const cards = listNav.querySelectorAll(':scope > li.lp__list_navigation_section');
  cards.forEach((card) => {
    // Image cell: find the <img> inside .lp__lg_horizontal_img
    const imgWrapper = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }
    // Defensive: fallback if no image
    const imageCell = imgEl || '';

    // Text cell: build up content
    const contentWrapper = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentWrapper) {
      // Title (as heading)
      const titleDiv = contentWrapper.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use the <a> inside as heading
        const titleLink = titleDiv.querySelector('a');
        if (titleLink) {
          // Create a heading element
          const heading = document.createElement('h3');
          // Move the link into the heading
          heading.appendChild(titleLink);
          textCellContent.push(heading);
        }
      }
      // Subtitle / meta info
      const hammerDiv = contentWrapper.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use <div> as is
        textCellContent.push(hammerDiv);
      }
      // Description
      const blurbDiv = contentWrapper.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        textCellContent.push(blurbDiv);
      }
    }
    // CTA: Use the overlay link at the end (not the title link)
    const overlayLink = card.querySelector('a.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in title
      textCellContent.push(overlayLink);
    }

    rows.push([imageCell, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
