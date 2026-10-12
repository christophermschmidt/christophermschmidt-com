export type EvidenceState = "unknown" | "fail" | "pass";

export function evaluateDecision(ageInput: string, authority: EvidenceState, version: EvidenceState) {
  const age = Number(ageInput);
  const validAge = ageInput.trim() !== "" && Number.isFinite(age) && age >= 0;
  const fails: string[] = [];
  const holds: string[] = [];
  if (validAge && age > 5) fails.push("The stock input exceeds the stipulated age limit.");
  if (!validAge) holds.push("Stock age needs a valid observation.");
  if (authority === "fail") fails.push("The action path exceeds its approved scope.");
  if (version === "fail") fails.push("The action is not safely bound to the evaluated stock version.");
  if (authority === "unknown") holds.push("Authority enforcement needs the relevant allow and deny tests.");
  if (version === "unknown") holds.push("State-version binding needs a controlled change-before-commit test.");
  if (fails.length) return { state: "fail", label: "OBSERVED CONSTRAINT", title: "Block observed constraint", description: "At least one demonstrated violation prevents the proposed transfer path from proceeding in its current form. Supported conditions elsewhere do not cancel that failure.", instruction: "Keep transfer execution disabled. Assign correction and a verified retest to the responsible owner.", items: [...fails, ...holds] } as const;
  if (holds.length) return { state: "hold", label: "MISSING REQUIRED EVIDENCE", title: "Hold for evidence", description: "No selected test demonstrates a violation, but necessary support is still missing. Missing evidence is neither a demonstrated failure nor proof that the control works.", instruction: "Keep the proposed execution path on hold until the required evidence is reviewed.", items: holds } as const;
  return { state: "pass", label: "ILLUSTRATED CONDITIONS SUPPORTED", title: "Review the bounded deployment request", description: "The three illustrated conditions are supported in this hypothetical retest. That does not establish that all requirements for this use have been assessed.", instruction: "The accountable approver must review remaining requirements, define the permitted boundary, and record conditions and expiry before any allowance.", items: ["Confirm coverage of all other applicable requirements.", "Review evidence currency, scope, and remaining dependencies.", "Record the human decision and its operating conditions."] } as const;
}
