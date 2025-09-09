/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process expected structure
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Find all card items
  const cardItems = element.querySelectorAll('.lp__list_navigation_section');

  cardItems.forEach((card) => {
    // --- IMAGE CELL ---
    // Find the image inside the card
    let imgCell = null;
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    if (imgContainer) {
      // Use the <picture> block directly for resilience
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        // Fallback: use the first img
        const img = imgContainer.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    const content = card.querySelector('.lp__list_navigation_content');
    if (content) {
      // Title (as heading)
      const titleDiv = content.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use the <a> inside titleDiv
        const link = titleDiv.querySelector('a');
        if (link) {
          // Create heading element
          const heading = document.createElement('strong');
          heading.appendChild(link.cloneNode(true));
          textCellContent.push(heading);
        }
      }
      // Subtitle/Meta (lp__hammer)
      const hammerDiv = content.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use as a paragraph
        const meta = document.createElement('p');
        meta.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(meta);
      }
      // Description (lp__blurb_text)
      const blurbDiv = content.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> inside blurbDiv
        const descP = blurbDiv.querySelector('p');
        if (descP) {
          textCellContent.push(descP);
        }
      }
    }
    // --- CTA LINK ---
    // Use the overlay link at the end
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already included in title
      // (title link is already present, so skip unless needed)
      // Optionally, could add as a separate CTA at the end
      // For now, skip duplicate
    }

    // Compose row
    rows.push([
      imgCell,
      textCellContent,
    ]);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
