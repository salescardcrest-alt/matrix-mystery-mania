/* ============================================================
   MATRIX MYSTERY MANIA (3M) — Game Engine
   ============================================================ */

const CONFIG = {
  questionsPerRound: { 1: 10, 2: 10, 3: 10, 4: 10 },
  timePerQuestion: { 1: 20, 2: 20, 3: 60, 4: 60 },
  pointsPerCorrect: { 1: 10, 2: 10, 3: 15, 4: 10 },
  qualifyThreshold: 8,
};

const ADMIN_CREDENTIALS = {
  name: "Ayush",
  mobile: "9135469842",
  email: "landofpits@gmail.com",
};

const state = {
  player: { id: "", name: "", phone: "", email: "" },
  currentRound: 0,
  roundQueue: [],
  roundIndex: 0,
  timerId: null,
  timeLeft: 0,
  scores: { 1: 0, 2: 0, 3: 0, 4: 0 },
  answered: false,
  questionStartTime: 0,
  roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
  roundLog: [],
  selectedTextIdx: -1,
  selectedAudioIdx: -1,
  selectedMcqIdx: -1,
};

function $(id) { return document.getElementById(id); }

const SCREENS_WITHOUT_PLAYER_LOGOUT = ["screen-register", "screen-admin-login", "screen-admin-panel"];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  $("btnPlayerLogout").style.display = SCREENS_WITHOUT_PLAYER_LOGOUT.includes(id) ? "none" : "";
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(pool, count) {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function renderDots(containerId, total, currentIndex) {
  const el = $(containerId);
  el.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i < currentIndex ? " done" : i === currentIndex ? " active" : "");
    el.appendChild(d);
  }
}

function setTimerDisplay(el, seconds) {
  el.textContent = seconds;
  el.classList.remove("warn", "danger");
  if (seconds <= 5) el.classList.add("danger");
  else if (seconds <= 10) el.classList.add("warn");
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function getElapsedSeconds(roundNum, timedOut) {
  if (timedOut) return CONFIG.timePerQuestion[roundNum];
  const elapsed = Math.round((Date.now() - state.questionStartTime) / 1000);
  return Math.min(Math.max(elapsed, 0), CONFIG.timePerQuestion[roundNum]);
}

function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ---------------- SOUND EFFECTS (synthesized, no audio files needed) ---------------- */

let sharedAudioCtx = null;

function unlockAudioContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!sharedAudioCtx) sharedAudioCtx = new AC();
  if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume().catch(() => {});
}

function playUnlockChime() {
  if (!sharedAudioCtx) return;
  try {
    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;
    [660, 880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.1;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  } catch (e) {
    /* audio unavailable — game still proceeds silently */
  }
}

/* ---------------- PLAYER LOGOUT ---------------- */

$("btnPlayerLogout").addEventListener("click", () => {
  const ok = confirm(
    "Log out and return to the home screen? Your progress is saved on the server — you can log back in anytime with the same phone number."
  );
  if (!ok) return;

  clearTimer();
  clearInterval(waitPollTimer);
  clearInterval(adminPollTimer);
  clearInterval(summaryPollTimer);
  clearSession();

  state.player = { id: "", name: "", phone: "", email: "" };
  state.scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  state.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };

  $("playerName").value = "";
  $("playerPhone").value = "";
  $("playerEmail").value = "";

  showScreen("screen-register");
});

/* ---------------- PLAYER STORAGE (shared via server — visible to every device) ---------------- */

async function getPlayers() {
  try {
    const res = await fetch("/api/players");
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    alert("Could not reach the game server. Make sure this device is on the same WiFi as the host laptop and the server is running.");
    return [];
  }
}

async function savePlayerRecord(record) {
  await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", record }),
  });
  return record;
}

async function updatePlayerRecord(id, patch) {
  await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", id, patch }),
  });
}

/* Saves exactly which question within the current round the player is on,
   plus their answers so far, so a page refresh can resume mid-round
   instead of restarting the whole round. Fire-and-forget — gameplay
   never waits on this. */
function persistInProgress() {
  if (!state.player.id) return;
  updatePlayerRecord(state.player.id, {
    inProgress: {
      round: state.currentRound,
      index: state.roundIndex,
      log: state.roundLog,
      queue: state.roundQueue,
    },
  }).catch(() => {});
}

async function resetAllPlayers() {
  await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reset" }),
  });
}

/* ---------------- GAME STATE (admin-controlled round gate) ---------------- */

async function getGameState() {
  try {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    return { currentRound: 0 };
  }
}

async function setGameState(round) {
  const res = await fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentRound: round }),
  });
  return res.json();
}

async function setResultsDeclared(declared) {
  const res = await fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resultsDeclared: declared }),
  });
  return res.json();
}

/* Ranks completed players by final-round correct answers (desc),
   breaking ties by total time taken (asc — faster wins the tie). */
function computeRankings(players) {
  return players
    .filter((p) => p.status === "completed")
    .slice()
    .sort((a, b) => {
      const byCorrect = (b.finalCorrect || 0) - (a.finalCorrect || 0);
      if (byCorrect !== 0) return byCorrect;
      return (a.totalTime || 0) - (b.totalTime || 0);
    });
}

