const ANSWER_KEY = [
  {
    answer: "27 crore",
    takeaway: "Section 135 sets a minimum CSR obligation of 2% of the average net profit over the preceding three financial years.",
    score(value) {
      if (value === "") return { points: 0, trust: 0, lives: 0, reason: "No answer submitted." };
      const difference = Math.abs(Number(value) - 27);
      if (difference <= 0.005) return { points: 15, trust: 5, lives: 0, reason: "Exact answer." };
      if (difference <= 1) return { points: 10, trust: 0, lives: 0, reason: "Within Rs 1 crore." };
      if (difference <= 3) return { points: 5, trust: 0, lives: 0, reason: "Within Rs 3 crore." };
      return { points: 0, trust: 0, lives: 0, reason: "Outside the accepted range." };
    },
    displayAnswer(value) { return value === "" ? "No answer" : `₹${Number(value).toFixed(2)} crore`; },
  },
  {
    answer: "B",
    takeaway: "Local needs and local area preference should guide the programme, rather than a convenient but disconnected choice.",
    outcomes: [
      { points: 8, trust: 0, lives: 8000, reason: "Lawful, but ignores the needs near the plant." },
      { points: 15, trust: 10, lives: 15000, reason: "Based on local needs and local area preference." },
      { points: 5, trust: 0, lives: 0, reason: "Lawful, but offers no visible local benefit." },
      { points: 0, trust: -15, lives: 1000, reason: "Conflict of interest with the MD’s family." },
    ],
  },
  {
    answer: "A",
    takeaway: "Check eligibility, registration and delivery record. A kickback is bribery, not a CSR saving.",
    outcomes: [
      { points: 15, trust: 10, lives: 12000, reason: "Registered, proven and audited partner." },
      { points: 5, trust: -5, lives: 5000, reason: "Not eligible without CSR-1 and no track record." },
      { points: 0, trust: -15, lives: 2000, reason: "A kickback, which is bribery." },
      { points: 8, trust: 0, lives: 7000, reason: "Lawful, but weak capacity to deliver." },
    ],
  },
  {
    answer: "A",
    takeaway: "The Board must verify use of funds. Escalate discrepancies, independently check the facts and protect the remaining funds.",
    outcomes: [
      { points: 20, trust: 10, lives: 6000, reason: "Protects funds and reports to the Board." },
      { points: 0, trust: -20, lives: 0, reason: "Knowingly reports false results." },
      { points: 8, trust: -5, lives: 3000, reason: "Fixes the partner but hides the problem." },
      { points: 5, trust: -10, lives: 1000, reason: "Keeps funding a partner who misreported." },
    ],
  },
  {
    answer: "A",
    takeaway: "Transfer unspent ongoing-project funds to the prescribed account within 30 days, then use and disclose them as required.",
    outcomes: [
      { points: 15, trust: 5, lives: 5000, reason: "Follows the Unspent CSR Account rule." },
      { points: 0, trust: -20, lives: 0, reason: "Fake spending through a related party." },
      { points: 3, trust: -5, lives: 500, reason: "Wastes money just to look compliant." },
      { points: 2, trust: -10, lives: 0, reason: "Breaks the 30-day transfer rule." },
    ],
  },
  {
    answer: "A",
    takeaway: "Report verified impact honestly and complete the independent assessment when the legal threshold applies.",
    outcomes: [
      { points: 20, trust: 15, lives: 4000, reason: "Honest reporting plus required impact assessment." },
      { points: 0, trust: -15, lives: 0, reason: "Greenwashing with an inflated claim." },
      { points: 8, trust: 0, lives: 1000, reason: "Honest but hides impact information." },
      { points: 12, trust: 0, lives: 2000, reason: "Honest figure, but misses a legal requirement." },
    ],
  },
];

function scoreAnswer(roundIndex, answer) {
  const key = ANSWER_KEY[roundIndex];
  if (key.score) return key.score(answer);
  if (!answer) return { points: 0, trust: 0, lives: 0, reason: "No answer submitted." };
  return { ...key.outcomes["ABCD".indexOf(answer)] };
}

function keySummary(roundIndex) {
  const key = ANSWER_KEY[roundIndex];
  if (!key) return null;
  return { answer: key.answer, takeaway: key.takeaway };
}

function displayAnswer(roundIndex, value) {
  const key = ANSWER_KEY[roundIndex];
  return key.displayAnswer ? key.displayAnswer(value) : value;
}

module.exports = { ANSWER_KEY, scoreAnswer, keySummary, displayAnswer };
