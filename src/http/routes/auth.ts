import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserDbDao } from '../../persistance/DbDAO/UserDbDao.js';
import { User, UserRole } from '../Entity/User.js';
import { 
    generateToken, 
    generateRefreshToken, 
    verifyRefreshToken,
    authenticateToken 
} from '../../middleware/AuthMiddleware.js';
import { config } from '../../config.js';

export function createAuthRouter(UserDbDao: UserDbDao) {
    const router = express.Router();

    /**
     * POST /auth/register
     * Inscription d'un nouvel utilisateur
     */
    router.post('/register', async (req: Request, res: Response) => {
        try {
            const { username, password, email, role } = req.body;

            // Validation des données
            if (!username || !password || !email) {
                res.status(400).json({ error: 'Username, password, and email are required' });
                return;
            }

            // Vérifier si l'utilisateur existe déjà
            const existingUser = UserDbDao.findByUsername(username);
            if (existingUser) {
                res.status(409).json({ error: 'Username already exists' });
                return;
            }

            const existingEmail = UserDbDao.findByEmail(email);
            if (existingEmail) {
                res.status(409).json({ error: 'Email already exists' });
                return;
            }

            // Hash du mot de passe
            const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

            // Générer un ID unique (simple incrémentation)
            const allUsers = UserDbDao.findAll();
            const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;

            // Créer le nouvel utilisateur (par défaut USER, sauf si spécifié)
            const userRole = role && Object.values(UserRole).includes(role) ? role : UserRole.USER;
            const newUser = new User(newId, username, hashedPassword, email, userRole);

            UserDbDao.insert(newUser);

            res.status(201).json({ 
                message: 'User registered successfully',
                user: newUser.toSafeObject()
            });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Unable to register user' });
        }
    });

    /**
     * POST /auth/login
     * Connexion d'un utilisateur
     */
    router.post('/login', async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }

            // Trouver l'utilisateur
            const user = UserDbDao.findByUsername(username);
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            // Générer les tokens
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            const accessToken = generateToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.json({
                message: 'Login successful',
                accessToken,
                refreshToken,
                user: user.toSafeObject()
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Unable to login' });
        }
    });

    /**
     * POST /auth/refresh
     * Rafraîchir le token d'accès avec un refresh token
     */
    router.post('/refresh', (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                res.status(400).json({ error: 'Refresh token is required' });
                return;
            }

            // Vérifier le refresh token
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded) {
                res.status(403).json({ error: 'Invalid or expired refresh token' });
                return;
            }

            // Vérifier que l'utilisateur existe toujours
            const user = UserDbDao.findById(decoded.id);
            if (!user) {
                res.status(403).json({ error: 'User not found' });
                return;
            }

            // Générer un nouveau token d'accès
            const payload = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            const newAccessToken = generateToken(payload);

            res.json({
                accessToken: newAccessToken
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(500).json({ error: 'Unable to refresh token' });
        }
    });

    /**
     * GET /auth/me
     * Obtenir les informations de l'utilisateur connecté
     */
    router.get('/me', authenticateToken, (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const user = UserDbDao.findById(req.user.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user.toSafeObject());
        } catch (error) {
            console.error('Error fetching user info:', error);
            res.status(500).json({ error: 'Unable to fetch user information' });
        }
    });

    return router;
}