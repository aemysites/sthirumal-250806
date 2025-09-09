/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list container
  const listNav = element.querySelector('.lp__list_navcomponents');
  if (!listNav) return;
  const ul = listNav.querySelector('ul');
  if (!ul) return;

  // Table header
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all cards (li elements)
  const cards = ul.querySelectorAll(':scope > li.lp__list_navigation_section');
  cards.forEach((card) => {
    // Image cell: find the <picture> or <img>
    let imageCell = null;
    const imgWrap = card.querySelector('.lp__lg_horizontal_img');
    if (imgWrap) {
      const picture = imgWrap.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        // fallback: just use the first img
        const img = imgWrap.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: Title, hammer, description, CTA
    const contentWrap = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentWrap) {
      // Title (as heading)
      const titleDiv = contentWrap.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use <strong> for heading style
        const heading = document.createElement('strong');
        // If there's a link, use its text
        const link = titleDiv.querySelector('a');
        if (link) {
          heading.textContent = link.textContent.trim();
        } else {
          heading.textContent = titleDiv.textContent.trim();
        }
        textCellContent.push(heading);
      }
      // Hammer (subtitle)
      const hammerDiv = contentWrap.querySelector('.lp__hammer');
      if (hammerDiv) {
        // Use <div> for subtitle
        const subtitle = document.createElement('div');
        subtitle.textContent = hammerDiv.textContent.trim();
        textCellContent.push(subtitle);
      }
      // Description
      const blurbDiv = contentWrap.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> directly if present
        const p = blurbDiv.querySelector('p');
        if (p) textCellContent.push(p);
      }
      // CTA: Use the overlay link if present
      const overlayLink = card.querySelector('a.lp__overlay-link');
      if (overlayLink) {
        // Only add if href is present and not empty
        if (overlayLink.getAttribute('href')) {
          const cta = document.createElement('a');
          cta.href = overlayLink.getAttribute('href');
          cta.textContent = overlayLink.textContent.trim();
          textCellContent.push(cta);
        }
      }
    }

    // Add row: [image, text]
    rows.push([imageCell, textCellContent]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
