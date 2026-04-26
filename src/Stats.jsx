// Stats.jsx — Hidden product metrics dashboard
// Access at: cardcoach.vercel.app/stats
// Not linked anywhere in the app — only you know this exists

const STORAGE_KEYS = {
  USER_NAME:      "cc_user_name",
  SELECTED_CARDS: "cc_selected_cards",
  QUERY_LOG:      "cc_query_log",
  SAVINGS:        "cc_savings",
  CREDIT_LOG:     "cc_credit_log",
  STREAK:         "cc_streak",
};

const storage = {
  get: (key) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
};

const AMEX_CARDS = {
  amex_platinum: "Platinum Card",
  amex_gold: "Gold Card",
  amex_green: "Green Card",
  amex_bce: "Blue Cash Everyday",
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      padding: "20px 24px",
      background: "#FFFFFF",
      border: "1px solid #E2E4E8",
      borderRadius: "10px",
      borderLeft: `4px solid ${accent || "#016FD0"}`,
    }}>
      <div style={{
        fontSize: "11px", fontWeight: 600,
        color: "#8A8C8F", letterSpacing: "0.08em",
        textTransform: "uppercase", marginBottom: "8px",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "28px", fontWeight: 700,
        color: "#002663", letterSpacing: "-0.02em",
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: "12px", color: "#8A8C8F",
          marginTop: "4px", fontWeight: 400,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function QueryRow({ entry, index }) {
  const date = new Date(entry.timestamp);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "80px 1fr 100px 80px",
      gap: "12px",
      padding: "12px 16px",
      background: index % 2 === 0 ? "#F7F8FA" : "#FFFFFF",
      borderRadius: "6px",
      alignItems: "center",
      fontSize: "13px",
    }}>
      <div style={{ color: "#8A8C8F", fontWeight: 500 }}>
        {dateStr}
        <div style={{ fontSize: "11px", color: "#B0B3B8" }}>{timeStr}</div>
      </div>
      <div style={{
        color: "#1A1A1A", fontWeight: 400,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {entry.query}
      </div>
      <div>
        <span style={{
          padding: "3px 8px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: 600,
          background: entry.confirmed ? "#F0FBF4" : "#F7F8FA",
          color: entry.confirmed ? "#166534" : "#8A8C8F",
          border: `1px solid ${entry.confirmed ? "#86EFAC" : "#E2E4E8"}`,
        }}>
          {entry.confirmed ? "✓ Confirmed" : "Pending"}
        </span>
      </div>
      <div style={{
        fontWeight: 700,
        color: entry.confirmed && entry.amount_saved > 0 ? "#166534" : "#8A8C8F",
        textAlign: "right",
      }}>
        {entry.confirmed && entry.amount_saved > 0
          ? `$${parseFloat(entry.amount_saved).toFixed(2)}`
          : "—"}
      </div>
    </div>
  );
}

export default function Stats() {
  // Read all data from localStorage
  const userName     = storage.get(STORAGE_KEYS.USER_NAME) || "Unknown";
  const selectedCards= storage.get(STORAGE_KEYS.SELECTED_CARDS) || [];
  const queryLog     = storage.get(STORAGE_KEYS.QUERY_LOG) || [];
  const savings      = storage.get(STORAGE_KEYS.SAVINGS) || [];
  const creditLog    = storage.get(STORAGE_KEYS.CREDIT_LOG) || {};
  const streak       = storage.get(STORAGE_KEYS.STREAK) || { current_streak: 0, last_visit: null };

  // Compute metrics
  const totalQueries     = queryLog.length;
  const confirmedSavings = savings.filter((s) => s.confirmed);
  const totalSaved       = confirmedSavings.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const confirmRate      = totalQueries > 0
    ? Math.round((confirmedSavings.length / totalQueries) * 100)
    : 0;
  const creditsUsed      = Object.values(creditLog).filter(Boolean).length;
  const cardNames        = selectedCards.map((id) => AMEX_CARDS[id] || id).join(", ");

  // This month's savings
  const thisMonth = new Date().getMonth();
  const thisMonthSaved = confirmedSavings
    .filter((s) => new Date(s.date).getMonth() === thisMonth)
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F8FA; font-family: 'Work Sans', sans-serif; color: #1A1A1A; }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "32px",
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px",
            }}>
              <span style={{
                fontSize: "22px", fontWeight: 700, color: "#002663",
              }}>
                CardCoach
              </span>
              <span style={{
                padding: "2px 8px", background: "#016FD0",
                borderRadius: "4px", fontSize: "10px",
                fontWeight: 700, color: "#fff", letterSpacing: "0.08em",
              }}>
                STATS
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#8A8C8F" }}>
              Product metrics for <strong>{userName}</strong> ·{" "}
              Last visit: {streak.last_visit || "Never"} ·{" "}
              Cards: {cardNames || "None selected"}
            </div>
          </div>
          <a href="/" style={{
            padding: "8px 16px",
            background: "#002663", color: "#fff",
            borderRadius: "6px", fontSize: "13px",
            fontWeight: 600, textDecoration: "none",
            transition: "background 0.15s",
          }}>
            ← Back to app
          </a>
        </div>

        {/* Metric cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}>
          <StatCard
            label="Total Queries"
            value={totalQueries}
            sub="All time"
            accent="#016FD0"
          />
          <StatCard
            label="Total Saved"
            value={`$${totalSaved.toFixed(2)}`}
            sub={`$${thisMonthSaved.toFixed(2)} this month`}
            accent="#166534"
          />
          <StatCard
            label="Confirmation Rate"
            value={`${confirmRate}%`}
            sub={`${confirmedSavings.length} of ${totalQueries} used`}
            accent="#B8960C"
          />
          <StatCard
            label="Day Streak"
            value={streak.current_streak || 0}
            sub={`Last visit: ${streak.last_visit || "—"}`}
            accent="#DC2626"
          />
          <StatCard
            label="Credits Tracked"
            value={creditsUsed}
            sub="Monthly credits marked used"
            accent="#7C3AED"
          />
        </div>

        {/* North Star metric callout */}
        <div style={{
          padding: "16px 20px",
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: "10px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{
              fontSize: "11px", fontWeight: 700,
              color: "#016FD0", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: "4px",
            }}>
              North Star Metric
            </div>
            <div style={{ fontSize: "14px", color: "#002663", fontWeight: 500 }}>
              % of purchase decisions where user checks CardCoach
            </div>
          </div>
          <div style={{
            fontSize: "32px", fontWeight: 700,
            color: "#016FD0", letterSpacing: "-0.02em",
          }}>
            {confirmRate}%
          </div>
        </div>

        {/* Query history table */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid #E2E4E8",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E2E4E8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#002663" }}>
              Query History
            </div>
            <div style={{ fontSize: "12px", color: "#8A8C8F" }}>
              {totalQueries} total queries
            </div>
          </div>

          {queryLog.length === 0 ? (
            <div style={{
              padding: "40px", textAlign: "center",
              color: "#8A8C8F", fontSize: "14px",
            }}>
              No queries yet. Go use the app first.
            </div>
          ) : (
            <div style={{ padding: "8px" }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 100px 80px",
                gap: "12px",
                padding: "8px 16px",
                fontSize: "11px", fontWeight: 700,
                color: "#8A8C8F", letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                <div>Date</div>
                <div>Query</div>
                <div>Status</div>
                <div style={{ textAlign: "right" }}>Saved</div>
              </div>
              {/* Rows — most recent first */}
              {[...queryLog].reverse().map((entry, i) => (
                <QueryRow key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Raw data export */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={() => {
              const data = {
                exported_at: new Date().toISOString(),
                user: userName,
                streak,
                selected_cards: selectedCards,
                query_log: queryLog,
                savings,
                credit_log: creditLog,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `cardcoach-data-${new Date().toISOString().split("T")[0]}.json`;
              a.click();
            }}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "1px solid #E2E4E8",
              borderRadius: "6px",
              fontSize: "13px", fontWeight: 500,
              color: "#4D4F53", cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#016FD0"; e.currentTarget.style.color = "#016FD0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E4E8"; e.currentTarget.style.color = "#4D4F53"; }}
          >
            Export all data as JSON
          </button>
          <div style={{ fontSize: "11px", color: "#B0B3B8", marginTop: "8px" }}>
            Your data lives in this browser only. Export to back it up.
          </div>
        </div>

      </div>
    </>
  );
}
