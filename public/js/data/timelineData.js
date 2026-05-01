/**
 * Timeline data: key milestones in Indian electoral history.
 * Each entry: id, year, title, description, icon (emoji)
 */
const TIMELINE_DATA = [
  { id: 1, year: '1950', title: 'Election Commission Established', description: 'The Election Commission of India was established on 25th January 1950, one day before India became a Republic. Sukumar Sen became the first Chief Election Commissioner.', icon: '🏛️' },
  { id: 2, year: '1951-52', title: 'First General Elections', description: 'India conducted its first-ever general elections — the largest democratic exercise in history at that time. Over 17 crore voters were eligible, with 45% turnout.', icon: '🗳️' },
  { id: 3, year: '1962', title: 'Third General Elections', description: 'The use of ballot boxes and paper ballots continued. Election logistics expanded significantly across the growing nation.', icon: '📦' },
  { id: 4, year: '1967', title: 'First Opposition Wins', description: 'For the first time, several states elected non-Congress governments, marking the beginning of multi-party democracy in India.', icon: '🔄' },
  { id: 5, year: '1982', title: 'First Use of EVMs', description: 'Electronic Voting Machines were used for the first time in the North Paravur Assembly constituency of Kerala, revolutionizing the voting process.', icon: '💻' },
  { id: 6, year: '1985', title: 'Anti-Defection Law', description: 'The 52nd Constitutional Amendment introduced the anti-defection law (Tenth Schedule), penalizing legislators who switch parties after election.', icon: '⚖️' },
  { id: 7, year: '1988', title: 'Voting Age Lowered to 18', description: 'The 61st Constitutional Amendment reduced the voting age from 21 to 18 years, adding millions of young voters to the electorate.', icon: '🧑' },
  { id: 8, year: '1989', title: 'Multi-Member Commission', description: 'For the first time, two additional Election Commissioners were appointed, making the ECI a multi-member body.', icon: '👥' },
  { id: 9, year: '1993', title: 'Panchayati Raj Elections', description: 'The 73rd and 74th Amendments mandated regular elections to Panchayats and Municipalities with 33% reservation for women.', icon: '🏘️' },
  { id: 10, year: '2003', title: 'Full EVM Implementation', description: 'All state and national elections moved to EVMs completely, eliminating paper ballots and significantly reducing booth capturing and fraud.', icon: '✅' },
  { id: 11, year: '2009', title: 'Largest Election Ever', description: 'The 2009 Lok Sabha election had 71.7 crore eligible voters across 543 constituencies — the largest democratic exercise in world history.', icon: '🌍' },
  { id: 12, year: '2010', title: 'NRI Voting Rights', description: 'The Representation of People (Amendment) Act allowed Non-Resident Indians to register as voters and participate in elections.', icon: '✈️' },
  { id: 13, year: '2013', title: 'NOTA Introduced', description: 'Following the Supreme Court ruling in PUCL vs Union of India, the "None of the Above" (NOTA) option was added to EVMs.', icon: '🚫' },
  { id: 14, year: '2014', title: 'Highest Turnout Record', description: 'The 2014 Lok Sabha elections saw a record 66.4% voter turnout with 55.3 crore votes cast. NOTA was used for the first time nationally.', icon: '📈' },
  { id: 15, year: '2017', title: 'VVPAT Deployed Nationally', description: 'Voter Verifiable Paper Audit Trail machines were deployed alongside EVMs in all constituencies for the first time in state elections.', icon: '🖨️' },
  { id: 16, year: '2019', title: 'Multi-Phase Mega Election', description: 'The 2019 Lok Sabha election was conducted in 7 phases over 39 days with 91.2 crore eligible voters — the world\'s largest-ever democratic exercise.', icon: '🇮🇳' },
  { id: 17, year: '2024', title: 'Electoral Bonds Struck Down', description: 'The Supreme Court declared the Electoral Bond scheme unconstitutional, ordering disclosure of all bond details for transparency in political funding.', icon: '📜' },
];

if (typeof module !== 'undefined') module.exports = TIMELINE_DATA;
