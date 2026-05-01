/**
 * Step-by-step guide data for the Indian election process.
 * Each step: id, title, icon, summary, details (array of points), funFact
 */
const GUIDE_DATA = [
  {
    id: 1, title: 'Election Announcement', icon: '📢',
    summary: 'The Election Commission announces election dates and schedule.',
    details: [
      'The ECI holds a press conference to announce election dates',
      'The Model Code of Conduct comes into immediate effect',
      'The entire election schedule including phases, nomination dates, and counting date is declared',
      'The government cannot announce new policies or schemes after this point',
      'All political advertisements need ECI pre-certification'
    ],
    funFact: 'The 2019 Lok Sabha election schedule was announced on March 10, 2019, for a 7-phase election spanning April-May.'
  },
  {
    id: 2, title: 'Model Code of Conduct', icon: '📋',
    summary: 'Rules that govern the behavior of parties and candidates.',
    details: [
      'No party can use government resources for campaigning',
      'Ministers cannot combine official visits with campaign work',
      'No new government projects or schemes can be announced',
      'Religious and caste-based appeals are prohibited',
      'Campaign content must not incite hatred or violence',
      'Paid news and fake news are strictly monitored',
      'Social media campaigns must comply with guidelines'
    ],
    funFact: 'Though MCC is not legally enforceable, ECI\'s moral authority and swift action make it highly effective.'
  },
  {
    id: 3, title: 'Nomination of Candidates', icon: '📝',
    summary: 'Eligible candidates file their nomination papers.',
    details: [
      'Candidates must be Indian citizens and meet age requirements (25 for Lok Sabha/Assembly, 30 for Rajya Sabha)',
      'Nomination papers are filed with the Returning Officer',
      'A security deposit is required: ₹25,000 for Lok Sabha (₹12,500 for SC/ST)',
      'Each candidate needs at least one proposer from the constituency',
      'Candidates must declare their assets, liabilities, and criminal cases',
      'Affidavits with educational qualifications are mandatory'
    ],
    funFact: 'In the 2019 elections, about 8,000 candidates filed nominations for 543 Lok Sabha seats!'
  },
  {
    id: 4, title: 'Scrutiny of Nominations', icon: '🔍',
    summary: 'The Returning Officer examines all nomination papers.',
    details: [
      'The RO checks if the candidate meets all eligibility criteria',
      'Verification of age, citizenship, and constituency enrollment',
      'Criminal record declarations are reviewed',
      'Incomplete or incorrect nominations are rejected',
      'Candidates and their agents can raise objections during scrutiny',
      'The RO\'s decision can be challenged only through an election petition after results'
    ],
    funFact: 'Candidates disqualified under the RPA Act include those with criminal convictions of 2+ years imprisonment.'
  },
  {
    id: 5, title: 'Withdrawal of Candidature', icon: '↩️',
    summary: 'Candidates may choose to withdraw from the contest.',
    details: [
      'A specific deadline is set for withdrawal after scrutiny',
      'Candidates can withdraw by submitting a notice to the RO',
      'After the withdrawal deadline, the final list of candidates is published',
      'If only one candidate remains, they are declared elected unopposed',
      'Election symbols are finalized and allotted to candidates',
      'The official ballot order is determined'
    ],
    funFact: 'Unopposed elections are rare — they usually happen in Rajya Sabha elections or local body polls.'
  },
  {
    id: 6, title: 'Election Campaign', icon: '📣',
    summary: 'Parties and candidates campaign to win voter support.',
    details: [
      'Campaigns include rallies, road shows, door-to-door canvassing, and social media',
      'Each candidate has a spending limit (₹95 lakh for Lok Sabha in most states)',
      'Parties release manifestos outlining their policies and promises',
      'Campaign spending is monitored by expenditure observers',
      'Free airtime is provided on Doordarshan and AIR for national/state parties',
      'All campaign activities must cease 48 hours before polling (silent period)'
    ],
    funFact: 'India\'s 2019 election campaign is estimated to have cost over ₹60,000 crore, making it one of the most expensive elections globally.'
  },
  {
    id: 7, title: 'Polling Day', icon: '🗳️',
    summary: 'Voters cast their votes at designated polling stations.',
    details: [
      'Polling stations open at 7 AM and close at 6 PM (may vary)',
      'Voters show valid ID (EPIC or 12 approved alternatives) at the station',
      'Indelible ink is applied to the left index finger',
      'Voter enters the secret voting compartment and presses the EVM button',
      'VVPAT machine displays a paper slip for 7 seconds for verification',
      'Voter assistance is available for persons with disabilities and senior citizens',
      'Mock polls are conducted before voting begins to verify EVM functioning'
    ],
    funFact: 'India sets up polling stations even for a single voter! In 2019, a booth was set up in Gir Forest for just one voter.'
  },
  {
    id: 8, title: 'Vote Counting', icon: '🔢',
    summary: 'EVMs are opened and votes are counted under strict supervision.',
    details: [
      'Counting typically happens 3-4 days after the final polling phase',
      'EVMs are stored in secure strongrooms with 24/7 CCTV and armed security',
      'Counting begins at 8 AM with postal ballots, then EVM counting',
      'Candidates and their counting agents are present during the process',
      'Results are announced round-by-round for each constituency',
      'VVPAT slips from 5 randomly selected booths per constituency are verified',
      'The entire process is transparent with multiple layers of oversight'
    ],
    funFact: 'With EVMs, counting that once took days with paper ballots now finishes in just a few hours!'
  },
  {
    id: 9, title: 'Results & Government Formation', icon: '🏆',
    summary: 'Winners are declared and the government is formed.',
    details: [
      'The candidate with the most votes in each constituency wins (FPTP)',
      'Results are displayed in real-time on the ECI website and media',
      'The party/coalition with 272+ seats in Lok Sabha forms the government',
      'The President invites the majority leader to form the government',
      'The PM and Council of Ministers are sworn in',
      'If no party has a majority, the largest party/coalition is invited first',
      'The new government must prove its majority through a floor test'
    ],
    funFact: 'The ECI\'s results website crashes on counting day due to billions of hits from eager citizens!'
  },
  {
    id: 10, title: 'Post-Election', icon: '📊',
    summary: 'After elections, the democratic process continues.',
    details: [
      'Election petitions can be filed in High Courts challenging the results',
      'The Model Code of Conduct is lifted after results are declared',
      'ECI publishes detailed statistical reports on the elections',
      'Voter turnout data, spending reports, and analysis are made public',
      'Preparations begin for any upcoming state or local elections',
      'The new government presents its first budget and policy agenda'
    ],
    funFact: 'India\'s Election Commission is considered one of the most efficient election management bodies in the world!'
  }
];

if (typeof module !== 'undefined') module.exports = GUIDE_DATA;
