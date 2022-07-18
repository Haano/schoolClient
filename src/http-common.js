import axios from "axios";

export default axios.create({
    //<<<<<<< HEAD
    // baseURL: "http://192.168.0.112:8081/tutorials",
    // baseURL: "https://a931-37-18-41-143.eu.ngrok.io/tutorials",
    baseURL: "http://localhost:8081/tutorials",
    headers: {
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": 1,
    },
});
// =======
//   baseURL: "http://192.168.0.109:8081/tutorials",
//   headers: {
//     "Content-type": "application/json",
//   },
// });
// >>>>>>> 1112d9beb64cef69d460f55ef570429a6b7898a7