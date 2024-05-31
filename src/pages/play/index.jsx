import "./play.css";
import { useState } from "react";
import useTeams from "src/hooks/teams";

const Play = () => {
  const [teams, dispatcher] = useTeams();
  const [addVector, setAddVector] = useState(() => teams.map(() => '0'));

  const setPointsInput = (idx, value) => {
    setAddVector((curr) => {
      const next = [...curr];
      next[idx] = value;
      return next;
    });
  };

  const stagePoints = (idx) => {
    try {
      const points = parseInt(addVector[idx]);
      dispatcher.stageTeamPoints(idx, points);
      setPointsInput(idx, '0');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page">
      <div className="play container col">
        <h1>Live Editor</h1>
        <div className="container col">
          <div className="play__header-row">
            <div>Team Name</div>
            <div>Score</div>
            <div>Staged</div>
            <div>Add</div>
          </div>
          {teams.map((team, idx) => (
            <div key={`team-play-${idx}`} className="play__row">
              <div>{team.name}</div>
              <div>{team.score}</div>
              <div>{team.staged}</div>
              <div className="row flex--center">
                <input
                  type="number"
                  className="input"
                  value={addVector[idx] ?? ""}
                  onChange={({ target }) =>
                    setPointsInput(idx, target.value)
                  }
                />
                <button
                  className="btn btn--secondary"
                  onClick={() => stagePoints(idx)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Play;
