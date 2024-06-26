import bookingService from '../service/bookingService';

const createBooking = async (req, res) => {
    let result = await bookingService.createBooking(req.body);
    return res.status(200).json(result)
}

const getAllBookingByAccount = async (req, res) => {
    let result = await bookingService.getAllBookingByAccount(req.params.id, req.params.status);
    return res.status(200).json(result)
}

const deleteBooking = async (req, res) => {
    let result = await bookingService.deleteBooking(req.params.ID_booking, req.params.ID_patient);
    return res.status(200).json(result)
}

const getBookingForDoctor = async (req, res) => {
    let result = await bookingService.getBookingForDoctor(req.params.id, req.params.status, req.params.date, req.params.time, req.params.page);
    return res.status(200).json(result)
}

const updateBooking = async (req, res) => {
    let result = await bookingService.updateBooking(req.body);
    return res.status(200).json(result)
}

const statsBooking = async (req, res) => {
    let result = await bookingService.statsBooking(req.params.id, req.params.flag);
    return res.status(200).json(result)
}

const statsRevenue = async (req, res) => {
    let result = await bookingService.statsRevenue(req.params.id, req.params.year, req.params.flag);
    return res.status(200).json(result)
}

const getBookingForAdmin = async (req, res) => {
    let result = await bookingService.getBookingForAdmin(req.params.id, req.params.status, req.params.date, req.params.time, req.params.page, req.params.flag);
    return res.status(200).json(result)
}

const getMedicalResultByID = async (req, res) => {
    let result = await bookingService.getMedicalResultByID(req.params.id);
    return res.status(200).json(result)
}

const updateMedicalResult = async (req, res) => {
    let result = await bookingService.updateMedicalResult(req.body);
    return res.status(200).json(result)
}

const createMedicalResult = async (req, res) => {
    let result = await bookingService.createMedicalResult(req.body);
    return res.status(200).json(result)
}

const deleteMedicalResult = async (req, res) => {
    let result = await bookingService.deleteMedicalResult(req.params.id);
    return res.status(200).json(result)
}


module.exports = {
    createBooking: createBooking,
    getAllBookingByAccount: getAllBookingByAccount,
    deleteBooking: deleteBooking,
    getBookingForDoctor: getBookingForDoctor,
    updateBooking: updateBooking,
    statsBooking: statsBooking,
    statsRevenue: statsRevenue,
    getBookingForAdmin: getBookingForAdmin,
    getMedicalResultByID: getMedicalResultByID,
    updateMedicalResult: updateMedicalResult,
    createMedicalResult: createMedicalResult,
    deleteMedicalResult: deleteMedicalResult
}