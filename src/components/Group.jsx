import React, { useState } from 'react';
import groups from '../data/groups.json';

export default function Group({ groupName }) {
  const group = groups[groupName];
  const [areMatchesPlayed, setAreMatchesPlayed] = useState(false);
  const [matches, setMatches] = useState([]);
  const [teamStats, setTeamStats] = useState(() => {
    const initialStats = {};
    group.forEach(team => {
      initialStats[team.ISOCode] = {
        GP: 0,
        PTS: 0,
        W: 0,
        L: 0,
        PF: 0,
        PA: 0,
        PD: 0,
      };
    });
    return initialStats;
  });

  const generateMatches = (teams) => {
    let matchList = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matchList.push({ team1: teams[i], team2: teams[j] });
      }
    }
    return matchList;
  };

  const simulateMatch = (match) => {
    // Probability factor based on FIBA ranking difference
    const rankDifference = match.team2.FIBARanking - match.team1.FIBARanking;
    const probability = 1 / (1 + Math.pow(10, rankDifference / 400));

    const randomFactor = Math.random();
    const team1Score = Math.floor(Math.random() * 41) + 70; // Generates a score between 70 and 110
    const team2Score = Math.floor(Math.random() * 41) + 70; // Generates a score between 70 and 110

    const winner = randomFactor < probability ? match.team1.ISOCode : match.team2.ISOCode;

    return {
      ...match,
      team1Score,
      team2Score,
      winner,
    };
  };

  const updateTeamStats = (matchResults) => {
    const updatedStats = { ...teamStats };
    matchResults.forEach(match => {
      const { team1, team2, team1Score, team2Score, winner } = match;
      const team1ISO = team1.ISOCode;
      const team2ISO = team2.ISOCode;

      // Update games played
      updatedStats[team1ISO].GP += 1;
      updatedStats[team2ISO].GP += 1;

      // Update points for and against
      updatedStats[team1ISO].PF += team1Score;
      updatedStats[team1ISO].PA += team2Score;
      updatedStats[team2ISO].PF += team2Score;
      updatedStats[team2ISO].PA += team1Score;

      // Update point difference
      updatedStats[team1ISO].PD = updatedStats[team1ISO].PF - updatedStats[team1ISO].PA;
      updatedStats[team2ISO].PD = updatedStats[team2ISO].PF - updatedStats[team2ISO].PA;

      // Update wins, losses, and points
      if (winner === team1ISO) {
        updatedStats[team1ISO].W += 1;
        updatedStats[team2ISO].L += 1;
        updatedStats[team1ISO].PTS += 2;
        updatedStats[team2ISO].PTS += 1;
      } else {
        updatedStats[team2ISO].W += 1;
        updatedStats[team1ISO].L += 1;
        updatedStats[team2ISO].PTS += 2;
        updatedStats[team1ISO].PTS += 1;
      }
    });
    setTeamStats(updatedStats);
  };

  const playGroupStage = () => {
    const matches = generateMatches(group);
    const matchResults = matches.map(simulateMatch);
    setMatches(matchResults);
    updateTeamStats(matchResults);
    setAreMatchesPlayed(true);
  };

  return (
      <div className="border-2 rounded-xl py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-center leading-6 text-gray-900">GROUP {groupName}</h1>
            </div>
          </div>
        </div>
        <div className="mt-4 flow-root overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <table className="w-full text-left">
              <thead className="">
              <tr>
                <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">Country</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">GP</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">PTS</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">W</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">L</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">PF</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">PA</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">PD</th>
              </tr>
              </thead>
              <tbody>
              {group.map(team => (
                  <tr key={team.ISOCode}>
                    <td className="py-4 pr-3 text-sm font-medium text-gray-900">{team.Team}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].GP}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].PTS}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].W}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].L}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].PF}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].PA}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{teamStats[team.ISOCode].PD}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex mt-8 justify-center">
          {!areMatchesPlayed && <button
              type="button"
              className="rounded-2xl h-12 bg-indigo-600 px-3.5 py-2.5 shadow-lg text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={playGroupStage}
          >
            Play group stage
          </button>}

        </div>
        {areMatchesPlayed && (
            <div className="mt-6">
              <h2 className="text-base font-semibold text-center my-4 leading-6 text-gray-900">Match Results</h2>
              <ul className="mb-4">
                {matches.map((match, index) => (
                    <li key={index} className="py-2 text-sm border-b-2 px-8">
                      {match.team1.Team} <span className="font-bold"> {match.team1Score} </span> : <span className="font-bold">{match.team2Score}</span> {match.team2.Team}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
}