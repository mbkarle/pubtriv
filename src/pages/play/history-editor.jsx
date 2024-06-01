import { useState, useEffect } from "react";
import useTeams from "src/hooks/teams";

const HistoryEditor = ({ teamIdx }) => {
  const [teams, dispatcher] = useTeams();
  const team = teams[teamIdx];
  const [editing, setEditing] = useState(false);
  const [editVals, setEditVals] = useState(team.history);
  const [isValidRewrite, setIsValidRewrite] = useState(false);

  useEffect(() => {
    setEditVals(team.history);
    setIsValidRewrite(false);
  }, [team.history]);

  const updateEditVal = (idx, val) => {
    setEditVals((curr) => {
      const next = [...curr];
      next[idx] = val;
      return next;
    });
    setIsValidRewrite(
      val.length &&
        team.history.reduce(
          (curr, saved, pos) =>
            curr || (pos === idx ? saved != val : saved != editVals[pos]),
          false
        )
    );
  };

  const updateHistory = () => {
    try {
      const rewrite = editVals.map((str) => parseInt(str));
      dispatcher.setHistory(teamIdx, rewrite);
    } catch (e) {
      console.error(e);
    }
  };

  const confirm = () => {
    updateHistory();
    setEditing(false);
  };

  return (
    <div className="history-editor row">
      <table className="history-editor__table">
        <tbody>
          <tr className="history-editor__tr">
            {team.history.map((pts, idx) => (
              <td
                className="history-editor__td"
                key={`history-${teamIdx}-${idx}`}
              >
                {editing ? (
                  <input
                    className="history-editor__input"
                    type="number"
                    value={editVals[idx]}
                    onChange={({ target }) => updateEditVal(idx, target.value)}
                  />
                ) : (
                  pts
                )}
              </td>
            ))}
            <th className="history-editor__th">{team.score}</th>
          </tr>
        </tbody>
      </table>
      {editing ? (
        <>
          <button
            className="history-editor__btn btn btn--warning"
            onClick={() => {
              setEditVals(team.history);
              setEditing(false);
            }}
          >
            Cancel
          </button>
          <button
            className="history-editor__btn btn btn--primary margin--left--sm"
            onClick={() => confirm()}
            disabled={!isValidRewrite}
          >
            Confirm
          </button>
        </>
      ) : (
        <button
          className="history-editor__btn btn btn--secondary"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default HistoryEditor;
