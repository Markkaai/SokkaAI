import React from "react";
import { useState, useEffect } from "react";

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const list = predictions?.items || [];

  const toPercent = (value) => {
    return (value * 100).toFixed(1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString + "Z"); // Ensure it's treated as UTC

    if (isNaN(date)) return "Invalid date";

    return date.toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://elliott888-epl-model.hf.space/predictions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch predictions");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9 pr-2">
          {list.map((pred, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition flex flex-col gap-2"
            >
              {/* Teams */}
              <div className="flex justify-around">
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src={`https://elliott888-epl-model.hf.space${pred.home_team_logo}`}
                    alt=""
                    className="h-20"
                  />
                  <p className="text-sm font-semibold">{pred.home_team}</p>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                  <span>VS</span>
                  <p className="text-xs text-slate-400">
                    {formatDateTime(pred.match_date)}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src={`https://elliott888-epl-model.hf.space${pred.away_team_logo}`}
                    alt=""
                    className="h-20"
                  />
                  <p className="text-sm font-semibold">{pred.away_team}</p>
                </div>
              </div>
              <p className="text-sm font-semibold"></p>

              <div className="flex justify-around mt-2">
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs text-slate-400">
                    {pred.home_team} win
                  </span>
                  <span className=" text-green-500 font-bold">{toPercent(pred.prob_home)} %</span>
                </div>
                <div className="flex flex-col items-center justify-center h-full" >
                  <span className="text-xs text-slate-400">Draw</span>
                  <span className=" text-green-500 font-bold">{toPercent(pred.prob_draw)}%</span>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs text-slate-400">
                    {pred.away_team} win
                  </span>
                  <span className=" text-green-500 font-bold">
                     {toPercent(pred.prob_away)} %
                  </span>
                </div>
              </div>

              {/* Probabilities */}
              <div className="text-xs space-y-1 mt-1"></div>

              {/* Confidence */}
              <p className="text-xs text-slate-300 mt-1">
                Confidence:{" "}
                <span className="font-medium">
                  {toPercent(pred.confidence)} %
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Predictions;
