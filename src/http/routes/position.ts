import express from 'express';
import type { Request, Response } from 'express';
import { PositionDbDao } from '../../persistance/DbDAO/PositionDbDao.js';
import { Position } from '../Entity/Position.js';
import { authenticateToken, authorizeRoles } from '../../middleware/AuthMiddleware.js';
import { UserRole } from '../Entity/User.js';

export function createPositionRouter(positionDbDao: PositionDbDao) {
    const router = express.Router();

    /**
     * GET /positions
     * Récupérer toutes les positions
     */
    router.get('/positions', authenticateToken, (req: Request, res: Response) => {
        try {
            const positions = positionDbDao.findAll();
            res.json(positions);
        } catch (error) {
            console.error('Error fetching positions:', error);
            res.status(500).json({ error: 'Unable to retrieve positions' });
        }
    });

    /**
     * GET /positions/:id
     * Récupérer une position par son ID
     */
    router.get('/positions/:id', authenticateToken, (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid position ID' });
                return;
            }

            const position = positionDbDao.findById(id);
            
            if (!position) {
                res.status(404).json({ error: 'Position not found' });
                return;
            }

            res.json(position);
        } catch (error) {
            console.error('Error fetching position:', error);
            res.status(500).json({ error: 'Unable to retrieve position' });
        }
    });

    /**
     * POST /positions
     * Créer une nouvelle position (ADMIN uniquement)
     */
    router.post('/positions', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            const { id, name } = req.body;

            if (!name) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            // Générer un ID si non fourni
            const positionId = id || (positionDbDao.findAll().length > 0 
                ? Math.max(...positionDbDao.findAll().map(p => p.codePosition)) + 1 
                : 1);

            const newPosition = new Position(positionId, name);
            positionDbDao.insert(newPosition);

            res.status(201).json({ 
                message: 'Position created successfully', 
                position: newPosition 
            });
        } catch (error) {
            console.error('Error creating position:', error);
            res.status(500).json({ error: 'Unable to create position' });
        }
    });

    /**
     * PUT /positions/:id
     * Mettre à jour une position (ADMIN uniquement)
     */
    router.put('/positions/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid position ID' });
                return;
            }

            const existingPosition = positionDbDao.findById(id);
            if (!existingPosition) {
                res.status(404).json({ error: 'Position not found' });
                return;
            }

            const { name } = req.body;

            if (name) {
                existingPosition.name = name;
            }

            const success = positionDbDao.update(existingPosition);

            if (success) {
                res.json({ 
                    message: 'Position updated successfully', 
                    position: existingPosition 
                });
            } else {
                res.status(500).json({ error: 'Failed to update position' });
            }
        } catch (error) {
            console.error('Error updating position:', error);
            res.status(500).json({ error: 'Unable to update position' });
        }
    });

    /**
     * DELETE /positions/:id
     * Supprimer une position (ADMIN uniquement)
     */
    router.delete('/positions/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid position ID' });
                return;
            }

            const deleted = positionDbDao.delete(id);

            if (deleted) {
                res.json({ message: 'Position deleted successfully' });
            } else {
                res.status(404).json({ error: 'Position not found' });
            }
        } catch (error) {
            console.error('Error deleting position:', error);
            res.status(500).json({ error: 'Unable to delete position' });
        }
    });

    /**
     * POST /positions/:id/members/:memberId
     * Ajouter un membre à une position (ADMIN uniquement)
     */
    router.post('/positions/:id/members/:memberId', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            if (!req.params.memberId) {
                res.status(400).json({ error: 'MemberId parameter is required' });
                return;
            }

            const positionId = parseInt(req.params.id);
            const memberId = parseInt(req.params.memberId);

            if (isNaN(positionId) || isNaN(memberId)) {
                res.status(400).json({ error: 'Invalid position or member ID' });
                return;
            }

            const success = positionDbDao.addMemberToPosition(memberId, positionId);

            if (success) {
                res.json({ message: 'Member added to position successfully' });
            } else {
                res.status(500).json({ error: 'Failed to add member to position' });
            }
        } catch (error) {
            console.error('Error adding member to position:', error);
            res.status(500).json({ error: 'Unable to add member to position' });
        }
    });

    /**
     * DELETE /positions/:id/members/:memberId
     * Retirer un membre d'une position (ADMIN uniquement)
     */
    router.delete('/positions/:id/members/:memberId', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            if (!req.params.memberId) {
                res.status(400).json({ error: 'MemberId parameter is required' });
                return;
            }

            const positionId = parseInt(req.params.id);
            const memberId = parseInt(req.params.memberId);

            if (isNaN(positionId) || isNaN(memberId)) {
                res.status(400).json({ error: 'Invalid position or member ID' });
                return;
            }

            const success = positionDbDao.removeMemberFromPosition(memberId, positionId);

            if (success) {
                res.json({ message: 'Member removed from position successfully' });
            } else {
                res.status(404).json({ error: 'Member not in this position' });
            }
        } catch (error) {
            console.error('Error removing member from position:', error);
            res.status(500).json({ error: 'Unable to remove member from position' });
        }
    });

    /**
     * GET /positions/:id/members
     * Récupérer tous les membres d'une position
     */
    router.get('/positions/:id/members', authenticateToken, (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const positionId = parseInt(req.params.id);

            if (isNaN(positionId)) {
                res.status(400).json({ error: 'Invalid position ID' });
                return;
            }

            const memberIds = positionDbDao.findMembersByPosition(positionId);
            res.json({ positionId, memberIds });
        } catch (error) {
            console.error('Error fetching members of position:', error);
            res.status(500).json({ error: 'Unable to retrieve members' });
        }
    });

    return router;
}