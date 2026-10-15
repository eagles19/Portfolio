/* db, firebaseReady come from js/firebase-config.js; CONTENT comes from
   js/content.js — plain scripts loaded before this one share the same
   global scope, so no imports are needed here. */

/* =========================================================================
   START SCREEN
   ========================================================================= */
document.getElementById("logo-badge").textContent = CONTENT.initial;
document.getElementById("logo-badge-2").textContent = CONTENT.initial;
document.getElementById("start-title").textContent = `WELCOME TO ${CONTENT.name.toUpperCase()}'S HUB`;
document.getElementById("brand-name").textContent = CONTENT.name;
document.getElementById("brand-tag").textContent = CONTENT.tagline;

const startScreen = document.getElementById("start-screen");
const kiosk = document.getElementById("kiosk");

startScreen.addEventListener("click", enterKiosk, { once:true });

function enterKiosk(){
  startScreen.classList.add("hide");
  kiosk.style.display = "flex";
  bumpVisitCounter();
  renderCategory("home");
}

/* =========================================================================
   CATEGORY NAV
   ========================================================================= */
const CATEGORIES = [
  { id:"home",      label:"🏠 Home" },
  { id:"about",     label:"👤 About Me" },
  { id:"work",      label:"💼 My Work" },
  { id:"skills",    label:"🛠️ Skills" },
  { id:"links",     label:"🔗 Links" },
  { id:"contact",   label:"✉️ Contact" },
  { id:"guestbook", label:"📝 Guestbook" },
  { id:"games",     label:"🎮 Mini Games" }
];

const catbar = document.getElementById("catbar");
const stage = document.getElementById("stage");
const bottomHint = document.getElementById("bottom-hint");

CATEGORIES.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "catbtn";
  btn.dataset.cat = cat.id;
  btn.textContent = cat.label;
  btn.addEventListener("click", () => renderCategory(cat.id));
  catbar.appendChild(btn);
});

function setActiveCat(id){
  [...catbar.children].forEach(b => b.classList.toggle("active", b.dataset.cat === id));
}

function renderCategory(id){
  if (activeGame && activeGame.running) saveGameScore("navigation");
  setActiveCat(id);
  stage.innerHTML = "";
  const el = document.createElement("div");
  el.className = "stage-inner";
  stage.appendChild(el);

  const renderers = { home: renderHome, about: renderAbout, work: renderWork, skills: renderSkills, links: renderLinks, contact: renderContact, guestbook: renderGuestbook, games: renderGames };
  bottomHint.textContent = "Browsing: " + (CATEGORIES.find(c => c.id === id)?.label.replace(/^\S+\s/, "") || id);
  (renderers[id] || renderHome)(el);
}

/* =========================================================================
   SCREENS
   ========================================================================= */
function renderHome(el){
  el.innerHTML = `
    <div class="combo-banner">
      <span class="emoji">⭐</span>
      <div>
        <b>Today's combo: About Me + My Work</b>
        <span>Tap a category above to start browsing.</span>
      </div>
    </div>
    <h2>${CONTENT.name}</h2>
    <p class="lede">${CONTENT.role} · ${CONTENT.tagline}</p>
    <div class="tile-grid">
      ${CATEGORIES.filter(c => c.id !== "home").map(c => `
        <div class="tile" data-goto="${c.id}">
          <div class="tile-icon">${c.label.split(" ")[0]}</div>
          <h3>${c.label.replace(/^\S+\s/, "")}</h3>
          <p>Tap to view</p>
        </div>
      `).join("")}
    </div>
  `;
  el.querySelectorAll("[data-goto]").forEach(t => t.addEventListener("click", () => renderCategory(t.dataset.goto)));
}

