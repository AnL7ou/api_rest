import express from 'express';
import type { MemberDbDao } from '../DbDAO/MemberDbDao.js';
import { Member } from '../Classes/Member.js';

export function createMemberRouter(memberDbDao: MemberDbDao) {

    const router = express.Router();

    router.get('/members', async (req, res) => {
        try {
            const members = await memberDbDao.findAll();
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve members' });
        }
    });

    router.get('/members/:id', async (req, res) => {
        try {
            const id = Number(req.params.id);
            const member = await memberDbDao.findById(id);
            if (member) {
                res.json(member);
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve member' });
        }
    });

    router.post('/members', async (req, res) => {
        try {
            const { id, stageName, firstName, lastName, birthday, skzoo } = req.body;

            // Create updated Member instance
            const updatedMember = new Member(id, stageName, firstName, lastName, birthday, skzoo);

            const success = await memberDbDao.update(updatedMember);

            if (success) {
                res.json({ message: 'Member added successfully', member: updatedMember });
            } else {
                res.status(500).json({ error: 'Failed to add member' });
            }
        } catch (error) {
            console.error('Error updating member:', error);
            res.status(500).json({ error: 'Unable to add member' });
        }
    });

    router.delete('/members/:id', async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid member ID' });
            }

            const deleted = await memberDbDao.delete(id);

            if (deleted) {
                res.json({ message: 'Member deleted successfully' });
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            res.status(500).json({ error: 'Unable to delete member' });
        }
    });


    router.put('/members/:id', async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid member ID' });
            }

            const existingMember = await memberDbDao.findById(id);
            if (!existingMember) {
                return res.status(404).json({ message: 'Member not found' });
            }

            // Extract fields from body
            const { stageName, firstName, lastName, birthday, skzoo } = req.body;

            // Create updated Member instance
            const updatedMember = new Member(id, stageName, firstName, lastName, birthday, skzoo);

            const success = await memberDbDao.update(updatedMember);

            if (success) {
                res.json({ message: 'Member updated successfully', member: updatedMember });
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

