import db from "../models/db";
import getPagingData from "../util/getPagingData";
import _, { includes } from "lodash";
import Op, { where } from "sequelize";

const createPatient = async (obj) => {
    try {
        var patient = await db.patient.create(obj);
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, patient }
}

const updatePatient = async (obj) => {
    try {
        var patient = await db.patient.update(obj, { where: { ID: obj.ID } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, patient }
}

const getAllPatientByAccount = async (id) => {
    try {
        var patients = await db.patient.findAll({
            where: { ID_account: id, IsDeleted: false },
            include: [{ model: db.booking, include: [{ model: db.schedule }] }]
        });

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, patients }
}

const deletePatient = async (id) => {
    try {
        await db.patient.update({ IsDeleted: true }, {
            where: {
                ID: id
            }
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0 }
}

const getAllPatientForDoctor = async (id, page, queryString) => {

    if (_.isEmpty(queryString)) queryString = "";

    let limit = 5;
    let offset = (limit * page) - limit;

    try {

        let condition = ""
        let condition2 = ""
        if (id === "all") {
            condition = ""
            condition2 = "left join"
        } else {
            condition = `&& ID_doctor = ${id}`
            condition2 = "join"
        }

        const [total, metadata1] = await db.sequelize.query(`
        select count(*) as total from (
            select patient.ID, Name 
            from patient ${condition2} booking on patient.ID = booking.ID_patient
            ${condition2} schedule on booking.ID_schedule = schedule.ID
            where schedule.ID_healthcare_package IS NULL && Name like "%${queryString}%" ${condition}
            group by patient.ID
        ) src;
        `);

        const [patient, metadata2] = await db.sequelize.query(`
        select patient.ID, Name, DateOfBirth, Email, Phone, Gender, Address, Health_insurance_code, Ethnicity, Citizen_id_number, IsDeleted  
        from patient ${condition2} booking on patient.ID = booking.ID_patient
        ${condition2} schedule on booking.ID_schedule = schedule.ID
        where schedule.ID_healthcare_package IS NULL && Name like "%${queryString}%" ${condition}
        group by patient.ID, Name, DateOfBirth, Email, Phone, Gender, Address, Health_insurance_code, Ethnicity, Citizen_id_number, IsDeleted  
        limit ${limit} offset ${offset}
        `);

        let tempData = {
            count: total[0].total,
            rows: patient
        }

        if (id === "all") {
            for (let item of patient) {
                item.booking = await db.booking.findAll({
                    where: { ID_patient: item.ID },
                    include: [{ model: db.schedule, where: { ID_healthcare_package: null }, include: [{ model: db.doctor }] }]
                })
            }
        } else {
            for (let item of patient) {
                item.booking = await db.booking.findAll({
                    where: { ID_patient: item.ID },
                    include: [{ model: db.schedule, where: { ID_healthcare_package: null }, include: [{ model: db.doctor }], where: { ID_doctor: id } }]
                })
            }
        }

        var data = getPagingData(tempData, page, limit)

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, data }
}

const getAllPatientByHealthCare = async (id, page, queryString) => {

    if (_.isEmpty(queryString)) queryString = "";

    let limit = 5;
    let offset = (limit * page) - limit;

    try {

        let condition = ""
        let condition2 = ""
        if (id === "all") {
            condition = ""
            condition2 = "left join"
        } else {
            condition = `&& ID_healthcare_package = ${id}`
            condition2 = "join"
        }

        const [total, metadata1] = await db.sequelize.query(`
        select count(*) as total from (
            select patient.ID, Name 
            from patient ${condition2} booking on patient.ID = booking.ID_patient
            ${condition2} schedule on booking.ID_schedule = schedule.ID
            where schedule.ID_doctor IS NULL && Name like "%${queryString}%" ${condition}
            group by patient.ID
        ) src;
        `);

        const [patient, metadata2] = await db.sequelize.query(`
        select patient.ID, Name, DateOfBirth, Email, Phone, Gender, Address, Health_insurance_code, Ethnicity, Citizen_id_number, IsDeleted  
        from patient ${condition2} booking on patient.ID = booking.ID_patient
        ${condition2} schedule on booking.ID_schedule = schedule.ID
        where schedule.ID_doctor IS NULL && Name like "%${queryString}%" ${condition}
        group by patient.ID, Name, DateOfBirth, Email, Phone, Gender, Address, Health_insurance_code, Ethnicity, Citizen_id_number, IsDeleted  
        limit ${limit} offset ${offset}
        `);

        let tempData = {
            count: total[0].total,
            rows: patient
        }

        if (id === "all") {
            for (let item of patient) {
                item.booking = await db.booking.findAll({
                    where: { ID_patient: item.ID },
                    include: [{ model: db.schedule, where: { ID_doctor: null }, include: [{ model: db.healthcare_package }] }]
                })
            }
        } else {
            for (let item of patient) {
                item.booking = await db.booking.findAll({
                    where: { ID_patient: item.ID },
                    include: [{ model: db.schedule, where: { ID_doctor: null }, include: [{ model: db.healthcare_package }], where: { ID_healthcare_package: id } }]
                })
            }
        }

        var data = getPagingData(tempData, page, limit)

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, data }
}

module.exports = {
    createPatient: createPatient,
    getAllPatientByAccount: getAllPatientByAccount,
    deletePatient: deletePatient,
    updatePatient: updatePatient,
    getAllPatientForDoctor: getAllPatientForDoctor,
    getAllPatientByHealthCare: getAllPatientByHealthCare
}