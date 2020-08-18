import { API } from '../../backend'

// API means : http://localhost:8000/api/

export const signup = user => {

    // In fetch request we are passing some request to the URL i.e., API

    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};


export const signin = user => {
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Authenticates user and keep user logged in for longer time 
// Middleware

export const authenticate = (data, next) => {

    // typeof window means window object is accessible to us

    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};


export const signout = next => {
    if (typeof window !== "undefined"){
        localStorage.removeItem("jwt")
        next();

        return fetch(`${API}/signout`, {
            method: "GET"
        })
        .then(response => console.log("Signout success."))
        .catch(err => console.log(err))
    }
};


// Validates whether the user is authenticate/signed in or not


export const isAuthenticated = () => {
    if(typeof window == "undefined"){
        return false
    }
    if(localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    }
    else {
        return false
    }
}

