/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from <picture>
  function getImage(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Helper to build the text cell for each card
  function buildTextCell(contentDiv) {
    const parts = [];
    // Title (as heading)
    const titleDiv = contentDiv.querySelector('.lp__list_navigation_title');
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        const h3 = document.createElement('h3');
        h3.appendChild(link.cloneNode(true));
        parts.push(h3);
      }
    }
    // Subtitle / hammer
    const hammerDiv = contentDiv.querySelector('.lp__hammer');
    if (hammerDiv) {
      const subtitle = document.createElement('div');
      subtitle.innerHTML = hammerDiv.innerHTML;
      subtitle.style.fontWeight = 'bold';
      subtitle.style.fontSize = '0.95em';
      subtitle.style.marginBottom = '4px';
      parts.push(subtitle);
    }
    // Description
    const blurbDiv = contentDiv.querySelector('.lp__blurb_text');
    if (blurbDiv) {
      // Use the <p> directly
      const p = blurbDiv.querySelector('p');
      if (p) parts.push(p.cloneNode(true));
    }
    // Call-to-action (link)
    // Try to find a link in the title, otherwise fallback to overlay link
    let ctaLink = null;
    if (titleDiv) {
      ctaLink = titleDiv.querySelector('a');
    }
    if (!ctaLink) {
      // Fallback: overlay link
      ctaLink = contentDiv.parentElement.querySelector('.lp__overlay-link');
    }
    if (ctaLink) {
      // Only add if not already included in heading
      if (!parts.some(el => el.contains && el.contains(ctaLink))) {
        const cta = document.createElement('div');
        cta.appendChild(ctaLink.cloneNode(true));
        parts.push(cta);
      }
    }
    return parts;
  }

  // Get all cards
  const cards = [];
  const cardNodes = element.querySelectorAll('.lp__list_navigation_section');
  cardNodes.forEach(cardNode => {
    // Image cell
    const imgDiv = cardNode.querySelector('.lp__lg_horizontal_img');
    let imgEl = null;
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      imgEl = getImage(picture);
      if (imgEl) imgEl = imgEl.cloneNode(true);
    }
    // Text cell
    const contentDiv = cardNode.querySelector('.lp__list_navigation_content');
    const textCell = buildTextCell(contentDiv);
    // Push row: [image, text]
    cards.push([
      imgEl,
      textCell
    ]);
  });

  // Build table
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
