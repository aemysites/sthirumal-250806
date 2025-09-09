/* global WebImporter */
export default function parse(element, { document }) {
  // Find the event list wrapper
  const eventList = element.querySelector('.academy_eventlist .ace-eventlist');
  if (!eventList) return;

  // Table header as required
  const headerRow = ['Cards (cards36)'];
  const rows = [headerRow];

  // Each card is .lp__meetingevent_wrapper
  const cards = eventList.querySelectorAll('.lp__meetingevent_wrapper');
  cards.forEach(card => {
    // Left column: Date block (month + date)
    const dateBlock = card.querySelector('.lp__event_month');
    let leftCell = '';
    if (dateBlock) {
      // Use the actual element so formatting is preserved
      leftCell = dateBlock;
    }

    // Right column: Details (title, location) + image
    const details = card.querySelector('.lp__meetingevent_details');
    const imgWrap = card.querySelector('.lp__meetingevent_img');
    // Compose right cell: details first, then image
    const rightCellContent = [];
    if (details) rightCellContent.push(details);
    if (imgWrap) rightCellContent.push(imgWrap);
    // Defensive: if nothing found, add empty
    if (rightCellContent.length === 0) rightCellContent.push('');

    rows.push([leftCell, rightCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
