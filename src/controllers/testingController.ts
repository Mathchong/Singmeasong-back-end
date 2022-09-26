import { Request, Response } from "express";

import TestService from "../services/testingService.js";

const testing = new TestService()

export default class TestController {
    async createOneRecommendation(req: Request, res: Response) {
        const body = req.body
        const created = await testing.createOne(body);

        return res.status(201).json({ status: 200, message: "created recommendation", data: created });
    }

    async createRecommendations(req: Request, res: Response) {
        let { qtd }: any = req.params
        qtd = qtd * 1

        await testing.createMany(qtd)

        return res.status(201).json({ status: 200, message: `created ${qtd} recommendation(s)` });
    }

    async resetDatabase(req: Request, res: Response) {
        await testing.resetDatabase()

        return res.status(204).json({ status: 204, message: "Database is blank" })
    }
}