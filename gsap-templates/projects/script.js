// ==UserScript==
// @name         Modify Google Search Results
// @namespace    http://your.namespace.here/
// @version      1.0
// @description  Add custom changes to Google search results page
// @author       Your Name
// @match        https://www.google.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const searchTools = document.querySelector(".RNNXgb");
  if (searchTools) {
    const tray = document.querySelector(".IUOThf");
    const redditDiv = tray.createElement("div");
    redditDiv.textContent = "Reddit";
    redditDiv.style.cursor = "pointer";
    redditDiv.addEventListener("click", handleRedditClick);
    searchTools.appendChild(redditDiv);
  }

  const tray = document.querySelector(".IUOThf");
  const children = tray.children;
  for (let i = 0; i < children.length; i++) {
    if (i > 4) {
      children[i].style.display = "none";
    }
  }

  function handleRedditClick() {
    const searchInput = document.querySelector('input[name="q"]');
    const searchTerm = searchInput.value;
    window.location.href = `https://www.google.com/search?q=${searchTerm}+site:reddit.com`;
  }
})();
