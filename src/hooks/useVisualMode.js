import { useState } from "react";

export default function useVisualMode(initialState) {
  const [mode, setMode] = useState(initialState);
  const [history, setHistory] = useState([initialState]);

  function transition(secondState, replace = false) {
    if (replace) {
      setMode(secondState);

      setHistory(prevState => {
        const newHistory = [...prevState];
        return [...newHistory.slice(0, newHistory.length - 1), secondState];
      });
    } else {
      setMode(secondState);
      setHistory(prevState => [...prevState, secondState]);
    }
  }

  function back() {
    if (history.length > 1) {
      const newHistory = history.slice(0, history.length - 1);
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  }
  return { mode, transition, back };
}
