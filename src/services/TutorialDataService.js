import http from "../http-common";
import httpFile from "../http-common-file";

class TutorialDataService {
    //reciept
    createReciept(data) {
        return http.post("/createReciept", data);
    }

    findReciept(classID) {
            return http.post(`/findReciept/id=`, classID);
        }
        //reciept***
    getAll() {
        return http.get("/tutorials");
    }

    get(id) {
        return http.get(`/tutorials/${id}`);
    }

    create(data) {
        return http.post("/tutorials", data);
    }

    update(id, data) {
        return http.put(`/tutorials/${id}`, data);
    }

    delete(id) {
        return http.delete(`/tutorials/${id}`);
    }
    deleteCauses(id) {
        return http.delete(`/causes/${id}`);
    }
    deleteCategory(id) {
        return http.delete(`/category/${id}`);
    }

    deleteAll() {
        return http.delete(`/tutorials`);
    }

    findByTitle(title) {
        return http.get(`/tutorials?title=${title}`);
    }

    findByClassID(classID) {
            return http.post(`/findByClassID/id=`, classID);
        }
        ////////////////////

    createClass(data) {
        return http.post("/createClass", data);
    }
    getAllCLass() {
        return http.get("/getAllClass");
    }

    getAllCauses() {
        return http.get("/getAllCauses");
    }

    getCategory() {
            return http.get("/getCategory");
        }
        /////////////////// students
    createStudent(data) {
        return http.post("/createStudent", data);
    }
    deleteStudent(id) {
        return http.delete(`/student/${id}`);
    }

    findStudentByClassID(classID) {
            return http.post(`/findStudentByClassID/id=`, classID);
        }
        //Category
    createCategory(data) {
        return http.post("/createCategory", data);
    }
    updateCat(id, data) {
        return http.put(`/updateCat/${id}`, data);
    }

    createCauses(data) {
        return http.post("/createCauses", data);
    }
    createDate(data) {
        return http.post("/createDate", data);
    }

    ///marks
    createMarks(data) {
        return http.post("/createMarks", data);
    }
    findMarks(classID) {
        return http.post(`/findMarks/id=`, classID);
    }
    updateMark(id, data) {
        return http.put(`/updateMark/${id}`, data);
    }

    ///*** FILE
    sendFile(data) {
        return httpFile.post(`/single-file`, data);
    }

    getFile() {
        return http.get(`/loadFileID`, {
            responseType: "blob",
            observe: "response",
        });
    }
}

export default new TutorialDataService();