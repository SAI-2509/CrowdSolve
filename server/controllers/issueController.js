import Issue from "../models/Issue.js";
import User from "../models/User.js";
import { calculateDistanceKm } from "../services/geoService.js";
import { ensureSampleIssuesForUser } from "../services/seedService.js";
import { calculateUrgencyScore, isTrendingIssue } from "../services/urgencyService.js";

function buildMediaUrl(req) {
  if (req.file?.filename) {
    return `${process.env.UPLOADS_BASE_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
  }

  return req.body.mediaUrl || "";
}

function buildResultMediaUrl(req) {
  if (req.file?.filename) {
    return `${process.env.UPLOADS_BASE_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
  }

  return req.body.resultPhotoUrl || "";
}

function serializeIssue(issue, viewer) {
  const votes = issue.votes ?? [];

  return {
    id: issue._id,
    title: issue.title,
    description: issue.description,
    category: issue.category,
    mediaUrl: issue.mediaUrl,
    locationName: issue.locationName,
    location: issue.location,
    area: issue.area,
    city: issue.city,
    neighborhood: issue.neighborhood,
    status: issue.status,
    authorityFlagged: issue.authorityFlagged,
    votesCount: issue.votesCount,
    urgencyScore: issue.urgencyScore,
    resultPhotoUrl: issue.resultPhotoUrl,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    comments: issue.comments,
    updates: issue.updates,
    reportedBy: issue.reportedBy,
    hasUpvoted: viewer ? votes.some((vote) => String(vote) === String(viewer._id)) : false
  };
}

export async function createIssue(req, res) {
  const { title, description, category, locationName, lat, lng, neighborhood, area, city } = req.body;

  if (!title || !description || !category || !locationName || lat === undefined || lng === undefined) {
    return res.status(400).json({ message: "Missing required issue fields." });
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    mediaUrl: buildMediaUrl(req),
    locationName,
    area: area || req.user.area,
    city: city || req.user.city,
    neighborhood: neighborhood || req.user.neighborhood,
    location: {
      type: "Point",
      coordinates: [Number(lng), Number(lat)]
    },
    reportedBy: req.user._id,
    updates: [
      {
        status: "Reported",
        note: "Issue reported by citizen.",
        changedBy: req.user._id
      }
    ]
  });

  issue.urgencyScore = calculateUrgencyScore(issue);
  issue.authorityFlagged = issue.votesCount >= Number(process.env.AUTHORITY_THRESHOLD_VOTES || 15);
  await issue.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { contributionPoints: 10 } });

  const populatedIssue = await Issue.findById(issue._id).populate("reportedBy", "name neighborhood");
  res.status(201).json({ issue: serializeIssue(populatedIssue, req.user) });
}

export async function getIssues(req, res) {
  await ensureSampleIssuesForUser(req.user);
  const radiusKm = Number(req.query.radiusKm || 5);
  const mode = req.query.mode || "local";
  const issues = await Issue.find()
    .populate("reportedBy", "name neighborhood")
    .sort({ createdAt: -1 });

  const filteredIssues = issues
    .filter((issue) => {
      if (mode === "trending") {
        return isTrendingIssue(issue);
      }

      if (!req.user?.homeZone?.coordinates) {
        return true;
      }

      const distance = calculateDistanceKm(
        {
          coordinates: [req.user.homeZone.coordinates.lng, req.user.homeZone.coordinates.lat]
        },
        issue.location
      );

      return distance <= radiusKm;
    })
    .map((issue) => serializeIssue(issue, req.user));

  res.json({ issues: filteredIssues });
}

export async function getMyIssues(req, res) {
  await ensureSampleIssuesForUser(req.user);
  const issues = await Issue.find({ reportedBy: req.user._id })
    .populate("reportedBy", "name neighborhood")
    .sort({ createdAt: -1 });

  res.json({ issues: issues.map((issue) => serializeIssue(issue, req.user)) });
}

export async function upvoteIssue(req, res) {
  const issue = await Issue.findById(req.params.issueId);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found." });
  }

  const alreadyVoted = issue.votes.some((vote) => String(vote) === String(req.user._id));

  if (alreadyVoted) {
    issue.votes = issue.votes.filter((vote) => String(vote) !== String(req.user._id));
    issue.votesCount = Math.max(0, issue.votesCount - 1);
  } else {
    issue.votes.push(req.user._id);
    issue.votesCount += 1;
  }

  issue.authorityFlagged = issue.votesCount >= Number(process.env.AUTHORITY_THRESHOLD_VOTES || 15);
  issue.urgencyScore = calculateUrgencyScore(issue);
  await issue.save();

  res.json({
    issue: serializeIssue(issue, req.user)
  });
}

export async function addComment(req, res) {
  const issue = await Issue.findById(req.params.issueId);
  const { body } = req.body;

  if (!issue) {
    return res.status(404).json({ message: "Issue not found." });
  }

  if (!body?.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty." });
  }

  issue.comments.push({
    user: req.user._id,
    name: req.user.name,
    body: body.trim()
  });

  await issue.save();
  res.status(201).json({ comments: issue.comments });
}

export async function updateIssueStatus(req, res) {
  const issue = await Issue.findById(req.params.issueId);
  const { status, note } = req.body;
  const resultPhotoUrl = buildResultMediaUrl(req);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found." });
  }

  if (!["Pending", "In Progress", "Resolved"].includes(status)) {
    return res.status(400).json({ message: "Unsupported status." });
  }

  issue.status = status;
  if (resultPhotoUrl) {
    issue.resultPhotoUrl = resultPhotoUrl;
  }

  const updateStatusLabel =
    status === "Pending" ? "Verified" : status === "In Progress" ? "Assigned" : "Resolved";

  issue.updates.push({
    status: updateStatusLabel,
    note: note || `Issue moved to ${status}.`,
    photoUrl: resultPhotoUrl || "",
    changedBy: req.user._id
  });
  issue.urgencyScore = calculateUrgencyScore(issue);
  await issue.save();

  const populatedIssue = await Issue.findById(issue._id).populate("reportedBy", "name neighborhood email");
  res.json({
    issue: serializeIssue(populatedIssue, req.user),
    notification: `Result update prepared for ${populatedIssue.reportedBy.name}.`
  });
}