function renderAbout(el){
  const np = CONTENT.nowPlaying;
  const npReady = np && np.spotifyEmbedUrl && np.spotifyEmbedUrl !== "TODO_SPOTIFY_EMBED_URL";

  el.innerHTML = `
    <h2>About Me</h2>
    <p class="lede">A little more about me, my interests, and how you can reach me.</p>

    <div class="about-layout about-layout-centered">
      <div class="about-main about-copy">
        <div class="order-panel about-text-panel">
          <p class="lede about-role">${CONTENT.role}</p>
          ${CONTENT.about.map(p => `<p>${p}</p>`).join("")}
        </div>

        <div class="about-info-grid">
          <div class="order-panel about-info-card">
            <div class="about-card-icon">📍</div>
            <h3>Contact Information</h3>
            <div class="about-detail"><span>Address</span><strong>${esc(CONTENT.contactInfo.address)}</strong></div>
            <div class="about-detail"><span>Phone</span><strong>${esc(CONTENT.contactInfo.phone)}</strong></div>
            <div class="about-detail"><span>Email</span><strong>${esc(CONTENT.contactInfo.email)}</strong></div>
          </div>

          <div class="order-panel about-info-card">
            <div class="about-card-icon">🎯</div>
            <h3>Hobbies</h3>
            <div class="hobby-list">
              ${CONTENT.hobbies.map(h => `<span class="hobby-pill">${esc(h)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>

      ${np ? `
      <div class="now-playing about-profile-playing">
        <div class="np-photo"><img src="${np.photo}" alt="${CONTENT.name} profile picture"></div>
        <div class="np-body">
          <div class="np-label">🎧 Now Playing</div>
          ${npReady ? `
            <div class="np-song">${np.song}</div>
            <div class="np-artist">${np.artist}</div>
            <iframe class="np-embed" src="${np.spotifyEmbedUrl}" width="100%" height="152" frameborder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            ${np.openUrl && np.openUrl !== "TODO_SPOTIFY_TRACK_URL" ? `<a class="np-open" href="${np.openUrl}" target="_blank" rel="noopener">open in spotify ↗</a>` : ""}
          ` : `<div class="np-todo">Add the song in js/content.js → nowPlaying.</div>`}
        </div>
      </div>` : ""}
    </div>
  `;
}

function renderWork(el){
  el.innerHTML = `
    <h2>My Work</h2>
    <p class="lede">Tap an item for details.</p>
    <div class="tile-grid">
      ${CONTENT.work.map((w,i) => `
        <div class="tile" data-work="${i}">
          <div class="tile-icon">${w.icon}</div>
          <div class="tile-tag">${w.tag}</div>
          <h3>${w.title}</h3>
          <p>${w.desc}</p>
        </div>
      `).join("")}
    </div>
  `;
  el.querySelectorAll("[data-work]").forEach(t => t.addEventListener("click", () => {
    const w = CONTENT.work[t.dataset.work];
    openModal(`
      ${w.screenshot ? `<img class="modal-shot" src="${w.screenshot}" alt="${w.title} screenshot">` : ""}
      <div class="tile-tag">${w.tag}</div>
      <h2>${w.icon} ${w.title}</h2>
      <p>${w.desc}</p>
    `);
  }));
}

function renderSkills(el){
  el.innerHTML = `
    <h2>Skills</h2>
    <p class="lede">What's on the menu, skill-wise.</p>
    <div class="tile-grid">
      ${Object.entries(CONTENT.skills).map(([group, list]) => `
        <div class="tile" style="cursor:default;">
          <div class="tile-icon">🧠</div>
          <h3>${group}</h3>
          <p>${list.join(" · ")}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLinks(el){
  const L = CONTENT.links;
  const rows = [["Facebook", L.facebook], ["YouTube", L.youtube], ["GitHub", L.github]];
  el.innerHTML = `
    <h2>Links</h2>
    <p class="lede">Find me elsewhere.</p>
    <div class="kv-list">
      ${rows.map(([k,v]) => `
        <div class="kv-row">
          <span class="k">${k}</span>
          <a href="${v}" target="_blank" rel="noopener">${v}</a>
        </div>
      `).join("")}
    </div>
  `;
}

function renderContact(el){
  el.innerHTML = `
    <h2>Contact</h2>
    <p class="lede">Send a message — it's saved straight to Firebase.</p>
    <div class="order-panel">
      <div class="field"><label>Name</label><input type="text" id="c-name" /></div>
      <div class="field"><label>Email</label><input type="text" id="c-email" /></div>
      <div class="field"><label>Message</label><textarea id="c-msg"></textarea></div>
      <div class="submitbar">
        <button class="btn-primary" id="c-send" style="padding:12px 26px;">SEND MESSAGE</button>
        <span class="status-msg" id="c-status"></span>
      </div>
    </div>
  `;
  el.querySelector("#c-send").addEventListener("click", async () => {
    const name = el.querySelector("#c-name").value.trim();
    const email = el.querySelector("#c-email").value.trim();
    const message = el.querySelector("#c-msg").value.trim();
    const status = el.querySelector("#c-status");
    if (!message) { status.textContent = "Write a message first."; status.className = "status-msg err"; return; }
    if (!firebaseReady) { status.textContent = "Firebase isn't configured yet — see js/firebase-config.js"; status.className = "status-msg err"; return; }
    status.textContent = "Sending…"; status.className = "status-msg";
    try {
      await db.collection("contact_messages").add({ name: name || "anonymous", email, message, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      status.textContent = "Sent — thanks!"; status.className = "status-msg ok";
      el.querySelectorAll("input,textarea").forEach(i => i.value = "");
    } catch (e) {
      console.error(e);
      status.textContent = "Failed to send — check console / Firestore rules."; status.className = "status-msg err";
    }
  });
}

function renderGuestbook(el){
  el.innerHTML = `
    <h2>Guestbook</h2>
    <p class="lede">Leave a note for the next visitor.</p>
    <div id="gb-list" class="status-msg">Loading entries…</div>
    <div class="order-panel" style="margin-top:14px;">
      <div class="field"><label>Name</label><input type="text" id="g-name" /></div>
      <div class="field"><label>Message</label><textarea id="g-msg"></textarea></div>
      <div class="submitbar">
        <button class="btn-primary" id="g-sign" style="padding:12px 26px;">SIGN GUESTBOOK</button>
        <span class="status-msg" id="g-status"></span>
      </div>
    </div>
  `;
  const listEl = el.querySelector("#gb-list");

  async function loadEntries(){
    if (!firebaseReady) { listEl.innerHTML = `<span class="err">Firebase isn't configured yet — see js/firebase-config.js</span>`; return; }
    try {
      const snap = await db.collection("guestbook").orderBy("createdAt", "desc").limit(10).get();
      if (snap.empty) { listEl.innerHTML = `no entries yet — be the first.`; return; }
      listEl.innerHTML = snap.docs.map(d => {
        const v = d.data();
        const when = v.createdAt?.toDate ? v.createdAt.toDate().toLocaleString() : "";
        return `<div class="entry"><div class="who">${esc(v.name || "anonymous")}</div><div class="msg">${esc(v.message || "")}</div><div class="when">${when}</div></div>`;
      }).join("");
    } catch (e) {
      console.error(e);
      listEl.innerHTML = `couldn't load entries — check console / Firestore rules.`;
    }
  }
  loadEntries();

  el.querySelector("#g-sign").addEventListener("click", async () => {
    const name = el.querySelector("#g-name").value.trim();
    const message = el.querySelector("#g-msg").value.trim();
    const status = el.querySelector("#g-status");
    if (!message) { status.textContent = "Write something first."; status.className = "status-msg err"; return; }
    if (!firebaseReady) { status.textContent = "Firebase isn't configured yet."; status.className = "status-msg err"; return; }
    status.textContent = "Posting…"; status.className = "status-msg";
    try {
      await db.collection("guestbook").add({ name: name || "anonymous", message, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      status.textContent = "Posted."; status.className = "status-msg ok";
      el.querySelector("#g-name").value = ""; el.querySelector("#g-msg").value = "";
      loadEntries();
    } catch (e) {
      console.error(e);
      status.textContent = "Failed — check console / Firestore rules."; status.className = "status-msg err";
    }
  });
}


let activeGame = null;

function renderGames(el){
  el.innerHTML = `
    <h2>Mini Games</h2>
    <p class="lede">Play, save your score, and see how you rank on the leaderboard.</p>

    <div class="game-layout">
      <div class="game-panel">
        <div class="game-header">
          <div>
            <div class="tile-tag">30 SECOND CHALLENGE</div>
            <h3>🎯 Catch the Dot</h3>
            <p>Click the moving target as many times as you can before time runs out.</p>
          </div>
          <div class="game-stat">
            <span>TIME</span>
            <strong id="game-time">30</strong>
          </div>
        </div>

        <div class="game-score-row">
          <span>Score: <strong id="game-score">0</strong></span>
          <span>Best: <strong id="game-best">—</strong></span>
        </div>

        <div id="game-board" class="game-board">
          <div class="game-message" id="game-message">
            <strong>Ready?</strong>
            <span>Enter your name, then start the game.</span>
          </div>
        </div>

        <div class="game-controls">
          <input id="game-player" class="game-name-input" maxlength="30" placeholder="Your name">
          <button class="btn-primary" id="game-start">START GAME</button>
          <button class="game-leave" id="game-leave" type="button">SAVE & LEAVE</button>
          <span class="status-msg" id="game-status"></span>
        </div>
      </div>

      <div class="leaderboard-panel">
        <div class="leaderboard-title">
          <div>
            <div class="tile-tag">TOP SCORES</div>
            <h3>🏆 Leaderboard</h3>
          </div>
          <button class="refresh-board" id="leaderboard-refresh">↻</button>
        </div>
        <div id="leaderboard-list" class="leaderboard-list">
          Loading scores…
        </div>
      </div>
    </div>
  `;

  activeGame = {
    running: false,
    saved: false,
    player: "",
    score: 0,
    timeLeft: 30,
    timer: null
  };

  const board = el.querySelector("#game-board");
  const message = el.querySelector("#game-message");
  const scoreEl = el.querySelector("#game-score");
  const timeEl = el.querySelector("#game-time");
  const bestEl = el.querySelector("#game-best");
  const playerInput = el.querySelector("#game-player");
  const startBtn = el.querySelector("#game-start");
  const leaveBtn = el.querySelector("#game-leave");
  const status = el.querySelector("#game-status");
  const list = el.querySelector("#leaderboard-list");

  async function loadLeaderboard(){
    if (!firebaseReady) {
      list.innerHTML = `<div class="leaderboard-empty">Firebase is not configured.</div>`;
      return;
    }

    try {
      const snap = await db.collection("game_scores")
        .orderBy("score", "desc")
        .limit(10)
        .get();

      if (snap.empty) {
        list.innerHTML = `<div class="leaderboard-empty">No scores yet. Be the first!</div>`;
        bestEl.textContent = "—";
        return;
      }

      const scores = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      bestEl.textContent = scores[0].score ?? 0;

      list.innerHTML = scores.map((v, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
        return `
          <div class="leader-row">
            <span class="leader-rank">${medal}</span>
            <div class="leader-name">
              <strong>${esc(v.name || "Anonymous")}</strong>
              <small>${v.createdAt?.toDate ? v.createdAt.toDate().toLocaleString() : ""}</small>
            </div>
            <strong class="leader-score">${Number(v.score || 0)}</strong>
          </div>
        `;
      }).join("");
    } catch (e) {
      console.error(e);
      list.innerHTML = `<div class="leaderboard-empty">Could not load scores. Check Firestore rules.</div>`;
    }
  }

  function placeTarget(){
    const old = board.querySelector(".game-target");
    if (old) old.remove();

    const target = document.createElement("button");
    target.type = "button";
    target.className = "game-target";
    target.textContent = "●";

    const maxX = Math.max(10, board.clientWidth - 62);
    const maxY = Math.max(10, board.clientHeight - 62);
    target.style.left = `${10 + Math.random() * (maxX - 10)}px`;
    target.style.top = `${10 + Math.random() * (maxY - 10)}px`;

    target.addEventListener("click", () => {
      if (!activeGame.running) return;
      activeGame.score += 1;
      scoreEl.textContent = activeGame.score;
      placeTarget();
    });

    board.appendChild(target);
  }

  function stopGame(){
    if (!activeGame || !activeGame.running) return;
    activeGame.running = false;
    clearInterval(activeGame.timer);
    activeGame.timer = null;

    const target = board.querySelector(".game-target");
    if (target) target.remove();

    message.innerHTML = `<strong>Game Over!</strong><span>Your score: ${activeGame.score}</span>`;
    message.classList.remove("hidden");
    saveGameScore("game-over");
  }

  function startGame(){
    const player = playerInput.value.trim();
    if (!player) {
      status.textContent = "Enter your name first.";
      status.className = "status-msg err";
      playerInput.focus();
      return;
    }
    if (!firebaseReady) {
      status.textContent = "Firebase isn't configured.";
      status.className = "status-msg err";
      return;
    }

    if (activeGame.running) return;

    activeGame.running = true;
    activeGame.saved = false;
    activeGame.player = player;
    activeGame.score = 0;
    activeGame.timeLeft = 30;

    scoreEl.textContent = "0";
    timeEl.textContent = "30";
    status.textContent = "Game on!";
    status.className = "status-msg ok";
    message.classList.add("hidden");

    placeTarget();

    activeGame.timer = setInterval(() => {
      activeGame.timeLeft -= 1;
      timeEl.textContent = activeGame.timeLeft;

      if (activeGame.timeLeft <= 0) stopGame();
    }, 1000);
  }

  async function saveGameScore(reason){
    if (!activeGame || activeGame.saved || !activeGame.player || activeGame.score < 0) return;
    activeGame.saved = true;

    if (activeGame.running) {
      activeGame.running = false;
      clearInterval(activeGame.timer);
      activeGame.timer = null;
    }

    if (!firebaseReady) return;

    try {
      await db.collection("game_scores").add({
        name: activeGame.player,
        score: activeGame.score,
        game: "catch-the-dot",
        reason,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      status.textContent = "Score saved!";
      status.className = "status-msg ok";
      await loadLeaderboard();
    } catch (e) {
      activeGame.saved = false;
      console.error(e);
      status.textContent = "Score could not be saved. Check Firestore rules.";
      status.className = "status-msg err";
    }
  }

  startBtn.addEventListener("click", startGame);
  leaveBtn.addEventListener("click", async () => {
    if (!activeGame.player) {
      status.textContent = "Start a game first.";
      status.className = "status-msg err";
      return;
    }
    await saveGameScore("left-game");
    message.innerHTML = `<strong>Score saved!</strong><span>You can start another round anytime.</span>`;
    message.classList.remove("hidden");
  });

  el.querySelector("#leaderboard-refresh").addEventListener("click", loadLeaderboard);
  loadLeaderboard();
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* =========================================================================
   MODAL
   ========================================================================= */
const modalBackdrop = document.getElementById("modal-backdrop");
const modalBody = document.getElementById("modal-body");
function openModal(html){ modalBody.innerHTML = html; modalBackdrop.classList.add("show"); }
function closeModal(){ modalBackdrop.classList.remove("show"); }
document.getElementById("modal-close").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => { if (e.target === modalBackdrop) closeModal(); });

/* =========================================================================
   VISIT COUNTER → shown as a ticket / order number
   ========================================================================= */
async function bumpVisitCounter(){
  const el = document.getElementById("ticket-num");
  if (!firebaseReady) { el.textContent = "N/A"; return; }
  try {
    const ref = db.collection("stats").doc("visits");
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ count: firebase.firestore.FieldValue.increment(1) });
      el.textContent = "#" + String((snap.data().count || 0) + 1).padStart(3, "0");
    } else {
      await ref.set({ count: 1 });
      el.textContent = "#001";
    }
  } catch (e) {
    console.error(e);
    el.textContent = "ERR";
  }
}

/* clock */
function tickClock(){ document.getElementById("clock").textContent = new Date().toLocaleTimeString(); }
setInterval(tickClock, 1000);
tickClock();