const STATUS_LABELS = {
  "in-progress": "In Progress",
  "eliminated-round-1": "Eliminated — Round 1",
  "eliminated-round-2": "Eliminated — Round 2",
  "eliminated-round-3": "Eliminated — Round 3",
  completed: "Completed Final",
};

async function exportPlayersToExcel() {
  const players = await getPlayers();

  if (players.length === 0) {
    alert("No players registered yet on this device.");
    return;
  }

  const maxFinalCorrect = Math.max(
    0,
    ...players.filter((p) => p.status === "completed").map((p) => p.finalCorrect || 0)
  );

  const rows = players.map((p, i) => ({
    "#": i + 1,
    "Player Name": p.name,
    "Mobile Number": p.phone,
    "Institute Email": p.email || "",
    "Round 1": p.round1 ? `${p.round1.correct}/${p.round1.total}` : "-",
    "Round 1 Time": p.round1 && typeof p.round1.time === "number" ? formatSeconds(p.round1.time) : "-",
    "Round 2": p.round2 ? `${p.round2.correct}/${p.round2.total}` : "-",
    "Round 2 Time": p.round2 && typeof p.round2.time === "number" ? formatSeconds(p.round2.time) : "-",
    "Round 3": p.round3 ? `${p.round3.correct}/${p.round3.total}` : "-",
    "Round 3 Time": p.round3 && typeof p.round3.time === "number" ? formatSeconds(p.round3.time) : "-",
    "Final Correct": p.status === "completed" ? `${p.finalCorrect}/${CONFIG.questionsPerRound[4]}` : "-",
    "Final Time": p.round4 && typeof p.round4.time === "number" ? formatSeconds(p.round4.time) : "-",
    "Total Score": p.totalScore || 0,
    "Total Time": typeof p.totalTime === "number" ? formatSeconds(p.totalTime) : "-",
    "Status": STATUS_LABELS[p.status] || p.status || "-",
    "Result": p.status === "completed" && p.finalCorrect === maxFinalCorrect ? "WINNER" : (p.status && p.status.startsWith("eliminated") ? "Lost" : ""),
    "Registered At": p.time,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Players");
  XLSX.writeFile(wb, "matrix_mystery_mania_players.xlsx");
}

/* ---------------- REGISTRATION ---------------- */

function normalizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

function restoreProgressFromRecord(record) {
  state.player.id = record.id;
  state.player.name = record.name;
  state.player.phone = record.phone;
  state.player.email = record.email;
  state.scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  state.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };
  [1, 2, 3, 4].forEach((r) => {
    const rr = record[`round${r}`];
    if (rr) {
      state.scores[r] = rr.points || 0;
      state.roundTimes[r] = rr.time || 0;
    }
  });
}

function highestCompletedRound(record) {
  if (record.round3) return 3;
  if (record.round2) return 2;
  if (record.round1) return 1;
  return 0;
}

/* ---------------- SESSION PERSISTENCE (survive a page refresh) ---------------- */

const SESSION_STORAGE_KEY = "matrix3m_session";

function saveSession() {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ phone: state.player.phone }));
  } catch (e) {
    /* storage unavailable — refresh just won't auto-resume */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {}
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch (e) {
    return null;
  }
}

function resumeExistingPlayer(existing) {
  restoreProgressFromRecord(existing);
  saveSession();

  if (existing.status === "completed") {
    showSummary();
    return;
  }
  if (existing.status && existing.status.startsWith("eliminated-round-")) {
    const r = parseInt(existing.status.split("-")[2], 10);
    const rr = existing[`round${r}`];
    showEliminated(r, rr ? rr.correct : 0, rr ? rr.total : CONFIG.questionsPerRound[r]);
    return;
  }

  const inProg = existing.inProgress;
  const inProgRoundFinalized = inProg && existing[`round${inProg.round}`];
  if (inProg && inProg.round && !inProgRoundFinalized && Array.isArray(inProg.queue) && inProg.queue.length > 0) {
    resumeMidRound(inProg);
    return;
  }

  // still in progress — resume at the next round they haven't done yet
  startWaitingFor(highestCompletedRound(existing) + 1);
}

function resumeMidRound(inProg) {
  state.currentRound = inProg.round;
  state.roundQueue = inProg.queue;
  state.roundIndex = inProg.index;
  state.roundLog = inProg.log || [];
  state.scores[inProg.round] =
    state.roundLog.filter((e) => e.correct).length * CONFIG.pointsPerCorrect[inProg.round];

  if (state.roundIndex >= state.roundQueue.length) {
    showRoundReview();
    return;
  }

  if (inProg.round === 1 || inProg.round === 2) {
    showScreen("screen-text-round");
    renderTextQuestion();
  } else if (inProg.round === 3) {
    showScreen("screen-audio-round");
    renderAudioQuestion();
  } else if (inProg.round === 4) {
    showScreen("screen-mcq-round");
    renderMcqQuestion();
  }
}

async function tryAutoResumeFromSession() {
  const session = loadSession();
  if (!session || !session.phone) return;

  const normalizedPhone = normalizePhone(session.phone);
  const players = await getPlayers();
  const existing = players.find((p) => normalizePhone(p.phone) === normalizedPhone);

  if (existing) {
    resumeExistingPlayer(existing);
  } else {
    clearSession();
  }
}

