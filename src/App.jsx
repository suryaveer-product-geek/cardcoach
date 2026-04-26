// CardCoach — Amex Edition
// Design System: True Amex brand colors #016FD0 / #002663 / #4D4F53
// Typography: Helvetica Neue stack (what Amex actually uses) + clean sans fallback
// Tone: Trust. Clarity. Zero decoration.
import { useState, useRef, useEffect } from "react";

const AMEX_CARDS = [
  {
    id: "amex_platinum",
    name: "Platinum Card",
    tagline: "The original prestige card",
    color: "#E8E0D0",
    textColor: "#1C1917",
    accentColor: "#B8960C",
    tier: "PLATINUM",
    gradient: "linear-gradient(135deg, #E8E4DC 0%, #D4CFC4 40%, #C8C2B4 70%, #B8B2A4 100%)",
    shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
  },
  {
    id: "amex_gold",
    name: "Gold Card",
    tagline: "For the ones who dine and travel",
    color: "#C9A84C",
    textColor: "#1C1917",
    accentColor: "#8B6914",
    tier: "GOLD",
    gradient: "linear-gradient(135deg, #D4A843 0%, #C49A38 40%, #B8902E 70%, #A88020 100%)",
    shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
  },
  {
    id: "amex_green",
    name: "Green Card",
    tagline: "Travel, transit, and everyday",
    color: "#4A7C59",
    textColor: "#F5F0E8",
    accentColor: "#A8D4B8",
    tier: "GREEN",
    gradient: "linear-gradient(135deg, #4A7C59 0%, #3D6B4A 40%, #2E5A3C 70%, #1E4A2C 100%)",
    shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
  },
  {
    id: "amex_bce",
    name: "Blue Cash Everyday",
    tagline: "Cash back on the everyday",
    color: "#2B5EA7",
    textColor: "#F5F0E8",
    accentColor: "#90B4E8",
    tier: "BLUE",
    gradient: "linear-gradient(135deg, #2B5EA7 0%, #1E4F98 40%, #143F84 70%, #0A2F6A 100%)",
    shimmer: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
  },
];

const SYSTEM_PROMPT = `You are a distinguished American Express benefits concierge — the most knowledgeable, discreet, and precise advisor in the world of premium card benefits.

## Your Knowledge
You have comprehensive knowledge of American Express card benefits as publicly documented:

AMEX PLATINUM:
- $200 annual airline fee credit (select one airline)
- $200 Uber Cash annually ($15/month + $20 in December)
- $240 digital entertainment credit ($20/month: Disney+, Hulu, ESPN+, NYT, Peacock, etc.)
- $155 Walmart+ membership credit
- $100 Saks Fifth Avenue credit ($50 semi-annually)
- $189 CLEAR Plus credit
- $300 Equinox credit
- Global Lounge Collection access (Centurion, Priority Pass, Delta Sky Clubs, etc.)
- Fine Hotels + Resorts program
- Global Entry/TSA PreCheck credit ($100/$85)
- Trip cancellation/interruption insurance
- Cell phone protection
- Marriott Bonvoy Gold Elite status
- Hilton Honors Gold status
- 5x points on flights booked directly with airlines or through amextravel.com
- 5x points on prepaid hotels through amextravel.com
- 1x on all other purchases

AMEX GOLD:
- $120 dining credit ($10/month at Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, Milk Bar, select restaurants)
- $120 Uber Cash ($10/month)
- $100 hotel credit through The Hotel Collection (2+ night stay)
- $84 Dunkin' credit ($7/month)
- Global Entry/TSA PreCheck credit
- Trip delay insurance
- Baggage insurance
- 4x points at restaurants worldwide
- 4x points at U.S. supermarkets (up to $25,000/year)
- 3x points on flights booked directly or amextravel.com
- 1x on all other purchases

AMEX GREEN:
- $189 CLEAR Plus credit
- $100 LoungeBuddy credit
- Trip delay insurance
- 3x points on travel (including transit, hotels, flights, rideshare)
- 3x points at restaurants worldwide
- 1x on all other purchases

AMEX BLUE CASH EVERYDAY:
- $84 Disney Bundle credit ($7/month)
- $15/month Home Chef credit
- 3% cash back at U.S. supermarkets (up to $6,000/year)
- 3% cash back at U.S. online retail purchases (up to $6,000/year)  
- 3% cash back at U.S. gas stations (up to $6,000/year)
- 1% cash back on other purchases

## Strict Rules
1. Only reference benefits listed above — never invent or extrapolate
2. When uncertain about a current amount or status, say so clearly and direct them to americanexpress.com
3. Give ONE clear recommendation. Don't hedge excessively.
4. If a purchase doesn't trigger any special benefit, say so honestly — "No specific benefit applies here, use your highest everyday earn rate"
5. Keep responses under 100 words unless detail is requested
6. Never use bullet point soup — write in elegant, flowing prose

## Response Format for "which card" queries:
RECOMMENDATION: [Card name] — [one precise reason]
BENEFIT: [The specific benefit that applies, with exact amount if known]
NOTE: [One thing to verify or be aware of — keep it short]

## Tone
You are the financial equivalent of a Michelin-starred maître d'. Warm but precise. Confident but never arrogant. You make the user feel intelligent for asking.`;

