import scheduleService from "../service/scheduleService";

const getAllTimeType = async (req, res) => {
    let result = await scheduleService.getAllTimeType();
    return res.status(200).json(result)
}

const getDoctorScheduleByDate = async (req, res) => {
    let result = await scheduleService.getDoctorScheduleByDate(req.params.doctorID, req.params.date);
    return res.status(200).json(result)
}

const getHealthcareScheduleByDate = async (req, res) => {
    let result = await scheduleService.getHealthcareScheduleByDate(req.params.healthcareID, req.params.date);
    return res.status(200).json(result)
}

const createScheduleForDoctor = async (req, res) => {
    let result = await scheduleService.createScheduleForDoctor(req.body);
    return res.status(200).json(result)
}

const getScheduleForDoctor = async (req, res) => {
    let result = await scheduleService.getScheduleForDoctor(req.params.doctorID, req.params.date, req.params.page);
    return res.status(200).json(result)
}

const updateMaxPatient = async (req, res) => {
    let result = await scheduleService.updateMaxPatient(req.body);
    return res.status(200).json(result)
}

const deleteSchedule = async (req, res) => {
    let result = await scheduleService.deleteSchedule(req.params.id);
    return res.status(200).json(result)
}

const createScheduleForHealthcare = async (req, res) => {
    let result = await scheduleService.createScheduleForHealthcare(req.body);
    return res.status(200).json(result)
}

const getScheduleForHealthcare = async (req, res) => {
    let result = await scheduleService.getScheduleForHealthcare(req.params.healthcareID, req.params.date, req.params.page);
    return res.status(200).json(result)
}

module.exports = {
    getAllTimeType: getAllTimeType,
    getDoctorScheduleByDate: getDoctorScheduleByDate,
    getHealthcareScheduleByDate: getHealthcareScheduleByDate,
    createScheduleForDoctor: createScheduleForDoctor,
    getScheduleForDoctor: getScheduleForDoctor,
    updateMaxPatient: updateMaxPatient,
    deleteSchedule: deleteSchedule,
    createScheduleForHealthcare: createScheduleForHealthcare,
    getScheduleForHealthcare: getScheduleForHealthcare
}