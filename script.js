
const app = document.getElementById("app");
const SAVE_KEY = "deeBirthdayInvestigation_v2";

const freshProgress = () => ({
  completed: [],
  unlocked: 1,
  evidence: [],
  inspected: [],
});

let progress = loadProgress();

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return saved ? { ...freshProgress(), ...saved } : freshProgress();
  } catch {
    return freshProgress();
  }
}

function saveProgress() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
}

const rooms = [
  ["🔎", "THE CRIME SCENE", "A birthday mystery. A suspicious cake."],
  ["📼", "THE SOUNDTRACK", "A little 90s music knowledge, please."],
  ["🕵️", "THE SUSPECT FILES", "Someone's story isn't adding up."],
  ["🧀", "THE BIRTHDAY BUSINESS", "A very important party-planning emergency."],
  ["🏆", "THE FINAL FILE", "One last password stands between you and glory."],
];

function startGame() {
    alert("JAVASCRIPT IS CONNECTED!");
    showDashboard();
  }

function showDashboard() {
  app.innerHTML = `
    <section class="game-card dashboard">
      <p class="eyebrow">BIRTHDAY INVESTIGATION BUREAU · EST. 1977</p>
      <h1>THE DEE<br>INVESTIGATION FILES</h1>
      <p class="scene-intro">
        Welcome back, Detective. Five rooms. Five challenges.
        One woman who has somehow made collecting reward points a personality trait.
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
              <span class="room-icon">${room[0]}</span>
              <span class="room-info">
                <strong>ROOM 0${number} · ${room[1]}</strong>
                <small>${room[2]}</small>
              </span>
              <span class="room-status">${done ? "✓ SOLVED" : unlocked ? "OPEN →" : "🔒"}</span>
            </button>
          `;
        }).join("")}
      </div>

      <div class="investigator-note">
        <strong>INVESTIGATOR'S NOTE:</strong>
        Progress saves automatically on this device. You may leave and return.
        Unlike certain people, this website has its life together.
      </div>

      <button class="reset-button" onclick="confirmReset()">RESET ALL PROGRESS</button>
    </section>
  `;
}

function roomHeader(number) {
  return `
    <button class="back-button" onclick="showDashboard()">← BACK TO CASE FILES</button>
    <p class="eyebrow">CASE 049 · ROOM 0${number} OF 05</p>
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

function addEvidence(item) {
  if (!progress.evidence.includes(item)) {
    progress.evidence.push(item);
  }
  saveProgress();
}

function completeRoom(number, evidence) {
  if (!progress.completed.includes(number)) {
    progress.completed.push(number);
    progress.unlocked = Math.max(progress.unlocked, number + 1);
  }
  if (evidence) addEvidence(evidence);
  saveProgress();
  showRoomComplete(number, evidence);
}

function showRoomComplete(number, evidence) {
  app.innerHTML = `
    <section class="game-card">
      <p class="eyebrow">INVESTIGATION UPDATE · ROOM 0${number}</p>
      <h1>CASE SOLVED!</h1>
      <div class="big-doodle">🎉 🔎 ✨</div>
      <p class="scene-intro">Excellent work, Detective. Another mystery has been dealt with.</p>
      <div class="evidence-award">
        <span>📁 EVIDENCE COLLECTED</span>
        <strong>${evidence}</strong>
      </div>
      <button onclick="showDashboard()">BACK TO CASE FILES →</button>
      <p class="tiny">Your next room is unlocked. Try not to let it go to your head.</p>
    </section>
  `;
}

function wrongAnswer(message) {
  const feedback = document.getElementById("feedback");
  if (feedback) feedback.textContent = message;
}

function showHint(message) {
  const hint = document.getElementById("hint-display");
  if (hint) hint.textContent = message;
}

// --------------------------------------------------
// ROOM 1 — THE CRIME SCENE
// --------------------------------------------------

