import express from "express";
import userController from "../controller/userController";
import clinicController from "../controller/clinicController";
import healthcareController from "../controller/healthcareController";
import doctorsController from "../controller/doctorController";
import bookingController from "../controller/bookingController";
import categoryController from "../controller/categoryController";
import patientController from "../controller/patientController";
import scheduleController from "../controller/scheduleController";
import blogController from "../controller/blogController";
import { upload } from "../util/uploadImage";

const router = express.Router();

const initApiRoutes = (app) => {

    router.post("/register", userController.register);
    router.post("/login", userController.login);
    router.post("/changePassword", userController.changePassword);

    router.get("/getAllClinics/:isDeleted", clinicController.getAllClinics);
    router.get("/getAllHealthcarePackage", healthcareController.getAllHealthcarePackage);
    router.get("/getAlldoctors", doctorsController.getAllDoctors);

    router.get("/getAllCity", categoryController.getAllCity);
    router.get("/getAllDegree", categoryController.getAllDegree);
    router.get("/getAllSpeciality", categoryController.getAllSpeciality);
    router.get("/getAllHealthcareType", categoryController.getAllHealthcareType);
    router.get("/getAllTimeType", scheduleController.getAllTimeType);

    router.get("/getAllClinicsPagination/page=:page?&queryString=:queryString?&idCity=:idCity?&isDeleted=:isDeleted?", clinicController.getAllClinicsPagination);
    router.get("/getAllDoctorsPagination/page=:page?&queryString=:queryString?&idCity=:idCity?&idSpeciality=:idSpeciality?&priceOrder=:priceOrder?", doctorsController.getAllDoctorsPagination);
    router.get("/getAllHealthcarePagination/page=:page?&queryString=:queryString?&idCity=:idCity?&idType=:idType?&priceOrder=:priceOrder?", healthcareController.getAllHealthcarePagination);

    router.get("/getDoctorDetail/:id", doctorsController.getDoctorDetail);
    router.get("/getDoctorScheduleByDate/doctorID=:doctorID?&date=:date?", scheduleController.getDoctorScheduleByDate);
    router.get("/getDoctorByClinic/:id", doctorsController.getDoctorByClinic);

    router.get("/getHealthcareDetail/:id", healthcareController.getHealthcareDetail);
    router.get("/getHealthcareScheduleByDate/healthcareID=:healthcareID?&date=:date?", scheduleController.getHealthcareScheduleByDate);
    router.get("/getHealthcareByClinic/:id", healthcareController.getHealthcareByClinic);

    router.post("/createPatient", patientController.createPatient);
    router.get("/getAllPatientByAccount/:id", patientController.getAllPatientByAccount);
    router.delete("/deletePatient/:id", patientController.deletePatient);
    router.put("/updatePatient", patientController.updatePatient);

    router.post("/createBooking", bookingController.createBooking);
    router.get("/getAllBookingByAccount/:id/:status", bookingController.getAllBookingByAccount);
    router.delete("/deleteBooking/:ID_booking/:ID_patient", bookingController.deleteBooking);

    router.get("/getDoctorByAccount/:id", doctorsController.getDoctorByAccount);
    router.put("/updateDoctorByID", upload.single("image"), doctorsController.updateDoctorByID);

    router.post("/createScheduleForDoctor", scheduleController.createScheduleForDoctor);
    router.get("/getScheduleForDoctor/doctorID=:doctorID?&date=:date?&page=:page?", scheduleController.getScheduleForDoctor);
    router.put("/updateMaxPatient", scheduleController.updateMaxPatient);
    router.delete("/deleteSchedule/:id", scheduleController.deleteSchedule);

    router.get("/getBookingForDoctor/:id/:status/:date/:time/:page", bookingController.getBookingForDoctor);
    router.put("/updateBooking", bookingController.updateBooking);

    router.get("/statsBooking/:id/:year/:flag", bookingController.statsBooking);
    router.get("/statsRevenue/:id/:year/:flag", bookingController.statsRevenue);
    router.get("/getAllPatientForDoctor/:id/:page/:queryString?", patientController.getAllPatientForDoctor);

    router.get("/searchAll/:queryString?", clinicController.searchAll);

    router.get("/getAllDoctorSpeciality/:name?", doctorsController.getAllDocSpeciality);
    router.post("/createDocSpeciality", doctorsController.createDocSpeciality);
    router.put("/updateDocSpeciality", doctorsController.updateDocSpeciality);
    router.delete("/deleteDocSpeciality/:id", doctorsController.deleteDocSpeciality);

    router.get("/getAllDoctorsAdmin/page=:page?&queryString=:queryString?&clinicID=:clinicID?", doctorsController.getAllDoctorsAdmin);
    router.post("/createDoctor", upload.single("image"), doctorsController.createDoctor);
    router.delete("/deleteDoctorByID/:id", doctorsController.deleteDoctorByID);
    router.get("/getBookingForAdmin/:id/:status/:date/:time/:page/:flag", bookingController.getBookingForAdmin);

    router.post("/createScheduleForHealthcare", scheduleController.createScheduleForHealthcare);
    router.get("/getScheduleForHealthcare/healthcareID=:healthcareID?&date=:date?&page=:page?", scheduleController.getScheduleForHealthcare);

    router.get("/getAllPatientByHealthCare/:id/:page/:queryString?", patientController.getAllPatientByHealthCare);

    router.post("/createBlog", upload.single("image"), blogController.createBlog);
    router.get("/getAllBlogs/page=:page?&queryString=:queryString?", blogController.getAllBlogs);
    router.delete("/deleteBlog/:id", blogController.deleteBlog);
    router.put("/updateBlogByID", upload.single("image"), blogController.updateBlogByID);
    router.get("/getBlogByID/:id", blogController.getBlogByID);

    router.post("/createClinic", upload.array("images"), clinicController.createClinic);
    router.put("/updateClinicByID", upload.single("image"), clinicController.updateClinicByID);
    router.delete("/deleteClinic/:id", clinicController.deleteClinicByID);

    router.get("/getClinicImage/:id", clinicController.getClinicImage);
    router.delete("/deleteClinicImage/:id", clinicController.deleteClinicImage);
    router.post("/createClinicImage", upload.array("images"), clinicController.createClinicImage);

    router.get("/getAllHealthcareTypeAdmin/:queryString?", healthcareController.getAllHealthcareTypeAdmin);
    router.post("/createHealthcareType", healthcareController.createHealthcareType);
    router.put("/updateHealthcareType", healthcareController.updateHealthcareType);
    router.delete("/deleteHealthcareType/:id", healthcareController.deleteHealthcareType);

    router.get("/getAllHealthcarePaginationAdmin/page=:page?&queryString=:queryString?&clinicID=:clinicID?", healthcareController.getAllHealthcarePaginationAdmin);
    router.post("/createHealthcarePackage", healthcareController.createHealthcarePackage);
    router.put("/updateHealthcarePackage", healthcareController.updateHealthcarePackage);
    router.delete("/deleteHealthcarePackage/:id", healthcareController.deleteHealthcarePackage);

    router.get("/getTotalAdmin", clinicController.getTotalAdmin);

    return app.use("/", router);
}

export default initApiRoutes;