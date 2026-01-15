import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload as JwtPayloadBase } from 'jsonwebtoken';
import { config } from '../config.js';
import { UserRole } from '../Classes/User.js';

// Étendre le type Request pour inclure les informations utilisateur
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

export interface CustomJwtPayload extends JwtPayloadBase {
    id: number;
    username: string;
    role: UserRole;
}

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token JWT dans le header Authorization
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as CustomJwtPayload;
        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
        };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ error: 'Invalid token' });
        } else {
            res.status(500).json({ error: 'Token verification failed' });
        }
    }
};

/**
 * Middleware d'autorisation basé sur les rôles
 * @param roles - Liste des rôles autorisés
 */
export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ 
                error: 'Access forbidden',
                message: `You need one of the following roles: ${roles.join(', ')}`
            });
            return;
        }

        next();
    };
};

/**
 * Middleware pour vérifier si l'utilisateur accède à ses propres ressources
 * ou s'il est administrateur
 */
export const authorizeOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    if (!req.params.id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
    }

    const requestedUserId = parseInt(req.params.id);
    
    if (req.user.role === UserRole.ADMIN || req.user.id === requestedUserId) {
        next();
    } else {
        res.status(403).json({ 
            error: 'Access forbidden',
            message: 'You can only access your own resources'
        });
    }
};

/**
 * Génère un token JWT
 */
export const generateToken = (payload: Omit<CustomJwtPayload, keyof JwtPayloadBase>): string => {
    if (!config.jwt.secret) {
        throw new Error('JWT secret is not configured');
    }
    
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

/**
 * Génère un refresh token JWT
 */
export const generateRefreshToken = (payload: Omit<CustomJwtPayload, keyof JwtPayloadBase>): string => {
    if (!config.jwt.secret) {
        throw new Error('JWT secret is not configured');
    }
    
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};

/**
 * Vérifie et décode un refresh token
 */
export const verifyRefreshToken = (token: string): CustomJwtPayload | null => {
    if (!config.jwt.secret) {
        return null;
    }
    
    try {
        return jwt.verify(token, config.jwt.secret) as CustomJwtPayload;
    } catch (error) {
        return null;
    }
};