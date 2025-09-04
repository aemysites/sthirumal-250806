/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process expected structure
  if (!element || !document) return;

  // Table header row
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const cardItems = element.querySelectorAll('.lp__list_navcomponents > ul > li.lp__list_navigation_section');

  cardItems.forEach((li) => {
    // Image cell: find <img> inside .lp__lg_horizontal_img
    const imgContainer = li.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Text cell: build content
    const contentContainer = li.querySelector('.lp__list_navigation_content');
    const cellContent = [];

    // Title (as heading)
    const titleDiv = contentContainer && contentContainer.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        // Create heading element (h3)
        const heading = document.createElement('h3');
        heading.appendChild(link);
        cellContent.push(heading);
      }
    }

    // Subtitle / meta info (lp__hammer)
    const hammerDiv = contentContainer && contentContainer.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use <p> for subtitle/meta info
      const metaP = document.createElement('p');
      metaP.innerHTML = hammerDiv.innerHTML;
      cellContent.push(metaP);
    }

    // Description (lp__blurb_text)
    const blurbDiv = contentContainer && contentContainer.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Usually contains a <p>
      const descP = blurbDiv.querySelector('p');
      if (descP) {
        cellContent.push(descP);
      }
    }

    // Call-to-action (overlay link, not the title link)
    // Only add if href is different from the title link (defensive)
    const overlayLink = li.querySelector('a.lp__overlay-link');
    if (overlayLink) {
      // Avoid duplicate if already used as title
      if (!titleDiv || !titleDiv.contains(overlayLink)) {
        // Place CTA at the bottom
        const ctaP = document.createElement('p');
        ctaP.appendChild(overlayLink);
        cellContent.push(ctaP);
      }
    }

    // Compose row: [image, text content]
    rows.push([
      imgEl,
      cellContent,
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
