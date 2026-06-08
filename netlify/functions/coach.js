export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return new Response(
      JSON.stringify({ error: "Manjka ANTHROPIC_API_KEY na strežniku." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Neveljaven JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, system } = body || {};
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Manjka polje 'messages'." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system:
          system ||
          "Si ATHLOS Coach — strokoven, jedrnat osebni AI trener za resne športnike. Odgovarjaš v slovenščini. Svetuješ o treningu, prehrani in regeneraciji. Pri bolečinah si previden in priporočaš strokovno pomoč pri resnih simptomih.",
        messages,
      }),
    });

    const data = await upstream.json();

    const text = Array.isArray(data.content)
      ? data.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim()
      : "";

    return new Response(JSON.stringify({ text, raw: data }), {
      status: upstream.ok ? 200 : upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Napaka pri klicu AI.", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
