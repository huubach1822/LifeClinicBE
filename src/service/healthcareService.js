import db from "../models/db";
import _ from "lodash";
import getPagingData from "../util/getPagingData";
import { Sequelize, where } from "sequelize";
import { Op } from "sequelize";

const getAllHealthcarePackage = async () => {
    try {
        var healthcarePackage = await db.healthcare_package.findAll({
            include: [
                { model: db.clinic, attributes: ['Name', 'Address', 'Logo'] },
                { model: db.healthcare_type, attributes: ['Name'] }
            ],
            where: { IsDeleted: false }
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, healthcarePackage }
}

const getAllHealthcarePagination = async (page, queryString, idCity, idType, priceOrder) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";
    if (_.isEmpty(idCity)) idCity = {
        [Op.not]: null
    };
    if (_.isEmpty(idType)) idType = {
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
        var rawData = await db.healthcare_package.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.clinic, attributes: ['ID', 'Name', 'Address'], where: { ID_city: idCity } },
                { model: db.healthcare_type, attributes: ['ID', 'Name'], where: { ID: idType } }
            ],
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
                // '$clinic.ID_city$': idCity,
                // ID_healthcare_type: idType,
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

const getHealthcareDetail = async (id) => {

    try {

        var healthcareDetail = {

        }

        if (id === "all") {
            id = {
                [Op.not]: null
            }
        } else {
            healthcareDetail = await db.healthcare_package.findOne({
                include: [
                    { model: db.clinic, attributes: ['Name', 'Address', 'Latitude', 'Longitude'] },
                    { model: db.healthcare_type, attributes: ['Name'] },
                    { model: db.healthcare_service }
                ],
                where: { ID: id }
            });
        }

        var healthcareSchedule = await db.healthcare_package.findAll({
            attributes: [],
            include: [
                { model: db.schedule, attributes: ['Date'] }
            ],
            group: ['Date'],
            raw: true,
            where: { ID: id },
        });

        if (_.isEmpty(healthcareDetail)) {
            let temp = healthcareSchedule.map((x) => Object.values(x)).flat(1)
            healthcareDetail = {
                healthcareSchedule: temp
            }
        }
        else {
            healthcareDetail.dataValues.healthcareSchedule = healthcareSchedule.map((x) => Object.values(x)).flat(1)
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, healthcareDetail }
}

const getHealthcareByClinic = async (clinicID) => {

    try {
        var result = await db.clinic.findOne({
            include: [
                { model: db.healthcare_package, include: [{ model: db.healthcare_type }], where: { IsDeleted: false }, required: false },
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


const getAllHealthcareTypeAdmin = async (queryString) => {

    if (_.isEmpty(queryString)) queryString = "";

    try {
        var result = await db.healthcare_type.findAll(
            {
                attributes: ['ID', 'Name', [Sequelize.fn('COUNT', Sequelize.col('healthcare_packages.ID')), 'count_package']],
                include: [{ model: db.healthcare_package, attributes: [] }],
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

const createHealthcareType = async (obj) => {
    try {
        let temp = await db.healthcare_type.findOne({ where: { ID: obj.Name } })
        if (!_.isEmpty(temp)) {
            return { message: "Healthcare type already exists", code: 1 }
        }
        var result = await db.healthcare_type.create(obj);
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const updateHealthcareType = async (obj) => {
    try {
        var result = await db.healthcare_type.update(obj, { where: { ID: obj.ID } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const deleteHealthcareType = async (id) => {
    try {
        var result = await db.healthcare_type.destroy({ where: { ID: id } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}


const getAllHealthcarePaginationAdmin = async (page, queryString, clinicID) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";
    if (clinicID == "all") clinicID = {
        [Op.not]: null
    };

    let limit = 8;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.healthcare_package.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                {
                    model: db.clinic, attributes: ['ID', 'Name', 'Address'],
                    where: {
                        ID: clinicID
                    }
                },
                { model: db.healthcare_type, attributes: ['ID', 'Name'] },
                { model: db.healthcare_service }
            ],
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
                // ID_clinic: clinicID
            },
            // raw: true
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    let data = getPagingData(rawData, page, limit)

    for (let i = 0; i < data.result.length; i++) {
        let service = await db.healthcare_service.findAll({ where: { ID_healthcare_package: data.result[i].ID }, raw: true })
        data.result[i].healthcare_services = service
    }

    return {
        message: "Success",
        code: 0,
        data
    }
}

const createHealthcarePackage = async (obj) => {
    try {
        let temp = await db.healthcare_package.create(obj);

        for (var i = 0; i < obj.dataService.length; i++) {
            var service = obj.dataService[i];
            service.ID = service.id
            service.ID_healthcare_package = temp.ID
            await db.healthcare_service.create(service)
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const updateHealthcarePackage = async (obj) => {
    try {

        var temp = await db.healthcare_package.update(obj, { where: { ID: obj.ID } });

        for (var i = 0; i < obj.dataService.length; i++) {
            var service = obj.dataService[i];
            if (service.status == 'delete') {
                await db.healthcare_service.destroy({ where: { ID: service.ID } })
            }
            if (service.status == 'update') {
                await db.healthcare_service.update(service, { where: { ID: service.ID } })
            }
            if (service.status == 'create') {
                service.ID = service.id
                service.ID_healthcare_package = obj.ID
                await db.healthcare_service.create(service)
            }
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const deleteHealthcarePackage = async (id) => {
    try {
        var result = await db.healthcare_package.update({ IsDeleted: true }, { where: { ID: id } });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
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