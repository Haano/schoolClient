import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.0.108:8081/tutorials",
    headers: {
        "Content-type": "multipart/form-data",
    },
});