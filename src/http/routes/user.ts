import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserDbDao } from '../../persistance/DbDAO/UserDbDao.js';
import { User, UserRole } from '../Entity/User.js';
import { 
    authenticateToken, 
    authorizeRoles, 
    authorizeOwnerOrAdmin 
} from '../../middleware/AuthMiddleware.js';
import { config } from '../../config.js';

export function createUserRouter(UserDbDao: UserDbDao) {
    const router = express.Router();

    /**
     * GET /users
     * Récupérer tous les utilisateurs (ADMIN uniquement)
     */
    router.get('/users', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            const users = UserDbDao.findAll();
            const safeUsers = users.map(user => user.toSafeObject());
            res.json(safeUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Unable to retrieve users' });
        }
    });

    /**
     * GET /users/:id
     * Récupérer un utilisateur par son ID
     * L'utilisateur peut consulter son propre profil, l'admin peut consulter tous les profils
     */
    router.get('/users/:id', authenticateToken, authorizeOwnerOrAdmin, (req: Request, res: Response) => {
        try {

            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }
            
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const user = UserDbDao.findById(id);
            
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user.toSafeObject());
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Unable to retrieve user' });
        }
    });

    /**
     * PUT /users/:id
     * Mettre à jour un utilisateur
     * L'utilisateur peut modifier son propre profil, l'admin peut modifier tous les profils
     */
    router.put('/users/:id', authenticateToken, authorizeOwnerOrAdmin, async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const existingUser = UserDbDao.findById(id);
            if (!existingUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const { username, email, password, role } = req.body;

            // Vérifier que le username n'est pas déjà pris par un autre utilisateur
            if (username && username !== existingUser.username) {
                const userWithSameUsername = UserDbDao.findByUsername(username);
                if (userWithSameUsername && userWithSameUsername.id !== id) {
                    res.status(409).json({ error: 'Username already taken' });
                    return;
                }
                existingUser.username = username;
            }

            // Vérifier que l'email n'est pas déjà pris par un autre utilisateur
            if (email && email !== existingUser.email) {
                const userWithSameEmail = UserDbDao.findByEmail(email);
                if (userWithSameEmail && userWithSameEmail.id !== id) {
                    res.status(409).json({ error: 'Email already taken' });
                    return;
                }
                existingUser.email = email;
            }

            // Mettre à jour le mot de passe si fourni
            if (password) {
                const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
                existingUser.password = hashedPassword;
            }

            // Seul un admin peut changer le rôle
            if (role && req.user?.role === UserRole.ADMIN) {
                if (Object.values(UserRole).includes(role)) {
                    existingUser.role = role;
                }
            }

            const success = UserDbDao.update(existingUser);

            if (success) {
                res.json({ 
                    message: 'User updated successfully', 
                    user: existingUser.toSafeObject() 
                });
            } else {
                res.status(500).json({ error: 'Failed to update user' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Unable to update user' });
        }
    });

    /**
     * DELETE /users/:id
     * Supprimer un utilisateur (ADMIN uniquement)
     */
    router.delete('/users/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }
            
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            // Vérifier que l'utilisateur existe
            const user = UserDbDao.findById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Empêcher la suppression de son propre compte
            if (req.user?.id === id) {
                res.status(403).json({ error: 'You cannot delete your own account' });
                return;
            }

            const deleted = UserDbDao.delete(id);

            if (deleted) {
                res.json({ message: 'User deleted successfully' });
            } else {
                res.status(500).json({ error: 'Failed to delete user' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Unable to delete user' });
        }
    });

    return router;
}