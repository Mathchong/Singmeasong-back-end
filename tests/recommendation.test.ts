import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../src/app'
import { createRecommendation } from './factories/recommendationFactory'


import { PrismaClient } from '@prisma/client'
const client = new PrismaClient();

beforeEach(async () => {
    await client.$executeRaw`DELETE FROM recommendations`
})

afterAll(async () => {
    await client.$executeRaw`DELETE FROM recommendations`
    await client.$disconnect()
})


describe("Test POST /recommendations route", () => {
    it("Must return 201 when create a recommendation", async () => {
        const recommendation = await createRecommendation()

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(201)
    })

    it("Verify created recommendation at database", async () => {
        const recommendation = await createRecommendation()

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        const databaseConsult = await client.recommendation.findUnique({ where: { name: recommendation.name } })

        expect(databaseConsult).not.toBeFalsy()
    })

    it("Must return 409 if attepment to create an existing recommendation", async () => {
        const recommendation = await createRecommendation()

        await client.recommendation.create({ data: recommendation })
        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(409)

    })

    it("Must return 422 if not sent 'Name' property", async () => {
        const recommendation = await createRecommendation()
        delete recommendation.name

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(422)

    })

    it("Must return 422 if not sent 'youtubeLink' property", async () => {
        const recommendation = await createRecommendation()
        delete recommendation.youtubeLink

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(422)
    })

    it("Must return 422 if not send a string in 'Name' property", async () => {
        const recommendation: any = await createRecommendation()
        recommendation.name = 123

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(422)
    })

    it("Must return 422 if not send a string in 'youtubeLink' property", async () => {
        const recommendation: any = await createRecommendation()
        recommendation.youtubeLink = 123

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(422)
    })

    it("Must return 422 if sent a link not from Youtube in 'youtubeLink' property", async () => {
        const recommendation = await createRecommendation()
        recommendation.youtubeLink = 'https://www.google.com'

        const response = await supertest(app).post('/recommendations/').send(recommendation)

        expect(response.status).toBe(422)
    })

    it("Must return 422 if sent an extra property", async () => {
        const recommendation: any = await createRecommendation()
        recommendation.newProperty = 'testing'

        const response = await supertest(app).post('/recommendations/').send(recommendation)
        expect(response.status).toBe(422)
    })
})

describe("Test POST /recommendations/:id/upvote", () => {
    it("Verify database for vote counting", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation
        let updatedRecommendation

        const response = await supertest(app).post(`/recommendations/${id}/upvote`)

        updatedRecommendation = await client.recommendation.findUnique({
            where: { id }
        })

        expect(response.status).toBe(200)
        expect(updatedRecommendation.score).toBe(1)

    })

    it("Must return 404 if numeric id do not exist", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation

        const response = await supertest(app).post(`/recommendations/${id + 1}/upvote`)

        expect(response.status).toBe(404)

    })
    // it("Must return 404 if sent a not numeric id", async () => {

    //     const fakeString = faker.lorem.word()

    //     const response = await supertest(app).post(`/recommendations/${fakeString}/upvote`)

    //     expect(response.status).toBe(404)
    // })
})

describe("Test POST /recommendations/:id/downvote", () => {
    it("Verify database for vote counting", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation

        const response = await supertest(app).post(`/recommendations/${id}/downvote`)

        const updatedRecommendation = await client.recommendation.findUnique({
            where: {
                id
            }
        })

        expect(response.status).toBe(200)
        expect(updatedRecommendation.score).toBe(-1)
    })

    it("Must return 404 if numeric id do not exist", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation

        const response = await supertest(app).post(`/recommendations/${id + 1}/downvote`)

        expect(response.status).toBe(404)
    })

    // it.todo("Must return 404 if sent a not numeric id")
    it("recommendation must be in database if vote is equal -5", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation

        for (let i = 0; i < 5; i++) {
            await supertest(app).post(`/recommendations/${id}/downvote`)
        }

        const updatedRecommendation = await client.recommendation.findUnique({
            where: {
                id
            }
        })

        expect(updatedRecommendation).not.toBeFalsy()
        expect(updatedRecommendation.score).toBe(-5)
    })

    it("recommendation must be deleted if vote is bellow -5", async () => {
        const recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })
        const { id } = createdRecommendation

        for (let i = 0; i < 6; i++) {
            await supertest(app).post(`/recommendations/${id}/downvote`)
        }

        const updatedRecommendation = await client.recommendation.findUnique({
            where: {
                id
            }
        })

        expect(updatedRecommendation).toBeFalsy()
    })
})

