import React, { useEffect, useRef, useState } from "react";
import "./App.css";

interface TimerProps {
  work: number;
  prepare: number;
  rest: number;
  cycles: number;
  onEnd: () => void;
}

function Timer({ work, prepare, rest, cycles, onEnd }: TimerProps) {
  // used to trigger a render
  const [, setTick] = useState(0);

  const startTimeMillis = useRef(performance.now());
  const elapsedMillis = performance.now() - startTimeMillis.current;
  // calculate total time
  const totalTimeSeconds = prepare + (work + rest) * cycles;
  // calculate time left
  const timeLeft = totalTimeSeconds * 1000 - elapsedMillis;
  // calculate min:sec for time lelt
  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const inPrepare = elapsedMillis < prepare * 1000;

  useEffect(() => {
    if (elapsedMillis > totalTimeSeconds * 1000) {
      onEnd();
    }
  }, [elapsedMillis, onEnd, totalTimeSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [setTick]);

  return (
    <div className="timer">
      <div className="time">
        <span>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</span>
      </div>
      <div className="action">
        <span>{inPrepare ? "prepare" : "work"}</span>
      </div>
    </div>
  );
}

function App() {
  const [start, setStart] = useState(false);
  const [prepare, setPrepare] = useState(5);
  const [work, setWork] = useState(30);
  const [cycles, setCycles] = useState(8);
  const [rest, setRest] = useState(0);
  return (
    <div className="container">
      <div className="settings">
        {start ? (
          <Timer
            prepare={prepare}
            work={work}
            rest={rest}
            cycles={cycles}
            onEnd={() => {
              setStart(false);
            }}
          />
        ) : (
          <>
            <label>
              Prepare
              <input
                type="number"
                name="prepare"
                min="0"
                value={prepare}
                onChange={(e) => setPrepare(Number(e.target.value))}
              />
            </label>
            <label>
              Work
              <input
                type="number"
                name="work"
                min="0"
                value={work}
                onChange={(e) => setWork(Number(e.target.value))}
              />
            </label>
            <label>
              Rest
              <input
                type="number"
                name="rest"
                min="0"
                value={rest}
                onChange={(e) => setRest(Number(e.target.value))}
              />
            </label>
            <label>
              Cycles
              <input
                type="number"
                name="cycles"
                min="1"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
              />
            </label>
          </>
        )}
      </div>
      <div className="start">
        <button className="btn" onClick={() => setStart(!start)}>
          {start ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default App;
