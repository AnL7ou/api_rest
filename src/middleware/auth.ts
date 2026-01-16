import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { config } from "../config.js";
import { UserRole } from "../persistance/Entity/User.js";

/**
 * Make req.user exist (single-file simplest approach).
 * Note: no export here; it's a global augmentation.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Your app's JWT payload (extends the standard JWT payload).
 */
export type CustomJwtPayload = JwtPayload & {
  id: number;
  username: string;
  role: UserRole;
};

function requireJwtSecret(): string {
  const secret = config.jwt.secret;
  if (!secret) throw new Error("JWT secret is not configured");
  return secret;
}

/**
 * JWT authentication middleware
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  let secret: string;
  try {
    secret = requireJwtSecret();
  } catch {
    res.status(500).json({ error: "JWT secret is not configured" });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "Token expired" });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      res.status(500).json({ error: "Token verification failed" });
      return;
    }

    const payload = decoded as unknown as CustomJwtPayload;

    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };

    next();
  });
};

/**
 * Role-based authorization middleware
 */
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Access forbidden",
        message: `You need one of the following roles: ${roles.join(", ")}`,
      });
      return;
    }

    next();
  };
};

/**
 * Authorize owner or admin
 */
export const authorizeOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const requestedUserId = Number(req.params.id);
  if (Number.isNaN(requestedUserId)) {
    res.status(400).json({ error: "Invalid ID parameter" });
    return;
  }

  if (req.user.role === UserRole.ADMIN || req.user.id === requestedUserId) {
    next();
    return;
  }

  res.status(403).json({
    error: "Access forbidden",
    message: "You can only access your own resources",
  });
};

/**
 * Generate access token
 */
export const generateToken = (payload: Pick<CustomJwtPayload, "id" | "username" | "role">): string => {
  const secret = requireJwtSecret();

  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (
  payload: Pick<CustomJwtPayload, "id" | "username" | "role">
): string => {
  const secret = requireJwtSecret();

  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verify and decode refresh token
 */
export const verifyRefreshToken = (token: string): CustomJwtPayload | null => {
  try {
    const secret = requireJwtSecret();
    return jwt.verify(token, secret) as unknown as CustomJwtPayload;
  } catch {
    return null;
  }
};
