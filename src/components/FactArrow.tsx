import { useEffect, useRef, useState } from "react";
import "./fact-arrow.css";

export type ArrowFact = { text: string; truth: boolean; why: string };
export function FactArrow({
  facts,
  say,
  onDone,
}: {
  facts: ArrowFact[];
  say: (text: string) => void;
  onDone: () => void;
}) {
  const [round, setRound] = useState(0);
  const [aim, setAim] = useState<boolean | null>(null);
  const [flight, setFlight] = useState(false);
  const [landed, setLanded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const fact = facts[round];
  const correct = landed && aim === fact.truth;
  const launch = () => {
    if (aim === null || busy.current || landed) return;
    busy.current = true;
    setFlight(true);
    timer.current = setTimeout(() => {
      setFlight(false);
      setLanded(true);
      busy.current = false;
      say(
        aim === fact.truth
          ? `Yes! You got it! Congratulations, explorer! ${fact.why}`
          : `Good try! ${fact.why} Aim again when you are ready.`,
      );
    }, 1100);
  };
  return (
    <div className="fa-game" aria-label="Flying fact arrows">
      <div className="fa-counter">
        FACT {round + 1} / {facts.length} · Aim, then send your message
      </div>
      <div className="fa-targets">
        {[true, false].map((value) => (
          <button
            key={String(value)}
            className={`fa-target ${value ? "fa-true" : "fa-false"} ${aim === value ? "fa-aimed" : ""}`}
            aria-label={`Aim at ${value ? "True" : "False"}`}
            aria-pressed={aim === value}
            disabled={flight || landed}
            onClick={() => setAim(value)}
          >
            <strong>{value ? "TRUE" : "FALSE"}</strong>
            {landed && aim === value ? (
              <div className="fa-arrived">
                <span>{correct ? "✦ Delivered!" : "↻ Try again"}</span>
                <p>{fact.text}</p>
              </div>
            ) : (
              <span className="fa-orbit">{value ? "✓" : "×"}</span>
            )}
          </button>
        ))}
      </div>
      {!landed && (
        <div
          className={`fa-message ${flight ? (aim ? "fa-fly-left" : "fa-fly-right") : ""}`}
          aria-label="Fact attached to arrow"
        >
          <div className="fa-arrow">➶</div>
          <div className="fa-string" />
          <p className="fa-note">{fact.text}</p>
        </div>
      )}
      <div className="fa-controls">
        {!landed ? (
          <button className="cm-primary" disabled={aim === null || flight} onClick={launch}>
            {flight ? "Message flying…" : "Launch arrow ➶"}
          </button>
        ) : correct ? (
          <button
            className="cm-primary"
            onClick={() => {
              if (round === facts.length - 1) onDone();
              else {
                setRound(round + 1);
                setLanded(false);
                setAim(null);
                say("A new message! Choose True or False, then launch.");
              }
            }}
          >
            {round === facts.length - 1 ? "Finish mission →" : "Next fact →"}
          </button>
        ) : (
          <button
            className="cm-primary"
            onClick={() => {
              setLanded(false);
              setAim(null);
            }}
          >
            Try again ↻
          </button>
        )}
      </div>
    </div>
  );
}
