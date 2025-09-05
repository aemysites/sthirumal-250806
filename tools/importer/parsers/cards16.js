/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const cardsList = element.querySelector('.lp__list_navcomponents > ul');
  if (!cardsList) return;

  // Table header row
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Get all card items
  const cardItems = cardsList.querySelectorAll(':scope > li.lp__list_navigation_section');

  cardItems.forEach((card) => {
    // Image cell: find the <img> inside .lp__lg_horizontal_img
    let imgCell = null;
    const imgContainer = card.querySelector('.lp__lg_horizontal_img');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) imgCell = img;
      else imgCell = imgContainer; // fallback: use the container
    }

    // Text cell: build content
    const contentContainer = card.querySelector('.lp__list_navigation_content');
    const textCellContent = [];
    if (contentContainer) {
      // Title (as heading)
      const titleDiv = contentContainer.querySelector('.lp__list_navigation_title');
      if (titleDiv) {
        // Use <a> as heading
        const link = titleDiv.querySelector('a');
        if (link) {
          const heading = document.createElement('strong');
          heading.textContent = link.textContent.trim();
          textCellContent.push(heading);
        }
      }
      // Subtitle (lp__hammer)
      const hammerDiv = contentContainer.querySelector('.lp__hammer');
      if (hammerDiv) {
        const subtitle = document.createElement('div');
        subtitle.innerHTML = hammerDiv.innerHTML;
        textCellContent.push(subtitle);
      }
      // Description (lp__blurb_text)
      const blurbDiv = contentContainer.querySelector('.lp__blurb_text');
      if (blurbDiv) {
        // Use the <p> inside
        const p = blurbDiv.querySelector('p');
        if (p) textCellContent.push(p);
      }
      // Call-to-action (link)
      // Use the overlay link (not the heading link)
      const overlayLink = card.querySelector('a.lp__overlay-link');
      if (overlayLink) {
        // Only add if href is present and not empty
        if (overlayLink.getAttribute('href')) {
          const cta = document.createElement('a');
          cta.href = overlayLink.getAttribute('href');
          cta.textContent = overlayLink.textContent.trim();
          textCellContent.push(cta);
        }
      }
    }

    // Push row: [image, text content]
    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
