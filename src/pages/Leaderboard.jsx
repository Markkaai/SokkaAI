import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const leagues = {
  "Premier League": [
    { pos: 1,  team: "Manchester City",  played: 35, won: 25, drawn: 6,  lost: 4,  gf: 78, ga: 38, gd: "+40", points: 81, form: ["W","W","W","D","W"] },
    { pos: 2,  team: "Arsenal",          played: 35, won: 24, drawn: 5,  lost: 6,  gf: 82, ga: 32, gd: "+50", points: 77, form: ["W","W","D","W","W"] },
    { pos: 3,  team: "Liverpool",        played: 35, won: 22, drawn: 8,  lost: 5,  gf: 74, ga: 40, gd: "+34", points: 74, form: ["D","W","W","W","L"] },
    { pos: 4,  team: "Aston Villa",      played: 35, won: 20, drawn: 6,  lost: 9,  gf: 68, ga: 50, gd: "+18", points: 66, form: ["W","L","W","W","D"] },
    { pos: 5,  team: "Tottenham",        played: 35, won: 18, drawn: 6,  lost: 11, gf: 61, ga: 55, gd: "+6",  points: 60, form: ["L","W","W","D","W"] },
    { pos: 6,  team: "Chelsea",          played: 35, won: 16, drawn: 9,  lost: 10, gf: 60, ga: 52, gd: "+8",  points: 57, form: ["W","D","L","W","D"] },
    { pos: 7,  team: "Newcastle",        played: 35, won: 16, drawn: 7,  lost: 12, gf: 72, ga: 58, gd: "+14", points: 55, form: ["W","W","L","L","W"] },
    { pos: 8,  team: "Man United",       played: 35, won: 13, drawn: 8,  lost: 14, gf: 38, ga: 54, gd: "-16", points: 47, form: ["L","D","W","L","D"] },
    { pos: 9,  team: "West Ham",         played: 35, won: 12, drawn: 8,  lost: 15, gf: 48, ga: 62, gd: "-14", points: 44, form: ["D","L","W","D","L"] },
    { pos: 10, team: "Brighton",         played: 35, won: 11, drawn: 9,  lost: 15, gf: 52, ga: 60, gd: "-8",  points: 42, form: ["W","D","D","L","W"] },
    { pos: 11, team: "Wolves",           played: 35, won: 11, drawn: 7,  lost: 17, gf: 44, ga: 63, gd: "-19", points: 40, form: ["L","W","L","D","L"] },
    { pos: 12, team: "Fulham",           played: 35, won: 10, drawn: 9,  lost: 16, gf: 46, ga: 58, gd: "-12", points: 39, form: ["D","D","W","L","D"] },
    { pos: 13, team: "Brentford",        played: 35, won: 10, drawn: 8,  lost: 17, gf: 50, ga: 65, gd: "-15", points: 38, form: ["L","W","D","L","W"] },
    { pos: 14, team: "Crystal Palace",   played: 35, won: 9,  drawn: 9,  lost: 17, gf: 36, ga: 55, gd: "-19", points: 36, form: ["D","L","D","W","L"] },
    { pos: 15, team: "Everton",          played: 35, won: 9,  drawn: 8,  lost: 18, gf: 34, ga: 58, gd: "-24", points: 35, form: ["L","D","L","D","W"] },
    { pos: 16, team: "Nottm Forest",     played: 35, won: 9,  drawn: 7,  lost: 19, gf: 38, ga: 62, gd: "-24", points: 34, form: ["W","L","L","D","L"] },
    { pos: 17, team: "Luton Town",       played: 35, won: 7,  drawn: 9,  lost: 19, gf: 40, ga: 70, gd: "-30", points: 30, form: ["L","L","D","W","L"] },
    { pos: 18, team: "Burnley",          played: 35, won: 5,  drawn: 8,  lost: 22, gf: 32, ga: 76, gd: "-44", points: 23, form: ["L","L","D","L","L"] },
    { pos: 19, team: "Sheffield Utd",    played: 35, won: 4,  drawn: 5,  lost: 26, gf: 28, ga: 90, gd: "-62", points: 17, form: ["L","L","L","D","L"] },
    { pos: 20, team: "Burnley FC",       played: 35, won: 3,  drawn: 6,  lost: 26, gf: 26, ga: 85, gd: "-59", points: 15, form: ["L","D","L","L","L"] },
  ],
  "La Liga": [
    { pos: 1,  team: "Real Madrid",      played: 35, won: 26, drawn: 5,  lost: 4,  gf: 82, ga: 32, gd: "+50", points: 83, form: ["W","W","W","W","D"] },
    { pos: 2,  team: "Barcelona",        played: 35, won: 23, drawn: 6,  lost: 6,  gf: 74, ga: 40, gd: "+34", points: 75, form: ["W","D","W","W","W"] },
    { pos: 3,  team: "Atletico Madrid",  played: 35, won: 21, drawn: 7,  lost: 7,  gf: 65, ga: 38, gd: "+27", points: 70, form: ["D","W","W","L","W"] },
    { pos: 4,  team: "Athletic Bilbao",  played: 35, won: 18, drawn: 8,  lost: 9,  gf: 54, ga: 42, gd: "+12", points: 62, form: ["W","W","D","L","W"] },
    { pos: 5,  team: "Real Sociedad",    played: 35, won: 16, drawn: 7,  lost: 12, gf: 50, ga: 48, gd: "+2",  points: 55, form: ["L","W","D","W","D"] },
    { pos: 6,  team: "Villarreal",       played: 35, won: 15, drawn: 8,  lost: 12, gf: 52, ga: 50, gd: "+2",  points: 53, form: ["W","D","W","L","D"] },
    { pos: 7,  team: "Real Betis",       played: 35, won: 13, drawn: 9,  lost: 13, gf: 48, ga: 50, gd: "-2",  points: 48, form: ["D","L","W","W","D"] },
    { pos: 8,  team: "Sevilla",          played: 35, won: 10, drawn: 8,  lost: 17, gf: 40, ga: 58, gd: "-18", points: 38, form: ["L","D","L","W","L"] },
  ],
  "Bundesliga": [
    { pos: 1,  team: "Bayer Leverkusen", played: 33, won: 27, drawn: 5,  lost: 1,  gf: 88, ga: 24, gd: "+64", points: 86, form: ["W","W","W","D","W"] },
    { pos: 2,  team: "Bayern Munich",    played: 33, won: 24, drawn: 4,  lost: 5,  gf: 90, ga: 38, gd: "+52", points: 76, form: ["W","W","D","W","W"] },
    { pos: 3,  team: "Stuttgart",        played: 33, won: 18, drawn: 6,  lost: 9,  gf: 60, ga: 42, gd: "+18", points: 60, form: ["W","D","W","L","W"] },
    { pos: 4,  team: "RB Leipzig",       played: 33, won: 17, drawn: 5,  lost: 11, gf: 64, ga: 48, gd: "+16", points: 56, form: ["D","W","W","L","D"] },
    { pos: 5,  team: "Dortmund",         played: 33, won: 15, drawn: 7,  lost: 11, gf: 58, ga: 50, gd: "+8",  points: 52, form: ["W","L","D","W","W"] },
    { pos: 6,  team: "Eintracht",        played: 33, won: 14, drawn: 6,  lost: 13, gf: 52, ga: 54, gd: "-2",  points: 48, form: ["L","W","D","W","L"] },
  ],
};

