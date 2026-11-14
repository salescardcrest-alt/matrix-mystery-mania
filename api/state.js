const { getRedis } = require("./_redis");

const KEY = "matrix3m:state";
const DEFAULT_STATE = { currentRound: 0, resultsDeclared: false };

module.exports = async (req, res) => {
  try {
    const redis = getRedis();

    if (req.method === "GET") {
      const state = (await redis.get(KEY)) || DEFAULT_STATE;
      res.status(200).json(state);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const current = (await redis.get(KEY)) || DEFAULT_STATE;
      const state = {
        currentRound: body.currentRound !== undefined ? parseInt(body.currentRound, 10) || 0 : current.currentRound,
        resultsDeclared: body.resultsDeclared !== undefined ? !!body.resultsDeclared : !!current.resultsDeclared,
        updatedAt: new Date().toISOString(),
      };
      await redis.set(KEY, state);
      res.status(200).json(state);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
