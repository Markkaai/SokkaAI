import React, { useState, useEffect } from "react";

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const list = predictions?.items || [];

  const toPercent = (value) => {
    return (value * 100).toFixed(1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
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
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch predictions");

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
    <div className="bg-slate-900">
      {loading ? (
        <p className="text-slate-400">Loading predictions...</p>
      ) : list.length === 0 ? (
        <p className="text-slate-500">No predictions available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-9 pr-2 ">
          {list.map((pred, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition flex flex-col gap-2"
            >
              {/* Teams */}
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <img
                    src={`https://elliott888-epl-model.hf.space${pred.home_team_logo}`}
                    className="h-16 mx-auto"
                    alt=""
                  />
                  <p className="text-sm font-semibold">{pred.home_team}</p>
                </div>

                <span className="text-slate-400">VS</span>

                <div className="text-center">
                  <img
                    src={`https://elliott888-epl-model.hf.space${pred.away_team_logo}`}
                    className="h-16 mx-auto"
                    alt=""
                  />
                  <p className="text-sm font-semibold">{pred.away_team}</p>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-slate-400 text-center">
                {formatDateTime(pred.match_date)}
              </p>

              {/* Probabilities */}
              <div className="text-xs space-y-1 mt-1">
                <p>{pred.home_team}: {toPercent(pred.prob_home)}%</p>
                <p>{pred.away_team}: {toPercent(pred.prob_away)}%</p>
                <p>Draw: {toPercent(pred.prob_draw)}%</p>
              </div>

              {/* Confidence */}
              <p className="text-xs text-slate-300 mt-1">
                Confidence:{" "}
                <span className="font-medium">
                  {toPercent(pred.confidence)}%
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