$("playerPhone").addEventListener("input", () => {
  $("playerPhone").value = $("playerPhone").value.replace(/\D/g, "").slice(0, 10);
});

$("btnStart").addEventListener("click", async () => {
  unlockAudioContext();
  const name = $("playerName").value.trim();
  const phone = $("playerPhone").value.trim();

  if (!name) {
    $("playerName").focus();
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    $("playerPhone").focus();
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  $("btnStart").disabled = true;
  const normalizedPhone = normalizePhone(phone);
  const players = await getPlayers();
  const existing = players.find((p) => normalizePhone(p.phone) === normalizedPhone);

  if (existing) {
    $("btnStart").disabled = false;
    resumeExistingPlayer(existing);
    return;
  }

  state.player.id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  state.player.name = name;
  state.player.phone = phone;
  state.player.email = $("playerEmail").value.trim();
  state.scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  state.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };

  await savePlayerRecord({
    id: state.player.id,
    name: state.player.name,
    phone: state.player.phone,
    email: state.player.email,
    time: new Date().toLocaleString(),
    status: "in-progress",
    round1: null,
    round2: null,
    round3: null,
    finalCorrect: 0,
    totalScore: 0,
  });
  saveSession();
  $("btnStart").disabled = false;

  showScreen("screen-instructions");
});

$("btnInstructionsContinue").addEventListener("click", () => {
  startWaitingFor(1);
});

/* ---------------- ADMIN PANEL ---------------- */

$("btnOpenAdminLogin").addEventListener("click", () => {
  $("adminMobile").value = "";
  $("adminEmail").value = "";
  $("adminLoginError").className = "feedback";
  $("adminLoginError").textContent = "";
  showScreen("screen-admin-login");
});

$("btnAdminLoginBack").addEventListener("click", () => {
  showScreen("screen-register");
});

let adminPollTimer = null;

$("btnAdminLogin").addEventListener("click", async () => {
  const mobile = $("adminMobile").value.trim().replace(/\D/g, "");
  const email = $("adminEmail").value.trim().toLowerCase();

  const ok = mobile === ADMIN_CREDENTIALS.mobile && email === ADMIN_CREDENTIALS.email.toLowerCase();

  if (!ok) {
    const fb = $("adminLoginError");
    fb.className = "feedback show wrong";
    fb.textContent = "Incorrect mobile number or email.";
    return;
  }

  await renderAdminPanel();
  showScreen("screen-admin-panel");

  clearInterval(adminPollTimer);
  adminPollTimer = setInterval(renderAdminPanel, 5000);
});

$("btnAdminLogout").addEventListener("click", () => {
  clearInterval(adminPollTimer);
  showScreen("screen-register");
});

$("btnAdminExport").addEventListener("click", exportPlayersToExcel);

$("btnAdminReset").addEventListener("click", async () => {
  const typedEmail = prompt(
    "This will permanently delete ALL registered player data and reset the game to the lobby. This cannot be undone.\n\nType the admin email to confirm the reset:"
  );
  if (typedEmail === null) return;

  if (typedEmail.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase()) {
    alert("Email did not match the admin account. Reset cancelled.");
    return;
  }

  if (!confirm("Are you absolutely sure? All player registrations and results will be erased.")) {
    return;
  }

  await resetAllPlayers();
  await setGameState(0);
  await setResultsDeclared(false);
  await renderAdminPanel();
  alert("All player data has been reset. The game is back at the lobby, ready to start fresh.");
});

$("btnAdminStartNext").addEventListener("click", async () => {
  const state_ = await getGameState();
  const next = Math.min((state_.currentRound || 0) + 1, 4);
  await setGameState(next);
  await renderAdminPanel();
});

$("btnDeclareResult").addEventListener("click", async () => {
  if (!confirm("Declare the final results now? Every player who finished the final round will see the leaderboard (1st/2nd/3rd) on their own screen.")) {
    return;
  }
  await setResultsDeclared(true);
  await renderAdminPanel();
});

const ROUND_SHORT_NAMES = { 1: "Logo", 2: "Tagline", 3: "Tune" };
const GAME_STAGE_LABELS = {
  0: "Lobby — game not started",
  1: "Round 1 — Logo Recognition is live",
  2: "Round 2 — Tagline Recognition is live",
  3: "Round 3 — Tune Recognition is live",
  4: "Final Round — Marketing MCQ is live",
};

