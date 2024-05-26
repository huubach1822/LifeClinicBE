import clinicService from '../service/clinicService';

const getAllClinics = async (req, res) => {
    let result = await clinicService.getAllClinics(req.params.isDeleted);
    return res.status(200).json(result)
}

const getAllClinicsPagination = async (req, res) => {
    let result = await clinicService.getAllClinicsPagination(req.params.page, req.params.queryString, req.params.idCity, req.params.isDeleted);
    return res.status(200).json(result)
}

const searchAll = async (req, res) => {
    let result = await clinicService.searchAll(req.params.queryString);
    return res.status(200).json(result)
}

const createClinic = async (req, res) => {
    let result = await clinicService.createClinic(req.body, req.files);
    return res.status(200).json(result)
}

const updateClinicByID = async (req, res) => {
    let result = await clinicService.updateClinicByID(req.body, req.file);
    return res.status(200).json(result)
}

const deleteClinicByID = async (req, res) => {
    let result = await clinicService.deleteClinicByID(req.params.id);
    return res.status(200).json(result)
}

const getClinicImage = async (req, res) => {
    let result = await clinicService.getClinicImage(req.params.id);
    return res.status(200).json(result)
}

const deleteClinicImage = async (req, res) => {
    let result = await clinicService.deleteClinicImage(req.params.id);
    return res.status(200).json(result)
}

const createClinicImage = async (req, res) => {
    let result = await clinicService.createClinicImage(req.body, req.files);
    return res.status(200).json(result)
}

const getTotalAdmin = async (req, res) => {
    let result = await clinicService.getTotalAdmin();
    return res.status(200).json(result)
}

module.exports = {
    getAllClinics: getAllClinics,
    getAllClinicsPagination: getAllClinicsPagination,
    searchAll: searchAll,
    createClinic: createClinic,
    updateClinicByID: updateClinicByID,
    deleteClinicByID: deleteClinicByID,
    getClinicImage: getClinicImage,
    deleteClinicImage: deleteClinicImage,
    createClinicImage: createClinicImage,
    getTotalAdmin: getTotalAdmin
}