const clues = {
  cake: {
    title: "THE CAKE STAND",
    emoji: "🎂",
    description: "The birthday cake has lost its final candle. There is icing on the stand and a suspicious little fingerprint. Someone has been snacking on the evidence."
  },
  hat: {
    title: "THE PARTY HAT",
    emoji: "🥳",
    description: "A party hat has been abandoned beside the table. There's icing inside it. Either someone has a very unusual hat routine, or they were extremely close to the cake."
  },
  note: {
    title: "THE NOTE",
    emoji: "📝",
   description: "A note reads: I DID NOT TAKE THE CANDLE. I WAS NOWHERE NEAR THE CAKE. It is signed THE BIRTHDAY GREMLIN. A little defensive, aren't we?"
  },
  footprints: {
    title: "THE FOOTPRINTS",
    emoji: "👣",
    description: "A trail of tiny footprints leads towards the cake, but not away from it. A distraction, perhaps? The Bureau has ruled out animals. We respect the allergies."
  }
};

function roomOne() {
  app.innerHTML = `
    <section class="game-card crime-scene">
      ${roomHeader(1)}
      <h1>THE CRIME SCENE</h1>
      <p class="scene-intro">
        Emergency! The birthday cake has been tampered with.
        One candle is missing. Four clues remain.
        We need a competent detective. Apparently, that's you.
      </p>

      <div class="scene-warning">
        🚨 OFFICIAL NOTICE: Cake-related crimes will be taken seriously.
      </div>

      <h2>Inspect the evidence</h2>
      <p class="instruction">Tap each object to investigate it.</p>

      <div class="evidence-grid">
        ${Object.entries(clues).map(([key, clue]) => `
          <button class="evidence-object ${progress.inspected.includes(key) ? "inspected" : ""}"
            onclick="inspectClue('${key}')">
            <span class="evidence-emoji">${clue.emoji}</span>
            <span class="evidence-name">${clue.title}</span>
            <span class="evidence-status">
              ${progress.inspected.includes(key) ? "✓ INVESTIGATED" : "TAP TO INSPECT"}
            </span>
          </button>
        `).join("")}
      </div>

      <div id="clue-display" class="clue-display">
        <span class="clue-placeholder">🔎 Your evidence will appear here.</span>
      </div>

      <p class="clue-progress">${progress.inspected.length} / 4 clues investigated</p>

      ${progress.inspected.length === 4 ? `
        <div class="deduction-box">
          <h2>Who stole the candle?</h2>
          <p>Choose the culprit. Think before you accuse. This is not a family group chat.</p>
          <div class="suspect-options">
            <button class="suspect-button" onclick="checkRoomOne('cat')">🐈 The Cat</button>
            <button class="suspect-button" onclick="checkRoomOne('inspector')">🕵️ The Cake Inspector</button>
            <button class="suspect-button" onclick="checkRoomOne('gremlin')">👹 The Birthday Gremlin</button>
          </div>
          <p id="feedback" class="answer-feedback"></p>
        </div>
      ` : `<p class="locked-message">🔒 Investigate all four clues to unlock the accusation.</p>`}

      <button class="hint-button" onclick="showHint('The footprints are a distraction. Focus on the evidence connecting someone to the cake.')">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function inspectClue(key) {
  if (!progress.inspected.includes(key)) {
    progress.inspected.push(key);
    saveProgress();
  }
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
      ? "The cat is suspicious, but the footprints don't prove anything. Also, the cat has declined to comment."
      : "The Cake Inspector has an alibi. A sticky one, but an alibi nonetheless.");
  }
}

// --------------------------------------------------
// ROOM 2 — THE SOUNDTRACK
// --------------------------------------------------

function roomTwo() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(2)}
      <h1>THE SOUNDTRACK</h1>
      <p class="scene-intro">
        A mysterious mixtape has been found. The label says it contains
        a message for Dee. Naturally, the Bureau has confiscated it.
      </p>

      <div class="mixtape">
        <div class="cassette-holes"><span></span><span></span></div>
        <p class="eyebrow">SIDE A · THE 90s EDITION</p>
        <h2>THE DEE MIX</h2>
        <p>POP · R&B · QUESTIONABLE DANCING</p>
        <div class="cassette-reels">◉ ━━━━━━━━━ ◉</div>
      </div>

      <div class="clue-display">
        <h3>📼 THE SECRET TRACK</h3>
        <p>The message has been encoded by moving every letter one step FORWARD in the alphabet.</p>
        <h2 class="cipher-code">WJCF</h2>
        <p>Example: A becomes B. B becomes C. To decode, move backwards.</p>
      </div>

      <label class="puzzle-label" for="cipher-answer">What is the secret word?</label>
      <input id="cipher-answer" class="puzzle-input" placeholder="Enter the word..." autocomplete="off">
      <button onclick="checkRoomTwo()">PLAY THE SECRET TRACK →</button>
      <p id="feedback" class="answer-feedback"></p>
      <button class="hint-button" onclick="showHint('Move every letter one place BACKWARDS. W becomes V, for example.')">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomTwo() {
  const answer = document.getElementById("cipher-answer").value.trim().toUpperCase();
  if (answer === "VIBE") {
    completeRoom(2, "THE SECRET WORD: VIBE");
  } else {
    wrongAnswer("Not quite. The letters moved forward when the message was written. Reverse the shift!");
  }
}

// --------------------------------------------------
// ROOM 3 — THE SUSPECT FILES
// --------------------------------------------------

function roomThree() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(3)}
      <h1>THE SUSPECT FILES</h1>
      <p class="scene-intro">
        Three suspects were near the birthday preparations.
        One is lying. The evidence is in. Time to channel your favourite cop show.
      </p>

      <div class="suspect-file">
        <h3>🧢 AVA · THE ARRIVAL EXPERT</h3>
        <p>"I arrived after the candle had already disappeared."</p>
      </div>
      <div class="suspect-file">
        <h3>🎩 MAX · THE BEST FRIEND</h3>
        <p>"I was with Dee the entire time. I never went near the cake."</p>
      </div>
      <div class="suspect-file">
        <h3>👹 MILO · THE PARTY GUEST</h3>
        <p>"I didn't touch the cake. I was nowhere near it."</p>
      </div>

      <div class="clue-display">
        <h3>📂 ADDITIONAL EVIDENCE</h3>
        <p>• Two witnesses confirm Ava arrived after the candle disappeared.</p>
        <p>• Dee confirms Max was with her the entire time.</p>
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

      <div class="investigator-note">
        <strong>UNRELATED FILE DISCOVERED:</strong>
        "Low Rent Vagina Amanda." The Bureau has no further comment.
      </div>

      <button class="hint-button" onclick="showHint('Which suspect has physical evidence connecting them to the cake, despite claiming they were nowhere near it?')">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomThree(answer) {
  if (answer === "milo") {
    completeRoom(3, "MILO'S ICING-STAINED STATEMENT");
  } else {
    wrongAnswer("Check the evidence. One suspect's statement directly contradicts what was found.");
  }
}

// --------------------------------------------------
// ROOM 4 — THE BIRTHDAY BUSINESS
// --------------------------------------------------

function roomFour() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(4)}
      <h1>THE BIRTHDAY BUSINESS</h1>
      <p class="scene-intro">
        The birthday party is almost ready. Almost.
        Unfortunately, someone has mixed up the party checklist.
        The charcuterie board is in danger. We need to act.
      </p>

      <div class="charcuterie">
        <div>🧀</div><div>🍇</div><div>🥨</div><div>🍓</div><div>🍫</div>
        <p>THE BOARD OF IMPORTANT DECISIONS</p>
      </div>

      <div class="clue-display">
        <h3>📋 THE PARTY PLANNER'S NOTES</h3>
        <p>1. Crackers must be placed first.</p>
        <p>2. Cheese goes immediately after crackers.</p>
        <p>3. Fruit goes after the cheese.</p>
        <p>4. Chocolate is saved for last. Obviously.</p>
      </div>

      <h2>Put the board in order</h2>
      <p class="instruction">Choose what goes in each position.</p>

      <div class="order-list">
        ${[1,2,3,4].map(n => `
          <label class="order-row">
            <strong>${n}.</strong>
            <select id="order-${n}" class="puzzle-input">
              <option value="">Choose an item</option>
              <option value="crackers">🥨 Crackers</option>
              <option value="cheese">🧀 Cheese</option>
              <option value="fruit">🍇 Fruit</option>
              <option value="chocolate">🍫 Chocolate</option>
            </select>
          </label>
        `).join("")}
      </div>

      <button onclick="checkRoomFour()">SAVE THE CHARCUTERIE BOARD →</button>
      <p id="feedback" class="answer-feedback"></p>

      <div class="investigator-note">
        <strong>ADDITIONAL INTELLIGENCE:</strong>
        The subject has been known to collect Optimum points, get her steps in,
        and maintain an impressive nail situation. All considered suspiciously organised.
      </div>

      <button class="hint-button" onclick="showHint('The notes already tell you the exact order. Read them one at a time!')">I NEED A HINT</button>
      <p id="hint-display" class="hint-display"></p>
    </section>
  `;
}

