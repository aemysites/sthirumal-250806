/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getCardImage(card) {
    const imgContainer = card.querySelector('.lp-aca-card-img');
    if (!imgContainer) return null;
    // Prefer <img> inside <picture>
    const img = imgContainer.querySelector('img');
    if (img) return img;
    // Fallback: use <picture> itself if no <img>
    const picture = imgContainer.querySelector('picture');
    if (picture) return picture;
    return null;
  }

  // Helper to extract the text content from a card
  function getCardText(card) {
    const content = card.querySelector('.lp-aca-card-content');
    if (!content) return document.createElement('div');
    // Compose a fragment for all text content
    const frag = document.createElement('div');
    // Title
    const title = content.querySelector('.lp-aca-card-title');
    if (title) {
      // Use heading text, but preserve link if present
      const h = document.createElement('strong');
      const a = title.querySelector('a');
      if (a) {
        h.appendChild(a.cloneNode(true));
      } else {
        h.textContent = title.textContent;
      }
      frag.appendChild(h);
    }
    // Description
    const desc = content.querySelector('.lp-aca-card-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // CTA links (can be direct <a> or inside <ul>/<li>)
    // Collect all links with class 'lp-aca-card-link' inside content
    const links = Array.from(content.querySelectorAll('a.lp-aca-card-link'));
    if (links.length) {
      const ctaDiv = document.createElement('div');
      links.forEach(link => {
        // If multiple links, separate with space
        const cta = document.createElement('span');
        cta.appendChild(link.cloneNode(true));
        ctaDiv.appendChild(cta);
      });
      frag.appendChild(ctaDiv);
    }
    return frag;
  }

  // Find all cards in the block
  const cards = Array.from(element.querySelectorAll('.lp-aca-card'));
  const rows = [];
  // Header row
  rows.push(['Cards (cards29)']);
  // Each card: [image, text]
  cards.forEach(card => {
    const img = getCardImage(card);
    const text = getCardText(card);
    rows.push([img, text]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
