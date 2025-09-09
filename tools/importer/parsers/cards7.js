/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from the card
  function getImage(card) {
    const img = card.querySelector('picture img');
    return img || null;
  }

  // Helper to extract the text content for the card
  function getTextContent(card) {
    const content = card.querySelector('.lp__list_navigation_content');
    if (!content) return null;
    // Title (as heading)
    const titleDiv = content.querySelector('.lp__list_navigation_title');
    let heading = null;
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        heading = document.createElement('strong');
        heading.textContent = link.textContent.trim();
      }
    }
    // Subtitle / hammer
    const hammer = content.querySelector('.lp__hammer');
    // Description
    const blurb = content.querySelector('.lp__blurb_text');
    // CTA (use the first link in titleDiv, if present)
    let cta = null;
    if (titleDiv) {
      const link = titleDiv.querySelector('a');
      if (link) {
        cta = link.cloneNode(true);
      }
    }
    // Compose the text cell
    const frag = document.createDocumentFragment();
    if (heading) {
      frag.appendChild(heading);
      frag.appendChild(document.createElement('br'));
    }
    if (hammer) {
      frag.appendChild(hammer.cloneNode(true));
      frag.appendChild(document.createElement('br'));
    }
    if (blurb) {
      // Only append the <p> inside blurb
      const p = blurb.querySelector('p');
      if (p) {
        frag.appendChild(p.cloneNode(true));
      }
    }
    // Add CTA at the end if not already present
    // (In this design, the title is a link, so no separate CTA needed)
    return frag;
  }

  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Find all card items
  const cards = element.querySelectorAll('.lp__list_navigation_section');
  cards.forEach(card => {
    const img = getImage(card);
    const textContent = getTextContent(card);
    if (img && textContent) {
      rows.push([img, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
