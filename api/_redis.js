const { Redis } = require("@upstash/redis");

function findEnvPair() {
  const keys = Object.keys(process.env);

  const urlKey =
    keys.find((k) => k === "UPSTASH_REDIS_REST_URL") ||
    keys.find((k) => k === "KV_REST_API_URL") ||
    keys.find((k) => /REDIS_REST_URL$/.test(k)) ||
    keys.find((k) => /KV_REST_API_URL$/.test(k));

  const tokenKey =
    keys.find((k) => k === "UPSTASH_REDIS_REST_TOKEN") ||
    keys.find((k) => k === "KV_REST_API_TOKEN") ||
    keys.find((k) => /REDIS_REST_TOKEN$/.test(k)) ||
    keys.find((k) => /KV_REST_API_TOKEN$/.test(k));

  if (!urlKey || !tokenKey) {
    throw new Error(
      "No Redis/KV REST URL+TOKEN environment variables found. " +
        "Connect an Upstash (or KV) database to this project in Vercel's Storage tab, then redeploy."
    );
  }

  return { url: process.env[urlKey], token: process.env[tokenKey] };
}

function getRedis() {
  const { url, token } = findEnvPair();
  return new Redis({ url, token });
}

module.exports = { getRedis };
