import supertest from 'supertest';

import app from '../src/app'

describe("Test POST /recommendations route", () => {
    it.todo("Must return 201 when create a recomendation")
    it.todo("Verify created recomendation at database")

    it.todo("Must return 409 if attepment to create an existing recomendation")
    it.todo("Verify database in attepment to create an existing recomendation")

    it.todo("Must return 422 if not sent 'Name' property")
    it.todo("Must return 422 if not sent 'youtubeLink' property")

    it.todo("Must return 422 if not send a string in 'Name' property")
    it.todo("Must return 422 if not send a string in 'youtubeLink' property")

    it.todo("Must return 422 if sent a link not from Youtube in 'youtubeLink' property")
    it.todo("Must return 422 if sent an extra property")
})

describe("Test POST /recommendations/:id/upvote", () => {
    it.todo("Verify database for vote counting")
    it.todo("Must return 404 if numeric id do not exist")
    it.todo("Must return 404 if sent a not numeric id")
})

describe("Test POST /recommendations/:id/downvote", () => {
    it.todo("Verify database for vote counting")
    it.todo("Must return 404 if numeric id do not exist")
    it.todo("Must return 404 if sent a not numeric id")
    it.todo("Recomendation must be in database if vote is equal -5")
    it.todo("Recomendation must be deleted if vote is bellow -5")
})

describe("Test GET at /recomendations", () => {
    it.todo("Must return recomendatios in a specif format")
    it.todo("Must return the last 10 recommendations")
    it.todo("Cannot return more than 10 recommendations")
})

describe("Test GET /recommendations/:id", () => {
    it.todo("Must return recomendatios in a specif format")
    it.todo("Must return 404 if numeric id do not exist")
    it.todo("Must return 404 if sent a not numeric id")
})

describe("Test GET /recommendations/random", () => {
    it.todo("Must return recomendatios in a specif format")
    it.todo("Must return 404 if there is no recommendation at database")
    it.todo("Test if 70% of requests get a recomendation with a score greater than 10 if exists")
    it.todo("If only have recomendation with score greater than 10 or 10 and lower, must return a recomendation")
})

describe("Test GET /recommendations/top/:amount", () => {
    it.todo("Must return recomendatios in a specif format")
    it.todo("Must return 404 if there is no recommendation at database")
    it.todo("Test if 70% of requests get a recomendation with a score greater than 10 if exists")
    it.todo("If only have recomendation with score greater than 10 or 10 and lower, must return a recomendation")
})