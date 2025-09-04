/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find all academy-carousel blocks in the element
  const carousels = element.querySelectorAll('.academy-carousel');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    // Find the list of cards (li.swiper-slide)
    const slides = carousel.querySelectorAll('ul.swiper-wrapper > li.swiper-slide');
    if (!slides.length) return;

    // Table header
    const headerRow = ['Cards (cards25)'];
    const rows = [headerRow];

    slides.forEach((slide) => {
      // Defensive: Find image
      let imgEl = null;
      const imgContainer = slide.querySelector('.lp-aca-card-img');
      if (imgContainer) {
        // Prefer <img> inside <picture>
        imgEl = imgContainer.querySelector('img');
      }

      // Defensive: Find card content
      const contentContainer = slide.querySelector('.lp-aca-card-content');
      let contentEls = [];
      if (contentContainer) {
        // Title (h3, possibly with link)
        const title = contentContainer.querySelector('.lp-aca-card-title');
        if (title) contentEls.push(title);
        // Description
        const desc = contentContainer.querySelector('.lp-aca-card-description');
        if (desc) contentEls.push(desc);
        // CTA link (optional)
        const cta = contentContainer.querySelector('.lp-aca-card-link');
        if (cta) contentEls.push(cta);
      }

      // Build row: [image, text content]
      const row = [imgEl, contentEls];
      rows.push(row);
    });

    // Create block table
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace carousel with block table
    carousel.replaceWith(block);
  });
}
