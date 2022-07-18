import axios from "axios";

export default axios.create({
    //<<<<<<< HEAD
    //baseURL: "http://192.168.0.112:8081/tutorials",
    baseURL: "https://0bb4-178-170-253-71.eu.ngrok.io/tutorials",
    headers: {
        "Content-type": "multipart/form-data",
        "ngrok-skip-browser-warning": 1,
    },
});
//=======
//   baseURL: "http://192.168.0.109:8081/tutorials",
//   headers: {
//     "Content-type": "multipart/form-data",
//   },
// });
//>>>>>>> 1112d9beb64cef69d460f55ef570429a6b7898a7