async function renderAdminPanel() {
  const [players, gameState] = await Promise.all([getPlayers(), getGameState()]);
  const listEl = $("adminList");
  const statsEl = $("adminStats");
  listEl.innerHTML = "";

  const currentRound = gameState.currentRound || 0;
  $("adminStageLabel").textContent = GAME_STAGE_LABELS[currentRound] || `Round ${currentRound}`;
  $("btnAdminStartNext").disabled = currentRound >= 4;
  $("btnAdminStartNext").textContent = currentRound >= 4 ? "Final Round Already Live" : `Start ${currentRound === 0 ? "Round 1" : currentRound === 3 ? "Final Round" : "Round " + (currentRound + 1)}`;

  if (players.length === 0) {
    statsEl.innerHTML = "";
    listEl.innerHTML = `<div class="intro-text">No players registered yet.</div>`;
    return;
  }

  const finalists = players.filter((p) => p.status === "completed");
  const eliminated = players.filter((p) => p.status && p.status.startsWith("eliminated"));
  const ranked = computeRankings(players);
  const rankById = {};
  ranked.forEach((p, i) => { rankById[p.id] = i + 1; });
  const topThree = ranked.slice(0, 3);
  const declared = !!gameState.resultsDeclared;

  $("btnDeclareResult").textContent = declared ? "Results Declared ✓" : "Declare Result";
  $("btnDeclareResult").disabled = declared || finalists.length === 0;

  statsEl.innerHTML = `
    <div class="stat-chip"><span class="stat-num" id="statRegistered">0</span><span class="stat-label">Registered</span></div>
    <div class="stat-chip"><span class="stat-num" id="statEliminated">0</span><span class="stat-label">Eliminated</span></div>
    <div class="stat-chip"><span class="stat-num" id="statFinalists">0</span><span class="stat-label">Finished Final</span></div>
    <div class="stat-chip win"><span class="stat-num">${topThree.length ? "🏆" : "—"}</span><span class="stat-label">${topThree.length ? topThree.map((w) => w.name).join(", ") : "No finalists yet"}</span></div>
  `;
  animateCountUp($("statRegistered"), players.length, 500);
  animateCountUp($("statEliminated"), eliminated.length, 500);
  animateCountUp($("statFinalists"), finalists.length, 500);

  const sorted = players.slice().sort((a, b) => {
    const rank = (p) => {
      if (p.status === "completed") return 1000 + (p.finalCorrect || 0);
      if (p.status === "in-progress") return 500;
      const m = /eliminated-round-(\d)/.exec(p.status || "");
      return m ? parseInt(m[1], 10) * 10 : -1;
    };
    return rank(b) - rank(a);
  });

  sorted.forEach((p) => {
    const rank = rankById[p.id];
    const isWinner = rank === 1;
    const isLost = p.status && p.status.startsWith("eliminated");
    const isProgress = p.status === "in-progress";
    const statusLabel = STATUS_LABELS[p.status] || "Unknown";
    const eliminatedRound = isLost ? parseInt(/eliminated-round-(\d)/.exec(p.status)[1], 10) : null;
    const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";

    const card = document.createElement("div");
    card.className = "admin-card " + (isWinner ? "winner" : rank === 2 ? "rank-silver" : rank === 3 ? "rank-bronze" : isLost ? "lost" : "");

    const timeChipText = (val) => {
      const n = Number(val);
      return val !== null && val !== undefined && !Number.isNaN(n) ? formatSeconds(n) : "no time recorded";
    };

    const roundChip = (r) => {
      const result = p[`round${r}`];
      if (!result) {
        const reached = !isLost || eliminatedRound > r;
        return `<div class="admin-round-chip ${reached ? "pending" : "skipped"}"><span class="chip-label">R${r} · ${ROUND_SHORT_NAMES[r]}</span><span class="chip-value">${reached ? "—" : "DNQ"}</span></div>`;
      }
      const passed = result.correct >= CONFIG.qualifyThreshold;
      return `<div class="admin-round-chip ${passed ? "pass" : "fail"}"><span class="chip-label">R${r} · ${ROUND_SHORT_NAMES[r]}</span><span class="chip-value">${passed ? "✓" : "✕"} ${result.correct}/${result.total}</span><span class="chip-time">⏱ ${timeChipText(result.time)}</span></div>`;
    };

    const finalChip = p.status === "completed"
      ? `<div class="admin-round-chip final"><span class="chip-label">Final · MCQ</span><span class="chip-value">${p.finalCorrect}/${CONFIG.questionsPerRound[4]}</span><span class="chip-time">⏱ ${timeChipText(p.round4 && p.round4.time)}</span></div>`
      : `<div class="admin-round-chip skipped"><span class="chip-label">Final · MCQ</span><span class="chip-value">—</span></div>`;

    card.innerHTML = `
      <div class="admin-card-top">
        <div class="admin-id">
          <div class="admin-avatar">${initial}</div>
          <div>
            <div class="admin-name">${p.name}${rank === 1 ? ' <span class="winner-tag gold">🏆 WINNER</span>' : rank === 2 ? ' <span class="winner-tag silver">🥈 2ND</span>' : rank === 3 ? ' <span class="winner-tag bronze">🥉 3RD</span>' : ""}</div>
            <div class="admin-contact">${p.phone}${p.email ? " · " + p.email : ""}</div>
          </div>
        </div>
        <div class="admin-status ${isWinner ? "win" : isLost ? "lose" : isProgress ? "progress" : ""}">${statusLabel}</div>
      </div>
      <div class="admin-rounds">
        ${roundChip(1)}
        ${roundChip(2)}
        ${roundChip(3)}
        ${finalChip}
      </div>
      <div class="admin-score-line">Total Score: <strong>${p.totalScore || 0}</strong> pts · Total Time: <strong>${timeChipText(p.totalTime)}</strong> · Registered ${p.time}</div>
    `;
    listEl.appendChild(card);
  });
}

/* ---------------- WAITING ROOM (gated by admin) ---------------- */

const WAIT_ROUND_LABELS = {
  1: "Round 1 — Logo Recognition",
  2: "Round 2 — Tagline Recognition",
  3: "Round 3 — Tune Recognition",
  4: "the Final Round — Marketing MCQ",
};

