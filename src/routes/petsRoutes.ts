import express from 'express';
import type { PetDbDao } from '../DbDAO/PetDbDao.js';
import { Pet } from '../Classes/Pet.js';

export function createPetRouter(petDbDao: PetDbDao){
    const router = express.Router();

    router.get('/pets', async (req, res) => {
        try {
            const pets = await petDbDao.findAll();
            res.json(pets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Unable to retrieve pets' });
        }
    });

    router.get('/pets/owner/:ownerId', async (req, res) => {
        try {
            const ownerId = Number(req.params.ownerId);
            const pets = await petDbDao.findByMember(ownerId);
            res.json(pets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Unable to retrieve pets by owner' });
        }
    });

    router.post('/pets', async (req, res) => {
            try {
                const { id, name, type, owner, birthday } = req.body;
    
                // Create updated Pet instance
                const updatedPet = new Pet(id, name, type, birthday, owner);
    
                const success = await petDbDao.update(updatedPet);
    
                if (success) {
                    res.json({ message: 'Pet added successfully', member: updatedPet });
                } else {
                    res.status(500).json({ error: 'Failed to add member' });
                }
            } catch (error) {
                console.error('Error updating member:', error);
                res.status(500).json({ error: 'Unable to add member' });
            }
        });
    
        router.delete('/pets/:id', async (req, res) => {
            try {
                const id = Number(req.params.id);
    
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid member ID' });
                }
    
                const deleted = await petDbDao.delete(id);
    
                if (deleted) {
                    res.json({ message: 'Pet deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Pet not found' });
                }
            } catch (error) {
                console.error('Error deleting member:', error);
                res.status(500).json({ error: 'Unable to delete member' });
            }
        });
    
    
        router.put('/pets/:id', async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid member ID' });
                }
    
                const existingPet = await petDbDao.findById(id);
                if (!existingPet) {
                    return res.status(404).json({ message: 'Pet not found' });
                }
    
                // Extract fields from body
                const { name, type, birthday, owner } = req.body;
    
                // Create updated Pet instance
                const updatedPet = new Pet(id, name, type, birthday, owner);
    
                const success = await petDbDao.update(updatedPet);
    
                if (success) {
                    res.json({ message: 'Pet updated successfully', member: updatedPet });
                } else {
                    res.status(500).json({ error: 'Failed to update member' });
                }
            } catch (error) {
                console.error('Error updating member:', error);
                res.status(500).json({ error: 'Unable to update member' });
            }
        });

    return router;
}
