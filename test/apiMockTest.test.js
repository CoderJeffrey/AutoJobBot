const nock = require('nock');
const axios = require('axios');
const { publishPost } = require('../app.js');

// The mock response load it from ../data/response.json
const mockResponse = require('../data/response.json');

console.log("mockResponse is:", mockResponse);

// Create a mock response object that includes status, statusText, and potentially more fields
const mockResponseObj = {
    status: mockResponse.status,
    statusText: mockResponse.statusText,
    data: "", // Assuming your response body is empty
    headers: mockResponse.headers
};

// Set up the mock using nock
nock('https://api.linkedin.com')
    .post('/rest/posts')
    .reply(function (uri, requestBody) {
        // Return a mock response with the required structure
        return [
            201,
            mockResponseObj.data,
            mockResponseObj.headers
        ];
    });

// Intercept the Axios request and inject statusText
axios.interceptors.response.use(response => {
    response.statusText = "Created"; // Inject the statusText here
    return response;
}, error => {
    return Promise.reject(error);
});

// Test case to use the mocked response
describe('publishPost', () => {
    it('should return the mocked response', async () => {
        const response = await publishPost();
        expect(response.status).toBe(201);
        expect(response.statusText).toBe("Created");
        // Add more assertions as needed
    });
});
