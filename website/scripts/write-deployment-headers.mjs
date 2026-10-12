import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const previewHeaders = `/*
  X-Robots-Tag: noindex, nofollow, noarchive
`;

/** @param {Record<string, string | undefined>} environment */
export function deploymentMode(environment = process.env) {
  const branch = environment.CF_PAGES_BRANCH?.trim();
  const productionBranch = environment.SITE_PRODUCTION_BRANCH?.trim() || "master";
  const forceNoindex = ["1", "true", "yes"].includes(
    environment.SITE_FORCE_NOINDEX?.trim().toLowerCase() || "",
  );
  const isCloudflarePages = environment.CF_PAGES === "1" || Boolean(branch);
  return forceNoindex || (isCloudflarePages && branch && branch !== productionBranch)
    ? { kind: "preview", branch: branch || null, productionBranch, forced: forceNoindex }
    : { kind: "production", branch: branch || null, productionBranch, forced: false };
}

/**
 * @param {Record<string, string | undefined>} environment
 * @param {string | undefined} outputDirectoryOverride
 */
export function writeDeploymentHeaders(
  environment = process.env,
  outputDirectoryOverride = undefined,
) {
  const outputDirectory = path.resolve(
    outputDirectoryOverride || environment.DEPLOYMENT_OUTPUT_DIR || "out",
  );
  const headersPath = path.join(outputDirectory, "_headers");
  const mode = deploymentMode(environment);

  if (mode.kind === "preview") {
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(headersPath, previewHeaders, "utf8");
    return { ...mode, headersPath, action: "written" };
  }

  if (fs.existsSync(headersPath)) fs.unlinkSync(headersPath);
  return { ...mode, headersPath, action: "absent" };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const result = writeDeploymentHeaders(process.env, process.argv[2]);
  console.log(
    result.kind === "preview"
      ? `Preview indexing disabled for ${result.branch ? `branch ${result.branch}` : "this deployment"}.`
      : `Production indexing preserved for ${result.branch || "a non-Cloudflare local build"}.`,
  );
}
