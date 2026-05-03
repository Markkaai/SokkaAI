import React, { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const list = history?.items || [];

  const toPercent = (val) => (val * 100).toFixed(1);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://elliott888-epl-model.hf.space/prediction-history?skip=0&limit=20", // or reuse predictions
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setHistory(data);
        console.log("History:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-slate-400">Loading history...</p>
      ) : list.length === 0 ? (
        <p className="text-slate-500">No past matches</p>
      ) : (
        <div className="space-y-3">
          {list.map((match, i) => (
            <div
              key={i}
              className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center"
            >
              {/* Teams */}
              <div>
                <p className="text-sm font-semibold">
                  {match.home_team} vs {match.away_team}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDate(match.match_date)}
                </p>
              </div>

              {/* Outcome */}
              <div className="text-right">
                <p className="text-xs text-slate-300">
                  Predicted: {match.outcome}
                </p>

                {/* Optional */}
                {match.actual_result && (
                  <p className="text-xs text-slate-400">
                    Result: {match.actual_result}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;