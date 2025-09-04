/* global WebImporter */
export default function parse(element, { document }) {
  // Find the event list root
  const eventList = element.querySelector('.academy_eventlist .ace-eventlist');
  if (!eventList) return;

  // Get all event wrappers
  const eventWrappers = eventList.querySelectorAll('.lp__meetingevent_wrapper');
  if (!eventWrappers.length) return;

  // Prepare table rows
  const rows = [];
  // Header row as per instructions
  rows.push(['Cards (cards36)']);

  eventWrappers.forEach(wrapper => {
    // --- First cell: Image ---
    let imgCell = document.createElement('div');
    const imgBlock = wrapper.querySelector('.lp__meetingevent_img');
    if (imgBlock) {
      const img = imgBlock.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- Second cell: Text content (date, title, location) ---
    const textCellContent = [];

    // Date block (month and date)
    const dateBlock = wrapper.querySelector('.lp__event_month');
    if (dateBlock) {
      // Clone to avoid moving the node
      textCellContent.push(dateBlock.cloneNode(true));
    }

    // Title (linked)
    const details = wrapper.querySelector('.lp__meetingevent_details');
    if (details) {
      const title = details.querySelector('.h3, h3, .lp__collapse_title, a');
      if (title) {
        // If the title is an <a>, use it directly, else wrap in <div>
        if (title.tagName === 'A') {
          textCellContent.push(title);
        } else {
          const div = document.createElement('div');
          div.appendChild(title);
          textCellContent.push(div);
        }
      }
      // Description/location (the <p> tag)
      const desc = details.querySelector('p');
      if (desc) {
        textCellContent.push(desc);
      }
    }

    // Defensive: if nothing found, add empty div
    if (textCellContent.length === 0) {
      textCellContent.push(document.createElement('div'));
    }

    rows.push([imgCell, textCellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
