import { useAuth } from "@/contexts/AuthContext";
import { AppointmentView, User } from "@/types";
import { userInfo } from "os";



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


export async function claimRow(user: User, token: string, row: AppointmentView) {
    const reqHeaders = new Headers();
    reqHeaders.append("Authorization", `Bearer ${token}`);
    reqHeaders.append("Content-Type", "application/json");

    const payload = { 
        ...row,
        driver: user.id
    }

    const requestOptions = {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(payload),
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_HOST;

    let result;

    result = await fetch(`${baseUrl}/appointments/driver`, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(response => {throw new Error(response.error)});
    })
    .then(() => {
        return payload;
    })
    .catch(error => {
        console.log('Error claiming the thing!', error);
        alert("Problem claiming the route.  Please contact Sedky.")
        return new Error(error.message);
    });

    return result;
}


export async function completeRoute(token: string, row: AppointmentView) {
    const reqHeaders = new Headers();
    reqHeaders.append("Authorization", `Bearer ${token}`);
    reqHeaders.append("Content-Type", "application/json");

    const payload = { 
        ...row
    }

    const requestOptions = {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(payload),
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_HOST;

    let result;

    result = await fetch(`${baseUrl}/appointments/status`, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(response => {throw new Error(response.error)});
    })
    .then(() => {
        return payload;
    })
    .catch(error => {
        console.log('Error completing the thing!', error);
        alert("Problem completing route.  Please contact Sedky.")
        return new Error(error.message);
    });

    return result;
}