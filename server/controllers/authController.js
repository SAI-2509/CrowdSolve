import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { DEFAULT_AUTHORITY, ensureDefaultAuthority } from "../services/seedService.js";

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function shapeAuthPayload(user) {
  return {
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      area: user.area,
      city: user.city,
      neighborhood: user.neighborhood,
      homeZone: user.homeZone,
      avatarUrl: user.avatarUrl,
      contributionPoints: user.contributionPoints
    }
  };
}

export async function signup(req, res) {
  const { name, email, password, role, neighborhood, homeZone, area, city } = req.body;

  if (!name || !email || !password || !homeZone?.label || !homeZone?.address || !area || !city) {
    return res.status(400).json({ message: "Missing required signup fields." });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role === "authority" ? "authority" : "citizen",
    area,
    city,
    neighborhood: neighborhood || homeZone.label,
    homeZone
  });

  res.status(201).json(shapeAuthPayload(user));
}

export async function login(req, res) {
  const { email, password } = req.body;
  await ensureDefaultAuthority();

  if (email === DEFAULT_AUTHORITY.email && password === DEFAULT_AUTHORITY.password) {
    const authority = await User.findOne({ email: DEFAULT_AUTHORITY.email });
    return res.json(shapeAuthPayload(authority));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json(shapeAuthPayload(user));
}

export async function me(req, res) {
  res.json({ user: req.user });
}
