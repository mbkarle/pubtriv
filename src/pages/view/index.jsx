import "./view.css";
import { useState, useEffect, useLayoutEffect } from "react";
import useTeams, { getRound } from "src/hooks/teams";
import TeamBlock from "./team-block";

const getPositions = (teams) => {
  const transpose = teams.map((_, idx) => idx);
  transpose.sort((i1, i2) => teams[i2].score - teams[i1].score);
  // At this point have team indices sorted in order: e.g. [team1, team0, team2]
  // but want the "transpose" of this: [1st, 0th, 2nd]
  const positions = [...transpose];
  transpose.forEach(
    (teamIdx, positionIdx) => (positions[teamIdx] = positionIdx)
  );
  return positions;
};

const View = () => {
  const teams = useTeams()[0];
  const round = getRound(teams);
  const [positions, setPositions] = useState(() => getPositions(teams));
  const [scrollHeight, setScrollHeight] = useState(350);

  useEffect(() => {
    setPositions(getPositions(teams));
  }, [teams]);

  // use scroll height and resize listener to make sure page is tall enough to contain everything!
  useLayoutEffect(() => {
    const handleResize = () => {
      setScrollHeight(document.body.scrollHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="view__page page" style={{ height: `${scrollHeight}px` }}>
      <div className="view container col">
        <div className="row flex--apart flex--center view__header">
          <h1>Leaderboard</h1>
          <h2>Round: {round}</h2>
        </div>
        <div className="view__leader container">
          {teams.map((team, idx) => (
            <TeamBlock
              key={`view-team-${idx}`}
              teamIdx={idx}
              position={positions[idx]}
              round={round}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default View;
