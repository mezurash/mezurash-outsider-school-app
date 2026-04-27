import fs from "node:fs/promises";
import path from "node:path";

const ENDPOINT = process.env.FIGMA_MCP_ENDPOINT || "http://127.0.0.1:3845/mcp";
const ROOT_NODE_ID = process.env.FIGMA_ROOT_NODE_ID || "5:890";
const OUTPUT_FILE = process.env.FIGMA_DUMP_FILE || "figma-dump.md";
const NODE_LIST = process.env.FIGMA_NODE_LIST
  ? process.env.FIGMA_NODE_LIST.split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : null;
const CLIENT_LANGUAGES = "html,css,javascript";
const CLIENT_FRAMEWORKS = "none";

let nextId = 1;
let sessionId = "";

async function postRpc(payload, extraHeaders = {}) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const responseSessionId = response.headers.get("mcp-session-id");
  if (responseSessionId) sessionId = responseSessionId;

  return parseMcpResponse(text);
}

function parseMcpResponse(text) {
  const dataLines = text
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data: "))
    .map((line) => line.slice("data: ".length));

  const raw = dataLines.length ? dataLines.join("\n") : text.trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

async function initialize() {
  const response = await postRpc({
    jsonrpc: "2.0",
    id: nextId++,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "codex-local-figma-dump",
        version: "0.1.0",
      },
    },
  });

  return response;
}

async function callTool(name, args) {
  return postRpc(
    {
      jsonrpc: "2.0",
      id: nextId++,
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
    },
    { "mcp-session-id": sessionId },
  );
}

function contentText(payload) {
  return (
    payload?.result?.content
      ?.filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n") || ""
  );
}

