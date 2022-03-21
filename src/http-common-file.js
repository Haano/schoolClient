import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.152:8081/tutorials",
  headers: {
    "content-type": "multipart/form-data",
  },
});
