import healthcareService from '../service/healthcareService';

const getAllHealthcarePackage = async (req, res) => {
    let result = await healthcareService.getAllHealthcarePackage();
    return res.status(200).json(result)
}

const getAllHealthcarePagination = async (req, res) => {
    let result = await healthcareService.getAllHealthcarePagination(req.params.page, req.params.queryString, req.params.idCity, req.params.idType, req.params.priceOrder);
    return res.status(200).json(result)
}

const getHealthcareDetail = async (req, res) => {
    let result = await healthcareService.getHealthcareDetail(req.params.id);
    return res.status(200).json(result)
}

const getHealthcareByClinic = async (req, res) => {
    let result = await healthcareService.getHealthcareByClinic(req.params.id);
    return res.status(200).json(result)
}

const getAllHealthcareTypeAdmin = async (req, res) => {
    let result = await healthcareService.getAllHealthcareTypeAdmin(req.params.queryString);
    return res.status(200).json(result)
}

const createHealthcareType = async (req, res) => {
    let result = await healthcareService.createHealthcareType(req.body);
    return res.status(200).json(result)
}

const updateHealthcareType = async (req, res) => {
    let result = await healthcareService.updateHealthcareType(req.body);
    return res.status(200).json(result)
}

const deleteHealthcareType = async (req, res) => {
    let result = await healthcareService.deleteHealthcareType(req.params.id);
    return res.status(200).json(result)
}

const getAllHealthcarePaginationAdmin = async (req, res) => {
    let result = await healthcareService.getAllHealthcarePaginationAdmin(req.params.page, req.params.queryString, req.params.clinicID);
    return res.status(200).json(result)
}

const createHealthcarePackage = async (req, res) => {
    let result = await healthcareService.createHealthcarePackage(req.body);
    return res.status(200).json(result)
}

const updateHealthcarePackage = async (req, res) => {
    let result = await healthcareService.updateHealthcarePackage(req.body);
    return res.status(200).json(result)
}

const deleteHealthcarePackage = async (req, res) => {
    let result = await healthcareService.deleteHealthcarePackage(req.params.id);
    return res.status(200).json(result)
}

module.exports = {
    getAllHealthcarePackage: getAllHealthcarePackage,
    getAllHealthcarePagination: getAllHealthcarePagination,
    getHealthcareDetail: getHealthcareDetail,
    getHealthcareByClinic: getHealthcareByClinic,
    getAllHealthcareTypeAdmin: getAllHealthcareTypeAdmin,
    createHealthcareType: createHealthcareType,
    updateHealthcareType: updateHealthcareType,
    deleteHealthcareType: deleteHealthcareType,
    getAllHealthcarePaginationAdmin: getAllHealthcarePaginationAdmin,
    createHealthcarePackage: createHealthcarePackage,
    updateHealthcarePackage: updateHealthcarePackage,
    deleteHealthcarePackage: deleteHealthcarePackage
}