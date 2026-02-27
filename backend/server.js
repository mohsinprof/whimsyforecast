import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";
const DEFAULT_UNITS = "metric";

const getApiKey = () => {
  const rawKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || "";
  return rawKey.trim().replace(/^['\"]|['\"]$/g, "");
};

const buildOpenWeatherUrl = (baseUrl, path, params = {}) => {
  const apiKey = getApiKey();
  const query = new URLSearchParams({
    appid: apiKey || "",
    ...params,
  });
  return `${baseUrl}${path}?${query.toString()}`;
};

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ]
}));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Root route (prevents 404 on /)
app.get("/", (req, res) => {
  res.send("Backend is running. Use /api/health or /api/weather");
});

app.get("/api/weather/current", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const units = req.query.units || DEFAULT_UNITS;
    const apiKey = getApiKey();

    if (!apiKey) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY" });
    }

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url = buildOpenWeatherUrl(OPENWEATHER_BASE_URL, "/weather", {
      lat: String(lat),
      lon: String(lon),
      units: String(units),
    });
    const r = await fetch(url);

    if (!r.ok) {
      const errorData = await r.json().catch(() => null);
      return res.status(r.status).json({
        error: errorData?.message || "Upstream API failed",
      });
    }

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/weather/forecast", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const units = req.query.units || DEFAULT_UNITS;
    const apiKey = getApiKey();

    if (!apiKey) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY" });
    }

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url = buildOpenWeatherUrl(OPENWEATHER_BASE_URL, "/forecast", {
      lat: String(lat),
      lon: String(lon),
      units: String(units),
    });
    const r = await fetch(url);

    if (!r.ok) {
      const errorData = await r.json().catch(() => null);
      return res.status(r.status).json({
        error: errorData?.message || "Upstream API failed",
      });
    }

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/location/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const limit = req.query.limit || "1";
    const apiKey = getApiKey();

    if (!apiKey) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY" });
    }

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url = buildOpenWeatherUrl(OPENWEATHER_GEO_URL, "/reverse", {
      lat: String(lat),
      lon: String(lon),
      limit: String(limit),
    });
    const r = await fetch(url);

    if (!r.ok) {
      const errorData = await r.json().catch(() => null);
      return res.status(r.status).json({
        error: errorData?.message || "Upstream API failed",
      });
    }

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/location/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const limit = req.query.limit || "10";
    const apiKey = getApiKey();

    if (!apiKey) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY" });
    }

    if (!q) {
      return res.status(400).json({ error: "q is required" });
    }

    const url = buildOpenWeatherUrl(OPENWEATHER_GEO_URL, "/direct", {
      q: String(q),
      limit: String(limit),
    });
    const r = await fetch(url);

    if (!r.ok) {
      const errorData = await r.json().catch(() => null);
      return res.status(r.status).json({
        error: errorData?.message || "Upstream API failed",
      });
    }

    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (!getApiKey()) {
    console.warn("Missing WEATHER_API_KEY (or OPENWEATHER_API_KEY) in backend/.env");
  }
  console.log(`Backend running on http://localhost:${PORT}`);
});