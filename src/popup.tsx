// In popup.tsx or popup.js

import { Bookmark } from "./content_script";

chrome.storage.sync.get({ bookmarks: [] }, (data) => {
    const bookmarks = (data.bookmarks as Bookmark[]);
    const container = document.getElementById('bookmarks-container');

    if (!container) return;
  
    bookmarks.forEach((bookmark) => {
      // Create elements to display bookmark details
      const bookmarkElement = document.createElement('div');
      bookmarkElement.className = 'bookmark';
  
      const titleElement = document.createElement('h3');
      titleElement.textContent = bookmark.title;
  
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = bookmark.description;
  
      // Append elements to the bookmark element
      bookmarkElement.appendChild(titleElement);
      bookmarkElement.appendChild(descriptionElement);
  
      // Append the bookmark element to the container
      container.appendChild(bookmarkElement);
    });
  });
  