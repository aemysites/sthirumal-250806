/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (as <picture> or <img>) from a card
  function getImage(card) {
    // Prefer <picture> if present, else <img>
    const pic = card.querySelector('.lp__lg_horizontal_img picture');
    if (pic) return pic;
    const img = card.querySelector('.lp__lg_horizontal_img img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title, hammer, blurb, CTA) from a card
  function getTextContent(card) {
    const content = card.querySelector('.lp__list_navigation_content');
    if (!content) return '';
    // Title (as heading, with link)
    const titleDiv = content.querySelector('.lp__list_navigation_title');
    let title = '';
    if (titleDiv) {
      const a = titleDiv.querySelector('a');
      if (a) {
        // Wrap in <strong> for heading style
        const strong = document.createElement('strong');
        strong.appendChild(a);
        title = strong;
      } else {
        title = titleDiv.textContent.trim();
      }
    }
    // Hammer (subtitle)
    const hammerDiv = content.querySelector('.lp__hammer');
    let hammer = '';
    if (hammerDiv) {
      hammer = hammerDiv.cloneNode(true);
    }
    // Blurb (description)
    const blurbDiv = content.querySelector('.lp__blurb_text');
    let blurb = '';
    if (blurbDiv) {
      blurb = blurbDiv.cloneNode(true);
    }
    // Compose all text content in order
    const frag = document.createDocumentFragment();
    if (title) frag.append(title, document.createElement('br'));
    if (hammer) frag.append(hammer, document.createElement('br'));
    if (blurb) frag.append(blurb);
    return frag;
  }

  // Find all card list items
  const cards = element.querySelectorAll('li.lp__list_navigation_section');
  const rows = [];
  // Header row
  rows.push(['Cards (cards18)']);
  // Card rows
  cards.forEach((card) => {
    const image = getImage(card);
    const textContent = getTextContent(card);
    rows.push([image, textContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
