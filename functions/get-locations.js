// /functions/get-locations.js
export async function onRequestGet({ env }) {
  // WARNING: this endpoint is public.
  // Anyone who knows the URL can see locations.
  // For now simple; later we can add a password or secret token.

  const { keys } = await env.LOCATIONS.list({ limit: 200 });

  const items = [];
  for (const k of keys) {
    const v = await env.LOCATIONS.get(k.name);
    if (!v) continue;
    try {
      const obj = JSON.parse(v);
      items.push({ key: k.name, ...obj });
    } catch {
      items.push({ key: k.name, raw: v });
    }
  }

  // Sort newest first
  items.sort((a, b) => (b.key > a.key ? 1 : -1));

  return new Response(JSON.stringify({ ok: true, count: items.length, items }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
