export const CATEGORY_WEIGHTS = {
  "Burst Pipe": 95,
  "Water Leak": 82,
  "Power Outage": 92,
  "Road Damage": 78,
  Pothole: 74,
  "Garbage Overflow": 68,
  "Street Light": 58,
  "Drainage Block": 71,
  "Broken Bench": 35,
  Other: 45
};

export function getCategoryWeight(category) {
  return CATEGORY_WEIGHTS[category] ?? CATEGORY_WEIGHTS.Other;
}

export function calculateTimeElapsedScore(createdAt) {
  const hoursElapsed = Math.max(
    0,
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  );

  return Math.min(100, Math.round(hoursElapsed * 2));
}

export function calculateUrgencyScore(issue) {
  const votes = issue.votesCount ?? issue.votes?.length ?? 0;
  const categoryWeight = getCategoryWeight(issue.category);
  const timeElapsed = calculateTimeElapsedScore(issue.createdAt);

  const score = votes * 0.4 + categoryWeight * 0.4 + timeElapsed * 0.2;
  return Number(score.toFixed(1));
}

export function isTrendingIssue(issue) {
  return calculateUrgencyScore(issue) >= 55 || (issue.votesCount ?? issue.votes?.length ?? 0) >= 25;
}