function checkRoomFour() {
  const correct = ["crackers", "cheese", "fruit", "chocolate"];
  const answers = [1, 2, 3, 4].map(n => document.getElementById(`order-${n}`).value);

  if (answers.every((value, i) => value === correct[i])) {
    completeRoom(4, "THE PERFECT CHARCUTERIE BOARD");
  } else {
    wrongAnswer("The board is still in chaos. Re-read the planner's notes and try again.");
  }
}

// --------------------------------------------------
// ROOM 5 — THE FINAL FILE
// --------------------------------------------------

function roomFive() {
  app.innerHTML = `
    <section class="game-card">
      ${roomHeader(5)}
      <h1>THE FINAL FILE</h1>
      <p class="scene-intro">
        Detective, you've made it to the final room.
        The Bureau has one last password to check.
      </p>

      <div class="final-evidence">
        <h3>📁 YOUR COLLECTED EVIDENCE</h3>
        ${progress.evidence.map(item => `<p>✓ ${item}</p>`).join("")}
      </div>

      <div class="cipher-paper">
        <p class="eyebrow">FINAL PASSWORD REQUIRED</p>
        <h2>HAPPY · 49 · DEE</h2>
        <p>Put the three parts together. No spaces. No punctuation.</p>
      </div>

      <label class="puzzle-label" for="final-answer">Enter the final password</label>
      <input id="final-answer" class="puzzle-input" placeholder="Your final answer..." autocomplete="off">
      <button onclick="checkRoomFive()">UNLOCK THE FINAL FILE →</button>
      <p id="feedback" class="answer-feedback"></p>
    </section>
  `;
}

