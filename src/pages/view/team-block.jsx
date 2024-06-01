import useTeams from "src/hooks/teams";

const BLOCK_HEIGHT = 100;
const BLOCK_MARGIN = 24;
const POS_INCREMENT = BLOCK_HEIGHT + BLOCK_MARGIN;

const TeamBlock = ({ teamIdx, position, round }) => {
  const teams = useTeams()[0];
  const team = teams[teamIdx];
  const displayPosition = position + 1;

  return (
    <div
      className="row flex--apart team-block"
      style={{ top: POS_INCREMENT * position }}
    >
      <div className="row flex--center">
        <div className={`team-block__pos team-block__pos--${displayPosition}`}>
          {displayPosition}
        </div>
        <div className="team-block__title margin--left--sm">{team.name}</div>
      </div>
      <div className="row flex--center">
        <div className="team-block__total">{team.score}</div>
      </div>
    </div>
  );
};

export default TeamBlock;
