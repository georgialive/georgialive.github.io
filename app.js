import { initAdvancedLab } from "./advanced-lab.js";
import { initCourseMap } from "./course-map.js";
import { initContactDialog } from "./contact.js";
import { initMathLab } from "./math-lab.js";
import { makePattern, positionNotes } from "./instrument.js";

function initToolkit() {
  const tabs = document.querySelector(".toolkit-tabs");
  if (!tabs) return;
  const buttons = [...tabs.querySelectorAll('[role="tab"]')];
  const select = (button, focus = false) => {
    for (const option of buttons) {
      const active = option === button;
      option.setAttribute("aria-selected", String(active));
      option.tabIndex = active ? 0 : -1;
      document.getElementById(option.getAttribute("aria-controls")).hidden = !active;
    }
    if (focus) button.focus();
  };
  tabs.hidden = false;
  select(buttons[0]);
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest('[role="tab"]');
    if (button && tabs.contains(button)) select(button);
  });
  tabs.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
    if (event.key === "ArrowLeft") next = (index + buttons.length - 1) % buttons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      select(buttons[next], true);
    }
  });
}

function initProjectDialog() {
  const dialog = document.querySelector("#project-dialog");
  if (!dialog?.showModal) return; // Image links remain a no-JS/older-browser fallback.
  const body = document.querySelector("#project-dialog-body");
  const title = document.querySelector("#project-dialog-title");
  const controls = document.querySelector("#gallery-controls");
  const count = document.querySelector("#gallery-count");
  let trigger;
  let images = [];
  let imageIndex = 0;
  const showImage = (index) => {
    imageIndex = (index + images.length) % images.length;
    images.forEach((image, i) => { image.hidden = i !== imageIndex; });
    count.textContent = `${imageIndex + 1} / ${images.length}`;
  };
  document.querySelector(".archive-list").addEventListener("click", (event) => {
    const link = event.target.closest("a[data-project]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const template = document.getElementById(link.dataset.project);
    if (!(template instanceof HTMLTemplateElement)) return;
    event.preventDefault();
    trigger = link;
    title.textContent = link.dataset.title;
    body.replaceChildren(template.content.cloneNode(true));
    images = [...body.querySelectorAll(".project-gallery img")];
    controls.hidden = images.length < 2;
    if (images.length) showImage(0);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.querySelector("#close-project").focus();
  });
  document.querySelector("#close-project").addEventListener("click", () => dialog.close());
  document.querySelector("#previous-image").addEventListener("click", () => showImage(imageIndex - 1));
  document.querySelector("#next-image").addEventListener("click", () => showImage(imageIndex + 1));
  dialog.addEventListener("keydown", (event) => {
    if (images.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    showImage(imageIndex + (event.key === "ArrowRight" ? 1 : -1));
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    body.replaceChildren();
    images = [];
    trigger?.focus();
  });
}

function initContact() {
  const button = document.querySelector("#copy-email");
  const status = document.querySelector("#copy-status");
  if (button && status && globalThis.isSecureContext && navigator.clipboard?.writeText) {
    button.hidden = false;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("georgia.m.vrana@gmail.com");
        status.textContent = "Email copied. Looking forward to hearing from you!";
      } catch {
        status.textContent = "Your browser blocked copying. You can select the address above or open the email link.";
      }
    });
  }
  const timeline = document.querySelector("#career-timeline");
  document.querySelectorAll('a[href="#career-timeline"]').forEach((link) => {
    link.addEventListener("click", () => { timeline.open = true; });
  });
}