const formStyle = {
  W: "bg-green-500 text-white",
  D: "bg-slate-600 text-white",
  L: "bg-red-500 text-white",
};

const zoneStyle = (pos, total) => {
  if (pos <= 4)             return "border-l-2 border-blue-500";
  if (pos <= 6)             return "border-l-2 border-orange-500";
  if (pos >= total - 2)     return "border-l-2 border-red-500";
  return "";
};

export default function Leaderboard() {
  const [activeLeague, setActiveLeague] = useState("Premier League");
  const data = leagues[activeLeague];

  return (
    <section className="bg-slate-950 p-6 rounded-xl border border-slate-900">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">Team Standings</h2>
          <p className="text-slate-500 text-sm">Current league table and form guide.</p>
        </div>
        <button className="text-blue-500 text-sm font-semibold hover:underline flex items-center gap-1">
          Full Table <ChevronRight size={16} />
        </button>
      </div>

      {/* League Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.keys(leagues).map((league) => (
          <button
            key={league}
            onClick={() => setActiveLeague(league)}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200
              ${activeLeague === league
                ? "bg-blue-600 text-white"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-blue-500/40 hover:text-white"}`}
          >
            {league}
          </button>
        ))}
      </div>

      
      <div className="flex gap-4 mb-4 flex-wrap">
        {[
          { color: "bg-blue-500",   label: "Champions League" },
          { color: "bg-orange-500", label: "Europa League"    },
          { color: "bg-red-500",    label: "Relegation Zone"  },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${z.color}`} />
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{z.label}</span>
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-3 pb-2 border-b border-slate-800">
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold">#</span>
        <span className="col-span-4 text-[10px] text-slate-600 uppercase font-bold">Club</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">P</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">W</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">D</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">L</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">GD</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center hidden md:block">Form</span>
        <span className="col-span-1 text-[10px] text-slate-600 uppercase font-bold text-center">Pts</span>
      </div>

      {/* Rows */}
      <div className="space-y-1 mt-1">
        {data.map((team) => (
          <div
            key={team.pos}
            className={`group grid grid-cols-12 items-center bg-slate-900/40 rounded-lg px-3 py-2.5 hover:bg-slate-800/60 transition-all duration-200 ${zoneStyle(team.pos, data.length)}`}
          >
            <span className="col-span-1 text-slate-400 text-sm font-bold">{team.pos}</span>

            <span className="col-span-4 text-white text-sm font-semibold truncate">{team.team}</span>

            <span className="col-span-1 text-slate-400 text-xs text-center">{team.played}</span>
            <span className="col-span-1 text-green-400 text-xs font-bold text-center">{team.won}</span>
            <span className="col-span-1 text-slate-400 text-xs text-center">{team.drawn}</span>
            <span className="col-span-1 text-red-400 text-xs text-center">{team.lost}</span>
            <span className={`col-span-1 text-xs font-bold text-center ${team.gd.startsWith("+") ? "text-green-400" : team.gd === "0" ? "text-slate-400" : "text-red-400"}`}>
              {team.gd}
            </span>

            {/* Form */}
            <div className="col-span-1 hidden md:flex items-center justify-center gap-0.5">
              {team.form.map((f, i) => (
                <span key={i} className={`w-4 h-4 rounded-sm text-[8px] font-black flex items-center justify-center ${formStyle[f]}`}>
                  {f}
                </span>
              ))}
            </div>

            <span className="col-span-1 text-white text-sm font-black text-center">{team.points}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
