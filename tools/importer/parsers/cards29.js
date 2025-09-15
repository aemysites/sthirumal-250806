/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card
  function extractImage(card) {
    const imgContainer = card.querySelector('.lp-aca-card-img');
    if (!imgContainer) return null;
    // Prefer <picture>, fallback to <img>
    const picture = imgContainer.querySelector('picture');
    if (picture) return picture;
    const img = imgContainer.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title, description, CTA) from a card
  function extractTextContent(card) {
    const content = card.querySelector('.lp-aca-card-content');
    if (!content) return null;
    const frag = document.createElement('div');
    // Title (h3 > a)
    const title = content.querySelector('.lp-aca-card-title');
    if (title) {
      frag.appendChild(title);
    }
    // Description
    const desc = content.querySelector('.lp-aca-card-description');
    if (desc) {
      frag.appendChild(desc);
    }
    // CTAs: .lp-aca-card-link (may be direct child <a>, or inside <ul><li><a>)
    const ctas = content.querySelectorAll('.lp-aca-card-link');
    if (ctas.length > 0) {
      if (ctas.length === 1) {
        frag.appendChild(ctas[0]);
      } else {
        const ctaDiv = document.createElement('div');
        ctas.forEach((cta, idx) => {
          ctaDiv.appendChild(cta);
          if (idx < ctas.length - 1) {
            ctaDiv.appendChild(document.createTextNode(' '));
          }
        });
        frag.appendChild(ctaDiv);
      }
    }
    return frag;
  }

  // Find all .lp-aca-card elements in the section
  const cards = element.querySelectorAll('.lp-aca-card');

  // Build the table rows
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    const img = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