function initInstrument() {
  const canvas = document.querySelector("#instrument-canvas");
  const context = canvas?.getContext("2d");
  const controls = document.querySelector("#instrument-controls");
  const status = document.querySelector("#instrument-status");
  if (!context || !globalThis.crypto?.getRandomValues) {
    if (status) status.textContent = "The live instrument is unavailable in this browser.";
    return;
  }
  const scatterInput = document.querySelector("#scatter");
  const tempoInput = document.querySelector("#tempo");
  const playButton = document.querySelector("#play-pattern");
  const newButton = document.querySelector("#new-pattern");
  const noteKeys = document.querySelector("#note-keys");
  const readout = document.querySelector("#note-readout");
  const viewButtons = [...document.querySelectorAll("[data-view]")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  let pattern = makePattern(crypto.getRandomValues(new Uint8Array(64)));
  let positions = [];
  let width = 0;
  let height = 0;
  let view = "orbit";
  let selected = -1;
  let hovered = -1;
  let playing = false;
  let audioStarting = false;
  let playbackGeneration = 0;
  let audio;
  let startedAt = 0;
  let stepDuration = .3;
  let animation = 0;
  let finishTimer;
  let patternVersion = 1;
  const oscillators = new Set();

  const draw = () => {
    if (!width || !height) return;
    const active = playing ? Math.min(15, Math.floor(Math.max(0, audio.currentTime - startedAt) / stepDuration)) : (hovered >= 0 ? hovered : selected);
    positions = positionNotes(pattern, width, height, Number(scatterInput.value), view);
    context.clearRect(0, 0, width, height);
    const glow = context.createRadialGradient(width / 2, height * .46, 0, width / 2, height * .46, width * .48);
    glow.addColorStop(0, "#aa78e52b");
    glow.addColorStop(1, "#aa78e500");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#cbb1f220";
    context.lineWidth = 1;
    if (view === "orbit") {
      [0.2, 0.3, 0.39].forEach((factor) => {
        context.beginPath();
        context.ellipse(width / 2, height * .46, Math.min(width * factor, height * .37), Math.min(width * factor, height * .37), 0, 0, Math.PI * 2);
        context.stroke();
      });
    } else {
      context.beginPath();
      context.moveTo(width * .08, height * .46);
      context.lineTo(width * .92, height * .46);
      context.stroke();
    }
    context.beginPath();
    positions.forEach((point, i) => i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
    if (view === "orbit") context.closePath();
    context.strokeStyle = "#a67dd361";
    context.lineWidth = 1.4;
    context.stroke();
    positions.forEach((point, index) => {
      const isActive = index === active;
      const radius = 3 + pattern[index].level * 3;
      if (isActive) {
        const pulse = playing && !reducedMotion.matches ? Math.sin(performance.now() / 140) * 2 : 0;
        context.beginPath();
        context.arc(point.x, point.y, radius + 9 + pulse, 0, Math.PI * 2);
        context.fillStyle = "#d8b8ff20";
        context.fill();
        context.strokeStyle = "#d8b8ff99";
        context.stroke();
      }
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fillStyle = isActive ? "#f5e7ff" : index % 3 === 0 ? "#c6a4f0" : "#9569c4";
      context.fill();
      if (isActive) {
        context.font = "12px ui-monospace, monospace";
        context.textAlign = "center";
        context.fillStyle = "#f2deff";
        context.fillText(pattern[index].name, point.x, point.y - 20);
      }
    });
    [...noteKeys.children].forEach((key, index) => key.setAttribute("aria-pressed", String(index === active)));
    readout.textContent = active >= 0 ? `Note ${active + 1} / 16 · ${pattern[active].name}` : "16 notes · D pentatonic";
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  };

  const stop = (message = "Pattern stopped.") => {
    playbackGeneration += 1;
    playing = false;
    audioStarting = false;
    playButton.disabled = false;
    cancelAnimationFrame(animation);
    clearTimeout(finishTimer);
    for (const oscillator of oscillators) {
      try { oscillator.stop(); } catch { /* Already ended. */ }
    }
    oscillators.clear();
    playButton.textContent = "Play pattern";
    playButton.setAttribute("aria-pressed", "false");
    status.textContent = message;
    draw();
  };

  const ensureAudio = async () => {
    if (!AudioContextClass) return false;
    if (!audio || audio.state === "closed") audio = new AudioContextClass();
    await audio.resume();
    return audio.state === "running";
  };

  const scheduleNote = (note, time, duration) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    gain.gain.setValueAtTime(.0001, time);
    gain.gain.exponentialRampToValueAtTime(.12, time + .018);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.onended = () => {
      oscillators.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillators.add(oscillator);
    oscillator.start(time);
    oscillator.stop(time + duration + .025);
  };

  const animate = () => {
    draw();
    if (playing) animation = requestAnimationFrame(animate);
  };

  playButton.addEventListener("click", async () => {
    if (playing) { stop(); return; }
    if (audioStarting) return;
    const generation = ++playbackGeneration;
    audioStarting = true;
    playButton.disabled = true;
    playButton.textContent = "Starting…";
    try {
      if (!(await ensureAudio())) throw new Error("Audio unavailable");
      if (generation !== playbackGeneration) return;
      stepDuration = 60 / Number(tempoInput.value) / 2;
      startedAt = audio.currentTime + .05;
      pattern.forEach((note, index) => scheduleNote(note, startedAt + index * stepDuration, stepDuration * .9));
      playing = true;
      playButton.textContent = "Stop pattern";
      playButton.setAttribute("aria-pressed", "true");
      status.textContent = `Playing pattern ${patternVersion}. Sound stays in your browser.`;
      animate();
      finishTimer = setTimeout(() => stop("Pattern finished. Try a new one!"), (16 * stepDuration + .15) * 1000);
    } catch {
      if (generation === playbackGeneration) stop("Your browser couldn’t start audio. The visual controls still work.");
    } finally {
      if (generation === playbackGeneration) {
        audioStarting = false;
        playButton.disabled = false;
      }
    }
  });

  const rebuildKeys = () => {
    const keys = pattern.map((note, index) => {
      const key = document.createElement("button");
      key.type = "button";
      key.dataset.note = String(index);
      key.textContent = note.name;
      key.setAttribute("aria-label", `${AudioContextClass ? "Play" : "Select"} ${note.name}, note ${index + 1} of 16`);
      key.setAttribute("aria-pressed", "false");
      return key;
    });
    noteKeys.replaceChildren(...keys);
  };

  const selectNote = async (index) => {
    if (playing || audioStarting) stop("Pattern paused to explore a note.");
    selected = index;
    draw();
    try {
      if (await ensureAudio()) scheduleNote(pattern[index], audio.currentTime + .01, .35);
    } catch {
      status.textContent = "Note selected. Your browser couldn’t start audio.";
    }
  };

  noteKeys.addEventListener("click", (event) => {
    const key = event.target.closest("button[data-note]");
    if (key) selectNote(Number(key.dataset.note));
  });
  newButton.addEventListener("click", () => {
    if (playing || audioStarting) stop();
    try {
      pattern = makePattern(crypto.getRandomValues(new Uint8Array(64)));
      patternVersion += 1;
      selected = hovered = -1;
      rebuildKeys();
      draw();
      status.textContent = `Pattern ${patternVersion} generated. Select a note or press Play.`;
    } catch {
      status.textContent = "Your browser couldn’t create a new pattern. The existing one is still available.";
    }
  });
  scatterInput.addEventListener("input", () => {
    document.querySelector("#scatter-value").textContent = `${scatterInput.value}%`;
    draw();
  });
  tempoInput.addEventListener("input", () => {
    document.querySelector("#tempo-value").textContent = `${tempoInput.value} BPM`;
    if (playing) stop("Tempo updated. Press Play to hear it.");
  });
  viewButtons.forEach((button) => button.addEventListener("click", () => {
    view = button.dataset.view;
    viewButtons.forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
    draw();
  }));
  const findNote = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let closest = -1;
    let distance = 24;
    positions.forEach((point, index) => {
      const candidate = Math.hypot(point.x - x, point.y - y);
      if (candidate < distance) { distance = candidate; closest = index; }
    });
    return closest;
  };
  canvas.addEventListener("pointermove", (event) => { hovered = findNote(event); if (!playing) draw(); });
  canvas.addEventListener("pointerleave", () => { hovered = -1; if (!playing) draw(); });
  canvas.addEventListener("click", (event) => { const index = findNote(event); if (index >= 0) selectNote(index); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) stop("Playback paused while the page is hidden."); });
  controls.hidden = false;
  playButton.setAttribute("aria-pressed", "false");
  if (!AudioContextClass) {
    playButton.hidden = true;
    status.textContent = "Audio is unavailable; explore the visual pattern instead.";
  } else status.textContent = "Sound starts only when you press Play or select a note.";
  rebuildKeys();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  addEventListener("pagehide", (event) => {
    stop("");
    if (!event.persisted) {
      observer.disconnect();
      audio?.close();
    } else audio?.suspend();
  });
  addEventListener("pageshow", resize);
}

initToolkit();
initProjectDialog();
initContact();
initContactDialog();
initMathLab();
initAdvancedLab();
initCourseMap();
initInstrument();
document.querySelector("#year").textContent = String(new Date().getFullYear());
