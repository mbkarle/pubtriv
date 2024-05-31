import "./init.css";

import useTeams from "src/hooks/teams";

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
          <a className="btn btn--primary btn--big" href="/play">
            Play!
          </a>
        </div>
      </div>
    </div>
  );
};

export default Init;
