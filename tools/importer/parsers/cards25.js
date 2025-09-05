/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible tab panels (role="tabpanel" and not hidden)
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));
  tabPanels.forEach((tabPanel) => {
    if (tabPanel.hasAttribute('hidden')) return; // Only process visible tab

    // Find the academy-carousel inside this tabPanel
    const carousel = tabPanel.querySelector('.academy-carousel');
    if (!carousel) return;

    // Find all cards (li.swiper-slide)
    const cards = Array.from(carousel.querySelectorAll('ul.swiper-wrapper > li.swiper-slide'));
    if (!cards.length) return;

    // Table header
    const headerRow = ['Cards (cards25)'];
    const rows = [headerRow];

    cards.forEach((card) => {
      // Defensive: Find image (img inside picture)
      let imgEl = card.querySelector('.lp-aca-card-img img');
      // Defensive: Find card content
      let contentEl = card.querySelector('.lp-aca-card-content');
      // Defensive: Compose text cell
      const textCell = [];
      if (contentEl) {
        // Title (h3 or h3 > a)
        const title = contentEl.querySelector('.lp-aca-card-title');
        if (title) {
          textCell.push(title);
        }
        // Description
        const desc = contentEl.querySelector('.lp-aca-card-description');
        if (desc) {
          textCell.push(desc);
        }
        // CTA link (optional)
        const cta = contentEl.querySelector('.lp-aca-card-link');
        if (cta) {
          textCell.push(cta);
        }
      }
      // Only add row if image and text are present
      if (imgEl && textCell.length) {
        rows.push([imgEl, textCell]);
      }
    });

    // Create table block
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the tabPanel with the block
    tabPanel.replaceWith(block);
  });
}
