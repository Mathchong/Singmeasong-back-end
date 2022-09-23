import { faker } from '@faker-js/faker';

export async function createRecomendation() {
    return {
        name: faker.lorem.words(),
        youtubeLink: "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(10)
    }
}