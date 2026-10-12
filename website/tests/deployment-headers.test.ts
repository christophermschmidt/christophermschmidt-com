import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { previewHeaders, writeDeploymentHeaders } from "../scripts/write-deployment-headers.mjs";

function temporaryOutput() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "deployment-headers-"));
}

test("Cloudflare feature branches receive a noindex response header", () => {
  const output = temporaryOutput();
  const result = writeDeploymentHeaders({
    CF_PAGES: "1",
    CF_PAGES_BRANCH: "codex/executive-redesign-20261012",
    SITE_PRODUCTION_BRANCH: "main",
    DEPLOYMENT_OUTPUT_DIR: output,
  });
  assert.equal(result.kind, "preview");
  assert.equal(fs.readFileSync(path.join(output, "_headers"), "utf8"), previewHeaders);
});

test("the production branch remains indexable and removes stale preview headers", () => {
  const output = temporaryOutput();
  fs.writeFileSync(path.join(output, "_headers"), previewHeaders, "utf8");
  const result = writeDeploymentHeaders({
    CF_PAGES: "1",
    CF_PAGES_BRANCH: "master",
    DEPLOYMENT_OUTPUT_DIR: output,
  });
  assert.equal(result.kind, "production");
  assert.equal(fs.existsSync(path.join(output, "_headers")), false);
});

test("an isolated review project's primary branch can be forced nonindexable", () => {
  const output = temporaryOutput();
  const result = writeDeploymentHeaders({
    CF_PAGES: "1",
    CF_PAGES_BRANCH: "codex/executive-redesign-20261012",
    SITE_PRODUCTION_BRANCH: "codex/executive-redesign-20261012",
    SITE_FORCE_NOINDEX: "1",
    DEPLOYMENT_OUTPUT_DIR: output,
  });
  assert.equal(result.kind, "preview");
  assert.equal(result.forced, true);
  assert.equal(fs.readFileSync(path.join(output, "_headers"), "utf8"), previewHeaders);
});

test("ordinary local builds remain indexable", () => {
  const output = temporaryOutput();
  const result = writeDeploymentHeaders({ DEPLOYMENT_OUTPUT_DIR: output });
  assert.equal(result.kind, "production");
  assert.equal(fs.existsSync(path.join(output, "_headers")), false);
});

test("an explicit Cloudflare adapter output directory receives preview headers", () => {
  const output = temporaryOutput();
  const result = writeDeploymentHeaders(
    {
      CF_PAGES: "1",
      CF_PAGES_BRANCH: "feature/review",
      SITE_PRODUCTION_BRANCH: "main",
    },
    output,
  );
  assert.equal(result.kind, "preview");
  assert.equal(fs.readFileSync(path.join(output, "_headers"), "utf8"), previewHeaders);
});
