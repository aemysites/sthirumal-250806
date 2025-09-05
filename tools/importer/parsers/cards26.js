/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: get all direct card <li> children
  const cardElements = Array.from(element.children).filter(
    (child) => child.classList.contains('swiper-slide')
  );

  cardElements.forEach((cardEl) => {
    // Defensive: find the card wrapper
    const cardWrapper = cardEl.querySelector('.lp-aca-card-wrapper') || cardEl;

    // --- IMAGE CELL ---
    // Find the image container
    let imgCell = null;
    const imgContainer = cardWrapper.querySelector('.lp-aca-card-img');
    if (imgContainer) {
      // Use the <picture> element directly if present
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        // Fallback: use the first <img> if no <picture>
        const img = imgContainer.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    // Tag (optional, usually above title)
    const tag = cardWrapper.querySelector('.lp-aca-card-tag');
    if (tag) {
      // Use a <div> for tag, preserve original element
      textCellContent.push(tag);
    }
    // Title (h3 with link)
    const title = cardWrapper.querySelector('.lp-aca-card-title');
    if (title) {
      textCellContent.push(title);
    }
    // Description
    const desc = cardWrapper.querySelector('.lp-aca-card-description');
    if (desc) {
      textCellContent.push(desc);
    }
    // Compose the row
    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