function parseSections(metadataXml) {
  const sectionByName = new Map();
  const frameRegex =
    /<frame\s+id="([^"]+)"\s+name="(s\d+)"\s+x="([^"]+)"\s+y="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"([^>]*)>/g;

  let match;
  while ((match = frameRegex.exec(metadataXml))) {
    const [, nodeId, name, x, y, width, height, rest] = match;
    if (/\shidden="true"/.test(rest)) continue;

    const section = {
      name,
      nodeId,
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
    };

    const current = sectionByName.get(name);
    if (!current || section.y < current.y) {
      sectionByName.set(name, section);
    }
  }

  return [...sectionByName.values()].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
}

function collectAssetNotes(payload) {
  const serialized = JSON.stringify(payload);
  const urls = [
    ...new Set(
      [...serialized.matchAll(/https?:\/\/[^"\\\s)]+/g)].map((match) =>
        match[0].replace(/[),.;]+$/, ""),
      ),
    ),
  ];

  const imageNames = [
    ...new Set(
      [...serialized.matchAll(/"name":\s*"([^"]*(?:image|logo|cover|asset|svg|png|jpg|jpeg|webp)[^"]*)"/gi)].map(
        (match) => match[1],
      ),
    ),
  ];

  return {
    urlCount: urls.length,
    urls: urls.slice(0, 20),
    referencedImageNames: imageNames.slice(0, 30),
  };
}

function mdFence(value, language = "") {
  return `~~~~${language}\n${value}\n~~~~`;
}

function jsonFence(value) {
  return mdFence(JSON.stringify(value, null, 2), "json");
}

async function main() {
  const initialized = await initialize();
  const serverName = initialized?.result?.serverInfo?.name || "unknown MCP server";
  const serverVersion = initialized?.result?.serverInfo?.version || "unknown";
  console.log(`MCP: connected to ${serverName} ${serverVersion}`);

  const rootMetadataPayload = await callTool("get_metadata", {
    nodeId: ROOT_NODE_ID,
    clientLanguages: CLIENT_LANGUAGES,
    clientFrameworks: CLIENT_FRAMEWORKS,
  });
  const rootMetadataXml = contentText(rootMetadataPayload);
  const sections = NODE_LIST
    ? NODE_LIST.map((entry) => {
        const [name, nodeId, x = "0", y = "0", width = "0", height = "0"] = entry.split("|");
        if (!name || !nodeId) {
          throw new Error(`Invalid FIGMA_NODE_LIST item: ${entry}`);
        }
        return {
          name,
          nodeId,
          x: Number(x),
          y: Number(y),
          width: Number(width),
          height: Number(height),
        };
      })
    : parseSections(rootMetadataXml);

  console.log(`Frames found: ${sections.length}`);
  for (const section of sections) {
    console.log(
      `${section.name} -> ${section.nodeId} (${section.width}x${section.height} @ ${section.x},${section.y})`,
    );
  }

  const sectionPayloads = [];
  for (const section of sections) {
    const item = { section };

    try {
      item.designContext = await callTool("get_design_context", {
        nodeId: section.nodeId,
        clientLanguages: CLIENT_LANGUAGES,
        clientFrameworks: CLIENT_FRAMEWORKS,
        artifactType: "WEB_PAGE_OR_APP_SCREEN",
        taskType: "CREATE_ARTIFACT",
      });
    } catch (error) {
      item.designContextError = {
        message: error.message,
        stack: error.stack,
      };
    }

    try {
      item.variableDefs = await callTool("get_variable_defs", {
        nodeId: section.nodeId,
        clientLanguages: CLIENT_LANGUAGES,
        clientFrameworks: CLIENT_FRAMEWORKS,
      });
    } catch (error) {
      item.variableDefsError = {
        message: error.message,
        stack: error.stack,
      };
    }

    item.assetNotes = collectAssetNotes(item.designContext || item.designContextError || {});
    sectionPayloads.push(item);
  }

  const now = new Date().toISOString();
  const lines = [];
  lines.push("# Figma Dump Local");
  lines.push("");
  lines.push(`- Original: node ${ROOT_NODE_ID} no Figma Desktop Dev Mode MCP local`);
  lines.push(`- Data: ${now}`);
  lines.push(`- Node raiz: ${ROOT_NODE_ID}`);
  lines.push(`- Endpoint MCP: ${ENDPOINT}`);
  lines.push(`- Cliente: ${CLIENT_LANGUAGES}; ${CLIENT_FRAMEWORKS}`);
  lines.push("");
  lines.push("## Metadata raiz");
  lines.push("");
  lines.push(mdFence(rootMetadataXml, "xml"));
  lines.push("");
  lines.push("## Indice de secoes detectadas");
  lines.push("");
  lines.push("| Secao | Node ID | X | Y | Width | Height |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: |");
  for (const section of sections) {
    lines.push(
      `| ${section.name} | ${section.nodeId} | ${section.x} | ${section.y} | ${section.width} | ${section.height} |`,
    );
  }
  lines.push("");

  for (const item of sectionPayloads) {
    const { section } = item;
    lines.push(`## ${section.name} - ${section.nodeId}`);
    lines.push("");
    lines.push(
      `- Dimensoes: x=${section.x}, y=${section.y}, width=${section.width}, height=${section.height}`,
    );
    lines.push(`- Assets detectados em URLs: ${item.assetNotes.urlCount}`);
    if (item.assetNotes.urls.length) {
      for (const url of item.assetNotes.urls) lines.push(`  - ${url}`);
    }
    if (item.assetNotes.referencedImageNames.length) {
      lines.push(`- Nomes de assets/imagens referenciados: ${item.assetNotes.referencedImageNames.join(", ")}`);
    }
    lines.push("");
    lines.push("### get_design_context bruto");
    lines.push("");
    lines.push(jsonFence(item.designContext || item.designContextError));
    lines.push("");
    lines.push("### get_variable_defs bruto");
    lines.push("");
    lines.push(jsonFence(item.variableDefs || item.variableDefsError));
    lines.push("");
  }

  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
  await fs.writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
  const stat = await fs.stat(outputPath);

  console.log(`Markdown: ${outputPath}`);
  console.log(`Size: ${stat.size} bytes`);
}

main().catch((error) => {
  console.error(`Dump failed: ${error.message}`);
  if (error.stack) console.error(error.stack);
  process.exitCode = 1;
});
