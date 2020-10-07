import { define, html } from "/web_modules/heresy.js";

import "../db/state.js";
import storage from "../lib/storage.js";

import "./speechesList.js";
import "./video.js";


define("RoiVideoOut", {
  mappedAttributes: ["type"],
  oninit() {
    const qs = new URLSearchParams(location.search);
    this.type = qs.get("type");
  },
  style(self) {
    return `
    ${self} {
      display: block;
      overflow: hidden;
      height: 100vh;
    }
    ${self} whereby-embed {
      display: block;
      height: 100%;
    `;
  },
  onclick(event) {
    this.type = event.target.value;
  },
  ontype(t) {
    history.replaceState({}, '', new URL(`?type=${this.type}`, location.href));
    this.render();
  },
  render({ useSel, usePrevious }) {
    const { speechState } = useSel("speechState");
    const speech = (speechState.current?.out == this.type ? speechState.current : speechState.next);
    const room = speech?.speaker.room;
    const prevRoom = usePrevious(room);
    if (!this.type) {
      return this.html`
      Video-out type?
        <button value=a onclick=${this}>a</button>
        <button value=b onclick=${this}>b</button>
        `;
    }
    if (!room) {
      return this.html`
      Nothing on out ${this.type} at the moment.
      `;
    }
    if (room == prevRoom) return;
    this.html`
    <whereby-embed
      displayName=${this.type}
      background=off
      audio=off
      room=${room + "?floatSelf"} />
    `;
  }
});