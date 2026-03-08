"use client";

import { useState, useEffect } from "react";

interface Player {
  id: string;
  fullName: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchData() {
    try {
      const [teamsRes, playersRes] = await Promise.all([
        fetch("/api/admin/teams"),
        fetch("/api/admin/players"),
      ]);
      const teamsData = await teamsRes.json();
      const playersData = await playersRes.json();
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setPlayers(Array.isArray(playersData) ? playersData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function seedTournament() {
    setSeeding(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage("Tournament and holes seeded successfully!");
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Failed to seed tournament");
    } finally {
      setSeeding(false);
    }
  }

  async function createTeam() {
    if (!newTeamName.trim()) return;

    try {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName, playerIds: selectedPlayers }),
      });
      if (res.ok) {
        setNewTeamName("");
        setSelectedPlayers([]);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  }

  async function deleteTeam(teamId: string) {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await fetch("/api/admin/teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  }

  // Get unassigned players
  const assignedPlayerIds = teams.flatMap((t) => t.players.map((p) => p.id));
  const unassignedPlayers = players.filter((p) => !assignedPlayerIds.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8">Admin: Teams</h1>

        {/* Seed Tournament Button */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Tournament Setup</h2>
          <p className="text-gray-600 mb-4">
            Seed the tournament with course holes (Cazenovia Golf Club - 9 holes).
          </p>
          <button
            onClick={seedTournament}
            disabled={seeding}
            className="bg-black text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {seeding ? "Seeding..." : "Seed Tournament & Holes"}
          </button>
          {message && (
            <p className={`mt-4 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Create Team */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Create Team</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Team Name</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-black focus:outline-none"
                placeholder="e.g., Team Alpha"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">
                Add Players (optional)
              </label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                {unassignedPlayers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No unassigned players</p>
                ) : (
                  unassignedPlayers.map((player) => (
                    <label key={player.id} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlayers([...selectedPlayers, player.id]);
                          } else {
                            setSelectedPlayers(selectedPlayers.filter((id) => id !== player.id));
                          }
                        }}
                      />
                      <span>{player.fullName}</span>
                      <span className="text-gray-400 text-sm">({player.email})</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <button
              onClick={createTeam}
              disabled={!newTeamName.trim()}
              className="bg-black text-white font-bold px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              Create Team
            </button>
          </div>
        </div>

        {/* Teams List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Teams ({teams.length})</h2>
          {teams.length === 0 ? (
            <p className="text-gray-400">No teams created yet</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    {team.players.length > 0 ? (
                      <ul className="text-gray-600 text-sm mt-1">
                        {team.players.map((p) => (
                          <li key={p.id}>{p.fullName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm mt-1">No players assigned</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
