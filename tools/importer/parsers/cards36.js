/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the event list container
  const eventList = element.querySelector('.academy_eventlist .ace-eventlist');
  if (!eventList) return;

  // Header row as per block spec
  const headerRow = ['Cards (cards36)'];
  const rows = [headerRow];

  // Get all event wrappers
  const eventWrappers = eventList.querySelectorAll('.lp__meetingevent_wrapper');

  eventWrappers.forEach(wrapper => {
    // --- Image cell ---
    // Defensive: Find the image (picture or img)
    let imgCell = null;
    const imgContainer = wrapper.querySelector('.lp__meetingevent_img');
    if (imgContainer) {
      // Use the <picture> element if present, else fallback to <img>
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // --- Text cell ---
    // Compose: Date, Title (as heading), Location
    const textParts = [];

    // Date block
    const dateBlock = wrapper.querySelector('.lp__event_month');
    if (dateBlock) {
      // Clone to avoid moving from DOM
      textParts.push(dateBlock.cloneNode(true));
    }

    // Title (as heading)
    const details = wrapper.querySelector('.lp__meetingevent_details');
    if (details) {
      // Defensive: Find the h3 or a
      const titleDiv = details.querySelector('.h3');
      if (titleDiv) {
        // Use the anchor as heading
        const a = titleDiv.querySelector('a');
        if (a) {
          // Create a heading element for semantic value
          const heading = document.createElement('h3');
          heading.appendChild(a.cloneNode(true));
          textParts.push(heading);
        }
      }
      // Description/location
      const p = details.querySelector('p');
      if (p) {
        textParts.push(p.cloneNode(true));
      }
    }

    // Compose the row: [image, text]
    rows.push([
      imgCell,
      textParts
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
