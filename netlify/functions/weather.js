const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

const endpointBuilders = {
  current: ({ lat, lon, units }) => {
    if (!lat || !lon) {
      throw new Error("Missing lat or lon");
    }
    return {
      baseUrl: OPENWEATHER_BASE_URL,
      path: "/weather",
      params: { lat, lon, units },
    };
  },
  forecast: ({ lat, lon, units }) => {
    if (!lat || !lon) {
      throw new Error("Missing lat or lon");
    }
    return {
      baseUrl: OPENWEATHER_BASE_URL,
      path: "/forecast",
      params: { lat, lon, units },
    };
  },
  reverse: ({ lat, lon, limit = "1" }) => {
    if (!lat || !lon) {
      throw new Error("Missing lat or lon");
    }
    return {
      baseUrl: GEO_BASE_URL,
      path: "/reverse",
      params: { lat, lon, limit },
    };
  },
  search: ({ q, limit = "10" }) => {
    if (!q) {
      throw new Error("Missing search query");
    }
    return {
      baseUrl: GEO_BASE_URL,
      path: "/direct",
      params: { q, limit },
    };
  },
};

exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const key = process.env.OPENWEATHER_API_KEY;

    if (!key) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OPENWEATHER_API_KEY" }),
      };
    }

    const type = query.type;
    const buildEndpoint = endpointBuilders[type];

    if (!buildEndpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request type" }),
      };
    }

    let endpoint;
    try {
      endpoint = buildEndpoint(query);
    } catch (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError.message }),
      };
    }

    const searchParams = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(endpoint.params).map(([paramKey, value]) => [paramKey, String(value)])
      ),
      appid: key,
    });

    const response = await fetch(`${endpoint.baseUrl}${endpoint.path}?${searchParams.toString()}`);
    const data = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected weather proxy error" }),
    };
  }
};
