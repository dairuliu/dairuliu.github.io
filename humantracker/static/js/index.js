"use strict";

const burger = document.querySelector(".navbar-burger");
const menu = document.getElementById(burger.dataset.target);

function setMenu(open) {
  burger.classList.toggle("is-active", open);
  menu.classList.toggle("is-active", open);
  burger.setAttribute("aria-expanded", String(open));
}

burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-active")));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

const copyButton = document.querySelector(".copy-button");
const copyLabel = copyButton.querySelector("span:last-child");

copyButton.addEventListener("click", async () => {
  const citation = document.getElementById(copyButton.dataset.copyTarget).innerText;
  await navigator.clipboard.writeText(citation);
  copyLabel.textContent = "Copied";
  window.setTimeout(() => {
    copyLabel.textContent = "Copy BibTeX";
  }, 1800);
});

const tabs = [...document.querySelectorAll(".motion-tab")];
const panels = [...document.querySelectorAll(".comparison-panel")];
const pageButtons = [...document.querySelectorAll(".motion-page-button")];
const playButton = document.querySelector(".play-toggle");
const playIcon = playButton.querySelector(".icon");
const playLabel = playButton.querySelector("span:last-child");
const restartButton = document.querySelector(".restart-button");
const timeDisplay = document.querySelector(".time-display");
const loadStatus = document.querySelector(".load-status");
const comparisonSection = document.querySelector(".comparison-section");

let activePanel = document.querySelector(".comparison-panel.is-active");
let playing = false;
let frameRequest = 0;
let activeSession = null;
const panelLoads = new WeakMap();

function motionPages(panel = activePanel) {
  return [...panel.querySelectorAll(".motion-page")];
}

function activePage(panel = activePanel) {
  return motionPages(panel).find((page) => page.classList.contains("is-active")) || motionPages(panel)[0];
}

