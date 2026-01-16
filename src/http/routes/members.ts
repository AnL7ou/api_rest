import express from 'express';
import type { MemberRepository } from '../../persistance/Repository/MemberRepository.js';
import { MemberController } from '../Controller/MemberController.js';


export function createMemberRouter(memberRepository: MemberRepository) {
    const memberController = new MemberController(memberRepository);

    const router = express.Router();

    router.get('/members', memberController.findAll);
    router.get('/members/:id', memberController.findById);
    router.post('/members', memberController.insert);
    router.put('/members/:id', memberController.update);
    router.delete('/members/:id', memberController.delete);

    return router;
}
