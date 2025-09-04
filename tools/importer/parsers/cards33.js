/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cards container
  const cardsContainer = element.querySelector('.lp__list_navcomponents > ul');
  if (!cardsContainer) return;

  // Table header row
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Get all card list items
  const cardItems = cardsContainer.querySelectorAll(':scope > li.lp__list_navigation_section');

  cardItems.forEach((li) => {
    // --- IMAGE CELL ---
    // Find the image container
    const imgContainer = li.querySelector('.lp__lg_horizontal_img');
    let imageEl = null;
    if (imgContainer) {
      // Use the <img> inside <picture>
      imageEl = imgContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    const textParts = [];
    // Title (as heading)
    const titleDiv = li.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        // Create heading element
        const heading = document.createElement('h3');
        // Move the link into the heading
        heading.appendChild(link);
        textParts.push(heading);
      }
    }
    // Subtitle/Meta (E-Learning | Environment ...)
    const metaDiv = li.querySelector('.lp__hammer');
    if (metaDiv) {
      // Use <div> for meta info, style as needed later
      textParts.push(metaDiv);
    }
    // Description (can be multiple paragraphs)
    const blurbDiv = li.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Defensive: Only keep non-empty paragraphs
      const paragraphs = Array.from(blurbDiv.querySelectorAll('p')).filter(p => p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;');
      paragraphs.forEach(p => textParts.push(p));
    }
    // CTA: Use the overlay link if present and not already used
    const overlayLink = li.querySelector('a.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in heading
      const headingLink = titleDiv && titleDiv.querySelector('a');
      if (headingLink && headingLink.href !== overlayLink.href) {
        textParts.push(overlayLink);
      } else if (!headingLink) {
        textParts.push(overlayLink);
      }
    }

    // Compose row: [image, text]
    rows.push([
      imageEl || '',
      textParts
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