function panelVideos(panel = activePanel) {
  return [...activePage(panel).querySelectorAll("video")];
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function updateTime(current = 0, duration = 0) {
  const currentText = formatTime(current);
  const durationText = formatTime(duration);
  timeDisplay.textContent = `${currentText} / ${durationText}`;
}

function updatePlayButton() {
  playButton.setAttribute("aria-pressed", String(playing));
  playIcon.textContent = playing ? "Ⅱ" : "▶";
  playLabel.textContent = playing ? "Pause synchronized" : "Play synchronized";
}

function waitForMetadata(video) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("error", onError);
    };
    const onMetadata = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Unable to load ${video.dataset.src}`));
    };
    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("error", onError);
  });
}

function loadPanel(panel = activePanel) {
  const page = activePage(panel);
  if (page.dataset.loaded === "true") {
    return Promise.resolve(panelVideos(panel));
  }
  if (panelLoads.has(page)) {
    return panelLoads.get(page);
  }

  const videos = panelVideos(panel);
  const metadata = Promise.all(videos.map(waitForMetadata));
  videos.forEach((video) => {
    video.preload = "auto";
    video.src = video.dataset.src;
    video.load();
  });

  const load = metadata.then(() => {
    page.dataset.loaded = "true";
    return videos;
  }).finally(() => {
    panelLoads.delete(page);
  });
  panelLoads.set(page, load);
  return load;
}

function leader(videos = panelVideos()) {
  return videos.reduce((longest, video) => video.duration > longest.duration ? video : longest);
}

function preloadPanel(panel = activePanel) {
  void loadPanel(panel).catch((error) => {
    console.warn("Unable to preload comparison media", error);
  });
}

function setSharedTime(seconds, panel = activePanel) {
  const videos = panelVideos(panel);
  videos.forEach((video) => {
    const lastFrame = Math.max(0, video.duration - 0.04);
    video.currentTime = Math.min(seconds, lastFrame);
  });
  updateTime(seconds, leader(videos).duration);
}

function isCurrent(session) {
  return activeSession === session && activePanel === session.panel && activePage(session.panel) === session.page;
}

function isStale(session, videos = []) {
  if (isCurrent(session)) {
    return false;
  }
  if (!activeSession || activeSession.panel !== session.panel) {
    videos.forEach((video) => video.pause());
  }
  return true;
}

function cancelClock() {
  window.cancelAnimationFrame(frameRequest);
  frameRequest = 0;
}

function pausePanel() {
  activeSession = null;
  playing = false;
  cancelClock();
  panels.forEach((panel) => panelVideos(panel).forEach((video) => video.pause()));
  updatePlayButton();
}

function failPlayback(error, session) {
  if (!isCurrent(session)) {
    return;
  }
  pausePanel();
  loadStatus.textContent = `${error.message}. Check the media files and try again.`;
}

function tick(session) {
  if (!playing || !isCurrent(session)) {
    return;
  }

  const { panel } = session;
  const videos = panelVideos(panel);
  const clock = leader(videos);
  const duration = clock.duration;
  const current = clock.currentTime;

  if (clock.ended || current >= duration - 0.04) {
    setSharedTime(0, panel);
    void playPanel();
    return;
  }

  videos.forEach((video) => {
    if (video === clock) {
      return;
    }
    const lastFrame = Math.max(0, video.duration - 0.04);
    if (current >= lastFrame) {
      video.currentTime = lastFrame;
      video.pause();
      return;
    }
    if (Math.abs(video.currentTime - current) > 0.12) {
      video.currentTime = current;
    }
    if (video.paused) {
      video.play()
        .then(() => isStale(session, [video]))
        .catch((error) => failPlayback(error, session));
    }
  });

  updateTime(current, duration);
  frameRequest = window.requestAnimationFrame(() => tick(session));
}

function playPanel() {
  if (activeSession && activeSession.panel === activePanel && activeSession.promise) {
    return activeSession.promise;
  }

  const session = { panel: activePanel, page: activePage(), promise: null };
  activeSession = session;
  if (session.page.dataset.loaded !== "true") {
    loadStatus.textContent = "Loading…";
  }

  session.promise = loadPanel(session.panel).then((videos) => {
    if (isStale(session, videos)) {
      return;
    }
    const clock = leader(videos);
    if (!Number.isFinite(clock.duration) || clock.duration <= 0.04) {
      throw new Error("Comparison videos have no playable duration");
    }
    updateTime(clock.currentTime, clock.duration);
    loadStatus.textContent = "";
    if (clock.currentTime >= clock.duration - 0.04) {
      setSharedTime(0, session.panel);
    }

    const current = clock.currentTime;
    const playable = videos.filter((video) => current < video.duration - 0.04);
    return Promise.all(playable.map((video) => video.play())).then(() => {
      if (isStale(session, videos)) {
        return;
      }
      playing = true;
      updatePlayButton();
      cancelClock();
      frameRequest = window.requestAnimationFrame(() => tick(session));
    });
  }).catch((error) => {
    failPlayback(error, session);
  }).finally(() => {
    if (activeSession === session) {
      session.promise = null;
    }
  });
  return session.promise;
}

function activatePanel(name) {
  pausePanel();
  tabs.forEach((tab) => {
    const selected = tab.dataset.motion === name;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => {
    const selected = panel.dataset.panel === name;
    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
    if (selected) {
      activePanel = panel;
    }
  });

  updatePageButtons();
  if (activePage().dataset.loaded === "true") {
    const videos = panelVideos();
    const duration = leader(videos).duration;
    updateTime(leader(videos).currentTime, duration);
    loadStatus.textContent = "";
  } else {
    updateTime(0, 0);
    loadStatus.textContent = "";
  }
  preloadPanel();
}

function updatePageButtons() {
  const pages = motionPages();
  const activeIndex = pages.findIndex((page) => page.classList.contains("is-active"));
  pageButtons.forEach((button, index) => {
    const selected = index === activeIndex;
    button.hidden = index >= pages.length;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "page" : "false");
  });
}

function activatePage(index) {
  pausePanel();
  const pages = motionPages();
  const next = pages[Math.max(0, Math.min(index, pages.length - 1))];
  pages.forEach((page) => page.classList.toggle("is-active", page === next));
  updatePageButtons();
  if (next.dataset.loaded === "true") {
    const videos = panelVideos();
    updateTime(leader(videos).currentTime, leader(videos).duration);
  } else {
    updateTime(0, 0);
  }
  loadStatus.textContent = "";
  preloadPanel();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activatePanel(tab.dataset.motion));
  tab.addEventListener("keydown", (event) => {
    if (!(["ArrowLeft", "ArrowRight"].includes(event.key))) {
      return;
    }
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + tabs.length) % tabs.length;
    tabs[next].focus();
    activatePanel(tabs[next].dataset.motion);
  });
});

playButton.addEventListener("click", () => {
  if (playing) {
    pausePanel();
    return;
  }
  void playPanel();
});

restartButton.addEventListener("click", () => {
  if (activePage().dataset.loaded !== "true") {
    void playPanel();
    return;
  }
  const wasPlaying = playing;
  pausePanel();
  setSharedTime(0);
  if (wasPlaying) {
    void playPanel();
  }
});

pageButtons.forEach((button, index) => {
  button.addEventListener("click", () => activatePage(index));
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && playing) {
    pausePanel();
  }
});

const sectionObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting && playing) {
    pausePanel();
  }
}, { threshold: 0.08 });

sectionObserver.observe(comparisonSection);
updatePlayButton();
updatePageButtons();
preloadPanel();
