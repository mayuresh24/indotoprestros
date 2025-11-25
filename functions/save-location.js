// /functions/save-location.js
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    if (!body || typeof body.lat !== "number" || typeof body.lon !== "number") {
      return new Response(JSON.stringify({ ok: false, error: "Missing coords" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = `${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const value = JSON.stringify({
      lat: body.lat,
      lon: body.lon,
      accuracy: body.accuracy || null,
      userAgent: request.headers.get("user-agent") || "",
      ts: new Date().toISOString()
    });

    await env.LOCATIONS.put(key, value);

    return new Response(JSON.stringify({ ok: true, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
