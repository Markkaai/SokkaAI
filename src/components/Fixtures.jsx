import React from 'react';
import { ChevronRight, Calendar, Info } from 'lucide-react';

const fixturesData = [
  {
    id: 1,
    homeTeam: "Arsenal",
    awayTeam: "Man City",
    time: "18:30",
    date: "SUN 4 MAY",
    winProbHome: "34%",
    drawProb: "22%",
    winProbAway: "44%",
    confidence: "88%"
  },
  {
    id: 2,
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    time: "21:00",
    date: "MON 5 MAY",
    winProbHome: "52%",
    drawProb: "18%",
    winProbAway: "30%",
    confidence: "75%"
  }
];

export default function Fixtures() {
  return (
    <section className="bg-slate-950 p-6 rounded-xl border border-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">Upcoming Fixtures</h2>
          <p className="text-slate-500 text-sm">Next 48 hours of elite competition analysis.</p>
        </div>
        <button className="text-blue-500 text-sm font-semibold hover:underline flex items-center gap-1">
          View All <ChevronRight size={16} />
        </button>
      </div>

      {/* Fixtures List */}
      <div className="space-y-4">
        {fixturesData.map((match) => (
          <div 
            key={match.id} 
            className="group bg-slate-900/50 border border-slate-800 rounded-lg p-5 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Match Info & Teams */}
              <div className="flex items-center gap-8 flex-1 justify-center md:justify-start">
                <div className="text-center md:text-left">
                  <p className="text-blue-500 text-xs font-bold uppercase">{match.date}</p>
                  <p className="text-white text-lg font-bold">{match.time}</p>
                </div>
                
                <div className="flex items-center gap-4 text-white font-semibold text-lg">
                  <span>{match.homeTeam}</span>
                  <span className="text-slate-600 text-sm font-normal">VS</span>
                  <span>{match.awayTeam}</span>
                </div>
              </div>

              {/* Prediction Metrics */}
              <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={14} className="text-slate-500" />
                  <span className="text-slate-400 text-xs uppercase tracking-tighter">Win Probability</span>
                </div>
                
                <div className="flex w-full md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: match.winProbHome }} className="bg-blue-600 h-full" title="Home Win"></div>
                  <div style={{ width: match.drawProb }} className="bg-slate-600 h-full" title="Draw"></div>
                  <div style={{ width: match.winProbAway }} className="bg-blue-400 h-full" title="Away Win"></div>
                </div>

                <div className="flex justify-between w-full md:w-64 text-[10px] font-bold uppercase mt-1">
                  <span className="text-blue-500">{match.winProbHome} Home</span>
                  <span className="text-slate-500">{match.drawProb} Draw</span>
                  <span className="text-blue-300">{match.winProbAway} Away</span>
                </div>
              </div>

              {/* Action */}
              <button className="bg-blue-600/10 text-blue-500 border border-blue-600/20 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-all">
                Analyze
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}