import db from "../models/db";
import { Sequelize, where } from "sequelize";
import _ from "lodash";
import getPagingData from "../util/getPagingData";
import path from 'path';
import fs from 'fs';
import { Op } from "sequelize";
import { hashPassword } from "../util/hashPassword";

const getAllDoctors = async () => {
    try {
        var doctors = await db.doctor.findAll({
            include: [
                { model: db.clinic, attributes: ['Name', 'Address'] },
                { model: db.speciality, attributes: ['Name'] },
                { model: db.degree, attributes: ['Name'] }
            ],
            where: {
                IsDeleted: false
            }
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, doctors }
}

const getDoctorDetail = async (id) => {
    try {

        var doctorDetail = {

        };

        if (id === "all") {
            id = {
                [Op.not]: null
            }
        } else {
            doctorDetail = await db.doctor.findOne({
                include: [
                    { model: db.clinic, attributes: ['Name', 'Address', 'Latitude', 'Longitude'] },
                    { model: db.speciality, attributes: ['Name'] },
                    { model: db.degree, attributes: ['Name'] }
                ],
                where: { ID: id },
            });
        }

        var doctorSchedule = await db.doctor.findAll({
            attributes: [],
            include: [
                { model: db.schedule, attributes: ['Date'] }
            ],
            group: ['Date'],
            raw: true,
            where: { ID: id },
        });

        if (_.isEmpty(doctorDetail)) {
            let temp = doctorSchedule.map((x) => Object.values(x)).flat(1)
            doctorDetail = {
                doctorSchedule: temp
            }
        }
        else {
            doctorDetail.dataValues.doctorSchedule = doctorSchedule.map((x) => Object.values(x)).flat(1)
        }


    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, doctorDetail }
}

const getDoctorByClinic = async (clinicID) => {

    try {
        var result = await db.clinic.findOne({
            include: [
                { model: db.doctor, include: [{ model: db.degree }, { model: db.speciality }], where: { IsDeleted: false }, required: false },
                { model: db.city },
                { model: db.clinic_image }
            ],
            where: { ID: clinicID },
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const getAllDoctorsPagination = async (page, queryString, idCity, idSpeciality, priceOrder) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";
    if (_.isEmpty(idCity)) idCity = {
        [Op.not]: null
    };
    if (_.isEmpty(idSpeciality)) idSpeciality = {
        [Op.not]: null
    };
    let orderCondition = [];
    if (!_.isEmpty(priceOrder)) {
        orderCondition = [
            ['Price', priceOrder]
        ]
    }

    let limit = 8;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.doctor.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.clinic, attributes: ['ID', 'Name', 'Address'], where: { ID_city: idCity } },
                { model: db.speciality, attributes: ['ID', 'Name'], where: { ID: idSpeciality } },
                { model: db.degree, attributes: ['ID', 'Name'] }
            ],
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
                // '$clinic.ID_city$': idCity,
                // ID_speciality: idSpeciality,
                IsDeleted: false
            },
            order: orderCondition
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(rawData, page, limit)

    return {
        message: "Success",
        code: 0,
        data
    }
}

const getDoctorByAccount = async (accountID) => {
    try {
        var doctor = await db.doctor.findOne({
            include: [
                { model: db.account, where: { ID: accountID } },
                { model: db.clinic, attributes: ['ID', 'Name', 'Address', 'Latitude', 'Longitude'] },
                { model: db.speciality, attributes: ['ID', 'Name'] },
                { model: db.degree, attributes: ['ID', 'Name'] }
            ],
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, doctor }
}

const updateDoctorByID = async (obj, image) => {
    try {
        let doctor = JSON.parse(obj.doctor)
        if (!_.isEmpty(image?.filename)) {
            let tempDoc = await db.doctor.findOne({ where: { ID: doctor.ID } })
            fs.unlink(path.join(__dirname, '..', 'images', tempDoc.Avatar), (err => { if (err) console.log(err); }));
            doctor.Avatar = image.filename
        }
        var result = await db.doctor.update(doctor, { where: { ID: doctor.ID } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const getAllDocSpeciality = async (queryString) => {

    if (_.isEmpty(queryString)) queryString = "";

    try {
        var result = await db.speciality.findAll(
            {
                attributes: ['ID', 'Name', [Sequelize.fn('COUNT', Sequelize.col('doctors.ID')), 'count_doctor']],
                include: [{ model: db.doctor, attributes: [] }],
                where: {
                    Name: {
                        [Op.like]: `%${queryString}%`
                    }
                },
                group: ['ID', 'Name'],
            }
        );
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const createDocSpeciality = async (obj) => {
    try {
        let temp = await db.speciality.findOne({ where: { ID: obj.Name } })
        if (!_.isEmpty(temp)) {
            return { message: "Speciality already exists", code: 1 }
        }
        var result = await db.speciality.create(obj);
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const updateDocSpeciality = async (obj) => {
    try {
        var result = await db.speciality.update(obj, { where: { ID: obj.ID } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const deleteDocSpeciality = async (id) => {
    try {
        var result = await db.speciality.destroy({ where: { ID: id } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const getAllDoctorsAdmin = async (page, queryString, clinicID) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";

    if (clinicID === "all") clinicID = {
        [Op.not]: null
    }

    let limit = 8;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.doctor.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.clinic, attributes: ['ID', 'Name', 'Address'], where: { ID: clinicID } },
                { model: db.speciality, attributes: ['ID', 'Name'] },
                { model: db.degree, attributes: ['ID', 'Name'] },
                { model: db.account },
            ],
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
                // ID_clinic: clinicID
            },
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(rawData, page, limit)

    return {
        message: "Success",
        code: 0,
        data
    }
}

const createDoctor = async (obj, image) => {
    try {

        let account = JSON.parse(obj.account)
        let user = await db.account.findOne({
            where: {
                Username: account.Username
            }
        });

        if (!_.isEmpty(user)) {
            return { message: "Username already exists", code: 1 };
        } else {
            let pass = await hashPassword(account.Password);
            var tempacc = await db.account.create({ Username: account.Username, Password: pass, ID_account_type: 2 });
        }

        let doctor = JSON.parse(obj.doctor)
        doctor.Avatar = image.filename
        doctor.ID_account = tempacc.ID
        doctor.IsDeleted = false
        var result = await db.doctor.create(doctor);
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const deleteDoctorByID = async (id) => {
    try {
        var result = await db.doctor.update({ IsDeleted: true }, { where: { ID: id } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
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