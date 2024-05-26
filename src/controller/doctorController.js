import doctorService from '../service/doctorService';

const getAllDoctors = async (req, res) => {
    let result = await doctorService.getAllDoctors();
    return res.status(200).json(result)
}
const getDoctorDetail = async (req, res) => {
    let result = await doctorService.getDoctorDetail(req.params.id);
    return res.status(200).json(result)
}

const getDoctorByClinic = async (req, res) => {
    let result = await doctorService.getDoctorByClinic(req.params.id);
    return res.status(200).json(result)
}
const getAllDoctorsPagination = async (req, res) => {
    let result = await doctorService.getAllDoctorsPagination(req.params.page, req.params.queryString, req.params.idCity, req.params.idSpeciality, req.params.priceOrder);
    return res.status(200).json(result)
}

const getDoctorByAccount = async (req, res) => {
    let result = await doctorService.getDoctorByAccount(req.params.id);
    return res.status(200).json(result)
}

const updateDoctorByID = async (req, res) => {
    let result = await doctorService.updateDoctorByID(req.body, req.file);
    return res.status(200).json(result)
}

const getAllDocSpeciality = async (req, res) => {
    let result = await doctorService.getAllDocSpeciality(req.params.name);
    return res.status(200).json(result)
}

const createDocSpeciality = async (req, res) => {
    let result = await doctorService.createDocSpeciality(req.body);
    return res.status(200).json(result)
}

const updateDocSpeciality = async (req, res) => {
    let result = await doctorService.updateDocSpeciality(req.body);
    return res.status(200).json(result)
}

const deleteDocSpeciality = async (req, res) => {
    let result = await doctorService.deleteDocSpeciality(req.params.id);
    return res.status(200).json(result)
}

const getAllDoctorsAdmin = async (req, res) => {
    let result = await doctorService.getAllDoctorsAdmin(req.params.page, req.params.queryString, req.params.clinicID);
    return res.status(200).json(result)
}

const createDoctor = async (req, res) => {
    let result = await doctorService.createDoctor(req.body, req.file);
    return res.status(200).json(result)
}

const deleteDoctorByID = async (req, res) => {
    let result = await doctorService.deleteDoctorByID(req.params.id);
    return res.status(200).json(result)
}


module.exports = {
    getAllDoctors: getAllDoctors,
    getDoctorDetail: getDoctorDetail,
    getDoctorByClinic: getDoctorByClinic,
    getAllDoctorsPagination: getAllDoctorsPagination,
    getDoctorByAccount: getDoctorByAccount,
    updateDoctorByID: updateDoctorByID,
    getAllDocSpeciality: getAllDocSpeciality,
    createDocSpeciality: createDocSpeciality,
    updateDocSpeciality: updateDocSpeciality,
    deleteDocSpeciality: deleteDocSpeciality,
    getAllDoctorsAdmin: getAllDoctorsAdmin,
    createDoctor: createDoctor,
    deleteDoctorByID: deleteDoctorByID
}