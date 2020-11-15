import URLS, {servicepointsURL, movieReviewURL, digitaloceanURL, faceitURL, loginURL} from './Settings';

function getServicePoints(address) {
    const options = makeOptions("POST", true, address);
    return fetch(servicepointsURL, options)
        .then(handleHttpErrors);
}

function getMovieReviews(query) {
    const options = makeOptions("POST", true, {query});
    console.log(options);
    return fetch(movieReviewURL, options)
        .then(handleHttpErrors);
}

function getDigitalOceanInfo() {
    const options = makeOptions("GET", true);
    return fetch(digitaloceanURL, options)
    .then(handleHttpErrors);
}

function getFaceItGames() {
    const options = makeOptions("GET", false);
    return fetch(faceitURL+"/games", options)
    .then(handleHttpErrors);
}

function getPlayerInfo(nickname) {
    const options = makeOptions("POST", true, { nickname: nickname});
    return fetch(faceitURL+"/csgo/player", options)
    .then(handleHttpErrors);
}

const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
}
const getToken = () => {
    return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
}
const logout = () => {
    localStorage.removeItem("jwtToken");
}

const login = (user, password) => {
    const options = makeOptions("POST", true, { username: user, password: password });
    return fetch(loginURL, options)
        .then(handleHttpErrors)
        .then(res => { setToken(res.token) })
}

const apiFacade = {
    getServicePoints,
    getMovieReviews,
    getDigitalOceanInfo,
    getFaceItGames,
    getPlayerInfo,
    setToken,
    getToken,
    loggedIn,
    logout,
    login
}

function makeOptions(method, addToken, body) {
    var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    }
    if (addToken && loggedIn()) {
        opts.headers["x-access-token"] = getToken();
    }
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

export default apiFacade;