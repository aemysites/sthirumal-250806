/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find the correct card container: look for all visible .swiper-slide elements inside .academy-carousel
  const carousels = element.querySelectorAll('.academy-carousel');
  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll('.swiper-slide');
    slides.forEach((slide) => {
      // Image cell: get the <img> inside .lp-aca-card-img
      let imgCell = null;
      const imgWrap = slide.querySelector('.lp-aca-card-img img');
      if (imgWrap) imgCell = imgWrap.cloneNode(true);

      // Text cell: title (h3), description (div), CTA (a) if present
      const textCellContent = [];
      const contentWrap = slide.querySelector('.lp-aca-card-content');
      if (contentWrap) {
        // Title (h3)
        const title = contentWrap.querySelector('.lp-aca-card-title');
        if (title) textCellContent.push(title.cloneNode(true));
        // Description
        const desc = contentWrap.querySelector('.lp-aca-card-description');
        if (desc) textCellContent.push(desc.cloneNode(true));
        // CTA (optional, e.g. .lp-aca-card-link)
        const cta = contentWrap.querySelector('.lp-aca-card-link');
        if (cta) textCellContent.push(cta.cloneNode(true));
      }
      if (imgCell && textCellContent.length) {
        rows.push([imgCell, textCellContent]);
      }
    });
  });

  // Only replace if we have more than just the header
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