function PhysicalCard({ card, selected, anySelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const rotateX = hovered && !selected ? (mousePos.y - 0.5) * -10 : 0;
  const rotateY = hovered && !selected ? (mousePos.x - 0.5) * 10 : 0;

  // Faded = another card is selected but not this one
  const faded = anySelected && !selected;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onMouseMove={handleMouseMove}
      style={{
        width: "100%",
        aspectRatio: "1.586",
        borderRadius: "12px",
        background: card.gradient,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${
          selected ? 1.06 : hovered ? 1.02 : 1
        })`,
        transition: "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease, filter 0.4s ease",
        boxShadow: selected
          ? `0 28px 64px rgba(0,0,0,0.32), 0 0 0 2.5px ${card.accentColor}, 0 0 0 5px ${card.accentColor}33`
          : hovered
          ? "0 16px 40px rgba(0,0,0,0.18)"
          : "0 6px 20px rgba(0,0,0,0.1)",
        opacity: faded ? 0.38 : 1,
        filter: faded ? "saturate(0.4)" : "saturate(1)",
        zIndex: selected ? 2 : 1,
      }}
    >
      {/* Shimmer effect */}
      <div style={{
        position: "absolute", inset: 0,
        background: card.shimmer,
        backgroundSize: "200% 100%",
        animation: hovered ? "shimmer 1.5s infinite" : "none",
        opacity: 0.6,
        pointerEvents: "none",
      }} />

      {/* Card texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        opacity: 0.4,
        pointerEvents: "none",
      }} />

      {/* Selected indicator */}
      <div style={{
        position: "absolute", top: 10, right: 10,
        display: "flex", alignItems: "center", gap: "6px",
        opacity: selected ? 1 : 0,
        transform: selected ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.8)",
        transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
      }}>
        <div style={{
          padding: "3px 8px",
          borderRadius: "20px",
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(8px)",
          fontFamily: "'Geist Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.14em",
          color: "#fff",
        }}>
          ACTIVE
        </div>
        <div style={{
          width: "22px", height: "22px",
          borderRadius: "50%",
          background: card.accentColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px",
          color: card.textColor,
          fontWeight: 700,
          boxShadow: `0 2px 8px ${card.accentColor}88`,
        }}>✓</div>
      </div>

      {/* Card content */}
      <div style={{
        position: "absolute", inset: 0,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{
            fontSize: "9px",
            fontFamily: "var(--font)",
            letterSpacing: "0.18em",
            color: card.textColor,
            opacity: 0.6,
            fontWeight: 600,
          }}>
            {card.tier}
          </div>
          {/* Amex blue box mark */}
          <div style={{
            width: "26px", height: "26px",
            borderRadius: "4px",
            border: `1.5px solid ${card.textColor}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px",
            color: card.textColor,
            opacity: 0.8,
            fontFamily: "var(--font)",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}>AX</div>
        </div>

        {/* Chip */}
        <div style={{
          width: "28px", height: "20px",
          borderRadius: "3px",
          background: `linear-gradient(135deg, ${card.accentColor}88, ${card.accentColor}44)`,
          border: `1px solid ${card.accentColor}66`,
        }} />

        <div>
          <div style={{
            fontFamily: "var(--font)",
            fontSize: "14px",
            fontWeight: 700,
            color: card.textColor,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}>
            {card.name}
          </div>
          <div style={{
            fontFamily: "var(--font)",
            fontSize: "8px",
            color: card.textColor,
            opacity: 0.5,
            letterSpacing: "0.14em",
            marginTop: "3px",
            fontWeight: 500,
          }}>
            AMERICAN EXPRESS
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({ role, content, isStreaming, savingEntry, onConfirm, amountValue, onAmountChange, msg = {} }) {
  return (
    <div style={{
      padding: "20px 0",
      borderBottom: "1px solid var(--amex-border)",
      animation: "fadeUp 0.3s ease forwards",
    }}>
      <div style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.07em",
        color: role === "user" ? "var(--amex-blue)" : "var(--amex-text-muted)",
        marginBottom: "8px",
        textTransform: "uppercase",
      }}>
        {role === "user" ? "You" : "CardCoach"}
      </div>
      <div style={{
        fontSize: role === "assistant" ? "15px" : "14px",
        lineHeight: "1.75",
        color: msg.isError ? "#DC2626" : role === "user" ? "var(--amex-text-secondary)" : "var(--amex-text-primary)",
        fontWeight: 400,
        whiteSpace: "pre-wrap",
        background: msg.isError ? "#FEF2F2" : "transparent",
        padding: msg.isError ? "12px 14px" : "0",
        borderRadius: msg.isError ? "8px" : "0",
        border: msg.isError ? "1px solid #FECACA" : "none",
      }}>
        {content}
        {isStreaming && (
          <span style={{
            display: "inline-block",
            width: "2px", height: "15px",
            background: "var(--amex-blue)",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 1s infinite",
          }} />
        )}
      </div>

      {/* Savings confirmation — only on assistant messages, not streaming */}
      {role === "assistant" && !isStreaming && savingEntry && !savingEntry.confirmed && (
        <div style={{
          marginTop: "14px",
          padding: "12px 14px",
          background: "#F0F7FF",
          border: "1px solid #C8E0F8",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "popIn 0.25s ease",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "13px", color: "var(--amex-navy)", fontWeight: 500, flex: 1, minWidth: "160px" }}>
            Did you use this recommendation?
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
                fontSize: "13px", color: "var(--amex-text-muted)", pointerEvents: "none",
              }}>$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amountValue || ""}
                onChange={(e) => onAmountChange(e.target.value)}
                style={{
                  width: "90px",
                  padding: "7px 10px 7px 22px",
                  border: "1px solid var(--amex-border)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "var(--amex-text-primary)",
                  background: "#FFFFFF",
                  fontFamily: "var(--font)",
                }}
              />
            </div>
            <button
              onClick={onConfirm}
              style={{
                padding: "7px 16px",
                background: "var(--amex-blue)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--amex-navy)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--amex-blue)"}
            >
              I used this ✓
            </button>
          </div>
        </div>
      )}

      {/* Confirmed saving badge */}
      {role === "assistant" && savingEntry?.confirmed && (
        <div style={{
          marginTop: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          background: "#F0FBF4",
          border: "1px solid #86EFAC",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#166534",
          animation: "popIn 0.2s ease",
        }}>
          ✓ Saved ${parseFloat(savingEntry.amount || 0).toFixed(2)} logged
        </div>
      )}
    </div>
  );
}

