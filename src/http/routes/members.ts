import express from 'express';
import type { MemberDao } from '../../persistance/DAO/MemberDao.js';
import { MemberController } from '../Controller/MemberController.js';


export function createMemberRouter(memberDao: MemberDao) {
    const memberController = new MemberController(memberDao);

    const router = express.Router();

    router.get('/members', memberController.findAll);
    router.get('/members/:id', memberController.findById);
    router.post('/members', memberController.insert);
    router.put('/members/:id', memberController.update);
    router.delete('/members/:id', memberController.delete);

    return router;
}
