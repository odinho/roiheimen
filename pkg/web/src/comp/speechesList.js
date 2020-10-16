import { define, html } from "/web_modules/heresy.js";

export default define("RoiSpeechesList", {
  oninit() {
    this.simple = this.getAttribute("simple") != null;
  },
  style(self) {
    return `
    ${self} {
      display: flex;
      justify-content: center;
    }
    ${self} .status-started { font-size: 140%; }
    ${self} .status-ended { text-decoration: line-through; color: #666; }
    ${self} .status-cancelled { text-decoration: line-through; color: #875; }
    ${self} .simple .status-cancelled { display: none }
    `;
  },
  render({ useSel, useState, useStore }) {
    const { sakObj, speechState, myself } = useSel("sakObj", "speechState", "myself");
    const [showAll, setShowAll] = useState(false);
    const store = useStore();
    const { speeches } = sakObj || {};
    if (!speeches) {
      this.html`<p>Ingen på lista</p>`;
      return;
    }
    let shownSpeeches = speeches;
    if (!showAll) {
      shownSpeeches = speeches.filter((s) => !s.endedAt || s.id == speechState.prev?.id);
    }
    const toggle = () => {
      if (this.simple) return null;
      return html`<button style="margin-left: auto" .onclick=${() => setShowAll((s) => !s)}>
        ${shownSpeeches.length < speeches.length ? "Vis alle" : "Skjul ferdige"}
      </button>`;
    };
    const rm = (speech) => {
      if (speech.endedAt) return null;
      if (myself.admin || speech.speakerId == myself.id)
        return html`<button style="margin-left: auto" .onclick=${() => store.doSpeechEnd(speech.id)}>Stryk</button>`;
    };
    this.html`
      <table class=${this.simple ? "simple" : ""}>
      <tr><th>Nummer <th style="display: flex">Namn ${toggle()}</tr>
      ${shownSpeeches.map(
        (speech) =>
          html`
            <tr
              class=${`status-${speech.status} type-${speech.type}`}
              title=${`${speech.type} av ${speech.speaker.name}`}
            >
              <td>${speech.speaker.num}</td>
              <td style="display: flex">${speech.type == "REPLIKK" ? "↳ " : ""}${speech.speaker.name}${rm(speech)}</td>
            </tr>
          `
      )}
      </table>
      `;
  },
});
