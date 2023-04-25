import { API_URL } from "./api.js";

export async function getAllTests() {
    // GET from the API /tests
    const response = await fetch(
        API_URL + "/tests",
        {
            method: "GET",
        }
    )

    const getTestsResponse = await response.json()

    return getTestsResponse.tests

}