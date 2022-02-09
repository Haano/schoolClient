import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.131:8080/tutorials",
  headers: {
    "Content-type": "application/json",
  },
});