let waitPollTimer = null;

async function startWaitingFor(targetRound) {
  clearInterval(waitPollTimer);
  $("waitRoundLabel").textContent = WAIT_ROUND_LABELS[targetRound] || `Round ${targetRound}`;
  showScreen("screen-waiting");

  const checkAndProceed = async () => {
    const gameState = await getGameState();
    if ((gameState.currentRound || 0) >= targetRound) {
      clearInterval(waitPollTimer);
      playUnlockChime();
      startRound(targetRound);
    }
  };

  await checkAndProceed();
  waitPollTimer = setInterval(checkAndProceed, 3000);
}

/* ---------------- ROUND INTRO ---------------- */

const ROUND_INFO = {
  1: { label: "ROUND 1", title: "Logo Recognition", desc: `You'll see an old company logo and pick the correct brand from the options. ${CONFIG.timePerQuestion[1]} seconds per question. Get at least ${CONFIG.qualifyThreshold} out of ${CONFIG.questionsPerRound[1]} correct to qualify.` },
  2: { label: "ROUND 2", title: "Tagline Recognition", desc: `You'll see a brand's tagline and pick the correct brand from the options. ${CONFIG.timePerQuestion[2]} seconds per question. Get at least ${CONFIG.qualifyThreshold} out of ${CONFIG.questionsPerRound[2]} correct to qualify.` },
  3: { label: "ROUND 3", title: "Tune Recognition", desc: `Listen to the jingle and pick the correct brand from the options. 60 seconds per question. Get at least ${CONFIG.qualifyThreshold} out of ${CONFIG.questionsPerRound[3]} correct to reach the final.` },
  4: { label: "FINAL ROUND", title: "Marketing MCQ", desc: "10 multiple-choice marketing questions. 60 seconds per question. Highest correct answers wins!" },
};

function startRound(roundNum) {
  state.currentRound = roundNum;
  state.roundIndex = 0;
  state.answered = false;
  state.roundLog = [];

  let pool, count;
  if (roundNum === 1) { pool = ROUND1_LOGOS; count = CONFIG.questionsPerRound[1]; }
  if (roundNum === 2) { pool = ROUND2_TAGLINES; count = CONFIG.questionsPerRound[2]; }
  if (roundNum === 3) { pool = ROUND3_TUNES; count = CONFIG.questionsPerRound[3]; }
  if (roundNum === 4) { pool = ROUND4_MCQS; count = CONFIG.questionsPerRound[4]; }

  state.roundQueue = pickRandom(pool, count);
  persistInProgress();

  const info = ROUND_INFO[roundNum];
  $("introRoundLabel").textContent = info.label;
  $("introTitle").textContent = info.title;
  $("introDesc").textContent = info.desc;
  showScreen("screen-round-intro");
}

$("btnRoundBegin").addEventListener("click", () => {
  if (state.currentRound === 1 || state.currentRound === 2) {
    showScreen("screen-text-round");
    renderTextQuestion();
  } else if (state.currentRound === 3) {
    showScreen("screen-audio-round");
    renderAudioQuestion();
  } else if (state.currentRound === 4) {
    showScreen("screen-mcq-round");
    renderMcqQuestion();
  }
});

/* ---------------- ROUND 1 & 2 — TEXT ANSWER ---------------- */

function renderTextQuestion() {
  state.answered = false;
  state.selectedTextIdx = -1;
  const item = state.roundQueue[state.roundIndex];
  const roundNum = state.currentRound;

  $("textRoundChip").textContent = roundNum === 1 ? "ROUND 1" : "ROUND 2";
  $("textRoundTitle").textContent = roundNum === 1 ? "Logo Recognition" : "Tagline Recognition";
  renderDots("textDots", state.roundQueue.length, state.roundIndex);

  const mediaBox = $("textMediaBox");
  mediaBox.innerHTML = "";
  if (roundNum === 1) {
    const img = document.createElement("img");
    img.src = item.file;
    img.alt = "Old logo";
    mediaBox.appendChild(img);
  } else {
    const div = document.createElement("div");
    div.className = "tagline-display";
    div.textContent = `"${item.tagline}"`;
    mediaBox.appendChild(div);
  }

  const { options, correctIndex } = buildMcqOptions(item.brand, item.category);
  state.currentTextOptions = options;
  state.currentTextCorrectIndex = correctIndex;

  const optsEl = $("textOptions");
  optsEl.innerHTML = "";
  options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "mcq-option";
    btn.textContent = optText;
    btn.addEventListener("click", () => {
      state.selectedTextIdx = idx;
      optsEl.querySelectorAll(".mcq-option").forEach((b, i) => b.classList.toggle("selected", i === idx));
      $("btnTextSubmit").disabled = false;
    });
    optsEl.appendChild(btn);
  });

  $("btnTextSubmit").disabled = true;
  $("textFeedback").className = "feedback";
  $("textFeedback").textContent = "";

  state.questionStartTime = Date.now();
  startTimer($("textTimer"), CONFIG.timePerQuestion[roundNum], () => submitTextAnswer(state.selectedTextIdx, true));
}

