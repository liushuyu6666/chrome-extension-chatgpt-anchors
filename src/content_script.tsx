const EXTENSION_BUTTON_ID = 'chatgpt-bookmark-button';

// TDOO: MOVE TO THE MODEL FOLDER
export interface Bookmark {
  id: string;
  title: string;
  description: string;
  selectedText: string;
  url: string;
  startXPath: string;
  endXPath: string;
  startOffset: number;
  endOffset: number;
  timestamp: string; // ISO date string
}


document.addEventListener('mousedown', (event) => {
  if ((event.target as HTMLElement).id !== EXTENSION_BUTTON_ID) {
    removeAnchorButton();
  }
});

document.addEventListener('mouseup', function (event: MouseEvent) {
  const selection = window.getSelection();

  if (selection && !selection.isCollapsed) {
    const selectedText = selection.toString().trim();

    // Only proceed if there's actual text selected
    if (selectedText.length > 0) {
      // Remove any existing button to avoid duplicates
      removeAnchorButton();

      // Get the coordinates where to place the button
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const x = rect.right + window.scrollX;
      const y = rect.top + window.scrollY;

      // Create and display the button
      displayAnchorButton(x, y, selectedText);
    }
  } else {
    // If selection is cleared, remove the button
    removeAnchorButton();
  }
});

function removeAnchorButton() {
  const existingButton = document.getElementById(EXTENSION_BUTTON_ID);
  if (existingButton) {
    existingButton.remove();
  }
}

function displayAnchorButton(x: number, y: number, selectedText: string) {
  const button = document.createElement('button');
  button.id = EXTENSION_BUTTON_ID;
  button.innerText = '🧜🏻 anchor';

  // Style the button
  // TODO: move to .css
  button.style.position = 'absolute';
  button.style.left = `${x + 10}px`;
  button.style.top = `${y - 10}px`;
  button.style.zIndex = '10000'; // Ensure it's on top
  button.style.padding = '5px 10px';
  button.style.fontSize = '14px';
  button.style.cursor = 'pointer';
  button.style.backgroundColor = '#1a73e8';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

  // Append the button to the body
  document.body.appendChild(button);

  // Add event listener for the button
  button.addEventListener('mouseup', onAnchorButtonClick(selectedText));
}

function onAnchorButtonClick(selectedText: string) {
  return () => {
    // Remove the button after click
    removeAnchorButton();

    // Show a custom modal to collect title and description
    showAnchorModal(selectedText);
  }
}


function showAnchorModal(selectedText: string) {
  // Create the modal overlay
  // TODO: move to CSS
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'bookmark-modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalOverlay.style.zIndex = '10001'; // Above the button

  // Create the modal container
  const modal = document.createElement('div');
  modal.id = 'bookmark-modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#fff';
  modal.style.padding = '20px';
  modal.style.borderRadius = '8px';
  modal.style.width = '300px';
  modal.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';

  // Title input
  const titleLabel = document.createElement('label');
  titleLabel.innerText = 'Title (2-10 words):';
  titleLabel.style.display = 'block';
  titleLabel.style.marginBottom = '5px';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.maxLength = 50;
  titleInput.style.width = '100%';
  titleInput.style.marginBottom = '15px';

  // Description input
  const descLabel = document.createElement('label');
  descLabel.innerText = 'Description:';
  descLabel.style.display = 'block';
  descLabel.style.marginBottom = '5px';

  const descInput = document.createElement('textarea');
  descInput.rows = 3;
  descInput.style.width = '100%';
  descInput.style.marginBottom = '15px';

  // Buttons
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.textAlign = 'right';

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.style.marginRight = '10px';

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';

  // Append elements
  modal.appendChild(titleLabel);
  modal.appendChild(titleInput);
  modal.appendChild(descLabel);
  modal.appendChild(descInput);
  buttonsContainer.appendChild(saveButton);
  buttonsContainer.appendChild(cancelButton);
  modal.appendChild(buttonsContainer);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Event listeners
  saveButton.addEventListener('mouseup', () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (title.length < 2 || title.length > 50) {
      return;
    }

    saveBookmark(selectedText, title, description);
    document.body.removeChild(modalOverlay);
  });

  cancelButton.addEventListener('mouseup', () => {
    document.body.removeChild(modalOverlay);
  });
}

function saveBookmark(selectedText: string, title: string, description: string) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  // Generate a unique identifier for the selection
  const startXPath = generateXPath(startContainer);
  const endXPath = generateXPath(endContainer);

  const bookmark: Bookmark = {
    id: Date.now().toString(),
    title,
    description,
    selectedText,
    url: window.location.href,
    startXPath,
    endXPath,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    timestamp: new Date().toISOString(),
  };

  // Save the bookmark using chrome.storage
  chrome.storage.sync.get({ bookmarks: [] }, (data) => {
    const bookmarks = data.bookmarks;
    bookmarks.push(bookmark);
    chrome.storage.sync.set({ bookmarks });
  });
}

function generateXPath(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode!;
  }

  const paths: string[] = [];

  for (; node && node.nodeType === Node.ELEMENT_NODE; node = node.parentNode!) {
    let index = 0;
    let hasFollowingSiblings = false;
    let sibling = node.previousSibling;

    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === node.nodeName) {
        index++;
      }
      sibling = sibling.previousSibling;
    }

    sibling = node.nextSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === node.nodeName) {
        hasFollowingSiblings = true;
        break;
      }
      sibling = sibling.nextSibling;
    }

    const tagName = node.nodeName.toLowerCase();
    const pathIndex = (index || hasFollowingSiblings) ? `[${index + 1}]` : '';
    paths.splice(0, 0, `${tagName}${pathIndex}`);
  }

  return paths.length ? `/${paths.join('/')}` : '';
}