describe("Test GET at /recommendations", () => {
    it("Must return recomendatios in a specif format", async () => {
        let recommendation = await createRecommendation()
        const createdRecommendation = await client.recommendation.create({ data: recommendation })

        const response = await supertest(app).get(`/recommendations`)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body[0]).toEqual(createdRecommendation)

    })

    it("Must return the last 10 recommendations", async () => {
        const recommendations = []
        for (let i = 0; i < 13; i++) {
            recommendations.push(await createRecommendation())
        }

        const created = await client.recommendation.createMany({ data: recommendations })

        const response = await supertest(app).get(`/recommendations`)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toEqual(10)
    })

})

describe("Test GET /recommendations/:id", () => {
    it("Must return recomendatios in a specif format", async () => {
        const recommendation = await createRecommendation()
        const created = await client.recommendation.create({ data: recommendation })
        const { id } = created

        const response = await supertest(app).get(`/recommendations/${id}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(id)
        expect(response.body).toEqual(created)
    })
    it("Must return 404 if numeric id do not exist", async () => {
        const recommendation = await createRecommendation()
        const created = await client.recommendation.create({ data: recommendation })
        const { id } = created

        const response = await supertest(app).get(`/recommendations/${id + 1}`)

        expect(response.status).toBe(404)
    })

})

describe("Test GET /recommendations/random", () => {
    it("Must return recomendatios in a specif format", async () => {
        const recommendation = await createRecommendation()
        const created = await client.recommendation.create({ data: recommendation })

        const response = await supertest(app).get(`/recommendations/random`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(created)
    })

    it("Must return 404 if there is no recommendation at database", async () => {
        const response = await supertest(app).get(`/recommendations/random`)

        expect(response.status).toBe(404)
    })

    it("Test if 70% of requests get a recommendation with a score greater than 10 if exists", async () => {
        const recommendation1: any = await createRecommendation()
        const recommendation2: any = await createRecommendation()
        recommendation1.score = 15
        let highScoreCount = 0

        const createdHighScore = await client.recommendation.create({ data: recommendation1 })
        const createdLowScore = await client.recommendation.create({ data: recommendation2 })

        for (let i = 0; i < 100; i++) {
            const { body } = await supertest(app).get(`/recommendations/random`)
            if (body.id === createdHighScore.id) highScoreCount++;
        }
        console.log(highScoreCount)
        expect(highScoreCount).toBeGreaterThanOrEqual(68)
    })

    it("If only have recommendation with score greater than 10 or 10 and lower, must return a recommendation", async () => {
        let recommendation: any = await createRecommendation()
        recommendation.score = 15
        const created = await client.recommendation.create({ data: recommendation })

        const response = await supertest(app).get(`/recommendations/random`)

        expect(response.status).toBe(200)
        expect(response.body).not.toBeFalsy()
    })

})

describe("Test GET /recommendations/top/:amount", () => {
    it("Must return recomendatios in a specif format", async () => {
        const recommendation = await createRecommendation()
        const created = await client.recommendation.create({ data: recommendation })

        const response = await supertest(app).get(`/recommendations/top/1`)

        expect(response.status).toBe(200)
        expect
    })

    it("Test the order of recommendations", async () => {
        const recommendations: any = []
        recommendations.push(await createRecommendation())
        recommendations.push(await createRecommendation())
        recommendations.push(await createRecommendation())

        recommendations[0].score = 7
        recommendations[1].score = 3
        recommendations[2].score = 15

        const created = await client.recommendation.createMany({ data: recommendations })

        const response = await supertest(app).get(`/recommendations/top/3`)

        expect(response.status).toBe(200)
        expect(response.body[0].score).toBe(15)
        expect(response.body[1].score).toBe(7)
        expect(response.body[2].score).toBe(3)
    })
})