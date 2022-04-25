import http from "../http-common";

class ServerCommandLogin {
  getAllCLass() {
    return http.get("/getAllClass");
  }
}

export default new ServerCommandLogin();
