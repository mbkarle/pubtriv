import "./init.css";

import useTeams, { getRound } from "src/hooks/teams";

const TeamInfo = ({ name, onNameChange, onRemove }) => {
  return (
    <div className="team-info init__team-container__row">
      <button
        onClick={onRemove}
        className="team-info__button init__team-container__button btn btn--warning"
      >
        Remove
      </button>
      <input
        className="input"
        value={name}
        onChange={({ target }) => onNameChange(target.value)}
        placeholder="Team name"
      />
    </div>
  );
};

const Init = () => {
  const [teams, dispatcher] = useTeams();
  const round = getRound(teams);

  return (
    <div className="page">
      <div className="init container col">
        <h1>Create teams</h1>
        <div className="container col init__team-container">
          {teams.map((team, idx) => (
            <TeamInfo
              key={`team-init-${idx}`}
              name={team.name}
              onNameChange={(name) => dispatcher.setTeamName(idx, name)}
              onRemove={() => dispatcher.remove(idx)}
            />
          ))}
          <div className="init__team-container__row">
            <button
              className="init__team-container__button btn btn--primary"
              onClick={() => dispatcher.add()}
            >
              Add
            </button>
          </div>
        </div>
        <div className="col flex--center">
          {round > 1 ? (
            <div className="row">
              <div className="row flex--center font--md">
                Game in progress:{" "}
              </div>
              <button
                className="btn btn--warning margin--left--sm"
                onClick={() => dispatcher.resetAll()}
              >
                Reset
              </button>
              <a className="btn btn--primary margin--left--sm" href="/play">
                Resume
              </a>
            </div>
          ) : (
            <a className="btn btn--primary btn--big" href="/play">
              Play!
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Init;
