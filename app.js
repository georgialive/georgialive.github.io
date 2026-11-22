"use strict";

// Complete content and navigation remain available without JavaScript.
const filters = document.querySelector(".project-filters");
const cards = [...document.querySelectorAll("[data-category]")];
const count = document.querySelector("#project-count");
if (filters && cards.length && count) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button || !filters.contains(button)) return;
    let visible = 0;
    for (const card of cards) {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible += 1;
    }
    for (const option of filters.querySelectorAll("button")) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    count.textContent = `${visible} selected ${visible === 1 ? "project" : "projects"}`;
  });
}

const sampleButton = document.querySelector("#new-sample");
const grid = document.querySelector("#bit-grid");
const sampleOutput = document.querySelector("#sample-hex");
const sampleNote = document.querySelector("#sample-note");
const sampleStatus = document.querySelector("#sample-status");
let samplesGenerated = 0;

// Web Crypto supplies the bytes. This is not a QPP-RNG implementation or test.
if (sampleButton && grid && sampleOutput && sampleNote && sampleStatus && globalThis.crypto?.getRandomValues) {
  const cells = [...grid.children];
  const showSample = (announce) => {
    try {
      const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
      const bits = [...bytes].flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >> (7 - bit)) & 1));
      cells.forEach((cell, index) => cell.classList.toggle("is-one", bits[index] === 1));
      sampleOutput.textContent = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      samplesGenerated += 1;
      sampleNote.textContent = "Live randomness, from your browser.";
      if (announce) sampleStatus.textContent = `Sample ${samplesGenerated} generated: ${bytes.length} random bytes. The visualization has updated.`;
    } catch {
      sampleNote.textContent = "A visual exploration of randomness.";
      sampleButton.hidden = true;
      sampleStatus.textContent = "The live demo is unavailable in this browser.";
    }
  };
  sampleButton.hidden = false;
  showSample(false);
  sampleButton.addEventListener("click", () => showSample(true));
}

const copyButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");
if (copyButton && copyStatus && globalThis.isSecureContext && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("georgia.m.vrana@gmail.com");
      copyStatus.textContent = "Email address copied. Looking forward to hearing from you!";
    } catch {
      copyStatus.textContent = "Couldn’t copy automatically. Email me at georgia.m.vrana@gmail.com.";
    }
  });
}
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
