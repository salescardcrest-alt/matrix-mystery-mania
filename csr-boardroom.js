const API_URL = "/api/csr";
const POLL_MS = 3000;

let game = null;
let adminPin = null;
let adminAuthenticated = false;
let adminPanelOpen = false;
let timerInterval = null;
let pollInterval = null;
const $ = (id) => document.getElementById(id);

async function apiGet() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not reach the challenge server.");
  return res.json();
}

async function apiPost(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function setActiveView(viewId) {
  ["setupView", "roundView", "resultView", "finalView", "adminPanel"].forEach((id) => {
    $(id).hidden = id !== (adminPanelOpen ? "adminPanel" : viewId);
  });
  $("impactPanel").hidden = adminPanelOpen;
  $("introSection").hidden = adminPanelOpen;
}

function renderCurrentView() {
  if (game.started && !adminAuthenticated) {
    $("pinGateView").hidden = false;
    $("boardroomContent").hidden = true;
    return;
  }
  $("pinGateView").hidden = true;
  $("boardroomContent").hidden = false;

  if (!game.started) {
    setActiveView("setupView");
  } else if (game.complete) {
    renderFinal();
  } else if (game.results[game.currentRound]) {
    renderResult();
  } else {
    renderRound();
  }
  renderScoreboard();
  renderCodesPanel();
  if (adminAuthenticated) renderAdminPanel();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function currentTotals() {
  return game.teams.map((name, teamIndex) => {
    const roundResults = game.results.map((result) => result ? result[teamIndex] : null);
    return {
      name,
      points: roundResults.reduce((sum, result) => sum + (result ? result.points : 0), 0),
      trust: Math.max(0, Math.min(100, 50 + roundResults.reduce((sum, result) => sum + (result ? result.trust : 0), 0))),
      lives: roundResults.reduce((sum, result) => sum + (result ? result.lives : 0), 0),
      completed: roundResults.filter(Boolean).length,
      teamIndex,
    };
  });
}

function rankedTeams() {
  return currentTotals().sort((a, b) => b.points - a.points || b.trust - a.trust || b.lives - a.lives || a.teamIndex - b.teamIndex);
}

function renderSetup() {
  $("teamSetupGrid").innerHTML = Array.from({ length: TOTAL_TEAMS }, (_, index) => `
    <label class="team-name-field" for="team-name-${index}">
      TEAM ${String(index + 1).padStart(2, "0")}
      <input id="team-name-${index}" type="text" maxlength="32" placeholder="Team ${index + 1}" autocomplete="off">
    </label>
  `).join("");
}

function renderScoreboard() {
  const teams = rankedTeams();
  $("scoreboardList").innerHTML = teams.map((team, index) => `
    <div class="score-row">
      <span class="score-rank">${String(index + 1).padStart(2, "0")}</span>
      <span class="score-team" title="${escapeHtml(team.name)}">${escapeHtml(team.name)}</span>
      <span class="score-meta"><strong class="score-points">${team.points}<small> pts</small></strong><span class="score-trust">Trust ${team.trust}</span></span>
    </div>
  `).join("");
}

function renderCodesPanel() {
  const panel = $("codesPanel");
  if (!panel) return;
  if (!game.started || !adminAuthenticated) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  $("codesList").innerHTML = game.teams.map((name, index) => `
    <div class="code-row">
      <span class="code-team" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      <span class="code-value">${escapeHtml(game.teamCodes[index])}</span>
    </div>
  `).join("");
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function renderSubmissionStatus(containerId) {
  const container = $(containerId);
  if (!container) return;
  const answers = game.answers[game.currentRound];
  container.innerHTML = game.teams.map((team, index) => `
    <div class="team-answer-row"><span class="team-answer-name">${escapeHtml(team)}<span class="answer-hint">TEAM ${String(index + 1).padStart(2, "0")}</span></span><span class="submit-status${answers[index] ? " done" : ""}">${answers[index] ? "✓ Submitted" : "Waiting…"}</span></div>
  `).join("");
}

function updateAnswerCount() {
  const count = game.answers[game.currentRound].filter((answer) => answer !== "").length;
  const text = `${count} / ${TOTAL_TEAMS} submitted`;
  if ($("answerCount")) $("answerCount").textContent = text;
  if ($("adminAnswerCount")) $("adminAnswerCount").textContent = text;
}

function renderRound() {
  const round = ROUNDS[game.currentRound];
  $("roundNumber").textContent = `ROUND ${String(game.currentRound + 1).padStart(2, "0")} / 0${ROUNDS.length}`;
  $("roundProgress").innerHTML = ROUNDS.map((_, index) =>
    `<span class="progress-segment${index < game.currentRound ? " done" : index === game.currentRound ? " active" : ""}"></span>`
  ).join("");
  $("roundTitle").textContent = round.title;
  $("roundQuestion").textContent = round.question;
  $("roundClue").textContent = round.clue;
  renderSubmissionStatus("teamAnswerList");
  updateAnswerCount();
  updateTimerDisplay();
  setActiveView("roundView");
}

function updateTimerDisplay() {
  const seconds = game.timerEndAt
    ? Math.max(0, Math.ceil((game.timerEndAt - Date.now()) / 1000))
    : game.timerRemaining;
  $("roundTimer").textContent = formatTime(seconds);
  $("roundTimer").classList.toggle("warn", seconds <= 120 && seconds > 30);
  $("roundTimer").classList.toggle("danger", seconds <= 30);
  updateAdminTimerButton(seconds);
  if (game.timerEndAt && seconds === 0 && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateAdminTimerButton(seconds) {
  const button = $("adminTimerButton");
  if (!button) return;
  button.textContent = game.timerEndAt
    ? "Pause timer"
    : seconds <= 0
      ? "Time is up"
      : game.timerRemaining < ROUND_SECONDS
        ? "Resume timer"
        : "Start 90-second timer";
  button.disabled = seconds <= 0;
}

function ensureTimerTick() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = game.timerEndAt ? setInterval(updateTimerDisplay, 250) : null;
}

async function lockRound() {
  try {
    const fresh = await apiPost({ action: "adminState", pin: adminPin });
    game = fresh;
    const answers = game.answers[game.currentRound];
    const hasOptions = Boolean(ROUNDS[game.currentRound].options);
    if (hasOptions && answers.some((answer) => !answer)) {
      const proceed = confirm("Some teams haven’t submitted an answer yet. They will receive zero points for this round. Lock answers anyway?");
      if (!proceed) return;
    }
    game = await apiPost({ action: "lockRound", pin: adminPin });
    ensureTimerTick();
    renderCurrentView();
  } catch (err) {
    alert(err.message);
  }
}

function renderResult() {
  const roundIndex = game.currentRound;
  const round = ROUNDS[roundIndex];
  const results = game.results[roundIndex];
  setActiveView("resultView");
  $("resultKicker").textContent = `ROUND ${String(roundIndex + 1).padStart(2, "0")} COMPLETE`;
  $("resultTitle").textContent = round.title;
  $("resultSummary").textContent = "The round is locked. The facilitator can review the answer key in the Admin Panel.";
  $("roundResultsBody").innerHTML = results.map((result, index) => {
    return `<tr><td>${escapeHtml(game.teams[index])}</td><td>${result.points}</td><td>${result.trust > 0 ? "+" : ""}${result.trust}</td><td>${result.lives.toLocaleString("en-IN")}</td></tr>`;
  }).join("");
}

async function advanceRound() {
  try {
    game = await apiPost({ action: "nextRound", pin: adminPin });
    ensureTimerTick();
    renderCurrentView();
  } catch (err) {
    alert(err.message);
  }
}

function renderFinal() {
  setActiveView("finalView");
  const teams = rankedTeams();
  const winner = teams[0];
  $("winnerTitle").textContent = `${winner.name} takes the board`;
  $("winnerSummary").textContent = `${winner.points} points · Trust Index ${winner.trust} · ${winner.lives.toLocaleString("en-IN")} estimated lives impacted.`;
  $("finalHighlights").innerHTML = `
    <span class="final-highlight"><strong>${ROUNDS.length}</strong> decisions made</span>
    <span class="final-highlight"><strong>${teams[0].points}</strong> winning points</span>
    <span class="final-highlight"><strong>${teams.reduce((sum, team) => sum + team.lives, 0).toLocaleString("en-IN")}</strong> lives impacted across teams</span>
  `;
  $("finalResultsBody").innerHTML = teams.map((team, index) => `
    <tr><td>${String(index + 1).padStart(2, "0")}</td><td>${escapeHtml(team.name)}</td><td>${team.points} / 100</td><td>${team.trust}</td><td>${team.lives.toLocaleString("en-IN")}</td></tr>
  `).join("");
}

function renderAdminPanel() {
  if (!game.started) {
    $("adminStageLabel").textContent = "Challenge not started";
    $("adminStage").className = "admin-stage is-idle";
    $("adminRoundControls").hidden = true;
    $("adminFinalMessage").hidden = false;
    $("adminFinalMessage").textContent = "Set the team names and facilitator PIN, then start the challenge.";
    return;
  }

  const round = ROUNDS[game.currentRound];
  const key = game.answerKey;
  const results = game.results[game.currentRound];
  $("adminStageLabel").textContent = game.complete
    ? "Challenge complete"
    : `Round ${game.currentRound + 1} ${results ? "locked" : "in progress"}`;
  $("adminStage").className = `admin-stage ${game.complete ? "is-complete" : results ? "is-locked" : "is-live"}`;
  $("adminRoundControls").hidden = false;
  $("adminFinalMessage").hidden = !game.complete;
  $("adminRoundLabel").innerHTML = `<strong>${String(game.currentRound + 1).padStart(2, "0")}</strong><small>of ${ROUNDS.length}</small>`;
  $("adminRoundTitle").textContent = round.title;
  $("adminAnswerKeyText").textContent = key ? key.answer : "";
  $("adminTakeaway").textContent = key ? key.takeaway : "";
  $("adminAnswerEntry").hidden = Boolean(results) || game.complete;
  if (!results && !game.complete) {
    renderSubmissionStatus("adminAnswerList");
    updateAnswerCount();
  }
  $("adminLockRoundButton").hidden = Boolean(results) || game.complete;
  $("adminNextRoundButton").hidden = !results || game.complete;
  $("adminNextRoundButton").textContent = game.currentRound === ROUNDS.length - 1
    ? "Declare final results →"
    : `Start round ${game.currentRound + 2} →`;
  $("adminTimerButton").hidden = Boolean(results) || game.complete;
  $("adminResetTimerButton").hidden = Boolean(results) || game.complete;
  updateAdminTimerButton(game.timerEndAt
    ? Math.max(0, Math.ceil((game.timerEndAt - Date.now()) / 1000))
    : game.timerRemaining);

  $("adminTeamResults").innerHTML = results
    ? `<div class="section-kicker">ROUND SCORING</div><div class="table-wrap"><table class="results-table admin-score-table">
      <thead><tr><th>TEAM</th><th>ANSWER</th><th>PTS</th><th>TRUST</th><th>LIVES</th><th>REASON</th></tr></thead>
      <tbody>${results.map((result, index) => {
        const selected = game.answers[game.currentRound][index];
        const answer = round.options
          ? (selected ? `${selected} — ${round.options["ABCD".indexOf(selected)]}` : "No answer")
          : (game.displayAnswers ? game.displayAnswers[index] : selected);
        return `<tr><td>${escapeHtml(game.teams[index])}</td><td class="wrap-cell">${escapeHtml(answer)}</td><td>${result.points}</td><td>${result.trust > 0 ? "+" : ""}${result.trust}</td><td>${result.lives.toLocaleString("en-IN")}</td><td class="wrap-cell">${escapeHtml(result.reason)}</td></tr>`;
      }).join("")}</tbody>
    </table></div>`
    : `<p class="muted">Team responses are ready to score as they come in from each team’s device.</p>`;
}

function openAdminPanel() {
  if (!game.started) {
    alert("Set the team names and facilitator PIN, then start the challenge before opening the Admin Panel.");
    return;
  }
  adminPanelOpen = true;
  setActiveView("adminPanel");
  renderAdminPanel();
}

function closeAdminPanel() {
  adminAuthenticated = false;
  adminPanelOpen = false;
  adminPin = null;
  $("adminAnswerKeyText").textContent = "";
  $("adminTakeaway").textContent = "";
  $("adminTeamResults").innerHTML = "";
  renderCurrentView();
}

async function startGame() {
  const names = Array.from({ length: TOTAL_TEAMS }, (_, index) => $(`team-name-${index}`).value.trim() || `Team ${index + 1}`);
  if (new Set(names.map((name) => name.toLocaleLowerCase())).size !== names.length) {
    alert("Each team needs a different name.");
    return;
  }
  const pin = $("setupAdminPin").value.trim();
  if (!/^\d{4,8}$/.test(pin)) {
    alert("Choose a facilitator PIN with 4 to 8 digits.");
    $("setupAdminPin").focus();
    return;
  }
  try {
    game = await apiPost({ action: "startGame", teams: names, adminPin: pin });
    adminPin = pin;
    adminAuthenticated = true;
    $("setupAdminPin").value = "";
    renderCurrentView();
    ensureTimerTick();
  } catch (err) {
    alert(err.message);
  }
}

async function resetGame() {
  if (!confirm("Reset all team names, codes, round answers, scores and timer for this challenge?")) return;
  try {
    game = await apiPost({ action: "resetGame", pin: adminPin });
  } catch (err) {
    alert(err.message);
    return;
  }
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  adminAuthenticated = false;
  adminPanelOpen = false;
  adminPin = null;
  $("setupAdminPin").value = "";
  $("adminAnswerKeyText").textContent = "";
  $("adminTakeaway").textContent = "";
  $("adminTeamResults").innerHTML = "";
  renderSetup();
  renderCurrentView();
}

function csvCell(value) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadReport() {
  const headers = ["Rank", "Team", ...ROUNDS.map((round, index) => `Round ${index + 1}: ${round.title} points`), "Total points", "Trust Index", "Lives impacted"];
  const rows = rankedTeams().map((team, rank) => [
    rank + 1,
    team.name,
    ...game.results.map((result, roundIndex) => result ? result[team.teamIndex].points : 0),
    team.points,
    team.trust,
    team.lives,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const link = document.createElement("a");
  const downloadUrl = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
  link.href = downloadUrl;
  link.download = "csr-boardroom-results.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function startPolling() {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(async () => {
    try {
      const fresh = adminAuthenticated
        ? await apiPost({ action: "adminState", pin: adminPin })
        : await apiGet();
      const roundChanged = !game || fresh.currentRound !== game.currentRound || Boolean(fresh.results[fresh.currentRound]) !== Boolean(game.results[game.currentRound]) || fresh.started !== game.started || fresh.complete !== game.complete;
      game = fresh;
      if (roundChanged) ensureTimerTick();
      renderCurrentView();
    } catch (err) {
      /* transient network hiccup — try again on the next tick */
    }
  }, POLL_MS);
}

async function init() {
  renderSetup();
  $("startGameButton").addEventListener("click", startGame);
  $("openAdminPanelButton").addEventListener("click", openAdminPanel);
  $("finalAdminButton").addEventListener("click", openAdminPanel);
  $("gatePinForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const pin = $("gatePinInput").value;
    try {
      const { ok, state } = await apiPost({ action: "authAdmin", pin });
      if (!ok) {
        $("gatePinError").hidden = false;
        $("gatePinInput").select();
        return;
      }
      $("gatePinError").hidden = true;
      $("gatePinInput").value = "";
      adminPin = pin;
      adminAuthenticated = true;
      adminPanelOpen = true;
      game = state;
      ensureTimerTick();
      renderCurrentView();
    } catch (err) {
      alert(err.message);
    }
  });
  $("adminLogoutButton").addEventListener("click", closeAdminPanel);
  $("adminTimerButton").addEventListener("click", async () => {
    try {
      game = await apiPost({ action: "setTimer", pin: adminPin, op: game.timerEndAt ? "pause" : "start" });
      ensureTimerTick();
      updateTimerDisplay();
      renderAdminPanel();
    } catch (err) {
      alert(err.message);
    }
  });
  $("adminResetTimerButton").addEventListener("click", async () => {
    try {
      game = await apiPost({ action: "setTimer", pin: adminPin, op: "reset" });
      ensureTimerTick();
      updateTimerDisplay();
      renderAdminPanel();
    } catch (err) {
      alert(err.message);
    }
  });
  $("adminLockRoundButton").addEventListener("click", lockRound);
  $("adminNextRoundButton").addEventListener("click", advanceRound);
  $("adminResetButton").addEventListener("click", resetGame);
  $("adminExportButton").addEventListener("click", downloadReport);

  try {
    game = await apiGet();
  } catch (err) {
    alert("Could not reach the challenge server. Check your connection and reload.");
    return;
  }
  renderCurrentView();
  ensureTimerTick();
  startPolling();
}

init();
