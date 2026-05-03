import React, { useState, useEffect } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const list = history?.items || [];

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
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://elliott888-epl-model.hf.space/prediction-history?skip=0&limit=20",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch history");

        setHistory(data);
        console.log("History:", data);
      } catch (err) {
        console.error(err.message);
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
        <p className="text-slate-500">No history available</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-9 pr-2">
          {list.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-slate-800 pb-3"
            >
              {/* Left side */}
              <div>
                <p className="text-sm font-medium text-white">
                  {item.home_team} vs {item.away_team}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDateTime(item.match_date)}
                </p>
              </div>

              {/* Right side */}
              <div className="text-right">
                <p className="text-sm text-green-400 font-medium">
                  {item.outcome}
                </p>
                <p className="text-xs text-slate-500">
                  {toPercent(item.confidence)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;