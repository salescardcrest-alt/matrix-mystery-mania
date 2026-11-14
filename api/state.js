const { kv } = require("@vercel/kv");

const KEY = "matrix3m:state";

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const state = (await kv.get(KEY)) || { currentRound: 0 };
      res.status(200).json(state);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const state = {
        currentRound: parseInt(body.currentRound, 10) || 0,
        updatedAt: new Date().toISOString(),
      };
      await kv.set(KEY, state);
      res.status(200).json(state);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
