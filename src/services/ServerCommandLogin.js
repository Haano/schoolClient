import http from "../http-common";

class ServerCommandLogin {
  getAllCLass() {
    return http.get("/getAllClass");
  }
  userLogin(data) {
    return http.post("/userLogin", data);
  }

  updatePassword(id, data) {
    return http.put(`/updatePassword/${id}`, data);
  }
}

export default new ServerCommandLogin();
