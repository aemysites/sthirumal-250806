/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child elements
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Table header
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Find all card list items
  const cardItems = element.querySelectorAll('.lp__list_navigation_section');

  cardItems.forEach(card => {
    // --- IMAGE CELL ---
    // Find the image element inside the card
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      // Use the <img> inside <picture>
      imgEl = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    const contentContainer = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];

    // Title (as heading)
    const titleDiv = contentContainer && contentContainer.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        // Create heading element
        const heading = document.createElement('h3');
        heading.appendChild(link);
        textCellContent.push(heading);
      }
    }

    // Subtitle (hammer)
    const hammerDiv = contentContainer && contentContainer.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use <div> as is, but wrap in <p> for semantics
      const subtitle = document.createElement('p');
      subtitle.innerHTML = hammerDiv.textContent;
      textCellContent.push(subtitle);
    }

    // Description
    const blurbDiv = contentContainer && contentContainer.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> inside blurbDiv
      const descP = blurbDiv.querySelector('p');
      if (descP) {
        textCellContent.push(descP);
      }
    }

    // Call-to-action (bottom link)
    // Use the overlay link (not the heading link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if href is not same as heading link
      // But in this HTML, overlayLink is always present and is a duplicate of the heading link
      // To avoid duplicate links, only add if it's not already in heading
      if (
        (!titleDiv || !titleDiv.querySelector('a')) ||
        (overlayLink.href !== titleDiv.querySelector('a').href)
      ) {
        const ctaP = document.createElement('p');
        ctaP.appendChild(overlayLink);
        textCellContent.push(ctaP);
      }
    }

    // Compose row: [image, text content]
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
