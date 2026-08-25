import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const darfDirectory = path.join(process.cwd(), "..", "DARF");
const capabilitiesDirectory = path.join(darfDirectory, "capabilities");

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function filenameToTitle(filename: string): string {
  return decodeURIComponent(filename).replace(/\.md$/, "");
}

export interface CapabilityRef {
  title: string;
  slug: string;
  prerequisites: string;
  isNew: boolean;
}

export interface LayerGroup {
  name: string;
  note?: string;
  capabilities: CapabilityRef[];
}

export interface PillarGroup {
  name: string;
  tagline: string;
  layers: LayerGroup[];
}

const CAP_ROW = /\|\s*\[([^\]]+)\]\(capabilities\/([^)]+)\.md\)(\s*\*\*new\*\*)?\s*\|\s*([^|]*)\|/g;

export function getDarfStructure(): PillarGroup[] {
  const raw = fs.readFileSync(path.join(darfDirectory, "CAPABILITIES.md"), "utf8");

  const pillarBlocks = raw.split(/\n## Pillar \d\s*—\s*/).slice(1);

  return pillarBlocks.map((block) => {
    const [headerLine, ...rest] = block.split("\n");
    const name = headerLine.trim();
    const body = rest.join("\n");

    const taglineMatch = body.match(/\*(Can you trust[^*]+)\*/);
    const tagline = taglineMatch ? taglineMatch[1] : "";

    const layerBlocks = body.split(/\n### /).slice(1);
    const layers: LayerGroup[] = layerBlocks.map((lb) => {
      const [layerHeader, ...layerRest] = lb.split("\n");
      const layerBody = layerRest.join("\n").split(/\n## /)[0];

      const capabilities: CapabilityRef[] = [];
      let match: RegExpExecArray | null;
      const rowRe = new RegExp(CAP_ROW.source, "g");
      while ((match = rowRe.exec(layerBody)) !== null) {
        const title = filenameToTitle(match[2]);
        capabilities.push({
          title,
          slug: slugify(title),
          isNew: Boolean(match[3]),
          prerequisites: match[4].trim(),
        });
      }

      return { name: layerHeader.trim(), capabilities };
    });

    return { name, tagline, layers };
  });
}

export interface CapabilityMeta {
  slug: string;
  title: string;
  pillar: string;
  layer: string;
  prerequisites: string;
}

export interface Capability extends CapabilityMeta {
  contentHtml: string;
}

function fieldsAndBody(raw: string) {
  const lines = raw.split("\n");
  const fields: Record<string, string> = {};
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\*\*(.+?):\*\*\s*(.*)$/);
    if (m) {
      fields[m[1].toLowerCase()] = m[2].trim();
      bodyStart = i + 1;
    } else if (lines[i].trim() === "" && bodyStart > 0) {
      continue;
    } else if (bodyStart > 0) {
      break;
    }
  }

  const body = lines.slice(bodyStart).join("\n");
  return { fields, body };
}

export function getAllCapabilitySlugs(): string[] {
  if (!fs.existsSync(capabilitiesDirectory)) return [];
  return fs
    .readdirSync(capabilitiesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => slugify(f.replace(/\.md$/, "")));
}

export async function getCapabilityBySlug(slug: string): Promise<Capability | null> {
  if (!fs.existsSync(capabilitiesDirectory)) return null;
  const filename = fs
    .readdirSync(capabilitiesDirectory)
    .find((f) => f.endsWith(".md") && slugify(f.replace(/\.md$/, "")) === slug);
  if (!filename) return null;

  const raw = fs
    .readFileSync(path.join(capabilitiesDirectory, filename), "utf8")
    .replace(/\r\n/g, "\n");
  const withoutTitle = raw.replace(/^#\s+.+\n+/, "");
  const { fields, body } = fieldsAndBody(withoutTitle);

  const processed = await remark().use(html, { sanitize: false }).process(body);

  return {
    slug,
    title: filename.replace(/\.md$/, ""),
    pillar: fields["pillar"] || "",
    layer: fields["layer"] || "",
    prerequisites: fields["prerequisites"] || "",
    contentHtml: processed.toString(),
  };
}
