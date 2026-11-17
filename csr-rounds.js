const ROUND_SECONDS = 90;
const TOTAL_TEAMS = 8;

const ROUNDS = [
  {
    title: "The CSR Obligation",
    question: "Using Section 135, what is the minimum amount Udaan Industries must spend on CSR in FY 2023–24? Enter your answer in Rs crore.",
    clue: "Udaan’s net profits were Rs 1,200 crore in FY 2020–21, Rs 1,350 crore in FY 2021–22 and Rs 1,500 crore in FY 2022–23. The law requires at least 2% of the average net profit of the three preceding financial years.",
  },
  {
    title: "Choosing the Focus",
    question: "Where should most of Udaan’s CSR budget go?",
    clue: "Education, differently abled and livelihood received Rs 13,209 crore (44%); health and sanitation Rs 8,739 crore (29%); environment Rs 2,921 crore (10%); and rural development Rs 2,005 crore (7%). Maharashtra received Rs 5,497 crore — over 18% of all CSR money.",
    options: [
      "Follow the national trend and put most of it into education in Pune city schools",
      "Follow the Sukhapur needs survey: safe drinking water, the health centre and girls’ education near the plant",
      "Give the full amount to the PM’s National Relief Fund to keep it simple",
      "Fund a new school run by the Managing Director’s family trust",
    ],
  },
  {
    title: "Picking the Partner",
    question: "Which implementing agency should run the Sukhapur water and health project?",
    clue: "Companies ran 51,966 CSR projects in FY 2022–23, mostly through outside agencies. Since April 2021, an implementing agency must be registered with the Ministry of Corporate Affairs through Form CSR-1.",
    options: [
      "An NGO with CSR-1 registration, 8 years of water projects and audited accounts, costing 6% more",
      "The cheapest NGO, registered 3 months ago, with no CSR-1 and no track record",
      "An NGO suggested by a local politician, which offers to return 5% as a facilitation fee",
      "Udaan’s new in-house foundation, which has no field staff yet",
    ],
  },
  {
    title: "The Field Check",
    question: "After six months, the NGO reports 5,000 households with clean water. Your field visit finds only 2,100 working connections. What do you do?",
    clue: "The CSR Rules require the Board to satisfy itself that CSR funds were used for the approved purpose, and the CFO must certify it.",
    options: [
      "Hold the next payment, order an independent audit, recover misused money and report to the Board",
      "Accept the NGO’s figure because it looks good in the annual report",
      "Quietly switch to a new NGO without telling the Board",
      "Keep paying, but warn the NGO informally",
    ],
  },
  {
    title: "The Unspent Money",
    question: "On 31 March 2024, Rs 5 crore of the three-year water project is still unspent. What do you do?",
    clue: "For an ongoing project, unspent money must go to an Unspent CSR Account within 30 days and be used within three financial years.",
    options: [
      "Move Rs 5 crore to an Unspent CSR Account within 30 days, use it on the project within three years and disclose it in the Board report",
      "Pay Rs 5 crore to the MD’s family trust in the last week of March and show it as spent",
      "Spend it in one week on a celebrity CSR event so the report shows no unspent money",
      "Keep it in the company’s bank account and explain it next year",
    ],
  },
  {
    title: "The Annual Report",
    question: "Marketing wants the headline “Udaan transformed 1 lakh lives.” The verified count is 42,000 people. What goes into the annual report?",
    clue: "An average CSR obligation of Rs 10 crore or more requires an independent impact assessment for projects of Rs 1 crore or more. Top FY 2022–23 spenders included HDFC Bank (Rs 803.15 crore), TCS (Rs 774.44 crore) and Reliance Industries (Rs 743.40 crore).",
    options: [
      "Report the verified 42,000, commission an independent impact assessment and publish it with the annual report",
      "Publish “1 lakh lives transformed” with glossy photos",
      "Report only the money spent, with no beneficiary numbers",
      "Report 42,000 but skip the impact assessment to save cost",
    ],
  },
];
