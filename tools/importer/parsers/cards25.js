/* global WebImporter */
export default function parse(element, { document }) {
  // Find the academy carousel containing the cards
  const carousel = element.querySelector('.academy-carousel');
  if (!carousel) return;

  // Find all card slides (li elements)
  const slides = carousel.querySelectorAll('ul.swiper-wrapper > li.swiper-slide');
  if (!slides.length) return;

  // Table header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Find image
    let imgEl = null;
    const img = slide.querySelector('.lp-aca-card-img img');
    if (img) imgEl = img;

    // Find card content
    const contentContainer = slide.querySelector('.lp-aca-card-content');
    if (!contentContainer) return;

    // Collect all text content (title, description, CTA) in order
    const contentParts = [];
    // Title (h3 or .lp-aca-card-title)
    const title = contentContainer.querySelector('.lp-aca-card-title');
    if (title) {
      // Use the full element (with link if present)
      contentParts.push(title.cloneNode(true));
    }
    // Description
    const desc = contentContainer.querySelector('.lp-aca-card-description');
    if (desc) {
      contentParts.push(desc.cloneNode(true));
    }
    // CTA link (optional, e.g., .lp-aca-card-link)
    const cta = contentContainer.querySelector('.lp-aca-card-link');
    if (cta) {
      contentParts.push(cta.cloneNode(true));
    }

    // Only add row if image and at least one content part
    if (imgEl && contentParts.length) {
      rows.push([imgEl, contentParts]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
