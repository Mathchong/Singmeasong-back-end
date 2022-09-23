import { faker } from '@faker-js/faker';

export async function createRecommendation() {
    return {
        name: faker.lorem.words(),
        youtubeLink: "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(10)
    }
}