import store from "../db/state.js";

export function themeToCss(theme) {
  return Array.from(Object.entries(theme))
    .filter(([k]) => /^[-a-z]+$/.test(k))
    .map(([k, v]) => ([`--roi-theme-${k}`, v]));
}

function applyTheme({ theme }) {
  for (const [k, v] of themeToCss(theme)) {
    document.documentElement.style.setProperty(k, v);
  }
  if (theme[":external-css"]) {
    const elm = document.createElement("link");
    elm.rel = "stylesheet";
    elm.href = theme[":external-css"];
    document.head.appendChild(elm);
  }
}

store.subscribeToSelectors(["selectMeeting"], ({ meeting }) => {
  applyTheme(meeting);
})
