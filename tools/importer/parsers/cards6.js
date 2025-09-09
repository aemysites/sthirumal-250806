/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Table header row
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find all card list items
  const cardItems = element.querySelectorAll('.lp__list_navigation_section');

  cardItems.forEach((card) => {
    // --- IMAGE CELL ---
    // Find the image container
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgContainer) {
      // Prefer the <img> inside <picture>
      imgEl = imgContainer.querySelector('img');
    }
    // Defensive: If no image found, use the whole container
    const imageCell = imgEl || imgContainer;

    // --- TEXT CELL ---
    const textContent = [];
    // Title (as heading)
    const titleDiv = card.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      // Use <a> as heading
      const link = titleDiv.querySelector('a');
      if (link) {
        // Create heading element
        const heading = document.createElement('h3');
        heading.appendChild(link);
        textContent.push(heading);
      }
    }
    // Subtitle / meta info
    const hammerDiv = card.querySelector('.lp__hammer');
    if (hammerDiv) {
      // Use <div> as-is for subtitle
      textContent.push(hammerDiv);
    }
    // Description
    const blurbDiv = card.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Defensive: Only include non-empty paragraphs
      const paragraphs = Array.from(blurbDiv.querySelectorAll('p')).filter(p => p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;');
      textContent.push(...paragraphs);
    }
    // Call-to-action (use overlay link if present)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already included as title
      if (!titleDiv || !titleDiv.contains(overlayLink)) {
        textContent.push(overlayLink);
      }
    }

    // Add row: [image, text]
    rows.push([imageCell, textContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
