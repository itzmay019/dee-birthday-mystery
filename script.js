
const app = document.getElementById("app");

const SAVE_KEY = "deeBirthdayInvestigation_v1";

const defaultProgress = {
  completed: [],
  unlocked: 1,
  evidence: [],
};

let progress = loadProgress();

function loadProgress() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
}

const rooms = [
  { name: "The Crime Scene", icon: "🔎", subtitle: "A suspicious birthday incident." },
  { name: "The Secret Message", icon: "🔐", subtitle: "Something is hidden in plain sight." },
  { name: "The Suspect Files", icon: "🕵️", subtitle: "Someone isn't telling the truth." },
  { name: "The Birthday Disaster", icon: "🎈", subtitle: "A party-planning catastrophe." },
  { name: "The Final File", icon: "🏆", subtitle: "One last challenge." },
];

function startGame() {
  showDashboard();
}

function showDashboard() {
  app.innerHTML = `
    <section class="game-card dashboard">
      <p class="eyebrow">BIRTHDAY INVESTIGATION BUREAU</p>
      <h1>THE CASE FILES</h1>
      <p class="scene-intro">
        Welcome back, Detective. Five rooms. Five challenges.
        One very important birthday.
      </p>

      <div class="dashboard-stats">
        <div><strong>${progress.completed.length}/5</strong><span>Rooms solved</span></div>
        <div><strong>${progress.evidence.length}</strong><span>Evidence collected</span></div>
      </div>

      <div class="room-list">
        ${rooms.map((room, i) => {
          const number = i + 1;
          const done = progress.completed.includes(number);
          const unlocked = number <= progress.unlocked;

          return `
            <button class="room-card ${done ? "room-done" : ""}"
              ${unlocked ? `onclick="openRoom(${number})"` : "disabled"}>
              <span class="room-icon">${room.icon}</span>
              <span class="room-info">
                <strong>ROOM ${String(number).padStart(2, "0")} · ${room.name}</strong>
                <small>${room.subtitle}</small>
              </span>
              <span class="room-status">${done ? "✓ SOLVED" : unlocked ? "OPEN →" : "🔒"}</span>
            </button>
          `;
        }).join("")}
      </div>

      <p class="tiny">Progress saves automatically on this device.</p>
      <button class="reset-button" onclick="confirmReset()">RESET CASE FILES</button>
    </section>
  `;
}

function openRoom(number) {
  if (number > progress.unlocked) return;

  if (number === 1) roomOne();
  if (number === 2) roomTwo();
  if (number === 3) roomThree();
  if (number === 4) roomFour();
  if (number === 5) roomFive();
}

function roomHeader(number) {
  return `
    <button class="back-button" onclick="showDashboard()">← CASE FILES</button>
    <p class="eyebrow">ROOM ${String(number).padStart(2, "0")} OF 05</p>
  `;
}

function completeRoom(number, evidence) {
  if (!progress.completed.includes(number)) {
    progress.completed.push(number);
    progress.unlocked = Math.max(progress.unlocked, number + 1);
    if (evidence && !progress.evidence.includes(evidence)) {
      progress.evidence.push(evidence);
    }
    saveProgress();
  }
  showRoomComplete(number, evidence);
}

function showRoomComplete(number, evidence) {
  app.innerHTML = `
    <section class="game-card">
      <p class="eyebrow">INVESTIGATION UPDATE</p>
      <h1>ROOM SOLVED!</h1>
      <div class="big-doodle">🎉 🔎 ✨</div>
      <p class="scene-intro">Excellent work, Detective. Another piece of the mystery has been uncovered.</p>
      <div class="evidence-award">
        <span>📁 EVIDENCE COLLECTED</span>
        <strong>${evidence || "CASE COMPLETE"}</strong>
      </div>
      <button onclick="showDashboard()">BACK TO CASE FILES →</button>
      <p class="tiny">Your next room is now unlocked.</p>
    </section>
  `;
}

