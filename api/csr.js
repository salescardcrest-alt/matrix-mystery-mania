const { getRedis } = require("./_redis");
const { scoreAnswer, keySummary, displayAnswer } = require("./_answer-key");

const KEY = "csrBoardroom:game";
const TOTAL_TEAMS = 8;
const ROUND_COUNT = 6;
const ROUND_SECONDS = 90;

function defaultGame() {
  return {
    started: false,
    currentRound: 0,
    complete: false,
    adminPin: "",
    teams: Array.from({ length: TOTAL_TEAMS }, (_, i) => `Team ${i + 1}`),
    teamCodes: Array(TOTAL_TEAMS).fill(""),
    answers: Array.from({ length: ROUND_COUNT }, () => Array(TOTAL_TEAMS).fill("")),
    results: Array(ROUND_COUNT).fill(null),
    timerEndAt: null,
    timerRemaining: ROUND_SECONDS,
    updatedAt: new Date().toISOString(),
  };
}

function generateCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return [...codes];
}

function publicState(game) {
  const { adminPin, teamCodes, ...rest } = game;
  return rest;
}

function adminState(game) {
  return {
    ...publicState(game),
    teamCodes: game.teamCodes,
    answerKey: keySummary(game.currentRound),
    displayAnswers: game.answers[game.currentRound].map((value) => displayAnswer(game.currentRound, value)),
  };
}

function isValidGameShape(game) {
  return game
    && Array.isArray(game.teams) && game.teams.length === TOTAL_TEAMS
    && Array.isArray(game.teamCodes) && game.teamCodes.length === TOTAL_TEAMS
    && Array.isArray(game.answers) && game.answers.length === ROUND_COUNT
    && Array.isArray(game.results) && game.results.length === ROUND_COUNT;
}

module.exports = async (req, res) => {
  try {
    const redis = getRedis();

    if (req.method === "GET") {
      let game = await redis.get(KEY);
      if (!isValidGameShape(game)) game = defaultGame();
      res.status(200).json(publicState(game));
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    let game = await redis.get(KEY);
    if (!isValidGameShape(game)) game = defaultGame();

    const isAdmin = typeof body.pin === "string" && body.pin.length > 0 && body.pin === game.adminPin;

    switch (body.action) {
      case "authAdmin": {
        const ok = typeof body.pin === "string" && body.pin === game.adminPin;
        res.status(200).json(ok ? { ok, state: adminState(game) } : { ok });
        return;
      }

      case "adminState": {
        if (!isAdmin) { res.status(403).json({ error: "Invalid facilitator PIN." }); return; }
        res.status(200).json(adminState(game));
        return;
      }

      case "joinTeam": {
        const code = String(body.code || "").trim();
        const teamIndex = game.teamCodes.indexOf(code);
        if (!game.started || teamIndex === -1) {
          res.status(404).json({ error: "Code not recognised. Check with your facilitator." });
          return;
        }
        res.status(200).json({ teamIndex, state: publicState(game) });
        return;
      }

      case "startGame": {
        if (game.started && !isAdmin) {
          res.status(403).json({ error: "The facilitator PIN is required to restart an in-progress challenge." });
          return;
        }
        const pin = String(body.adminPin || "").trim();
        if (!/^\d{4,8}$/.test(pin)) {
          res.status(400).json({ error: "Choose a facilitator PIN with 4 to 8 digits." });
          return;
        }
        const names = Array.isArray(body.teams) ? body.teams.slice(0, TOTAL_TEAMS).map((n) => String(n || "").trim()).filter(Boolean) : [];
        while (names.length < TOTAL_TEAMS) names.push(`Team ${names.length + 1}`);

        game = defaultGame();
        game.teams = names;
        game.teamCodes = generateCodes(TOTAL_TEAMS);
        game.adminPin = pin;
        game.started = true;
        game.updatedAt = new Date().toISOString();
        await redis.set(KEY, game);
        res.status(200).json(adminState(game));
        return;
      }

      case "submitAnswer": {
        const code = String(body.code || "").trim();
        const teamIndex = game.teamCodes.indexOf(code);
        if (!game.started) { res.status(400).json({ error: "The challenge hasn’t started yet." }); return; }
        if (teamIndex === -1) { res.status(404).json({ error: "Code not recognised. Check with your facilitator." }); return; }
        if (game.complete) { res.status(400).json({ error: "The challenge is complete." }); return; }
        if (game.results[game.currentRound]) { res.status(409).json({ error: "This round is locked. Wait for the next round." }); return; }
        game.answers[game.currentRound][teamIndex] = String(body.answer ?? "").trim();
        game.updatedAt = new Date().toISOString();
        await redis.set(KEY, game);
        res.status(200).json({ teamIndex, state: publicState(game) });
        return;
      }

      case "lockRound": {
        if (!isAdmin) { res.status(403).json({ error: "Invalid facilitator PIN." }); return; }
        if (game.complete) { res.status(400).json({ error: "The challenge is already complete." }); return; }
        if (game.results[game.currentRound]) { res.status(409).json({ error: "This round is already locked." }); return; }
        game.results[game.currentRound] = game.answers[game.currentRound].map((answer) => scoreAnswer(game.currentRound, answer));
        game.timerEndAt = null;
        game.updatedAt = new Date().toISOString();
        await redis.set(KEY, game);
        res.status(200).json(adminState(game));
        return;
      }

      case "nextRound": {
        if (!isAdmin) { res.status(403).json({ error: "Invalid facilitator PIN." }); return; }
        if (!game.results[game.currentRound]) { res.status(400).json({ error: "Lock the current round first." }); return; }
        if (game.currentRound >= ROUND_COUNT - 1) {
          game.complete = true;
        } else {
          game.currentRound += 1;
          game.timerRemaining = ROUND_SECONDS;
          game.timerEndAt = null;
        }
        game.updatedAt = new Date().toISOString();
        await redis.set(KEY, game);
        res.status(200).json(adminState(game));
        return;
      }

      case "setTimer": {
        if (!isAdmin) { res.status(403).json({ error: "Invalid facilitator PIN." }); return; }
        if (body.op === "start") {
          if (game.timerRemaining > 0) game.timerEndAt = Date.now() + game.timerRemaining * 1000;
        } else if (body.op === "pause") {
          if (game.timerEndAt) {
            game.timerRemaining = Math.max(0, Math.ceil((game.timerEndAt - Date.now()) / 1000));
            game.timerEndAt = null;
          }
        } else if (body.op === "reset") {
          game.timerEndAt = null;
          game.timerRemaining = ROUND_SECONDS;
        } else {
          res.status(400).json({ error: "Unknown timer operation." });
          return;
        }
        game.updatedAt = new Date().toISOString();
        await redis.set(KEY, game);
        res.status(200).json(adminState(game));
        return;
      }

      case "resetGame": {
        if (!isAdmin) { res.status(403).json({ error: "Invalid facilitator PIN." }); return; }
        game = defaultGame();
        await redis.set(KEY, game);
        res.status(200).json(adminState(game));
        return;
      }

      default:
        res.status(400).json({ error: "Unknown action." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
