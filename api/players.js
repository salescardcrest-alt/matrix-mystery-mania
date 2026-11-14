const { getRedis } = require("./_redis");

const KEY = "matrix3m:players";

module.exports = async (req, res) => {
  try {
    const redis = getRedis();

    if (req.method === "GET") {
      const players = (await redis.get(KEY)) || [];
      res.status(200).json(players);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      let players = (await redis.get(KEY)) || [];

      if (body.action === "register") {
        players = [...players, body.record];
      } else if (body.action === "update") {
        players = players.map((p) =>
          p.id === body.id ? Object.assign({}, p, body.patch) : p
        );
      } else if (body.action === "reset") {
        players = [];
      }

      await redis.set(KEY, players);
      res.status(200).json(players);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
