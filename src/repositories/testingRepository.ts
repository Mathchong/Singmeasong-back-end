import { prisma } from "../database.js";

type createRecommendation = {
    name: string;
    youtubeLink: string;
    score?: number;
}

export default class TestRepository {

    async resetDatabase() {
        await prisma.$executeRaw`DELETE from recommendations`
    }

    async createOne(recommendation: createRecommendation) {
        const created = await prisma.recommendation.create({ data: recommendation })

        return created
    }

    async createMany(recommendation: createRecommendation[]) {
        await prisma.recommendation.createMany({ data: recommendation })
    }
}