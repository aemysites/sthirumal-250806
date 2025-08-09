/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards33)'];

  // Find all direct card links (cards)
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cards.map(card => {
    // Image: always present as the first img in the card
    const img = card.querySelector('img');

    // Card content is inside the div after the img
    const contentDiv = img && img.nextElementSibling;

    // Defensive
    if (!img || !contentDiv) return [null, null];

    // Tag/meta row (first sub-div, usually contains tag and time)
    let metaRow = contentDiv.querySelector('.flex-horizontal');
    // May be null if absent (but in all examples, present)

    // Title (h3)
    let heading = contentDiv.querySelector('h3, .h4-heading');
    // Description (first <p> after h3)
    let desc = contentDiv.querySelector('p');

    // CTA is the last visible 'Read' div, which we want to convert to a link
    // So look for all direct children divs in contentDiv that are not metaRow
    let allDivs = Array.from(contentDiv.querySelectorAll(':scope > div'));
    let ctaDiv = allDivs
      .filter(div => div !== metaRow && div.textContent.trim().toLowerCase() === 'read')[0];
    let cta = null;
    if (ctaDiv) {
      cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = ctaDiv.textContent;
    }

    // Compose the right-hand cell content in order as in example:
    // meta row (tag, time), heading, desc, cta (as link)
    const textCell = [];
    if (metaRow) textCell.push(metaRow);
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    return [img, textCell];
  });

  // Remove any row that is empty (defensive for edge cases)
  const filteredRows = rows.filter(([img, text]) => img && text && text.length > 0);
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...filteredRows
  ], document);

  element.replaceWith(table);
}