function submitTextAnswer(selectedIdx, timedOut) {
  if (state.answered) return;
  state.answered = true;
  clearTimer();

  const item = state.roundQueue[state.roundIndex];
  const correct = !timedOut && selectedIdx === state.currentTextCorrectIndex;
  const timeTaken = getElapsedSeconds(state.currentRound, timedOut);

  const buttons = $("textOptions").querySelectorAll(".mcq-option");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === selectedIdx) btn.classList.add("selected");
  });
  $("btnTextSubmit").disabled = true;

  const fb = $("textFeedback");
  fb.className = "feedback show neutral";
  fb.textContent = timedOut ? "Time's up — moving on." : "Answer locked in — moving on.";

  if (correct) state.scores[state.currentRound] += CONFIG.pointsPerCorrect[state.currentRound];

  state.roundLog.push({
    prompt: state.currentRound === 1 ? "Logo" : `"${item.tagline}"`,
    userAnswer: timedOut || selectedIdx < 0 ? "(no answer)" : state.currentTextOptions[selectedIdx],
    correctAnswer: item.brand,
    newLogo: state.currentRound === 1 ? item.newFile : null,
    correct,
    timeTaken,
  });

  setTimeout(() => advanceTextOrAudio(), 1400);
}

$("btnTextSubmit").addEventListener("click", () => submitTextAnswer(state.selectedTextIdx, false));

/* ---------------- ROUND 3 — AUDIO (MCQ) ---------------- */

function buildMcqOptions(correctBrand, category) {
  const categoryPool = (CATEGORY_POOLS[category] || []).filter((b) => b !== correctBrand);
  let distractorPool = categoryPool;
  if (distractorPool.length < 3) {
    const rest = BRAND_POOL.filter((b) => b !== correctBrand && !categoryPool.includes(b));
    distractorPool = [...categoryPool, ...shuffle(rest)];
  }
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([correctBrand, ...distractors]);
  return { options, correctIndex: options.indexOf(correctBrand) };
}

function renderAudioQuestion() {
  state.answered = false;
  state.selectedAudioIdx = -1;
  const item = state.roundQueue[state.roundIndex];
  renderDots("audioDots", state.roundQueue.length, state.roundIndex);

  const player = $("audioPlayer");
  player.src = item.file;
  player.play().catch(() => {});

  const { options, correctIndex } = buildMcqOptions(item.brand, item.category);
  state.currentAudioOptions = options;
  state.currentAudioCorrectIndex = correctIndex;

  const optsEl = $("audioOptions");
  optsEl.innerHTML = "";
  options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "mcq-option";
    btn.textContent = optText;
    btn.addEventListener("click", () => {
      state.selectedAudioIdx = idx;
      optsEl.querySelectorAll(".mcq-option").forEach((b, i) => b.classList.toggle("selected", i === idx));
      $("btnAudioSubmit").disabled = false;
    });
    optsEl.appendChild(btn);
  });

  $("btnAudioSubmit").disabled = true;
  state.questionStartTime = Date.now();
  startTimer($("audioTimer"), CONFIG.timePerQuestion[3], () => submitAudioAnswer(state.selectedAudioIdx, true));
}

function submitAudioAnswer(selectedIdx, timedOut) {
  if (state.answered) return;
  state.answered = true;
  clearTimer();
  $("audioPlayer").pause();

  const item = state.roundQueue[state.roundIndex];
  const correct = !timedOut && selectedIdx === state.currentAudioCorrectIndex;
  const timeTaken = getElapsedSeconds(3, timedOut);

  if (correct) state.scores[3] += CONFIG.pointsPerCorrect[3];

  state.roundLog.push({
    prompt: "Tune",
    userAnswer: timedOut || selectedIdx < 0 ? "(no answer)" : state.currentAudioOptions[selectedIdx],
    correctAnswer: item.brand,
    correct,
    timeTaken,
  });

  const buttons = $("audioOptions").querySelectorAll(".mcq-option");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === selectedIdx) btn.classList.add("selected");
  });
  $("btnAudioSubmit").disabled = true;

  setTimeout(() => advanceTextOrAudio(), 1200);
}

$("btnAudioSubmit").addEventListener("click", () => submitAudioAnswer(state.selectedAudioIdx, false));

function advanceTextOrAudio() {
  state.roundIndex++;
  persistInProgress();
  if (state.roundIndex >= state.roundQueue.length) {
    showRoundReview();
    return;
  }
  if (state.currentRound === 1 || state.currentRound === 2) {
    renderTextQuestion();
  } else if (state.currentRound === 3) {
    renderAudioQuestion();
  }
}

/* ---------------- FINAL ROUND — MCQ ---------------- */

function renderMcqQuestion() {
  state.answered = false;
  state.selectedMcqIdx = -1;
  const item = state.roundQueue[state.roundIndex];
  renderDots("mcqDots", state.roundQueue.length, state.roundIndex);

  $("mcqQuestion").textContent = item.q;
  const optsEl = $("mcqOptions");
  optsEl.innerHTML = "";

  item.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "mcq-option";
    btn.textContent = optText;
    btn.addEventListener("click", () => {
      state.selectedMcqIdx = idx;
      optsEl.querySelectorAll(".mcq-option").forEach((b, i) => b.classList.toggle("selected", i === idx));
      $("btnMcqSubmit").disabled = false;
    });
    optsEl.appendChild(btn);
  });

  $("btnMcqSubmit").disabled = true;
  state.questionStartTime = Date.now();
  startTimer($("mcqTimer"), CONFIG.timePerQuestion[4], () => submitMcqAnswer(state.selectedMcqIdx, true));
}

