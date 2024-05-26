import categoryService from '../service/categoryService';

const getAllCity = async (req, res) => {
    let result = await categoryService.getAllCity();
    return res.status(200).json(result)
}

const getAllDegree = async (req, res) => {
    let result = await categoryService.getAllDegree();
    return res.status(200).json(result)
}

const getAllSpeciality = async (req, res) => {
    let result = await categoryService.getAllSpeciality();
    return res.status(200).json(result)
}

const getAllHealthcareType = async (req, res) => {
    let result = await categoryService.getAllHealthcareType();
    return res.status(200).json(result)
}

module.exports = {
    getAllCity: getAllCity,
    getAllDegree: getAllDegree,
    getAllSpeciality: getAllSpeciality,
    getAllHealthcareType: getAllHealthcareType
}