function SavingsBanner({ totalSaved, confirmedCount }) {
  if (confirmedCount === 0) return null;
  return (
    <div style={{
      background: "var(--amex-navy)",
      padding: "10px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      animation: "slideIn 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4ADE80",
            boxShadow: "0 0 6px #4ADE80",
          }} />
          <span style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
          }}>
            SAVINGS TRACKER
          </span>
        </div>
        <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.15)" }} />
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
          {confirmedCount} recommendation{confirmedCount > 1 ? "s" : ""} used this month
        </span>
      </div>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: "4px",
        animation: "countUp 0.4s ease",
      }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>SAVED</span>
        <span style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#4ADE80",
          letterSpacing: "-0.02em",
        }}>
          ${totalSaved.toFixed(2)}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>this month</span>
      </div>
    </div>
  );
}

function BenefitCalendar({ selectedCards, creditLog, toggleCredit }) {
  const months = getLast3Months();

  if (selectedCards.length === 0) {
    return (
      <div style={{ padding: "24px 20px", color: "var(--amex-text-muted)", fontSize: "13px" }}>
        Select cards to see your benefit calendar.
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
      {selectedCards.map((cardId) => {
        const card = AMEX_CARDS.find((c) => c.id === cardId);
        const credits = MONTHLY_CREDITS[cardId] || [];
        if (!credits.length) return null;

        return (
          <div key={cardId} style={{ marginBottom: "24px", animation: "fadeUp 0.3s ease" }}>
            {/* Card header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "12px",
            }}>
              <div style={{
                width: "10px", height: "10px", borderRadius: "2px",
                background: card.gradient,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: "12px", fontWeight: 700,
                color: "var(--amex-navy)", letterSpacing: "0.04em",
              }}>
                {card.name.toUpperCase()}
              </span>
            </div>

            {/* Month columns header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 60px 60px",
              gap: "6px",
              marginBottom: "6px",
              paddingRight: "2px",
            }}>
              <div style={{ fontSize: "10px", color: "var(--amex-text-muted)", fontWeight: 600 }}>
                BENEFIT
              </div>
              {months.map((m) => (
                <div key={m.label} style={{
                  fontSize: "10px",
                  fontWeight: m.isCurrent ? 700 : 500,
                  color: m.isCurrent ? "var(--amex-blue)" : "var(--amex-text-muted)",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                }}>
                  {m.label.toUpperCase()}
                </div>
              ))}
            </div>

            {/* Credit rows */}
            {credits.map((credit) => (
              <div key={credit.label} style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 60px 60px",
                gap: "6px",
                marginBottom: "5px",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--amex-text-primary)" }}>
                    {credit.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--amex-text-muted)" }}>
                    ${credit.amount}{credit.note ? ` · ${credit.note}` : ""}{credit.cadence === "annual" ? " · annual" : credit.cadence === "semi-annual" ? " · semi-ann." : "/mo"}
                  </div>
                </div>
                {months.map((m) => {
                  const key = `${cardId}-${credit.label}-${m.monthIndex}-${m.year}`;
                  const isUsed = creditLog[key];
                  const isSkippable = credit.cadence === "annual" && !credit.months?.includes(m.monthIndex);
                  const isSemiSkippable = credit.cadence === "semi-annual" && !credit.months?.includes(m.monthIndex);

                  if (isSkippable || isSemiSkippable) {
                    return (
                      <div key={m.label} style={{
                        width: "28px", height: "28px", margin: "0 auto",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: "var(--amex-border)",
                      }}>—</div>
                    );
                  }

                  return (
                    <button
                      key={m.label}
                      onClick={() => toggleCredit(key)}
                      title={isUsed ? "Mark unused" : "Mark as used"}
                      style={{
                        width: "28px", height: "28px",
                        borderRadius: "6px",
                        border: isUsed ? "1.5px solid #86EFAC" : "1.5px solid var(--amex-border)",
                        background: isUsed ? "#F0FBF4" : m.isCurrent ? "#F7F8FA" : "transparent",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px",
                        margin: "0 auto",
                        transition: "all 0.15s ease",
                        color: isUsed ? "#166534" : "var(--amex-text-muted)",
                      }}
                      onMouseEnter={(e) => { if (!isUsed) e.currentTarget.style.borderColor = "var(--amex-blue)"; }}
                      onMouseLeave={(e) => { if (!isUsed) e.currentTarget.style.borderColor = "var(--amex-border)"; }}
                    >
                      {isUsed ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            ))}

            <div style={{ height: "1px", background: "var(--amex-border)", marginTop: "16px" }} />
          </div>
        );
      })}

      <div style={{
        fontSize: "11px", color: "var(--amex-text-muted)",
        marginTop: "4px", lineHeight: 1.6,
      }}>
        Tap a cell to mark a credit as used. Resets are not tracked automatically — update manually each month.
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }) {
  const suggestions = [
    { label: "Dining tonight", query: "I'm dining at a nice restaurant tonight. Which card maximizes my return?" },
    { label: "Booking a flight", query: "I'm booking an international flight. Which card should I use?" },
    { label: "Grocery run", query: "Weekly grocery shopping at a U.S. supermarket. Best card?" },
    { label: "Uber ride", query: "Taking an Uber. Any benefits I should know about?" },
    { label: "Hotel stay", query: "Booking a 3-night hotel stay. What benefits apply?" },
    { label: "Monthly credits", query: "What monthly credits am I likely missing or forgetting?" },
  ];

  return (
    <div style={{ padding: "36px 0 20px", animation: "fadeUp 0.4s ease" }}>
      <div style={{
        fontSize: "24px",
        fontWeight: 700,
        color: "var(--amex-navy)",
        lineHeight: 1.3,
        marginBottom: "6px",
      }}>
        What are you purchasing today?
      </div>
      <div style={{
        fontSize: "14px",
        color: "var(--amex-text-muted)",
        fontWeight: 400,
        marginBottom: "28px",
      }}>
        Your concierge will recommend the optimal card.
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
      }}>
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.query)}
            style={{
              padding: "14px 16px",
              background: "var(--amex-light-gray)",
              border: "1px solid var(--amex-border)",
              borderRadius: "8px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.18s ease",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--amex-text-primary)",
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--amex-blue)";
              e.currentTarget.style.background = "#F0F7FF";
              e.currentTarget.style.color = "var(--amex-navy)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--amex-border)";
              e.currentTarget.style.background = "var(--amex-light-gray)";
              e.currentTarget.style.color = "var(--amex-text-primary)";
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Monthly credits per card — used by the benefit calendar
const MONTHLY_CREDITS = {
  amex_platinum: [
    { label: "Uber Cash", amount: 15, note: "$20 in Dec" },
    { label: "Digital Entertainment", amount: 20 },
    { label: "Saks Credit", amount: 50, cadence: "semi-annual", months: [0, 6] },
  ],
  amex_gold: [
    { label: "Dining Credit", amount: 10 },
    { label: "Uber Cash", amount: 10 },
    { label: "Dunkin'", amount: 7 },
  ],
  amex_green: [
    { label: "CLEAR Plus", amount: 189, cadence: "annual", months: [0] },
    { label: "LoungeBuddy", amount: 100, cadence: "annual", months: [0] },
  ],
  amex_bce: [
    { label: "Disney Bundle", amount: 7 },
    { label: "Home Chef", amount: 15 },
  ],
};

// Returns last 3 months as { label, monthIndex, year }
function getLast3Months() {
  const now = new Date();
  return [2, 1, 0].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return {
      label: d.toLocaleString("default", { month: "short" }),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      isCurrent: offset === 0,
    };
  });
}

// ─── STORAGE LAYER ────────────────────────────────────────────────────────────
// System 1: localStorage persistence
// Keys are prefixed with "cc_" to avoid collisions

const STORAGE_KEYS = {
  USER_NAME:     "cc_user_name",
  SELECTED_CARDS:"cc_selected_cards",
  QUERY_LOG:     "cc_query_log",
  SAVINGS:       "cc_savings",
  CREDIT_LOG:    "cc_credit_log",
  STREAK:        "cc_streak",
};

const storage = {
  get: (key) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// Update streak — call on every app load
function updateStreak() {
  const today = new Date().toISOString().split("T")[0];
  const streak = storage.get(STORAGE_KEYS.STREAK) || { last_visit: null, current_streak: 0 };
  if (streak.last_visit === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = {
    last_visit: today,
    current_streak: streak.last_visit === yesterday ? streak.current_streak + 1 : 1,
  };
  storage.set(STORAGE_KEYS.STREAK, newStreak);
  return newStreak;
}

// Greeting based on time of day
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
// ──────────────────────────────────────────────────────────────────────────────

export default function CardCoachLuxury() {
  // Hydrate all state from localStorage on first load
  const [userName, setUserName] = useState(() => storage.get(STORAGE_KEYS.USER_NAME) || "");
  const [showNamePrompt, setShowNamePrompt] = useState(() => !storage.get(STORAGE_KEYS.USER_NAME));
  const [nameInput, setNameInput] = useState("");
  const [selectedCards, setSelectedCards] = useState(() => storage.get(STORAGE_KEYS.SELECTED_CARDS) || []);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("cards");
  const [savings, setSavings] = useState(() => storage.get(STORAGE_KEYS.SAVINGS) || []);
  const [pendingSaving, setPendingSaving] = useState(null);
  const [amountInputs, setAmountInputs] = useState({});
  const [creditLog, setCreditLog] = useState(() => storage.get(STORAGE_KEYS.CREDIT_LOG) || {});
  const [streak, setStreak] = useState(() => updateStreak());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist to localStorage on every change
  useEffect(() => { storage.set(STORAGE_KEYS.SELECTED_CARDS, selectedCards); }, [selectedCards]);
  useEffect(() => { storage.set(STORAGE_KEYS.SAVINGS, savings); }, [savings]);
  useEffect(() => { storage.set(STORAGE_KEYS.CREDIT_LOG, creditLog); }, [creditLog]);

  const totalSavedThisMonth = savings
    .filter((s) => s.confirmed && new Date(s.date).getMonth() === new Date().getMonth())
    .reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

  const confirmedCount = savings.filter((s) => s.confirmed).length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const toggleCard = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getSelectedCardNames = () =>
    selectedCards.map((id) => AMEX_CARDS.find((c) => c.id === id)?.name).filter(Boolean).join(", ");

  const sendMessage = async (overrideInput) => {
    const text = overrideInput || input;
    if (!text.trim() || loading) return;
    if (selectedCards.length === 0) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Please select at least one card from your wallet before I can make a recommendation.",
      }]);
      setInput("");
      return;
    }

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");

    const cardContext = `The member holds the following American Express cards: ${getSelectedCardNames()}.`;
    const contextualSystem = `${SYSTEM_PROMPT}\n\n## Member's Portfolio\n${cardContext}`;
    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: contextualSystem, messages: apiMessages }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullText += parsed.delta.text;
              setStreamingText(fullText);
            }
          } catch {}
        }
      }

      if (!fullText.trim()) throw new Error("empty_response");

      const finalMsg = { role: "assistant", content: fullText, id: Date.now() };
      setMessages((prev) => [...prev, finalMsg]);

      // Log to localStorage
      const log = storage.get(STORAGE_KEYS.QUERY_LOG) || [];
      log.push({
        id: finalMsg.id,
        query: text.slice(0, 120),
        response: fullText.slice(0, 300),
        timestamp: new Date().toISOString(),
        confirmed: false,
        amount_saved: 0,
      });
      storage.set(STORAGE_KEYS.QUERY_LOG, log);

      setSavings((prev) => [...prev, {
        id: finalMsg.id,
        query: text.slice(0, 60),
        amount: "",
        date: new Date().toISOString(),
        confirmed: false,
      }]);
      setStreamingText("");

    } catch (err) {
      setStreamingText("");

      let userMessage = "";
      if (err.message === "empty_response") {
        userMessage = "The AI returned an empty response. The model may be overloaded — please wait 30 seconds and try again.";
      } else if (err.message?.includes("503") || err.message?.includes("UNAVAILABLE")) {
        userMessage = "Google's AI is experiencing high demand right now. Please try again in a moment.";
      } else if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        userMessage = "No internet connection detected. Please check your network and try again.";
      } else {
        userMessage = `Something went wrong. Please try again. (${err.message || "Unknown error"})`;
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠️ ${userMessage}`,
        isError: true,
        id: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const saveName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    storage.set(STORAGE_KEYS.USER_NAME, trimmed);
    setShowNamePrompt(false);
  };

  const confirmSaving = (msgId) => {
    const amount = amountInputs[msgId] || "0";
    setSavings((prev) => {
      const updated = prev.map((s) =>
        s.id === msgId ? { ...s, confirmed: true, amount } : s
      );
      // Also persist query log entry
      const entry = updated.find((s) => s.id === msgId);
      const log = storage.get(STORAGE_KEYS.QUERY_LOG) || [];
      const existing = log.find((l) => l.id === msgId);
      if (existing) {
        existing.confirmed = true;
        existing.amount_saved = parseFloat(amount) || 0;
        storage.set(STORAGE_KEYS.QUERY_LOG, log);
      }
      return updated;
    });
  };

  const toggleCredit = (key) => {
    setCreditLog((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #FFFFFF; }
        :root {
          --amex-blue: #016FD0; --amex-navy: #002663; --amex-gray: #4D4F53;
          --amex-light-gray: #F7F8FA; --amex-border: #E2E4E8;
          --amex-text-primary: #1A1A1A; --amex-text-secondary: #4D4F53;
          --amex-text-muted: #8A8C8F; --amex-white: #FFFFFF;
          --font: 'Work Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.95)} 100%{opacity:1;transform:scale(1)} }
        @keyframes countUp { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--amex-border); border-radius: 4px; }
        textarea { outline: none; font-family: var(--font); }
        button { outline: none; font-family: var(--font); }
        input { outline: none; font-family: var(--font); }
      `}</style>

      {/* ── Name Prompt Modal — shown only on first visit ── */}
      {showNamePrompt && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,38,99,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "12px",
            padding: "36px 32px",
            width: "380px",
            boxShadow: "0 24px 64px rgba(0,38,99,0.2)",
            animation: "modalIn 0.3s ease",
          }}>
            <div style={{
              display: "inline-block",
              padding: "3px 10px",
              background: "var(--amex-blue)",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.08em",
              marginBottom: "16px",
            }}>AMEX</div>
            <div style={{
              fontSize: "22px", fontWeight: 700,
              color: "var(--amex-navy)", marginBottom: "8px",
            }}>
              Welcome to CardCoach
            </div>
            <div style={{
              fontSize: "14px", color: "var(--amex-text-muted)",
              marginBottom: "24px", lineHeight: 1.6,
            }}>
              Google Maps for your spending. What should we call you?
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Your first name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveName(nameInput); }}
              style={{
                width: "100%", padding: "12px 14px",
                border: "1px solid var(--amex-border)",
                borderRadius: "8px", fontSize: "15px",
                color: "var(--amex-text-primary)",
                marginBottom: "12px", background: "var(--amex-light-gray)",
              }}
            />
            <button
              onClick={() => saveName(nameInput)}
              style={{
                width: "100%", padding: "12px",
                background: "var(--amex-blue)", color: "#fff",
                border: "none", borderRadius: "8px",
                fontSize: "14px", fontWeight: 600,
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--amex-navy)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--amex-blue)"}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      <div style={{
        height: "100vh",
        display: "flex",
        background: "#FFFFFF",
        fontFamily: "var(--font)",
        overflow: "hidden",
        fontSize: "14px",
        color: "var(--amex-text-primary)",
      }}>

        {/* LEFT SIDEBAR — Card Wallet */}
        <div style={{
          width: sidebarOpen ? "288px" : "0px",
          minWidth: sidebarOpen ? "288px" : "0px",
          borderRight: "1px solid var(--amex-border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          background: "#FFFFFF",
        }}>
          <div style={{
            padding: "20px 20px 0",
            borderBottom: "1px solid var(--amex-border)",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--amex-text-muted)",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}>
              My Cards
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--amex-navy)",
              lineHeight: 1.2,
              marginBottom: "14px",
            }}>
              {sidebarTab === "cards" ? "Select cards to activate" : "Benefit Calendar"}
            </div>

            {/* Tab switcher */}
            <div style={{
              display: "flex",
              borderBottom: "none",
              gap: "0",
              marginBottom: "-1px",
            }}>
              {["cards", "benefits"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSidebarTab(tab)}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: sidebarTab === tab ? "2px solid var(--amex-blue)" : "2px solid transparent",
                    fontSize: "13px",
                    fontWeight: sidebarTab === tab ? 600 : 400,
                    color: sidebarTab === tab ? "var(--amex-blue)" : "var(--amex-text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "var(--font)",
                    letterSpacing: "0.01em",
                    paddingLeft: tab === "cards" ? "0" : "16px",
                  }}
                >
                  {tab === "cards" ? "Wallet" : "Credits"}
                </button>
              ))}
            </div>
          </div>

          {sidebarTab === "cards" ? (
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}>
              <div style={{ fontSize: "12px", color: "var(--amex-text-muted)", marginBottom: "2px" }}>
                {selectedCards.length === 0 ? "No cards selected" : `${selectedCards.length} card${selectedCards.length > 1 ? "s" : ""} active`}
              </div>
              {AMEX_CARDS.map((card, i) => (
                <div key={card.id} style={{ animation: `fadeUp 0.3s ease ${i * 0.07}s both` }}>
                  <PhysicalCard
                    card={card}
                    selected={selectedCards.includes(card.id)}
                    anySelected={selectedCards.length > 0}
                    onClick={() => toggleCard(card.id)}
                  />
                  <div style={{ marginTop: "6px", paddingLeft: "2px" }}>
                    <div style={{ fontSize: "12px", color: "var(--amex-text-muted)", fontWeight: 400 }}>
                      {card.tagline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <BenefitCalendar
              selectedCards={selectedCards}
              creditLog={creditLog}
              toggleCredit={toggleCredit}
            />
          )}

          {/* API Key section */}
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--amex-border)",
            background: "var(--amex-light-gray)",
          }}>
            <button
              onClick={() => setShowKeyInput((s) => !s)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#FFFFFF",
                border: `1px solid ${apiKey ? "#016FD0" : "var(--amex-border)"}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: apiKey ? "var(--amex-blue)" : "var(--amex-text-muted)",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s",
              }}
            >
              <span>API KEY</span>
              <span style={{
                fontSize: "11px",
                fontWeight: 500,
                color: apiKey ? "#22C55E" : "var(--amex-text-muted)",
              }}>
                {apiKey ? "● Connected" : "○ Not set"}
              </span>
            </button>
            {showKeyInput && (
              <div style={{ marginTop: "8px", animation: "fadeUp 0.2s ease" }}>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") setShowKeyInput(false); }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid var(--amex-border)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--amex-text-primary)",
                  }}
                />
                <div style={{
                  fontSize: "11px",
                  color: "var(--amex-text-muted)",
                  marginTop: "5px",
                  lineHeight: 1.5,
                }}>
                  Stored in session only.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}>

          {/* Top bar */}
          <div style={{
            padding: "16px 28px",
            borderBottom: "1px solid var(--amex-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FFFFFF",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                style={{
                  width: "34px", height: "34px",
                  background: "transparent",
                  border: "1px solid var(--amex-border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "4px",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--amex-blue)"; e.currentTarget.style.background = "#F0F7FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--amex-border)"; e.currentTarget.style.background = "transparent"; }}
              >
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: "14px", height: "1.5px", background: "var(--amex-gray)", borderRadius: "2px" }} />
                ))}
              </button>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontSize: "18px", fontWeight: 700,
                    color: "var(--amex-navy)", letterSpacing: "-0.01em",
                  }}>
                    {userName ? `${getGreeting()}, ${userName}` : "CardCoach"}
                  </span>
                  <span style={{
                    padding: "2px 8px", background: "var(--amex-blue)",
                    borderRadius: "4px", fontSize: "10px", fontWeight: 600,
                    color: "#FFFFFF", letterSpacing: "0.06em",
                  }}>AMEX</span>
                </div>
                <div style={{
                  fontSize: "12px", color: "var(--amex-text-muted)",
                  fontWeight: 400, marginTop: "1px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span>Google Maps for your spending</span>
                  {streak.current_streak > 1 && (
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--amex-blue)" }}>
                      🔥 {streak.current_streak} day streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedCards.length > 0 && (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {selectedCards.map((id) => {
                  const card = AMEX_CARDS.find((c) => c.id === id);
                  return (
                    <div key={id} style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      background: "var(--amex-light-gray)",
                      border: "1px solid var(--amex-border)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--amex-navy)",
                      letterSpacing: "0.04em",
                    }}>
                      {card.tier}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Savings Banner */}
          <SavingsBanner totalSaved={totalSavedThisMonth} confirmedCount={confirmedCount} />

          {/* Messages area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 28px",
            background: "#FFFFFF",
          }}>
            {messages.length === 0 && !streamingText ? (
              <EmptyState onSuggestion={(q) => { setInput(q); setTimeout(() => sendMessage(q), 50); }} />
            ) : (
              <div style={{ paddingBottom: "120px" }}>
                {messages.map((msg, i) => {
                  const savingEntry = msg.role === "assistant"
                    ? savings.find((s) => s.id === msg.id)
                    : null;
                  return (
                    <Message
                      key={i}
                      role={msg.role}
                      content={msg.content}
                      msg={msg}
                      savingEntry={savingEntry}
                      onConfirm={() => confirmSaving(msg.id)}
                      amountValue={amountInputs[msg.id] || ""}
                      onAmountChange={(val) => setAmountInputs((prev) => ({ ...prev, [msg.id]: val }))}
                    />
                  );
                })}
                {streamingText && (
                  <Message role="assistant" content={streamingText} isStreaming />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div style={{
            padding: "16px 28px 24px",
            background: "linear-gradient(to top, #FFFFFF 75%, transparent)",
            borderTop: "1px solid var(--amex-border)",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              background: "var(--amex-light-gray)",
              border: "1px solid var(--amex-border)",
              borderRadius: "8px",
              padding: "12px 14px",
              transition: "border-color 0.2s",
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={
                  selectedCards.length === 0
                    ? "Select a card from your wallet to begin..."
                    : "Describe your purchase or ask about a benefit..."
                }
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "var(--amex-text-primary)",
                  fontSize: "15px",
                  fontWeight: 400,
                  resize: "none",
                  lineHeight: "1.5",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: loading || !input.trim() ? "var(--amex-border)" : "var(--amex-blue)",
                  color: loading || !input.trim() ? "var(--amex-text-muted)" : "#FFFFFF",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 600,
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) e.currentTarget.style.background = "var(--amex-navy)";
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) e.currentTarget.style.background = "var(--amex-blue)";
                }}
              >
                {loading ? "···" : "Send"}
              </button>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              padding: "0 2px",
            }}>
              <div style={{
                fontSize: "11px",
                color: "var(--amex-text-muted)",
                fontWeight: 400,
              }}>
                Based on publicly documented Amex benefits. Verify at americanexpress.com
              </div>
              <div style={{
                fontSize: "11px",
                color: "var(--amex-text-muted)",
                fontWeight: 400,
              }}>
                Enter ↵ to send
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
