import { useMemo, createContext, useContext } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { KEYS } from "src/constants";

/**
 * Recall: ideas for features
 * Play page should "lock in" the score delta for each team and commit a new round when all are complete
 * Scores should be committed to history with a round (can just be index in array)
 * Scores at a given round should be able to be edited
 * A new team added mid game should have a history of 0 scores up to the given round
 * etc?
 */

const TEAM_INIT = {
  name: "",
  history: [],
  score: 0,
  staged: 0,
};

const getNewTeam = () => ({ ...TEAM_INIT });

class TeamDispatcher {
  constructor(setter) {
    this.setter = setter;
  }

  apply(func) {
    this.setter((curr) => {
      const next = [...curr];
      func(next);
      return next;
    });
  }

  remove(idx) {
    this.apply((arr) => arr.splice(idx, 1));
  }

  add() {
    this.apply((arr) => arr.push(getNewTeam()));
  }

  updateTeam(idx, func) {
    this.apply((arr) => {
      func(arr[idx]);
    });
  }

  setTeamName(idx, name) {
    this.updateTeam(idx, (team) => {
      team.name = name;
    });
  }

  setStagedPoints(idx, points) {
    this.updateTeam(idx, (team) => {
      team.staged = points;
    });
  }

  commitAll() {
    this.apply((arr) => {
      arr.forEach((team) => {
        team.history.push(team.staged);
        team.score += team.staged;
        team.staged = 0;
      });
    });
  }

  setHistory(idx, rewrite) {
    this.updateTeam(idx, (team) => {
      team.history = rewrite;
      team.score = team.history.reduce((acc, pts) => acc + pts, 0);
    });
  }

  resetAll() {
    this.apply((arr) => {
      arr.forEach((team) => {
        team.history = [];
        team.score = 0;
        team.staged = 0;
      });
    });
  }
}

export const TeamsContext = createContext([
  [getNewTeam()],
  new TeamDispatcher(() => null),
]);

export const useTeamsProvider = () => {
  const [teams, setTeams] = useLocalStorage(KEYS.TEAMS, [getNewTeam()]);

  const dispatcher = useMemo(() => new TeamDispatcher(setTeams), [setTeams]);

  return [teams, dispatcher];
};

const useTeams = () => {
  return useContext(TeamsContext);
};

export const getRound = (teams) => {
  return (teams?.[0]?.history?.length ?? 0) + 1;
};

export default useTeams;