function submitMcqAnswer(selectedIdx, timedOut) {
  if (state.answered) return;
  state.answered = true;
  clearTimer();

  const item = state.roundQueue[state.roundIndex];
  const correct = !timedOut && selectedIdx === item.correct;
  const timeTaken = getElapsedSeconds(4, timedOut);
  if (correct) state.scores[4] += CONFIG.pointsPerCorrect[4];

  state.roundLog.push({
    prompt: item.q,
    userAnswer: timedOut || selectedIdx < 0 ? "(no answer)" : item.options[selectedIdx],
    correctAnswer: item.options[item.correct],
    correct,
    timeTaken,
  });

  const buttons = $("mcqOptions").querySelectorAll(".mcq-option");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === selectedIdx) btn.classList.add("selected");
  });
  $("btnMcqSubmit").disabled = true;

  setTimeout(() => {
    state.roundIndex++;
    persistInProgress();
    if (state.roundIndex >= state.roundQueue.length) {
      showRoundReview();
    } else {
      renderMcqQuestion();
    }
  }, 1200);
}

$("btnMcqSubmit").addEventListener("click", () => submitMcqAnswer(state.selectedMcqIdx, false));

/* ---------------- TIMER ---------------- */

function startTimer(el, seconds, onExpire) {
  clearTimer();
  state.timeLeft = seconds;
  setTimerDisplay(el, state.timeLeft);
  state.timerId = setInterval(() => {
    state.timeLeft--;
    setTimerDisplay(el, Math.max(state.timeLeft, 0));
    if (state.timeLeft <= 0) {
      clearTimer();
      onExpire();
    }
  }, 1000);
}

/* ---------------- ROUND TRANSITIONS ---------------- */

function showRoundReview() {
  clearTimer();

  const roundLabels = {
    1: "ROUND 1 — LOGO RECOGNITION",
    2: "ROUND 2 — TAGLINE RECOGNITION",
    3: "ROUND 3 — TUNE RECOGNITION",
    4: "FINAL ROUND — MARKETING MCQ",
  };
  $("reviewRoundLabel").textContent = roundLabels[state.currentRound];

  const totalRoundTime = state.roundLog.reduce((sum, e) => sum + (e.timeTaken || 0), 0);
  $("reviewTimeTotal").textContent = `Round completed in ${formatSeconds(totalRoundTime)}`;

  const listEl = $("reviewList");
  listEl.innerHTML = "";
  state.roundLog.forEach((entry, i) => {
    const item = document.createElement("div");
    item.className = "review-item " + (entry.correct ? "correct" : "wrong");

    const badge = document.createElement("div");
    badge.className = "review-badge " + (entry.correct ? "correct" : "wrong");
    badge.textContent = entry.correct ? "✓" : "✕";
    item.appendChild(badge);

    const main = document.createElement("div");
    main.className = "review-main";
    const qLine = document.createElement("div");
    qLine.className = "review-q";
    qLine.innerHTML = `Q${i + 1} — ${entry.prompt} <span class="review-time">⏱ ${entry.timeTaken}s</span>`;
    main.appendChild(qLine);

    const answerLine = document.createElement("div");
    answerLine.className = "review-answer";
    answerLine.textContent = entry.correctAnswer;
    main.appendChild(answerLine);

    if (!entry.correct) {
      const userLine = document.createElement("div");
      userLine.className = "review-user";
      userLine.textContent = `Your answer: ${entry.userAnswer}`;
      main.appendChild(userLine);
    }
    item.appendChild(main);

    if (entry.newLogo) {
      const img = document.createElement("img");
      img.className = "review-thumb";
      img.src = entry.newLogo;
      img.alt = entry.correctAnswer;
      item.appendChild(img);
    }

    listEl.appendChild(item);
  });

  showScreen("screen-round-review");
}

$("btnReviewContinue").addEventListener("click", async () => {
  const roundNum = state.currentRound;
  const correctCount = state.roundLog.filter((e) => e.correct).length;
  const total = state.roundLog.length;
  const roundTime = state.roundLog.reduce((sum, e) => sum + (e.timeTaken || 0), 0);
  state.roundTimes[roundNum] = roundTime;
  const totalScoreSoFar = state.scores[1] + state.scores[2] + state.scores[3] + state.scores[4];
  const totalTimeSoFar = state.roundTimes[1] + state.roundTimes[2] + state.roundTimes[3] + state.roundTimes[4];

  const patch = { totalScore: totalScoreSoFar, totalTime: totalTimeSoFar, inProgress: null };
  patch[`round${roundNum}`] = { correct: correctCount, total, time: roundTime, points: state.scores[roundNum] };

  $("btnReviewContinue").disabled = true;

  if (roundNum <= 3 && correctCount < CONFIG.qualifyThreshold) {
    patch.status = `eliminated-round-${roundNum}`;
    await updatePlayerRecord(state.player.id, patch);
    $("btnReviewContinue").disabled = false;
    showEliminated(roundNum, correctCount, total);
    return;
  }

  if (roundNum === 4) {
    patch.status = "completed";
    patch.finalCorrect = correctCount;
  }
  await updatePlayerRecord(state.player.id, patch);
  $("btnReviewContinue").disabled = false;

  if (roundNum < 4) {
    startWaitingFor(roundNum + 1);
  } else {
    showSummary();
  }
});

