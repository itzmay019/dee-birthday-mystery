
const app = document.getElementById("app");

const clues = {
  cake: {
    title: "THE CAKE STAND",
    emoji: "🎂",
    description:
      "The final candle is missing. There is a suspicious smear of icing on the edge of the cake stand. Whoever took it was clearly not operating with clean hands.",
  },
  hat: {
    title: "THE PARTY HAT",
    emoji: "🥳",
    description:
      "A yellow party hat has been abandoned beside the table. There's a little blob of icing inside it. Whoever wore this hat was VERY close to the cake.",
  },
  note: {
    title: "THE NOTE",
    emoji: "📝",
    description:
      'A note reads: "I did NOT take the candle. I was nowhere near the cake." It is signed "The Birthday Gremlin." Interesting. Defensive much?',
  },
  footprints: {
    title: "THE FOOTPRINTS",
    emoji: "🐾",
    description:
      "Tiny pawprints lead towards the cake table. However, they stop at the table. There are no pawprints leading away. The cat may have visited the scene, but that doesn't prove it took anything.",
  },
};

let inspectedClues = new Set();
let hintUsed = false;

function startGame() {
  inspectedClues.clear();
  hintUsed = false;
  renderCrimeScene();
}

function renderCrimeScene() {
  app.innerHTML = `
    <section class="game-card crime-scene">
      <p class="eyebrow">CASE 001 · THE MISSING CANDLE</p>
      <h1>THE CRIME SCENE</h1>
      <p class="scene-intro">
        Oh, dear. The birthday cake has been tampered with.
        One candle is missing, and three suspects are acting
        suspiciously. Your job is to investigate.
      </p>

      <div class="scene-warning">
        🚨 DO NOT TOUCH THE EVIDENCE. Actually, that's exactly what
        we're asking you to do.
      </div>

      <h2>Inspect the scene</h2>
      <p class="instruction">Tap each object to investigate it.</p>

      <div class="evidence-grid">
        ${Object.entries(clues).map(([key, clue]) => `
          <button class="evidence-object ${inspectedClues.has(key) ? "inspected" : ""}"
            data-clue="${key}">
            <span class="evidence-emoji">${clue.emoji}</span>
            <span class="evidence-name">${clue.title}</span>
            <span class="evidence-status">
              ${inspectedClues.has(key) ? "✓ INVESTIGATED" : "TAP TO INSPECT"}
            </span>
          </button>
        `).join("")}
      </div>

      <div id="clue-display" class="clue-display">
        <span class="clue-placeholder">🔎 Your evidence will appear here...</span>
      </div>

      <div class="clue-progress">
        <span>Evidence collected</span>
        <strong>${inspectedClues.size} / 4</strong>
      </div>

      <div class="progress-track">
        <div class="progress-fill" style="width: ${inspectedClues.size * 25}%"></div>
      </div>

      ${inspectedClues.size === 4 ? `
        <div class="deduction-box">
          <p class="eyebrow">TIME TO MAKE AN ACCUSATION</p>
          <h2>Who stole the candle?</h2>
          <p>Choose carefully. The Birthday Bureau has a very strict no-false-accusations policy.</p>
          <div class="suspect-options">
            <button class="suspect-button" data-answer="cat">🐈 The Cat</button>
            <button class="suspect-button" data-answer="inspector">🕵️ The Cake Inspector</button>
            <button class="suspect-button" data-answer="gremlin">👹 The Birthday Gremlin</button>
          </div>
          <p id="answer-feedback" class="answer-feedback"></p>
        </div>
      ` : `
        <p class="locked-message">🔒 Investigate all four clues to unlock the accusation.</p>
      `}

      <button class="hint-button" id="hint-button">I NEED A HINT. I'M A BUSY PERSON.</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;

  app.querySelectorAll("[data-clue]").forEach(button => {
    button.addEventListener("click", () => inspectClue(button.dataset.clue));
  });

  app.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => checkCrimeAnswer(button.dataset.answer));
  });

  document.getElementById("hint-button").addEventListener("click", showHint);
}

function inspectClue(key) {
  inspectedClues.add(key);
  const clue = clues[key];

  renderCrimeScene();

  const display = document.getElementById("clue-display");
  display.innerHTML = `
    <div class="clue-reveal">
      <span class="clue-emoji">${clue.emoji}</span>
      <div>
        <h3>${clue.title}</h3>
        <p>${clue.description}</p>
      </div>
    </div>
  `;
}

function showHint() {
  const hint = document.getElementById("hint-display");

  hint.textContent = hintUsed
    ? "The pawprints are a distraction. Focus on the evidence connecting someone to the cake."
    : "HINT: Not every suspicious clue is useful. One piece of evidence is a red herring.";

  hintUsed = true;
}

function checkCrimeAnswer(answer) {
  const feedback = document.getElementById("answer-feedback");

  if (answer === "gremlin") {
    feedback.innerHTML = `
      <strong>CASE SOLVED. 🎉</strong>
      <p>The Birthday Gremlin has been caught! The icing, the hat, the suspicious note... honestly, not their finest criminal work.</p>
      <button id="continue-button">CONTINUE INVESTIGATION →</button>
    `;

    document.getElementById("continue-button").addEventListener("click", () => {
      app.innerHTML = `
        <section class="game-card">
          <p class="eyebrow">CASE 001 · EVIDENCE CONFIRMED</p>
          <h1>WELL, WELL, WELL.</h1>
          <div class="big-doodle">🏆 🔎 🎂</div>
          <p class="scene-intro">
            One mystery solved. The Birthday Gremlin has been apprehended
            and the candle has been recovered.
          </p>
          <p>Unfortunately, this investigation is far from over.</p>
          <button onclick="startGame()">REVISIT THE CRIME SCENE</button>
          <p class="tiny">More puzzles coming soon. The Bureau is understaffed.</p>
        </section>
      `;
    });
  } else {
    feedback.textContent = answer === "cat"
      ? "The cat is suspicious, yes. But suspicious is not the same as guilty. Check the evidence again."
      : "The Cake Inspector has an airtight alibi. Well, a slightly sticky one. Try again.";
  }
}
