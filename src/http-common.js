import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.136:8081/tutorials",
  headers: {
    "Content-type": "application/json",
  },
});
