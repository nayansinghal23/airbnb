import axios from "axios";

const USER_SERVICE_URL = 'http://localhost:3008/api/v1';

export async function getUserDetails(userId: number, cookie: string) {
    const response = await axios.get(`${USER_SERVICE_URL}/user/${userId}`, {
        headers: {
            Cookie: cookie
        }
    });
    return response;
}