function wrongAnswer(message) {
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.textContent = message;
}

// ROOM 1 — CRIME SCENE

const clues = {
  cake: {
    title: "THE CAKE STAND",
    emoji: "🎂",
    description: "The final candle is missing. A smear of icing sits on the edge of the stand. Whoever took it was not particularly careful."
  },
  hat: {
    title: "THE PARTY HAT",
    emoji: "🥳",
    description: "A yellow party hat has been abandoned beside the table. There is icing inside it. Very suspicious headwear."
  },
  note: {
    title: "THE NOTE",
    emoji: "📝",
    description: 'A note reads: "I did NOT take the candle. I was nowhere near the cake." It is signed THE BIRTHDAY GREMLIN. Defensive much?'
  },
  footprints: {
    title: "THE FOOTPRINTS",
    emoji: "🐾",
    description: "Tiny pawprints lead towards the cake table, but none lead away. The cat visited the scene, but that does not prove it stole anything."
  }
};

let inspected = new Set();

function roomOne() {
  app.innerHTML = `
    <section class="game-card crime-scene">
      ${roomHeader(1)}
      <h1>THE CRIME SCENE</h1>
      <p class="scene-intro">The birthday cake has been tampered with. One candle is missing. Four clues remain. Investigate everything.</p>
      <div class="scene-warning">🚨 OFFICIAL NOTICE: Cake-related crimes will be taken seriously.</div>
      <h2>Inspect the evidence</h2>
      <p class="instruction">Tap each object to investigate it.</p>

      <div class="evidence-grid">
        ${Object.entries(clues).map(([key, clue]) => `
          <button class="evidence-object ${inspected.has(key) ? "inspected" : ""}" onclick="inspectClue('${key}')">
            <span class="evidence-emoji">${clue.emoji}</span>
            <span class="evidence-name">${clue.title}</span>
            <span class="evidence-status">${inspected.has(key) ? "✓ INVESTIGATED" : "TAP TO INSPECT"}</span>
          </button>
        `).join("")}
      </div>

      <div id="clue-display" class="clue-display">
        <span class="clue-placeholder">🔎 Evidence will appear here.</span>
      </div>

      <p class="clue-progress">${inspected.size} / 4 clues investigated</p>

      ${inspected.size === 4 ? `
        <div class="deduction-box">
          <h2>Who stole the candle?</h2>
          <div class="suspect-options">
            <button class="suspect-button" onclick="checkRoomOne('cat')">🐈 The Cat</button>
            <button class="suspect-button" onclick="checkRoomOne('inspector')">🕵️ The Cake Inspector</button>
            <button class="suspect-button" onclick="checkRoomOne('gremlin')">👹 The Birthday Gremlin</button>
          </div>
          <p id="feedback" class="answer-feedback"></p>
        </div>
      ` : `<p class="locked-message">🔒 Investigate all four clues to unlock the accusation.</p>`}

      <button class="hint-button" onclick="showRoomHint(1)">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function inspectClue(key) {
  inspected.add(key);
  roomOne();

  const clue = clues[key];
  document.getElementById("clue-display").innerHTML = `
    <div class="clue-reveal">
      <span class="clue-emoji">${clue.emoji}</span>
      <div><h3>${clue.title}</h3><p>${clue.description}</p></div>
    </div>
  `;
}

function checkRoomOne(answer) {
  if (answer === "gremlin") {
    completeRoom(1, "THE GREMLIN'S CONFESSION");
  } else {
    wrongAnswer(answer === "cat"
      ? "The cat is suspicious, but the pawprints don't prove anything. Keep investigating."
      : "The Cake Inspector has an alibi. A very sticky alibi, but an alibi nonetheless.");
  }
}

// ROOM 2 — SECRET MESSAGE

function roomTwo() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(2)}
      <h1>THE SECRET MESSAGE</h1>
      <p class="scene-intro">The Birthday Gremlin left a coded message behind. Apparently, stealing candles wasn't enough. Now they're being dramatic.</p>

      <div class="cipher-paper">
        <p class="eyebrow">RECOVERED MESSAGE</p>
        <h2 class="cipher-code">DBOEMF</h2>
        <p>Every letter has been moved <strong>one step forward</strong> in the alphabet.</p>
        <p>For example: A becomes B. B becomes C.</p>
      </div>

      <label class="puzzle-label" for="cipher-answer">What was the original word?</label>
      <input id="cipher-answer" class="puzzle-input" placeholder="Enter your answer..." autocomplete="off">
      <button onclick="checkRoomTwo()">DECODE MESSAGE →</button>
      <p id="feedback" class="answer-feedback"></p>
      <button class="hint-button" onclick="showRoomHint(2)">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomTwo() {
  const answer = document.getElementById("cipher-answer").value.trim().toUpperCase();
  if (answer === "CANDLE") {
    completeRoom(2, "THE WORD CANDLE");
  } else {
    wrongAnswer("Not quite. Remember: the displayed letters moved FORWARD. To decode, move them backwards.");
  }
}

// ROOM 3 — SUSPECT FILES

function roomThree() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(3)}
      <h1>THE SUSPECT FILES</h1>
      <p class="scene-intro">Three people were near the cake. One of them is lying. Read the statements carefully.</p>

      <div class="suspect-file">
        <h3>🧢 AVA</h3>
        <p>"I arrived after the candle had already disappeared."</p>
      </div>
      <div class="suspect-file">
        <h3>🎩 MAX</h3>
        <p>"I was with Dee the entire time. I never went near the cake."</p>
      </div>
      <div class="suspect-file">
        <h3>👹 MILO</h3>
        <p>"I didn't touch the cake. I was nowhere near it."</p>
      </div>

      <div class="clue-display">
        <h3>📂 ADDITIONAL EVIDENCE</h3>
        <p>• Ava's arrival time is confirmed by two witnesses.</p>
        <p>• Dee confirms Max was with her.</p>
        <p>• Icing was found on Milo's sleeve.</p>
        <p>• Only one suspect is lying.</p>
      </div>

      <h2>Who is lying?</h2>
      <div class="suspect-options">
        <button class="suspect-button" onclick="checkRoomThree('ava')">Ava</button>
        <button class="suspect-button" onclick="checkRoomThree('max')">Max</button>
        <button class="suspect-button" onclick="checkRoomThree('milo')">Milo</button>
      </div>
      <p id="feedback" class="answer-feedback"></p>
      <button class="hint-button" onclick="showRoomHint(3)">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomThree(answer) {
  if (answer === "milo") {
    completeRoom(3, "MILO'S ICING-STAINED STATEMENT");
  } else {
    wrongAnswer("Check the confirmed evidence. One person's statement directly contradicts what was found.");
  }
}

// ROOM 4 — BIRTHDAY DISASTER

function roomFour() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(4)}
      <h1>THE BIRTHDAY DISASTER</h1>
      <p class="scene-intro">The party setup has been scrambled. Put the four events in the correct order using the clues below.</p>

      <div class="clue-display">
        <h3>📋 THE INSTRUCTIONS</h3>
        <p>1. The balloons were set up first.</p>
        <p>2. The cake arrived immediately after the balloons.</p>
        <p>3. Music started after the cake arrived.</p>
        <p>4. Confetti was saved for last. (For obvious reasons. Cleanup.)</p>
      </div>

      <h2>Choose the correct order</h2>
      <p class="instruction">Select the event in each position.</p>

      <div class="order-list">
        ${[1,2,3,4].map(n => `
          <label class="order-row">
            <strong>${n}.</strong>
            <select id="order-${n}" class="puzzle-input">
              <option value="">Choose an event</option>
              <option value="balloons">🎈 Balloons</option>
              <option value="cake">🎂 Cake</option>
              <option value="music">🎵 Music</option>
              <option value="confetti">🎊 Confetti</option>
            </select>
          </label>
        `).join("")}
      </div>

      <button onclick="checkRoomFour()">SUBMIT THE PARTY PLAN →</button>
      <p id="feedback" class="answer-feedback"></p>
      <button class="hint-button" onclick="showRoomHint(4)">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomFour() {
  const correct = ["balloons", "cake", "music", "confetti"];
  const answers = [1,2,3,4].map(n => document.getElementById(`order-${n}`).value);

  if (answers.every((value, i) => value === correct[i])) {
    completeRoom(4, "THE PERFECT PARTY ORDER");
  } else {
    wrongAnswer("The party is still a mess. Re-read the four instructions and try again.");
  }
}

// ROOM 5 — FINAL FILE

function roomFive() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(5)}
      <h1>THE FINAL FILE</h1>
      <p class="scene-intro">Detective, you've made it to the final room. The Bureau has one last test before revealing the truth.</p>

      <div class="final-evidence">
        <p>📁 Your collected evidence:</p>
        ${progress.evidence.map(item => `<div>✓ ${item}</div>`).join("")}
      </div>

      <div class="cipher-paper">
        <p class="eyebrow">FINAL PASSWORD REQUIRED</p>
        <h2>HAPPY DEE</h2>
        <p>Put the two words together. No spaces. No punctuation.</p>
      </div>

      <label class="puzzle-label" for="final-answer">Enter the final password</label>
      <input id="final-answer" class="puzzle-input" placeholder="The final password..." autocomplete="off">
      <button onclick="checkRoomFive()">UNLOCK THE FINAL FILE →</button>
      <p id="feedback" class="answer-feedback"></p>
    </section>
  `;
}