/* ---------------- ELIMINATED ---------------- */

const ROUND_NAMES = {
  1: "Logo Recognition",
  2: "Tagline Recognition",
  3: "Tune Recognition",
};

function showEliminated(roundNum, correctCount, total) {
  clearTimer();
  $("elimTitle").textContent = `Eliminated after Round ${roundNum}`;
  $("elimDesc").textContent =
    `${ROUND_NAMES[roundNum]}: you got ${correctCount} out of ${total} correct. ` +
    `You needed at least ${CONFIG.qualifyThreshold} to qualify for the next round.`;

  const breakdown = $("elimBreakdown");
  breakdown.innerHTML = "";
  for (let r = 1; r <= roundNum; r++) {
    const row = document.createElement("div");
    row.className = "row";
    const scoreLabel = r === roundNum
      ? `${correctCount}/${total} correct · ${formatSeconds(state.roundTimes[r])}`
      : `${state.scores[r]} pts · ${formatSeconds(state.roundTimes[r])}`;
    row.innerHTML = `<span>${ROUND_NAMES[r] || "Round " + r}</span><span>${scoreLabel}</span>`;
    breakdown.appendChild(row);
  }

  showScreen("screen-eliminated");
}

$("btnElimDone").addEventListener("click", () => {
  clearSession();
  state.scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  state.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };
  $("playerName").value = state.player.name;
  $("playerPhone").value = state.player.phone;
  $("playerEmail").value = state.player.email;
  showScreen("screen-register");
});

/* ---------------- SUMMARY ---------------- */

function animateCountUp(el, to, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * to);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const CONFETTI_COLORS = ["#f5c518", "#ffe28a", "#7dd3ff", "#27e07a", "#ff4d6d"];

function launchConfetti(containerId, count) {
  const container = $(containerId);
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }
  setTimeout(() => {
    container.innerHTML = "";
  }, 3200);
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function medalFor(rank) {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
}

function renderLeaderboardReveal(players) {
  const ranked = computeRankings(players);
  const myRank = ranked.findIndex((p) => p.id === state.player.id) + 1;

  $("resultsStatus").className = "results-status declared";
  $("resultsStatus").innerHTML = myRank
    ? `${medalFor(myRank)} You finished <strong>${ordinal(myRank)}</strong> out of ${ranked.length} finalists!`
    : "🏁 Results are in!";

  const topThree = ranked.slice(0, 3);
  $("leaderboardList").innerHTML = topThree
    .map(
      (p, i) => `
        <div class="leaderboard-row ${p.id === state.player.id ? "me" : ""}">
          <span class="leaderboard-medal">${medalFor(i + 1)}</span>
          <span class="leaderboard-name">${p.name}</span>
          <span class="leaderboard-score">${p.finalCorrect}/${CONFIG.questionsPerRound[4]}</span>
        </div>
      `
    )
    .join("");
}

let summaryPollTimer = null;

async function checkAndRevealResults() {
  const gameState = await getGameState();
  if (gameState.resultsDeclared) {
    clearInterval(summaryPollTimer);
    const players = await getPlayers();
    renderLeaderboardReveal(players);
  }
}

function showSummary() {
  const total = state.scores[1] + state.scores[2] + state.scores[3] + state.scores[4];
  animateCountUp($("finalScore"), total, 900);
  launchConfetti("confettiBurst", 60);

  $("resultsStatus").className = "results-status waiting";
  $("resultsStatus").textContent = "⏳ Waiting for the admin to declare the final results...";
  $("leaderboardList").innerHTML = "";
  clearInterval(summaryPollTimer);
  checkAndRevealResults();
  summaryPollTimer = setInterval(checkAndRevealResults, 5000);

  const breakdown = $("roundBreakdown");
  breakdown.innerHTML = "";
  const labels = {
    1: "Round 1 — Logo Recognition",
    2: "Round 2 — Tagline Recognition",
    3: "Round 3 — Tune Recognition",
    4: "Final Round — Marketing MCQ",
  };
  [1, 2, 3, 4].forEach((r) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${labels[r]}</span><span>${state.scores[r]} pts · ${formatSeconds(state.roundTimes[r])}</span>`;
    breakdown.appendChild(row);
  });

  const totalTime = state.roundTimes[1] + state.roundTimes[2] + state.roundTimes[3] + state.roundTimes[4];
  const totalRow = document.createElement("div");
  totalRow.className = "row total-time-row";
  totalRow.innerHTML = `<span>Total Time</span><span>${formatSeconds(totalTime)}</span>`;
  breakdown.appendChild(totalRow);

  showScreen("screen-summary");
}

$("btnPlayAgain").addEventListener("click", () => {
  clearInterval(summaryPollTimer);
  clearSession();
  state.scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  state.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };
  $("playerName").value = state.player.name;
  $("playerPhone").value = state.player.phone;
  $("playerEmail").value = state.player.email;
  showScreen("screen-register");
});

/* ---------------- STARTUP ---------------- */

tryAutoResumeFromSession();
