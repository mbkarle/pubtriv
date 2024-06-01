import "./play.css";
import { useState, useCallback, useMemo } from "react";
import useTeams, { getRound } from "src/hooks/teams";
import TeamEditor from "./team-editor";
import { useHotkeys } from "react-hotkeys-hook";

const HK_OPTIONS = { enableOnFormTags: true };

const Play = () => {
  const [teams, dispatcher] = useTeams();
  const round = getRound(teams);
  const [hasTip, setTip] = useState(false);
  const [readyEditors, setReadyEditors] = useState(() => teams.map(() => true));
  const onDoneChange = useCallback((idx, isDone) => {
    setReadyEditors((curr) => {
      const next = [...curr];
      next[idx] = isDone;
      return next;
    });
  }, []);

  const numReady = useMemo(() => {
    return readyEditors.reduce((acc, isReady) => acc + isReady, 0);
  }, [readyEditors]);

  const [focusIdx, setFocusIdx] = useState(0);

  useHotkeys(
    "shift+r",
    (e) => {
      e.preventDefault();
      advanceRound();
    },
    HK_OPTIONS,
    [teams.length, numReady, dispatcher]
  );
  useHotkeys(
    "n",
    (e) => {
      e.preventDefault();
      setFocusIdx((curr) => (curr + 1) % teams.length);
    },
    HK_OPTIONS,
    [teams.length]
  );
  useHotkeys(
    "shift+n",
    (e) => {
      e.preventDefault();
      setFocusIdx((curr) => (teams.length + curr - 1) % teams.length);
    },
    HK_OPTIONS,
    [teams.length]
  );
  useHotkeys(
    "g+1,g+2,g+3,g+4,g+5,g+6,g+7,g+8,g+9",
    (e, handler) => {
      e.preventDefault();
      try {
        const str = handler.keys.join("");
        const num = parseInt(str[1]);
        const displayAdjusted = num - 1;
        if (displayAdjusted < teams.length) {
          setFocusIdx(displayAdjusted % teams.length);
        }
      } catch (e) {
        console.log(`Expected hotkey g+[1-9]: ${e}`);
      }
    },
    HK_OPTIONS,
    teams.length
  );

  const advanceRound = () => {
    if (numReady === teams.length) {
      dispatcher.commitAll();
    }
  };

  return (
    <div className="page">
      <div className="play container col">
        <div className="row flex--apart flex--center">
          <div className="col">
            <div className="row flex--center">
              <h1>Live Editor</h1>
              <a
                className="btn btn--secondary margin--left--sm"
                href="/view"
                target="_blank"
              >
                View Live
              </a>
              <a className="btn btn--warning margin--left--sm" href="/init">
                Edit Teams
              </a>
            </div>
            <div className="row flex--center">
              <button
                className="btn btn--secondary"
                onClick={() => setTip((curr) => !curr)}
              >
                {hasTip ? "Hide " : "Show "}hotkeys
              </button>
              {hasTip && (
                <div className="margin--left--sm">
                  Hotkeys: Shift+R to advance round. n/shift+n to move down/up
                  rows. Hold g and press [1-9] to jump to row [1-9]. Press i to
                  enter insert mode for input in row. Press g in insert mode to
                  return to normal mode. Press 1-4 in normal mode to add 10-40
                  points and auto stage. Press in normal mode to add 5 points
                  and auto stage.
                </div>
              )}
            </div>
          </div>
          <div className="col flex--center">
            <div className="row flex--center">
              <div>Round: {round}</div>
              <button
                className="btn btn--primary play__next-round"
                onClick={advanceRound}
                disabled={numReady != teams.length}
              >
                Next
              </button>
            </div>
            <div>
              {numReady}/{teams.length} ready
            </div>
          </div>
        </div>
        <div className="container col">
          {teams.map((team, idx) => (
            <TeamEditor
              key={`team-play-${idx}`}
              teamIdx={idx}
              onDoneChange={onDoneChange}
              focusIdx={focusIdx}
              setFocusIdx={setFocusIdx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Play;
