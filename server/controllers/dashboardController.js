import Issue from "../models/Issue.js";
import User from "../models/User.js";
import { calculateUrgencyScore } from "../services/urgencyService.js";

export async function getPublicOverview(_req, res) {
  const [issueCount, resolvedCount, userCount, activeCount] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: "Resolved" }),
    User.countDocuments({ role: "citizen" }),
    Issue.countDocuments({ status: { $ne: "Resolved" } })
  ]);

  res.json({
    metrics: {
      totalIssues: issueCount,
      resolvedIssues: resolvedCount,
      activeUsers: userCount,
      activeIssues: activeCount
    }
  });
}

export async function getAuthorityDashboard(_req, res) {
  const issues = await Issue.find()
    .populate("reportedBy", "name neighborhood")
    .sort({ createdAt: -1 });

  const rankedIssues = issues
    .map((issue) => {
      issue.urgencyScore = calculateUrgencyScore(issue);
      return issue;
    })
    .sort((a, b) => b.urgencyScore - a.urgencyScore);

  const topContributors = await User.find({ role: "citizen" })
    .sort({ contributionPoints: -1 })
    .limit(5)
    .select("name neighborhood contributionPoints");

  const heatmap = rankedIssues.map((issue) => ({
    id: issue._id,
    title: issue.title,
    urgencyScore: issue.urgencyScore,
    category: issue.category,
    locationName: issue.locationName,
    coordinates: {
      lat: issue.location.coordinates[1],
      lng: issue.location.coordinates[0]
    }
  }));

  res.json({
    rankedIssues,
    heatmap,
    topContributors
  });
}
