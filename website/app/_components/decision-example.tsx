"use client";

import { useMemo, useState } from "react";
import { evaluateDecision, type EvidenceState } from "@/lib/decision";
const initial = { age: "22", authority: "unknown" as EvidenceState, version: "unknown" as EvidenceState };

export function DecisionExample() {
  const [age, setAge] = useState(initial.age);
  const [authority, setAuthority] = useState<EvidenceState>(initial.authority);
  const [version, setVersion] = useState<EvidenceState>(initial.version);
  const decision = useMemo(() => evaluateDecision(age, authority, version), [age, authority, version]);
  const numericAge = Number(age);
  const validAge = age.trim() !== "" && Number.isFinite(numericAge) && numericAge >= 0;
  return <div className="example-layout">
    <div>
      <div className="scope-card"><span className="eyebrow">The proposed operating boundary</span><p><strong>Use:</strong> Inventory transfer for approved planners and one warehouse pair.</p><p><strong>Authority:</strong> Controlled action after human approval; no autonomous or cross-region action.</p><p><strong>Owner:</strong> Inventory process owner. The five-minute limit is illustrative and use-specific, not a DARF default.</p></div>
      <div className="test-card"><label className="test-label" htmlFor="stock-age">01 / How old is the stock input at authorization?</label><p>Choose a hypothetical observed age. This example requires an input no more than five minutes old.</p><div className="slider-line"><input id="stock-age" type="range" min="0" max="30" step="1" value={validAge ? age : "22"} onChange={(event) => setAge(event.target.value)} aria-describedby="age-state" /><output htmlFor="stock-age">{validAge ? `${numericAge} min` : "Invalid value"}</output></div><StateMessage id="age-state" state={!validAge ? "hold" : numericAge <= 5 ? "pass" : "fail"}>{!validAge ? "Evidence hold: enter a valid non-negative age." : numericAge <= 5 ? `Hypothetical evidence supports the age requirement: ${numericAge} minutes.` : `Observed failure: ${numericAge} minutes exceeds the five-minute requirement.`}</StateMessage></div>
      <EvidenceSelect id="authority-test" label="02 / Does the action stay inside its authority?" value={authority} onChange={setAuthority} description="A written policy is not an enforcement test. Choose what the hypothetical test establishes." />
      <EvidenceSelect id="version-test" label="03 / Is the action bound to the evaluated stock version?" value={version} onChange={setVersion} description="Freshness alone does not address a change between checking stock and committing the transfer." />
      <button type="button" className="reset-button" onClick={() => { setAge(initial.age); setAuthority(initial.authority); setVersion(initial.version); }}>Reset the teaching example</button>
    </div>
    <aside className="decision-panel" aria-label="Illustrative operating decision"><span className="eyebrow">What the evidence changes</span><div aria-live="polite" aria-atomic="true"><div className={`decision-status ${decision.state}`}><i aria-hidden="true" />{decision.label}</div><h2>{decision.title}</h2><p>{decision.description}</p><p className="decision-instruction">{decision.instruction}</p><h3>{decision.state === "pass" ? "Before an operating allowance" : "What must be resolved"}</h3><ul>{decision.items.map((item) => <li key={item}>{item}</li>)}</ul></div><p className="decision-footnote">This is a three-condition illustration, not a readiness score, certification, or deployment authorization. Other applicable requirements and a named approver’s decision remain necessary.</p></aside>
  </div>;
}

function EvidenceSelect({ id, label, value, onChange, description }: { id: string; label: string; value: EvidenceState; onChange: (value: EvidenceState) => void; description: string }) {
  const state = value === "unknown" ? "hold" : value;
  const text = value === "pass" ? "Hypothetical evidence supports this scoped requirement." : value === "fail" ? "Observed failure: the test demonstrates a requirement violation." : "Evidence hold: a necessary control remains unverified.";
  return <div className="test-card"><label className="test-label" htmlFor={id}>{label}</label><p>{description}</p><select id={id} value={value} onChange={(event) => onChange(event.target.value as EvidenceState)}><option value="unknown">Required evidence is missing</option><option value="fail">Test demonstrates a requirement violation</option><option value="pass">Tests support the scoped requirement</option></select><StateMessage state={state}>{text}</StateMessage></div>;
}

function StateMessage({ id, state, children }: { id?: string; state: "hold" | "fail" | "pass"; children: React.ReactNode }) { return <div id={id} className={`test-state ${state}`}>{children}</div>; }

