import React from 'react'
import { useState,useEffect } from 'react';

function Predictions() {
  const [predictions, setPredictions] = useState([]);
const [loading, setLoading] = useState(true);

const list = predictions?.items || [];

useEffect(() => {
  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://elliott888-epl-model.hf.space/predictions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch predictions");

      console.log("Predictions:", data);
      setPredictions(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPredictions();
}, []);
  return (
    <div>
  {loading ? (
    <p className="text-slate-400">Loading predictions...</p>
  ) : predictions.length === 0 ? (
    <p className="text-slate-500">No predictions available</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-150 overflow-y-auto pr-2">
  {list.map((pred, index) => (
    <div
      key={index}
      className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition flex flex-col gap-2"
    >
      {/* Teams */}
      <p className="text-sm font-semibold">
        {pred.home_team} vs {pred.away_team}
      </p>

      {/* Date & Time */}
      <p className="text-xs text-slate-400">
         {pred.match_date}  {pred.match_time}
      </p>

      {/* Probabilities */}
      <div className="text-xs space-y-1 mt-1">
        <p>{pred.home_team}: {pred.prob_home}%</p>
        <p>{pred.away_team}: {pred.prob_away}%</p>
        <p>Draw: {pred.prob_draw}%</p>
      </div>

      {/* Confidence */}
      <p className="text-xs text-slate-300 mt-1">
        Confidence: <span className="font-medium">{pred.confidence}%</span>
      </p>
    </div>
  ))}
</div>
  )}
  </div>
  )
}

export default Predictions