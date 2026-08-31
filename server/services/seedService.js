import bcrypt from "bcryptjs";
import Issue from "../models/Issue.js";
import User from "../models/User.js";
import { calculateUrgencyScore } from "./urgencyService.js";

export const DEFAULT_AUTHORITY = {
  name: "CrowdSolve Authority",
  email: "authority@crowdsolve.gov",
  password: "Authority@123"
};

async function ensureDefaultAuthority() {
  let authority = await User.findOne({ email: DEFAULT_AUTHORITY.email });

  if (!authority) {
    authority = await User.create({
      name: DEFAULT_AUTHORITY.name,
      email: DEFAULT_AUTHORITY.email,
      passwordHash: await bcrypt.hash(DEFAULT_AUTHORITY.password, 10),
      role: "authority",
      area: "Central Ward",
      city: "Smart City",
      neighborhood: "Central Ward",
      homeZone: {
        label: "Central Ward",
        address: "Municipal HQ",
        coordinates: {
          lat: 28.6139,
          lng: 77.209
        }
      }
    });
  }

  return authority;
}

const sampleImagePool = [
  "https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
];

export async function ensureSampleIssuesForUser(user) {
  if (!user?.city || !user?.area || !user?.homeZone?.coordinates) {
    return;
  }

  const existingCount = await Issue.countDocuments({ city: user.city, area: user.area });
  if (existingCount > 0) {
    return;
  }

  const authority = await ensureDefaultAuthority();
  const residents = await Promise.all(
    ["Aisha Rao", "Rohan Mehta", "Neha Kapoor"].map(async (name, index) => {
      const email = `${name.toLowerCase().replaceAll(" ", ".")}+${user.city.toLowerCase().replaceAll(" ", "")}@crowdsolve.demo`;
      let resident = await User.findOne({ email });
      if (!resident) {
        resident = await User.create({
          name,
          email,
          passwordHash: await bcrypt.hash("password123", 10),
          role: "citizen",
          area: user.area,
          city: user.city,
          neighborhood: user.area,
          homeZone: {
            label: user.homeZone.label,
            address: user.homeZone.address,
            coordinates: {
              lat: user.homeZone.coordinates.lat + index * 0.004,
              lng: user.homeZone.coordinates.lng + index * 0.004
            }
          },
          contributionPoints: 50 - index * 5
        });
      }
      return resident;
    })
  );

  const sampleIssues = [
    {
      title: "Large pothole causing vehicle damage",
      description: "Residents report frequent near-misses and damaged bikes on this stretch.",
      category: "Pothole",
      locationName: `${user.area} Main Road`,
      location: {
        type: "Point",
        coordinates: [user.homeZone.coordinates.lng + 0.0045, user.homeZone.coordinates.lat + 0.003]
      },
      mediaUrl: sampleImagePool[0],
      votesCount: 14
    },
    {
      title: "Water leakage near residential block",
      description: "Continuous leakage has created slippery roads and wasted water for days.",
      category: "Water Leak",
      locationName: `${user.area} Block B`,
      location: {
        type: "Point",
        coordinates: [user.homeZone.coordinates.lng - 0.0032, user.homeZone.coordinates.lat + 0.0015]
      },
      mediaUrl: sampleImagePool[1],
      votesCount: 10
    },
    {
      title: "Street light outage on evening route",
      description: "The lane is very dark after sunset and pedestrians feel unsafe.",
      category: "Street Light",
      locationName: `${user.area} Cross Street`,
      location: {
        type: "Point",
        coordinates: [user.homeZone.coordinates.lng + 0.002, user.homeZone.coordinates.lat - 0.0028]
      },
      mediaUrl: sampleImagePool[2],
      votesCount: 6
    }
  ];

  for (let index = 0; index < sampleIssues.length; index += 1) {
    const reporter = residents[index % residents.length];
    const sampleIssue = sampleIssues[index];
    const issue = await Issue.create({
      ...sampleIssue,
      area: user.area,
      city: user.city,
      neighborhood: user.area,
      reportedBy: reporter._id,
      authorityFlagged: sampleIssue.votesCount >= Number(process.env.AUTHORITY_THRESHOLD_VOTES || 15),
      updates: [
        {
          status: "Reported",
          note: "Sample civic issue generated for preview.",
          changedBy: reporter._id
        }
      ]
    });

    issue.votes = residents.map((resident) => resident._id).slice(0, Math.min(residents.length, sampleIssue.votesCount));
    issue.urgencyScore = calculateUrgencyScore(issue);
    await issue.save();
  }

  authority.contributionPoints = authority.contributionPoints || 0;
  await authority.save();
}

export { ensureDefaultAuthority };
