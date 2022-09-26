import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { conflictError, notFoundError } from "../../src//utils/errorUtils";


describe('Testing Insert Function', () => {
    it("Testa se cria uma recommendation", async () => {
        const recommendation = {
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }

        jest
            .spyOn(recommendationRepository, "findByName")
            .mockResolvedValueOnce(null)

        jest
            .spyOn(recommendationRepository, "create")
            .mockResolvedValueOnce(null)

        await recommendationService.insert(recommendation)

        expect(recommendationRepository.findByName).toBeCalled()
        expect(recommendationRepository.create).toBeCalled()

    })

    it("Testa se dá erro caso já tenha alguma recommendation repetida", () => {
        const recommendation = {
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }

        jest
            .spyOn(recommendationRepository, "findByName")
            .mockResolvedValueOnce(recommendation)



        const response = recommendationService.insert(recommendation)

        expect(recommendationRepository.findByName).toBeCalled()
        expect(response).rejects.toEqual({ type: "conflict", message: "Recommendations names must be unique" })
    })
})

describe('Testing Upvote', () => {
    it("Testa se as funções são chamadas", async () => {
        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce({
                "name": "My Recommendation",
                id: 5,
                youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
                score: 250
            })
        jest
            .spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce(null)

        await recommendationService.upvote(1)

        expect(recommendationRepository.find).toBeCalled()
        expect(recommendationRepository.updateScore).toBeCalled()

    })
})

describe('Testing Downvote', () => {
    it("Testa se as funções são chamadas", async () => {
        const recommendation = {
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }

        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendation)
        jest
            .spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce(recommendation)

        await recommendationService.downvote(1)

        expect(recommendationRepository.find).toBeCalled()
        expect(recommendationRepository.updateScore).toBeCalled()

    })

    it("Testa se a recommendation é deletada", async () => {
        const recommendation = {
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: -6
        }

        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendation)
        jest
            .spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce(recommendation)
        jest
            .spyOn(recommendationRepository, "remove")
            .mockResolvedValueOnce(null)

        await recommendationService.downvote(1)

        expect(recommendationRepository.find).toBeCalled()
        expect(recommendationRepository.updateScore).toBeCalled()
        expect(recommendationRepository.remove).toBeCalled()

    })
})

describe('Testing Get By Id or Fail', () => {
    it("Deve chamar o erro caso não tenha recomendação", async () => {
        jest
            .spyOn(recommendationRepository, 'find')
            .mockResolvedValueOnce(null)

        const response = recommendationService.getById(1)

        expect(response).rejects.toEqual({ type: "not_found", message: "" })
    })

    it("Deve retornar a recomendação encontrada", async () => {
        const recommendation = {
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }
        jest
            .spyOn(recommendationRepository, 'find')
            .mockResolvedValueOnce(recommendation)

        const response = await recommendationService.getById(1)

        expect(response).toEqual(recommendation)

    })

})

describe('Testing Get', () => {
    it('should call function and return recommendations', async () => {
        const recommendation = [{
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }]
        jest
            .spyOn(recommendationRepository, 'findAll')
            .mockResolvedValueOnce(recommendation)

        const response = await recommendationService.get()

        expect(recommendationRepository.findAll).toBeCalled()
        expect(response).toBe(recommendation)
    })
})

describe('Testing Top', () => {
    it("Test if  function is called", async () => {
        const recommendation = [{
            "name": "My Recommendation",
            id: 5,
            youtubeLink: "https://www.youtube.com/watch?v=ipE9bsfYEog&t=99s",
            score: 250
        }]
        jest
            .spyOn(recommendationRepository, 'getAmountByScore')
            .mockResolvedValueOnce(recommendation)

        const response = await recommendationService.getTop(10)

        expect(response).toBe(recommendation)

        expect(recommendationRepository.getAmountByScore).toBeCalled()
    })
})