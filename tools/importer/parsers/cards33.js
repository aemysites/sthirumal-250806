/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getImage(card) {
    // Find the <img> inside the .lp__lg_horizontal_img
    const imgContainer = Array.from(card.children).find(child => child.classList && child.classList.contains('lp__lg_horizontal_img'));
    if (!imgContainer) return null;
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content from a card
  function getTextContent(card) {
    const contentContainer = Array.from(card.children).find(child => child.classList && child.classList.contains('lp__list_navigation_content'));
    if (!contentContainer) return null;

    // Title
    const titleDiv = contentContainer.querySelector('.lp__list_navigation_title');
    let title = null;
    if (titleDiv) {
      // Use the <a> inside as the heading
      const link = titleDiv.querySelector('a');
      if (link) {
        // Create a heading element (h3)
        title = document.createElement('h3');
        // Move the link into the heading
        title.appendChild(link);
      }
    }

    // Subtitle (hammer)
    const hammerDiv = contentContainer.querySelector('.lp__hammer');
    let subtitle = null;
    if (hammerDiv) {
      subtitle = document.createElement('p');
      subtitle.innerHTML = `<strong>${hammerDiv.textContent.trim()}</strong>`;
    }

    // Description
    const blurbDiv = contentContainer.querySelector('.lp__blurb_text');
    let description = null;
    if (blurbDiv) {
      // Use all <p> elements inside
      const paragraphs = Array.from(blurbDiv.querySelectorAll('p')).filter(p => p.textContent.trim() !== '' && p.innerHTML.trim() !== '&nbsp;');
      if (paragraphs.length > 0) {
        description = document.createElement('div');
        paragraphs.forEach(p => description.appendChild(p));
      }
    }

    // Call-to-action: use the overlay link (not the title link)
    const overlayLink = card.querySelector('.lp__overlay-link');
    let cta = null;
    if (overlayLink) {
      cta = document.createElement('p');
      const link = document.createElement('a');
      link.href = overlayLink.getAttribute('href');
      link.textContent = overlayLink.textContent.trim();
      cta.appendChild(link);
    }

    // Compose all parts into a single cell
    const cellContent = [];
    if (title) cellContent.push(title);
    if (subtitle) cellContent.push(subtitle);
    if (description) cellContent.push(description);
    if (cta) cellContent.push(cta);
    return cellContent;
  }

  // Find all cards (li.lp__list_navigation_section)
  const cards = element.querySelectorAll('li.lp__list_navigation_section');

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards33)']);

  // Card rows
  cards.forEach(card => {
    const img = getImage(card);
    const textContent = getTextContent(card);
    rows.push([
      img ? img : '',
      textContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
