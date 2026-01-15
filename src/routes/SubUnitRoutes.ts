import express from 'express';
import type { Request, Response } from 'express';
import { SubUnitDbDao } from '../DbDAO/SubUnitDbDao.js';
import { SubUnit } from '../Classes/SubUnit.js';
import { authenticateToken, authorizeRoles } from '../Middleware/AuthMiddleware.js';
import { UserRole } from '../Classes/User.js';

export function createSubUnitRouter(subUnitDbDao: SubUnitDbDao) {
    const router = express.Router();

    /**
     * GET /subunits
     * Récupérer toutes les sous-unités
     */
    router.get('/subunits', authenticateToken, (req: Request, res: Response) => {
        try {
            const subUnits = subUnitDbDao.findAll();
            res.json(subUnits);
        } catch (error) {
            console.error('Error fetching subunits:', error);
            res.status(500).json({ error: 'Unable to retrieve subunits' });
        }
    });

    /**
     * GET /subunits/:id
     * Récupérer une sous-unité par son ID
     */
    router.get('/subunits/:id', authenticateToken, (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid subunit ID' });
                return;
            }

            const subUnit = subUnitDbDao.findById(id);
            
            if (!subUnit) {
                res.status(404).json({ error: 'SubUnit not found' });
                return;
            }

            res.json(subUnit);
        } catch (error) {
            console.error('Error fetching subunit:', error);
            res.status(500).json({ error: 'Unable to retrieve subunit' });
        }
    });

    /**
     * POST /subunits
     * Créer une nouvelle sous-unité (ADMIN uniquement)
     */
    router.post('/subunits', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            const { id, name } = req.body;

            if (!name) {
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            // Générer un ID si non fourni
            const subUnitId = id || (subUnitDbDao.findAll().length > 0 
                ? Math.max(...subUnitDbDao.findAll().map(s => s.codeSubUnit)) + 1 
                : 1);

            const newSubUnit = new SubUnit(subUnitId, name);
            subUnitDbDao.insert(newSubUnit);

            res.status(201).json({ 
                message: 'SubUnit created successfully', 
                subUnit: newSubUnit 
            });
        } catch (error) {
            console.error('Error creating subunit:', error);
            res.status(500).json({ error: 'Unable to create subunit' });
        }
    });

    /**
     * PUT /subunits/:id
     * Mettre à jour une sous-unité (ADMIN uniquement)
     */
    router.put('/subunits/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid subunit ID' });
                return;
            }

            const existingSubUnit = subUnitDbDao.findById(id);
            if (!existingSubUnit) {
                res.status(404).json({ error: 'SubUnit not found' });
                return;
            }

            const { name } = req.body;

            if (name) {
                existingSubUnit.name = name;
            }

            const success = subUnitDbDao.update(existingSubUnit);

            if (success) {
                res.json({ 
                    message: 'SubUnit updated successfully', 
                    subUnit: existingSubUnit 
                });
            } else {
                res.status(500).json({ error: 'Failed to update subunit' });
            }
        } catch (error) {
            console.error('Error updating subunit:', error);
            res.status(500).json({ error: 'Unable to update subunit' });
        }
    });

    /**
     * DELETE /subunits/:id
     * Supprimer une sous-unité (ADMIN uniquement)
     */
    router.delete('/subunits/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid subunit ID' });
                return;
            }

            const deleted = subUnitDbDao.delete(id);

            if (deleted) {
                res.json({ message: 'SubUnit deleted successfully' });
            } else {
                res.status(404).json({ error: 'SubUnit not found' });
            }
        } catch (error) {
            console.error('Error deleting subunit:', error);
            res.status(500).json({ error: 'Unable to delete subunit' });
        }
    });

    /**
     * POST /subunits/:id/members/:memberId
     * Ajouter un membre à une sous-unité (ADMIN uniquement)
     */
    router.post('/subunits/:id/members/:memberId', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            if (!req.params.memberId) {
                res.status(400).json({ error: 'memberId parameter is required' });
                return;
            }

            const subUnitId = parseInt(req.params.id);
            const memberId = parseInt(req.params.memberId);

            if (isNaN(subUnitId) || isNaN(memberId)) {
                res.status(400).json({ error: 'Invalid subunit or member ID' });
                return;
            }

            const success = subUnitDbDao.addMemberToSubUnit(memberId, subUnitId);

            if (success) {
                res.json({ message: 'Member added to subunit successfully' });
            } else {
                res.status(500).json({ error: 'Failed to add member to subunit' });
            }
        } catch (error) {
            console.error('Error adding member to subunit:', error);
            res.status(500).json({ error: 'Unable to add member to subunit' });
        }
    });

    /**
     * DELETE /subunits/:id/members/:memberId
     * Retirer un membre d'une sous-unité (ADMIN uniquement)
     */
    router.delete('/subunits/:id/members/:memberId', authenticateToken, authorizeRoles(UserRole.ADMIN), (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }

            if (!req.params.memberId) {
                res.status(400).json({ error: 'memberId parameter is required' });
                return;
            }

            const subUnitId = parseInt(req.params.id);
            const memberId = parseInt(req.params.memberId);

            if (isNaN(subUnitId) || isNaN(memberId)) {
                res.status(400).json({ error: 'Invalid subunit or member ID' });
                return;
            }

            const success = subUnitDbDao.removeMemberFromSubUnit(memberId, subUnitId);

            if (success) {
                res.json({ message: 'Member removed from subunit successfully' });
            } else {
                res.status(404).json({ error: 'Member not in this subunit' });
            }
        } catch (error) {
            console.error('Error removing member from subunit:', error);
            res.status(500).json({ error: 'Unable to remove member from subunit' });
        }
    });

    /**
     * GET /subunits/:id/members
     * Récupérer tous les membres d'une sous-unité
     */
    router.get('/subunits/:id/members', authenticateToken, (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                res.status(400).json({ error: 'ID parameter is required' });
                return;
            }
            
            const subUnitId = parseInt(req.params.id);

            if (isNaN(subUnitId)) {
                res.status(400).json({ error: 'Invalid subunit ID' });
                return;
            }

            const memberIds = subUnitDbDao.findMembersBySubUnit(subUnitId);
            res.json({ subUnitId, memberIds });
        } catch (error) {
            console.error('Error fetching members of subunit:', error);
            res.status(500).json({ error: 'Unable to retrieve members' });
        }
    });

    return router;
}