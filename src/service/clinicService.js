import db from "../models/db";
import _ from "lodash"
import { Sequelize, where } from "sequelize";
import getPagingData from "../util/getPagingData";
import processImgContent from "../util/ImageConvert";
import path from 'path';
import fs from 'fs';

const getTotalAdmin = async () => {
    try {

        var result = {}
        result.totalClinic = await db.clinic.count();
        result.totalDoctor = await db.doctor.count();
        result.totalHealthcarePackage = await db.healthcare_package.count();
        result.totalPatient = await db.patient.count();

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const searchAll = async (queryString) => {

    if (_.isEmpty(queryString)) queryString = "";

    let limit = 5

    try {
        var clinics = await db.clinic.findAll({
            limit: limit,
            where: {
                Name: {
                    [Sequelize.Op.like]: `%${queryString}%`
                }
            }
        });

        var doctors = await db.doctor.findAll({
            limit: limit,
            where: {
                Name: {
                    [Sequelize.Op.like]: `%${queryString}%`
                }
            },
            include: [{ model: db.clinic }, { model: db.speciality }]
        });

        var healthcarePackages = await db.healthcare_package.findAll({
            limit: limit,
            where: {
                Name: {
                    [Sequelize.Op.like]: `%${queryString}%`
                }
            },
            include: [{ model: db.clinic }]
        });

        var data = {
            clinics,
            doctors,
            healthcarePackages
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, data }
}

const getAllClinics = async (isDeleted) => {

    const Op = Sequelize.Op;

    if (isDeleted == "true") {
        isDeleted = {
            [Op.not]: null
        };
    } else {
        isDeleted = false
    }

    try {
        var clinics = await db.clinic.findAll({
            where: {
                IsDeleted: isDeleted
            }
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, clinics }
}

const getAllClinicsPagination = async (page, queryString, idCity, isDeleted) => {

    const Op = Sequelize.Op;

    if (isDeleted == "true") {
        isDeleted = {
            [Op.not]: null
        };
    } else {
        isDeleted = false
    }

    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";
    if (_.isEmpty(idCity)) idCity = {
        [Op.not]: null
    };

    let limit = 6;
    let offset = (limit * page) - limit;

    try {
        var clinics = await db.clinic.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
                // ID_city: idCity,
                IsDeleted: isDeleted
            },
            include: [{ model: db.city, where: { ID: idCity } }],
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(clinics, page, limit)

    return {
        message: "Success",
        code: 0,
        data
    }

}

const createClinic = async (obj, clinicImage) => {

    try {

        let clinic = JSON.parse(obj.clinic)

        let city = await db.city.findOne({ where: { Name: clinic.CityName } })
        if (_.isEmpty(city)) {
            city = await db.city.create({ Name: clinic.CityName })
        }

        clinic.Logo = clinicImage[0].filename
        clinic.Latitude = parseFloat(clinic.Latitude)
        clinic.Longitude = parseFloat(clinic.Longitude)
        clinic.ID_city = city.ID
        clinic.IsDeleted = false
        clinic = await db.clinic.create(clinic)

        for (let i = 1; i < clinicImage.length; i++) {
            await db.clinic_image.create({ ID_clinic: clinic.ID, Image: clinicImage[i].filename })
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0 }
}

const updateClinicByID = async (obj, image) => {

    try {
        let clinic = JSON.parse(obj.clinic)
        if (!_.isEmpty(image?.filename)) {
            let tempClinic = await db.clinic.findOne({ where: { ID: clinic.ID } })
            fs.unlink(path.join(__dirname, '..', 'images', tempClinic.Logo), (err => { if (err) console.log(err); }))
            clinic.Logo = image.filename
        }

        let city = await db.city.findOne({ where: { Name: clinic.CityName } })
        if (_.isEmpty(city)) {
            city = await db.city.create({ Name: clinic.CityName })
        }

        clinic.Latitude = parseFloat(clinic.Latitude)
        clinic.Longitude = parseFloat(clinic.Longitude)
        clinic.ID_city = city.ID
        clinic.Description = await processImgContent(clinic.Description)
        var result = await db.clinic.update(clinic, { where: { ID: clinic.ID } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }

}

const deleteClinicByID = async (id) => {

    try {
        var result = await db.clinic.update({ IsDeleted: true }, { where: { ID: id } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const getClinicImage = async (id) => {

    const Op = Sequelize.Op;
    if (id === "all") id = {
        [Op.not]: null
    }

    try {
        var result = await db.clinic_image.findAll({ where: { ID_Clinic: id }, include: [{ model: db.clinic }] })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const deleteClinicImage = async (id) => {
    try {
        var result = await db.clinic_image.destroy({ where: { ID: id } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const createClinicImage = async (obj, image) => {
    try {

        let clinic = JSON.parse(obj.clinic)
        for (let i = 0; i < image.length; i++) {
            await db.clinic_image.create({ ID_clinic: clinic.ID, Image: image[i].filename })
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
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