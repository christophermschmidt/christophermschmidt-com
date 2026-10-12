import assert from "node:assert/strict";
import test from "node:test";
import { evaluateDecision } from "../lib/decision.ts";

test("five-minute boundary is supported", () => {
  assert.equal(evaluateDecision("5", "pass", "pass").title, "Review the bounded deployment request");
});
test("a value above the boundary blocks", () => {
  assert.equal(evaluateDecision("6", "pass", "pass").title, "Block observed constraint");
});
test("a demonstrated failure takes precedence while holds remain visible", () => {
  const result = evaluateDecision("22", "unknown", "unknown");
  assert.equal(result.title, "Block observed constraint");
  assert.equal(result.items.length, 3);
});
test("missing evidence holds", () => {
  assert.equal(evaluateDecision("5", "unknown", "pass").title, "Hold for evidence");
});
test("all three supported conditions require human review", () => {
  assert.equal(evaluateDecision("0", "pass", "pass").title, "Review the bounded deployment request");
});
test("invalid or missing age never passes", () => {
  assert.equal(evaluateDecision("", "pass", "pass").title, "Hold for evidence");
  assert.equal(evaluateDecision("not-a-number", "pass", "pass").title, "Hold for evidence");
});