function checkRoomFive() {
  const answer = document.getElementById("final-answer").value.trim().toUpperCase().replace(/\s/g, "");
  if (answer === "HAPPYDEE") {
    progress.completed.push(5);
    progress.unlocked = 5;
    saveProgress();
    showFinalReveal();
  } else {
    wrongAnswer("So close. The final password is written right there in the file. No need to overthink it!");
  }
}

function showFinalReveal() {
  app.innerHTML = `
    <section class="game-card final-reveal">
      <p class="eyebrow">BIRTHDAY INVESTIGATION BUREAU · CASE CLOSED</p>
      <div class="big-doodle">🎂 🎉 🥳</div>
      <h1>HAPPY BIRTHDAY, DEE!</h1>
      <p class="scene-intro">
        You've solved every mystery, uncovered every clue,
        and survived the most unnecessarily complicated birthday investigation ever assembled.
      </p>
      <div class="birthday-message">
        <h2>A MESSAGE FROM YOUR FAVOURITE INVESTIGATION TEAM</h2>
        <p>We hope your birthday is full of laughter, ridiculous moments, and people who appreciate just how wonderful you are.</p>
        <p>Thank you for being you. We love you!</p>
        <p>— The Birthday Investigation Bureau ❤️</p>
      </div>
      <div class="big-doodle">🏆 CASE CLOSED 🏆</div>
      <button onclick="showDashboard()">REVISIT THE CASE FILES</button>
    </section>
  `;
}

// HINTS

function showRoomHint(number) {
  const hints = {
    1: "Not every suspicious clue is useful. The pawprints are a distraction.",
    2: "To reverse a forward shift, move each letter one place BACKWARDS.",
    3: "Which suspect has physical evidence that contradicts their statement?",
    4: "The clues already give you the order. Start with the event that must happen first.",
  };

  const display = document.getElementById("hint-display");
  if (display) display.textContent = hints[number];
}

function confirmReset() {
  if (confirm("Are you absolutely sure? This will erase all saved progress on this device.")) {
    localStorage.removeItem(SAVE_KEY);
    progress = { ...defaultProgress, completed: [], evidence: [] };
    inspected.clear();
    showDashboard();
  }
}

