import axios from "axios";

export default axios.create({
    // baseURL: "http://192.168.0.112:8081/tutorials",
    baseURL: "https://0bb4-178-170-253-71.eu.ngrok.io/tutorials",
    headers: {
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": 1,
    },
});