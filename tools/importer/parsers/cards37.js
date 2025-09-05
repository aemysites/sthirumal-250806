/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the card list container
  const listNav = element.querySelector('.lp__list_navcomponents');
  if (!listNav) return;

  // Get all card elements
  const cardEls = Array.from(listNav.querySelectorAll('li.lp__list_navigation_section'));
  const rows = [];
  // Header row
  rows.push(['Cards (cards37)']);

  cardEls.forEach(cardEl => {
    // Image cell: find the <img> inside <picture>
    let imgEl = cardEl.querySelector('.lp__lg_horizontal_img img');
    // Defensive: fallback if not found
    if (!imgEl) {
      const pic = cardEl.querySelector('.lp__lg_horizontal_img picture');
      imgEl = pic ? pic.querySelector('img') : null;
    }

    // Text cell: build content
    const contentDiv = cardEl.querySelector('.lp__list_navigation_content');
    const textCell = document.createElement('div');
    if (contentDiv) {
      // Title (as heading)
      const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use <a> as heading if present
        const link = titleDiv.querySelector('a');
        if (link) {
          const heading = document.createElement('strong');
          heading.appendChild(link.cloneNode(true));
          textCell.appendChild(heading);
        } else {
          // fallback: just text
          const heading = document.createElement('strong');
          heading.textContent = titleDiv.textContent.trim();
          textCell.appendChild(heading);
        }
      }
      // Subtitle/hammer
      const hammerDiv = contentDiv.querySelector('.lp__hammer');
      if (hammerDiv) {
        const subtitle = document.createElement('div');
        subtitle.style.fontSize = 'smaller';
        subtitle.style.fontWeight = 'bold';
        subtitle.textContent = hammerDiv.textContent.trim();
        textCell.appendChild(subtitle);
      }
      // Description
      const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> directly
        const para = blurbDiv.querySelector('p');
        if (para) textCell.appendChild(para);
      }
      // CTA: Use the overlay link if present and not redundant
      const overlayLink = cardEl.querySelector('a.lp__overlay-link');
      // Only add CTA if it's not the same as the heading link
      if (overlayLink && (!titleDiv || !titleDiv.querySelector('a') || overlayLink.href !== titleDiv.querySelector('a').href)) {
        const cta = document.createElement('div');
        const ctaLink = overlayLink.cloneNode(true);
        cta.appendChild(ctaLink);
        textCell.appendChild(cta);
      }
    }

    // Add row: [image, text]
    rows.push([
      imgEl ? imgEl : '',
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
