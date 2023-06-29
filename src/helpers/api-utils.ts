import { User } from "@/types";

export async function createAppUser(token: string, firstName: string, lastName: string) {

    const reqHeaders = new Headers();
    reqHeaders.append("Authorization", `Bearer ${token}`);
    reqHeaders.append("Content-Type", "application/json");

    const reqBody = JSON.stringify({
        "firstName": firstName,
        "lastName": lastName
    });

    const requestOptions = {
        method: 'POST',
        headers: reqHeaders,
        body: reqBody,
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_HOST;

    let result;

    result = await fetch(`${baseUrl}/users`, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(response => {throw new Error(response.error)});
    })
    .then((data) => {
        return data;
    })
    .catch(error => {
        console.log('Error fetching bitfund user', error);
        return new Error(error.message);
    });

    return result;
}