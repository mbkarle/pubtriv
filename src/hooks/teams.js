import { useMemo } from "react";
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

  setTeamScore(idx, score) {
    this.updateTeam(idx, (team) => {
      team.score = score;
    });
  }

  addTeamPoints(idx, points) {
    this.updateTeam(idx, (team) => {
      team.history.push(points);
      team.score += points;
    });
  }

  commitTeamPoints(idx) {
    this.updateTeam(idx, (team) => {
      const points = team.staged;
      team.history.push(points);
      team.score += points;
      team.staged = 0;
    });
  }

  stageTeamPoints(idx, points) {
    this.updateTeam(idx, (team) => {
      team.staged += points;
    });
  }

  // TODO: clean this up
  // EITHER: make much more robust actions system OR reduce size of interface drastically
  commitAll() {
    this.apply((arr) => {
      arr.forEach((team) => {
        team.history.push(team.staged);
        team.score += team.staged;
        team.staged = 0;
      });
    });
  }
}

const useTeams = () => {
  const [teams, setTeams] = useLocalStorage(KEYS.TEAMS, [getNewTeam()]);

  const dispatcher = useMemo(() => new TeamDispatcher(setTeams), [setTeams]);

  return [teams, dispatcher];
};

export default useTeams;
