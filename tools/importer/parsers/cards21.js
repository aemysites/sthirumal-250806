/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all card elements (direct children)
  const cards = element.querySelectorAll(':scope > .lp-sticky-card');

  cards.forEach((card) => {
    // Defensive: Find image container
    const imgContainer = card.querySelector('.lp-sticky-card-img');
    let imageEl = null;
    if (imgContainer) {
      // Use the <picture> element directly for robustness
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        // fallback: use the img if picture is missing
        const img = imgContainer.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Defensive: Find content container
    const contentContainer = card.querySelector('.lp-sticky-card-content');
    let textContent = [];
    if (contentContainer) {
      // Title (h3)
      const title = contentContainer.querySelector('h3');
      if (title) textContent.push(title);
      // Description (p)
      const desc = contentContainer.querySelector('p');
      if (desc) textContent.push(desc);
    }

    // Compose row: [image, text content]
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
