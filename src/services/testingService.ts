import TestRepository from "../repositories/testingRepository.js";

import { createRecommendation } from "../../tests/factories/recommendationFactory.js"

const test = new TestRepository()

export default class TestService {

    async resetDatabase() {
        await test.resetDatabase()
    }

    async createOne() {
        const recommendation = await createRecommendation()

        return await test.createOne(recommendation)
    }

    async createMany(qtd: number) {
        const recommendations = []
        for (let i = 0; i < qtd; i++) {
            recommendations.push(await createRecommendation())
            recommendations[i].score = Math.floor(Math.random() * 100) + 1
        }

        await test.createMany(recommendations)
    }
}