import db from "../models/db";
import _ from 'lodash';
import { Sequelize, where } from "sequelize";
import getPagingData from "../util/getPagingData";

const getAllTimeType = async () => {
    try {
        var timeType = await db.time_type.findAll();
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, timeType }
}

const getDoctorScheduleByDate = async (doctorID, date) => {

    try {
        var timeSchedule = await db.schedule.findAll({
            include: [
                { model: db.time_type, attributes: ['ID', 'Value'] },
            ],
            where: { ID_doctor: doctorID, Date: date, Current_number: { [Sequelize.Op.lt]: Sequelize.col('Max_number') } },
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, timeSchedule }
}

const getHealthcareScheduleByDate = async (healthcareID, date) => {

    try {
        var timeSchedule = await db.schedule.findAll({
            include: [
                { model: db.time_type, attributes: ['ID', 'Value'] },
            ],
            where: { ID_healthcare_package: healthcareID, Date: date, Current_number: { [Sequelize.Op.lt]: Sequelize.col('Max_number') } },
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, timeSchedule }
}

const createScheduleForDoctor = async (data) => {
    // parseInt fe 
    try {
        if (_.isEmpty(data.Date_arr)) {
            for (let idTimeType of data.Time_type_arr) {
                await db.schedule.create({
                    ID_doctor: data.ID_doctor,
                    ID_time_type: parseInt(idTimeType),
                    Date: data.Date,
                    Max_number: parseInt(data.Max_number),
                    Current_number: 0
                })
            }
        } else {
            for (let date of data.Date_arr) {
                for (let idTimeType of data.Time_type_arr) {
                    await db.schedule.create({
                        ID_doctor: data.ID_doctor,
                        ID_time_type: parseInt(idTimeType),
                        Date: date,
                        Max_number: parseInt(data.Max_number),
                        Current_number: 0
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const getScheduleForDoctor = async (doctorID, date, page) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(date)) {
        date = {
            [Op.not]: null
        };
    }
    if (doctorID === "all") {
        doctorID = {
            [Op.not]: null
        };
    }
    if (_.isEmpty(page)) page = 1;

    let limit = 10;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.schedule.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.time_type, attributes: ['ID', 'Value'] },
                { model: db.booking, include: [{ model: db.patient }] },
                { model: db.doctor, attributes: ['ID', 'Name'], where: { ID: doctorID } }
            ],
            where: {
                // ID_doctor: doctorID, 
                Date: date
            },
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(rawData, page, limit)

    return { message: "Success", code: 0, data }
}

const updateMaxPatient = async (data) => {
    try {
        await db.schedule.update({ Max_number: data.Max_number }, { where: { ID: data.ID } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const deleteSchedule = async (id) => {
    try {
        await db.schedule.destroy({ where: { ID: id } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const createScheduleForHealthcare = async (data) => {

    // parseInt fe 
    try {
        if (_.isEmpty(data.Date_arr)) {
            for (let idTimeType of data.Time_type_arr) {
                await db.schedule.create({
                    ID_healthcare_package: data.ID_healthcare,
                    ID_time_type: parseInt(idTimeType),
                    Date: data.Date,
                    Max_number: parseInt(data.Max_number),
                    Current_number: 0
                })
            }
        } else {
            for (let date of data.Date_arr) {
                for (let idTimeType of data.Time_type_arr) {
                    await db.schedule.create({
                        ID_healthcare_package: data.ID_healthcare,
                        ID_time_type: parseInt(idTimeType),
                        Date: date,
                        Max_number: parseInt(data.Max_number),
                        Current_number: 0
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}


const getScheduleForHealthcare = async (healthcareID, date, page) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(date)) {
        date = {
            [Op.not]: null
        };
    }
    if (healthcareID === "all") {
        healthcareID = {
            [Op.not]: null
        };
    }
    if (_.isEmpty(page)) page = 1;

    let limit = 10;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.schedule.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.time_type, attributes: ['ID', 'Value'] },
                { model: db.booking, include: [{ model: db.patient }] },
                { model: db.healthcare_package, where: { ID: healthcareID } }
            ],
            where: {
                // ID_healthcare_package: healthcareID, 
                Date: date
            },
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(rawData, page, limit)

    return { message: "Success", code: 0, data }
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