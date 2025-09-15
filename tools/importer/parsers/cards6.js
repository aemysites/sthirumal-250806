/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Defensive: Find all cards in both possible structures
  let cardElements = [];
  // Case 1: list_navigation section (cards in <li>)
  if (element.classList.contains('list_navigation')) {
    const ul = element.querySelector('.lp__list_navcomponents ul');
    if (ul) {
      cardElements = Array.from(ul.children);
    }
  }
  // Case 2: academy_eventlist section (cards in .lp__meetingevent_wrapper)
  else {
    // Try to find .academy_eventlist or .ace-eventlist
    const eventList = element.querySelector('.academy_eventlist .ace-eventlist');
    if (eventList) {
      cardElements = Array.from(eventList.querySelectorAll('.lp__meetingevent_wrapper'));
    }
  }

  cardElements.forEach(card => {
    let imageCell, textCell;
    // Structure for list_navigation cards
    if (card.classList.contains('lp__list_navigation_section')) {
      // Image: .lp__lg_horizontal_img > picture > img
      const imgWrap = card.querySelector('.lp__lg_horizontal_img picture');
      let img = imgWrap && imgWrap.querySelector('img');
      imageCell = img ? img : document.createTextNode('');

      // Text: .lp__list_navigation_content
      const content = card.querySelector('.lp__list_navigation_content');
      if (content) {
        // Title: .lp__list_navigation_title > a
        const titleDiv = content.querySelector('.lp__list_navigation_title');
        const titleLink = titleDiv && titleDiv.querySelector('a');
        let titleElem;
        if (titleLink) {
          titleElem = document.createElement('strong');
          titleElem.appendChild(titleLink);
        }
        // Subtitle: .lp__hammer
        const subtitleDiv = content.querySelector('.lp__hammer');
        // Description: .lp__blurb_text
        const descDiv = content.querySelector('.lp__blurb_text');
        // CTA: overlay link (last <a> in card)
        const overlayLink = card.querySelector('.lp__overlay-link');
        let ctaElem;
        if (overlayLink) {
          ctaElem = document.createElement('div');
          const link = document.createElement('a');
          link.href = overlayLink.getAttribute('href');
          link.textContent = overlayLink.textContent;
          ctaElem.appendChild(link);
        }
        // Compose text cell
        const textParts = [];
        if (titleElem) textParts.push(titleElem);
        if (subtitleDiv) textParts.push(subtitleDiv);
        if (descDiv) textParts.push(descDiv);
        if (ctaElem) textParts.push(ctaElem);
        textCell = textParts;
      } else {
        textCell = document.createTextNode('');
      }
    }
    // Structure for event cards
    else if (card.classList.contains('lp__meetingevent_wrapper')) {
      // Image: .lp__meetingevent_img > picture > img
      const imgWrap = card.querySelector('.lp__meetingevent_img picture');
      let img = imgWrap && imgWrap.querySelector('img');
      imageCell = img ? img : document.createTextNode('');

      // Text: Month/dates, Title, Location
      const monthDiv = card.querySelector('.lp__event_month');
      const detailsDiv = card.querySelector('.lp__meetingevent_details');
      const titleDiv = detailsDiv && detailsDiv.querySelector('.h3');
      const titleLink = titleDiv && titleDiv.querySelector('a');
      let titleElem;
      if (titleLink) {
        titleElem = document.createElement('strong');
        titleElem.appendChild(titleLink);
      }
      // Location: <p> inside detailsDiv
      const locationP = detailsDiv && detailsDiv.querySelector('p');
      // Compose text cell
      const textParts = [];
      if (monthDiv) textParts.push(monthDiv);
      if (titleElem) textParts.push(titleElem);
      if (locationP) textParts.push(locationP);
      textCell = textParts;
    }
    // Add row
    rows.push([imageCell, textCell]);
  });

  // Build table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