function checkRoomFive() {
  const answer = document.getElementById("final-answer").value
    .trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (answer === "HAPPY49DEE") {
    if (!progress.completed.includes(5)) progress.completed.push(5);
    progress.unlocked = 5;
    addEvidence("THE FINAL FILE");
    saveProgress();
    showFinalReveal();
  } else {
    wrongAnswer("You're so close. Combine the three parts shown above!");
  }
}

function showFinalReveal() {
  app.innerHTML = `
    <section class="game-card final-reveal">
      <p class="eyebrow">BIRTHDAY INVESTIGATION BUREAU · CASE CLOSED</p>
      <div class="big-doodle">🎂 🎉 🥳</div>
      <h1>HAPPY 49TH BIRTHDAY, DEE!</h1>

      <div class="birthday-message">
        <h2>TO DEE ❤️</h2>
        <p>
          You've officially survived five rooms, several questionable
          investigations, and an unreasonable amount of birthday bureaucracy.
        </p>
        <p>
          Here's to your next chapter: more laughter, more adventures,
          more time by the water, more lovely moments with your girls,
          and plenty of reasons to celebrate yourself.
        </p>
        <p>
          Keep being the woman who lifts other women up, shows up for people,
          makes everyone laugh, and somehow manages to turn reward points
          into a competitive sport.
        </p>
        <p>
          We hope this next year brings you all the good things you deserve.
          You are loved, appreciated, and very much worth celebrating.
        </p>
        <p><strong>Happy birthday, Dee. ❤️</strong></p>
      </div>

      <div class="big-doodle">🏆 CASE CLOSED 🏆</div>
      <button onclick="showDashboard()">REVISIT THE CASE FILES</button>
    </section>
  `;
}

// --------------------------------------------------
// RESET
// --------------------------------------------------

function confirmReset() {
  if (confirm("Are you sure? This will erase all saved progress on this device.")) {
    localStorage.removeItem(SAVE_KEY);
    progress = freshProgress();
    showDashboard();
  }
}
