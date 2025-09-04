/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const cards = Array.from(element.querySelectorAll('.lp__list_navigation_section'));
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // Image cell: find the <img> inside .lp__lg_horizontal_img
    let imgCell = null;
    const imgWrap = card.querySelector('.lp__lg_horizontal_img');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }

    // Text cell: build a fragment with title, hammer, blurb, and CTA
    const contentWrap = card.querySelector('.lp__list_navigation_content');
    const frag = document.createElement('div');
    // Title (as heading)
    const titleDiv = contentWrap && contentWrap.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        const h2 = document.createElement('h2');
        h2.appendChild(link);
        frag.appendChild(h2);
      }
    }
    // Hammer (subtitle)
    const hammerDiv = contentWrap && contentWrap.querySelector('.lp__hammer');
    if (hammerDiv) {
      const subtitle = document.createElement('p');
      subtitle.innerHTML = hammerDiv.innerHTML;
      subtitle.style.fontWeight = 'bold';
      frag.appendChild(subtitle);
    }
    // Blurb (description)
    const blurbDiv = contentWrap && contentWrap.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Defensive: use all child nodes (preserve <p>, <br>, etc)
      Array.from(blurbDiv.childNodes).forEach(node => {
        frag.appendChild(node.cloneNode(true));
      });
    }
    // CTA: use the overlay link (not the title link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      const cta = document.createElement('p');
      const link = document.createElement('a');
      link.href = overlayLink.href;
      link.textContent = overlayLink.textContent;
      cta.appendChild(link);
      frag.appendChild(cta);
    }

    rows.push([imgCell, frag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
