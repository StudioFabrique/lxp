import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";

function publicAddress(address: string) {
  if (net.isIP(address) === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) ||
      (a === 198 && (b === 18 || b === 19)) || (a === 203 && b === 0 && c === 113) ||
      (a === 192 && b === 0 && c === 2) || (a === 198 && b === 51 && c === 100));
  }
  if (net.isIP(address) === 6) {
    // Les adresses IPv6 globales ont le préfixe 2000::/3.
    return /^[23][0-9a-f]{3}:/i.test(address);
  }
  return false;
}

function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#")) {
      const point = lower.startsWith("#x") ? parseInt(lower.slice(2), 16) : parseInt(lower.slice(1), 10);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
    }
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[lower] ?? "";
  });
}

function tagAttribute(tag: string, attribute: string) {
  return tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find(Boolean);
}

export function parseLinkPreview(html: string, page: URL) {
  const tags = html.match(/<meta\b[^>]*>|<link\b[^>]*>/gi) ?? [];
  const og = tags.find(tag => tagAttribute(tag, "property")?.toLowerCase() === "og:title" || tagAttribute(tag, "name")?.toLowerCase() === "twitter:title");
  const rawTitle = (og && tagAttribute(og, "content")) || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = rawTitle ? decodeEntities(rawTitle.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim().slice(0, 200) : page.hostname;
  const icon = tags.find(tag => /\bicon\b/i.test(tagAttribute(tag, "rel") ?? ""));
  let favicon: string | null = `${page.origin}/favicon.ico`;
  if (icon) {
    try {
      const candidate = new URL(tagAttribute(icon, "href") ?? "", page);
      if (candidate.origin === page.origin && /^https?:$/.test(candidate.protocol)) favicon = candidate.href;
    } catch { /* Garder le favicon standard. */ }
  }
  return { title: title || page.hostname, favicon };
}

export async function getLinkPreview(input: string, remainingRedirects = 2): Promise<{ title: string; favicon: string | null }> {
  if (input.length > 2048) throw new Error("Lien trop long.");
  const page = new URL(input);
  if (!/^https?:$/.test(page.protocol) || page.username || page.password || page.port) throw new Error("Lien invalide.");
  const hostname = page.hostname.replace(/^\[|\]$/g, "");
  const addresses = net.isIP(hostname)
    ? [{ address: hostname, family: net.isIP(hostname) }]
    : await dns.lookup(hostname, { all: true });
  if (addresses.length === 0 || addresses.some(item => !publicAddress(item.address))) throw new Error("Lien inaccessible.");
  const address = addresses[0];
  const transport = page.protocol === "https:" ? https : http;
  const result = await new Promise<{ html?: string; redirect?: string }>((resolve, reject) => {
    const request = transport.get(page, {
      headers: { accept: "text/html", "user-agent": "LXP-LinkPreview/1.0" },
      timeout: 5000,
      lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
    }, response => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode ?? 0) && response.headers.location && remainingRedirects > 0) {
        response.resume();
        resolve({ redirect: new URL(response.headers.location, page).href });
        return;
      }
      if (response.statusCode !== 200 || !response.headers["content-type"]?.includes("text/html")) {
        response.resume(); reject(new Error("Page indisponible.")); return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 256 * 1024) { response.destroy(new Error("Page trop grande.")); return; }
        chunks.push(chunk);
      });
      response.on("end", () => resolve({ html: Buffer.concat(chunks).toString("utf8") }));
      response.on("error", reject);
    });
    request.on("timeout", () => request.destroy(new Error("Délai dépassé.")));
    request.on("error", reject);
  });
  if (result.redirect) return getLinkPreview(result.redirect, remainingRedirects - 1);
  return parseLinkPreview(result.html ?? "", page);
}
