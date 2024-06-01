import { useState, useEffect, useRef } from "react";
import HistoryEditor from "./history-editor";
import useTeams, { getRound } from "src/hooks/teams";

const TeamEditor = ({ teamIdx, onDoneChange, focusIdx, setFocusIdx }) => {
  const blockRef = useRef();
  const inputRef = useRef();
  const [teams, dispatcher] = useTeams();
  const team = teams[teamIdx];
  const [stageInput, setStageInput] = useState("0");
  const [done, setDone] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const round = getRound(teams);
  const displayIdx = teamIdx + 1;

  useEffect(() => {
    if (focusIdx === teamIdx && blockRef.current) {
      blockRef.current.focus();
    }
  }, [blockRef, focusIdx, teamIdx]);

  useEffect(() => {
    let nextInvalid = false,
      nextDone = false;
    try {
      const input = parseInt(stageInput);
      nextInvalid = isNaN(input);
      nextDone = !nextInvalid && input == team.staged;
    } catch (e) {
      nextInvalid = true;
      console.error(e);
    }
    setInvalid(nextInvalid);
    setDone(nextDone);
  }, [stageInput, team]);

  useEffect(() => {
    onDoneChange(teamIdx, done);
  }, [done, onDoneChange, teamIdx]);

  useEffect(() => {
    setStageInput("0");
  }, [round]);

  const confirmStage = () => {
    try {
      if (!invalid && !done) {
        const staged = parseInt(stageInput);
        dispatcher.setStagedPoints(teamIdx, staged);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="team-editor col">
      <div className="team-editor__header row flex--center">
        <div className="col">
          <div className="team-editor__header__title">{team.name}</div>
          <button
            className="team-editor__header__tnum btn--secondary"
            ref={blockRef}
            onFocus={() => {
              if (teamIdx !== focusIdx) {
                setFocusIdx(teamIdx);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "i" && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
              } else if (e.key === "Enter") {
                confirmStage();
              } else {
                const hotkey = [1, 2, 3, 4, 5].find(
                  (candidate) => "" + candidate === e.key
                );
                if (hotkey) {
                  const toAdd = hotkey === 5 ? 5 : 10 * hotkey;
                  try {
                    const total = toAdd + parseInt(stageInput);
                    setStageInput(total);
                    dispatcher.setStagedPoints(teamIdx, total);
                  } catch (e) {
                    console.error(e);
                  }
                }
              }
            }}
          >
            {displayIdx}
          </button>
        </div>
        <div className="col">
          <div className="team-editor__header__staged row">
            <input
              placeholder={team.staged}
              ref={inputRef}
              className="team-editor__header__input input"
              type="number"
              value={stageInput}
              onChange={({ target }) => {
                setStageInput(target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  confirmStage();
                } else if (e.key === "g" || e.key === "Escape") {
                  blockRef.current?.focus();
                }
              }}
              onBlur={() => {
                if (!stageInput?.length) {
                  setStageInput(team.staged);
                }
              }}
            />
            <button
              className="team-editor__header__btn btn btn--primary"
              disabled={invalid || done}
              onClick={confirmStage}
            >
              Stage
            </button>
          </div>
          <HistoryEditor teamIdx={teamIdx} />
        </div>
      </div>
    </div>
  );
};

export default TeamEditor;
