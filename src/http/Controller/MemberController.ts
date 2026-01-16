import type { Request, Response } from "express";
import type { MemberRepository } from "../../persistance/Repository/MemberRepository.js";
import { Member } from "../../persistance/Entity/Member.js"

export class MemberController
{
    constructor(public memberRepository: MemberRepository)
    {
    }

    public findAll = async (_req: Request, res: Response) => {
        try {
            const members = await this.memberRepository.findAll();
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve members' });
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: 'Invalid member ID' });
            }

            const member = await this.memberRepository.findById(id);
            if (member) {
                res.json(member);
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve member' });
        }
    }

    public insert = async (req: Request, res: Response) => {
        try {
            const { stageName, firstName, lastName, birthday, skzoo } = req.body;

            const newMember = new Member(undefined as any, stageName, firstName, lastName, birthday, skzoo);

            const success = await this.memberRepository.insert(newMember);
            if (success) {
                return res.status(201).json({ message: "Member created successfully", member: newMember });
            }

            return res.status(500).json({ error: "Failed to create member" });
        } catch (error) {
            console.error("Error creating member:", error);
            return res.status(500).json({ error: "Unable to create member" });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "Invalid member ID" });
            }

            const existingMember = await this.memberRepository.findById(id);
            if (!existingMember) {
                return res.status(404).json({ message: "Member not found" });
            }

            const { stageName, firstName, lastName, birthday, skzoo } = req.body;

            const updatedMember = new Member(id, stageName, firstName, lastName, birthday, skzoo);

            const success = await this.memberRepository.update(updatedMember);
            if (success) {
                return res.json({ message: "Member updated successfully", member: updatedMember });
            }

            return res.status(500).json({ error: "Failed to update member" });
        } catch (error) {
            console.error("Error updating member:", error);
            return res.status(500).json({ error: "Unable to update member" });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid member ID' });
            }

            const deleted = await this.memberRepository.delete(id);

            if (deleted) {
                res.json({ message: 'Member deleted successfully' });
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            res.status(500).json({ error: '[MemberController.delete] Unable to delete member' });
        }
    }
}