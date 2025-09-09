/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .col-... element
  function extractCard(col) {
    // Image: find the first <img> in the card
    const img = col.querySelector('img');

    // Title: find the first .lp__listnav_icon_cta_title span with text
    let title = '';
    const titleContainer = col.querySelector('.lp__listnav_icon_cta_title');
    if (titleContainer) {
      // Find the first non-empty span
      const spans = Array.from(titleContainer.querySelectorAll('span'));
      for (const span of spans) {
        const text = span.textContent.trim();
        if (text) {
          title = text;
          break;
        }
      }
    }

    // Description: the first <p> in .lp__listnav_icon_cta_bottom
    let desc = '';
    const descP = col.querySelector('.lp__listnav_icon_cta_bottom p');
    if (descP) {
      desc = descP.textContent.trim();
    }

    // Compose text cell: title (strong or h3), then description
    const frag = document.createDocumentFragment();
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      frag.appendChild(p);
    }

    return [img, frag];
  }

  // Get all card columns
  const cols = element.querySelectorAll(':scope .row > div');

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards31)']);
  // Card rows
  cols.forEach((col) => {
    rows.push(extractCard(col));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
