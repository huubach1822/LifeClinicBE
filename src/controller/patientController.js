import patientService from '../service/patientService';

const createPatient = async (req, res) => {
    let result = await patientService.createPatient(req.body);
    return res.status(200).json(result)
}

const updatePatient = async (req, res) => {
    let result = await patientService.updatePatient(req.body);
    return res.status(200).json(result)
}

const getAllPatientByAccount = async (req, res) => {
    let result = await patientService.getAllPatientByAccount(req.params.id);
    return res.status(200).json(result)
}

const deletePatient = async (req, res) => {
    let result = await patientService.deletePatient(req.params.id);
    return res.status(200).json(result)
}

const getAllPatientForDoctor = async (req, res) => {
    let result = await patientService.getAllPatientForDoctor(req.params.id, req.params.page, req.params.queryString);
    return res.status(200).json(result)
}

const getAllPatientByHealthCare = async (req, res) => {
    let result = await patientService.getAllPatientByHealthCare(req.params.id, req.params.page, req.params.queryString);
    return res.status(200).json(result)
}

module.exports = {
    createPatient: createPatient,
    getAllPatientByAccount: getAllPatientByAccount,
    deletePatient: deletePatient,
    updatePatient: updatePatient,
    getAllPatientForDoctor: getAllPatientForDoctor,
    getAllPatientByHealthCare: getAllPatientByHealthCare
}