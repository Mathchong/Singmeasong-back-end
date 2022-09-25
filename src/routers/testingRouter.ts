import { Router } from "express";

import TestController from "../controllers/testingController.js";

const testing = new TestController()
const testingRouter = Router()

testingRouter.delete("/reset-database", testing.resetDatabase)
testingRouter.post("/createOneRecommendation", testing.createOneRecommendation)
testingRouter.post("/createRecommendations/:qtd", testing.createRecommendations)

export default testingRouter