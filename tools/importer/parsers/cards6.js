/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main cards container
  const cardsContainer = element.querySelector('.lp__list_navcomponents ul');
  if (!cardsContainer) return;

  // Table header row
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all card list items
  const cardItems = cardsContainer.querySelectorAll(':scope > li.lp__list_navigation_section');

  cardItems.forEach((li) => {
    // --- IMAGE CELL ---
    // Find the image container
    const imgDiv = li.querySelector('.lp__lg_horizontal_img');
    let imageEl = null;
    if (imgDiv) {
      // Use the <picture> element directly for resilience
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      }
    }

    // --- TEXT CELL ---
    const contentDiv = li.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentDiv) {
      // Title (as heading)
      const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use the <a> as heading
        const link = titleDiv.querySelector('a');
        if (link) {
          // Create a heading element and append the link
          const heading = document.createElement('h3');
          heading.appendChild(link);
          textCellContent.push(heading);
        }
      }
      // Subtitle / meta info
      const hammerDiv = contentDiv.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use a <p> for meta info
        const meta = document.createElement('p');
        meta.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(meta);
      }
      // Description
      const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> directly
        const descP = blurbDiv.querySelector('p');
        if (descP) {
          textCellContent.push(descP);
        }
      }
      // Call-to-action link (if present)
      // Prefer the overlay link if present
      const overlayLink = li.querySelector('a.lp__overlay-link');
      if (overlayLink) {
        // Only add if not already in heading
        if (!textCellContent.some(el => el.tagName === 'H3' && el.contains(overlayLink))) {
          const cta = document.createElement('p');
          const ctaLink = overlayLink.cloneNode(true);
          cta.appendChild(ctaLink);
          textCellContent.push(cta);
        }
      }
    }

    // Compose the row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
