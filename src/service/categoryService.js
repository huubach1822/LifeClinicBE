import db from "../models/db";

const getAllCity = async () => {
    try {
        var city = await db.city.findAll();
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, city }
}

const getAllDegree = async () => {
    try {
        var degree = await db.degree.findAll();
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, degree }
}

const getAllSpeciality = async () => {
    try {
        var speciality = await db.speciality.findAll();
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, speciality }
}

const getAllHealthcareType = async () => {
    try {
        var healthcareType = await db.healthcare_type.findAll();
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, healthcareType }
}

module.exports = {
    getAllCity: getAllCity,
    getAllDegree: getAllDegree,
    getAllSpeciality: getAllSpeciality,
    getAllHealthcareType: getAllHealthcareType
}