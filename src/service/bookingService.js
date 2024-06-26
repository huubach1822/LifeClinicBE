import db from "../models/db";
import _ from 'lodash';
import Sequelize from "sequelize";
const { Op } = require("sequelize");
import dayjs from "dayjs";
import getPagingData from "../util/getPagingData";
import sendMail from "../util/sendEmail";


const createBooking = async (obj) => {
    try {

        var scheduleTemp = await db.schedule.findOne({
            where: { ID: obj.ID_schedule },
            include: { model: db.time_type },
        });

        let temp = await db.booking.findAll({
            attributes: ['ID_patient', 'ID_schedule'],
            include: [{ model: db.schedule, attributes: ['Date'] }],
            group: ['Date', 'ID_patient', 'ID_schedule'],
            where: {
                ID_patient: obj.ID_patient,
                '$schedule.Date$': scheduleTemp.Date,
                Status: { [Op.not]: "Cancelled" },
            },
            raw: true,
        });
        if (!_.isEmpty(temp)) {
            return { message: "A patient can only make one appointment per day", code: 1 };
        } else {
            if (scheduleTemp.Current_number >= scheduleTemp.Max_number) {
                return { message: "The number of appointments for this day has reached the maximum capacity", code: 1 };
            } else {

                if (obj.Status !== "Cancelled") {
                    scheduleTemp.update({ Current_number: scheduleTemp.Current_number + 1 });
                    await scheduleTemp.save();
                }

                let book = await db.booking.create(obj);

                let payment = obj.PaymentInfo;
                payment.ID_booking = book.ID;
                await db.payment.create(payment);

                let patient = await db.patient.findOne({
                    where: { ID: obj.ID_patient },
                });

                if (!_.isEmpty(obj.dataServices)) {
                    for (let i = 0; i < obj.dataServices.length; i++) {
                        await db.booking_package_service.create({ ID_booking: book.ID, ID_healthcare_service: obj.dataServices[i].ID })
                    }
                }

                let tempString = ``

                if (scheduleTemp.ID_doctor != null) {
                    var tempDoc = await db.doctor.findOne({ where: { ID: scheduleTemp.ID_doctor }, include: { model: db.clinic, attributes: ['Name'] } })
                    tempString = `Doctor: ${tempDoc.Name}<br>Clinic: ${tempDoc.clinic.Name}`
                } else {
                    var tempHCP = await db.healthcare_package.findOne({ where: { ID: scheduleTemp.ID_healthcare_package }, include: { model: db.clinic, attributes: ['Name'] } })
                    tempString = `Healthcare package: ${tempHCP.Name}<br>Clinic: ${tempHCP.clinic.Name}`
                }
                // send email
                if (obj.Status !== "Cancelled") {
                    sendMail(patient.Email,
                        "Appointment Confirmed",
                        `Dear ${patient.Name},<br><br>
                        We're thrilled to inform you that your appointment has been successfully booked. Your commitment to your health is truly commendable, and we're honored to be a part of your wellness journey.<br>
                        Your appointment details are as follows:<br>
                        Booking ID: ${book.ID}<br>
                        Date: ${scheduleTemp.Date}<br>
                        Time: ${scheduleTemp.time_type.Value}<br>
                        ${tempString}<br><br>
                        Thank you for choosing us!<br>
                        Best regards,<br>
                        The LifeClinic Team`
                        // `Dear ${patient.Name},\n\nWe're thrilled to inform you that your appointment has been successfully booked. Your commitment to your health is truly commendable, and we're honored to be a part of your wellness journey.\n\nYour appointment details are as follows:\nBooking ID: ${book.ID}.\nDate: ${scheduleTemp.Date}.\nTime: ${scheduleTemp.time_type.Value}.\n${tempString}\n\nThank you for choosing us!\n\nBest regards,\nThe LifeClinic Team`
                    )
                } else {
                    sendMail(patient.Email,
                        "Appointment Cancellation",
                        `Dear ${patient.Name},<br><br>
                        We regret to inform you that your appointment has been canceled.<br>
                        Your appointment details are as follows:<br>
                        Booking ID: ${book.ID}<br>
                        Date: ${scheduleTemp.Date}<br>
                        Time: ${scheduleTemp.time_type.Value}<br>
                        ${tempString}<br><br>
                        Thank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.<br>
                        Best regards,<br>
                        The LifeClinic Team`
                        // `Dear ${patient.Name},\n\nWe regret to inform you that your appointment has been canceled.\n\nYour appointment details are as follows:\nBooking ID: ${book.ID}.\nDate: ${scheduleTemp.Date}.\nTime: ${scheduleTemp.time_type.Value}.\n${tempString}\n\nThank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.\n\nBest regards,\nThe LifeClinic Team`
                    )
                }
            }
        }
    } catch (error) {
        console.log(error)
        return { message: "error", code: 1 }
    }

    return { message: "success", code: 0 }
}

const getAllBookingByAccount = async (id, status) => {

    let opStatus = null
    if (status === "now") {
        opStatus = { [Op.or]: ["Pending", "Approved"] } //
    } else {
        opStatus = { [Op.or]: ["Cancelled", "Finished"] }
    }

    try {
        var booking = await db.booking.findAll({
            where: { '$patient.account.ID$': id, Status: opStatus },
            include: [
                { model: db.patient, include: [{ model: db.account, attributes: ['ID', 'Username'] }] },
                {
                    model: db.schedule,
                    include: [
                        { model: db.doctor, attributes: ['Name', 'ID_clinic', 'ID_speciality', 'Price'], include: [{ model: db.clinic, attributes: ['Name', 'Address'] }, { model: db.speciality }] },
                        { model: db.healthcare_package, attributes: ['Name', 'ID_clinic', 'ID_healthcare_type', 'Price'], include: [{ model: db.clinic, attributes: ['Name', 'Address'] }, { model: db.healthcare_type }] },
                        { model: db.time_type }
                    ]
                },
                {
                    model: db.booking_package_service, include: [{ model: db.healthcare_service }]
                },
                {
                    model: db.payment
                }
            ],
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, booking }
}

const deleteBooking = async (ID_booking, ID_schedule) => {
    try {

        await db.booking.update({ Status: "Cancelled" }, {
            where: {
                ID: ID_booking
            }
        });

        await db.schedule.update({ Current_number: Sequelize.literal('Current_number - 1') }, { where: { ID: ID_schedule } });

        let tempPayment = await db.payment.findOne({ where: { ID_booking: ID_booking } })
        if (tempPayment.Payment_method === "Cash") {
            tempPayment.Status = "Cancel"
            var now = dayjs()
            tempPayment.Payment_date = now.format('MM-DD-YYYY')
            await tempPayment.save()
        }

        let tempBooking = await db.booking.findOne({ where: { ID: ID_booking } });
        let scheduleTemp = await db.schedule.findOne({ where: { ID: ID_schedule }, include: [{ model: db.time_type }] });
        let patient = await db.patient.findOne({
            where: { ID: tempBooking.ID_patient },
        });

        let tempString = ``

        if (scheduleTemp.ID_doctor != null) {
            var tempDoc = await db.doctor.findOne({ where: { ID: scheduleTemp.ID_doctor }, include: { model: db.clinic, attributes: ['Name'] } })
            tempString = `Doctor: ${tempDoc.Name}<br>Clinic: ${tempDoc.clinic.Name}`
        } else {
            var tempHCP = await db.healthcare_package.findOne({ where: { ID: scheduleTemp.ID_healthcare_package }, include: { model: db.clinic, attributes: ['Name'] } })
            tempString = `Healthcare package: ${tempHCP.Name}<br>Clinic: ${tempHCP.clinic.Name}`
        }
        // send email
        sendMail(patient.Email,
            "Appointment Cancellation",
            `Dear ${patient.Name},<br><br>
            We regret to inform you that your appointment has been canceled.<br>
            Your appointment details are as follows:<br>
            Booking ID: ${ID_booking}<br>
            Date: ${scheduleTemp.Date}<br>
            Time: ${scheduleTemp.time_type.Value}<br>
            ${tempString}<br><br>
            Thank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.<br>
            Best regards,<br>
            The LifeClinic Team`
            // `Dear ${patient.Name},\n\nWe regret to inform you that your appointment has been canceled.\n\nYour appointment details are as follows:\nBooking ID: ${ID_booking}.\nDate: ${scheduleTemp.Date}.\nTime: ${scheduleTemp.time_type.Value}.\n${tempString}\n\nThank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.\n\nBest regards,\nThe LifeClinic Team`
        )

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0 }
}

const getBookingForDoctor = async (id, status, date, time, page) => {

    if (id === "all") id = {
        [Op.not]: null
    };

    if (date === "all") date = {
        [Op.not]: null
    };

    if (status === "all") status = {
        [Op.not]: null
    };

    if (time === "all") time = {
        [Op.not]: null
    };

    let limit = 10;
    let offset = (limit * page) - limit;

    try {
        var booking = await db.booking.findAndCountAll({
            offset: offset,
            limit: limit,
            include: [
                { model: db.payment },
                { model: db.patient, include: [{ model: db.account, attributes: ['ID', 'Username'] }] },
                { model: db.schedule, where: { Date: date }, include: [{ model: db.doctor, where: { ID: id } }, { model: db.time_type, where: { ID: time } }] },
            ],
            where: { Status: status }
        })

        var scheduleDate = await db.booking.findAll({
            attributes: [],
            include: [
                { model: db.schedule, attributes: ['Date'], where: { ID_doctor: id } },
            ],
            where: { Status: status },
            group: ['Date'],
            raw: true,
        });

        let data = getPagingData(booking, page, limit)

        var result = {
            booking: data,
            scheduleDate: scheduleDate.map((x) => Object.values(x)).flat(1)
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const updateBooking = async (obj) => {

    try {
        await db.booking.update({ Status: obj.Status }, {
            where: {
                ID: obj.ID
            }
        });

        let bookingTemp = await db.booking.findOne({
            where: {
                ID: obj.ID
            },
        })
        let scheduleTemp = await db.schedule.findOne({
            where: {
                ID: obj.ID_schedule
            },
            include: [{ model: db.time_type }]
        });
        let patient = await db.patient.findOne({
            where: {
                ID: bookingTemp.ID_patient
            }
        });

        let tempString = ``

        if (scheduleTemp.ID_doctor != null) {
            var tempDoc = await db.doctor.findOne({ where: { ID: scheduleTemp.ID_doctor }, include: { model: db.clinic, attributes: ['Name'] } })
            tempString = `Doctor: ${tempDoc.Name}<br>Clinic: ${tempDoc.clinic.Name}`
        } else {
            var tempHCP = await db.healthcare_package.findOne({ where: { ID: scheduleTemp.ID_healthcare_package }, include: { model: db.clinic, attributes: ['Name'] } })
            tempString = `Healthcare package: ${tempHCP.Name}<br>Clinic: ${tempHCP.clinic.Name}`
        }

        if (obj.Status === "Cancelled") {
            await db.schedule.update({ Current_number: Sequelize.literal('Current_number - 1') }, { where: { ID: obj.ID_schedule } });

            let tempPayment = await db.payment.findOne({ where: { ID_booking: obj.ID } })
            if (tempPayment.Payment_method === "Cash") {
                tempPayment.Status = "Cancel"
                var now = dayjs()
                tempPayment.Payment_date = now.format('MM-DD-YYYY')
                await tempPayment.save()
            }
            // send email
            sendMail(patient.Email,
                "Appointment Cancellation",
                `Dear ${patient.Name},<br><br>
                We regret to inform you that your appointment has been canceled.<br>
                Your appointment details are as follows:<br>
                Booking ID: ${obj.ID}<br>
                Date: ${scheduleTemp.Date}<br>
                Time: ${scheduleTemp.time_type.Value}<br>
                ${tempString}<br><br>
                Thank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.<br>
                Best regards,<br>
                The LifeClinic Team`
                // `Dear ${patient.Name},\n\nWe regret to inform you that your appointment has been canceled.\n\nYour appointment details are as follows:\nBooking ID: ${obj.ID}.\nDate: ${scheduleTemp.Date}.\nTime: ${scheduleTemp.time_type.Value}.\n${tempString}\n\nThank you for considering our services for your healthcare needs. We appreciate your understanding and look forward to serving you in the future.\n\nBest regards,\nThe LifeClinic Team`
            )
        } else if (obj.Status === "Finished") {

            let tempPayment = await db.payment.findOne({ where: { ID_booking: obj.ID } })
            if (tempPayment.Payment_method === "Cash") {
                tempPayment.Status = "Success"
                var now = dayjs()
                tempPayment.Payment_date = now.format('MM-DD-YYYY')
                await tempPayment.save()
            }
            // send email
            sendMail(patient.Email,
                "Appointment Finished",
                `Dear ${patient.Name},<br><br>
                I wanted to take a moment to express my sincere gratitude for choosing our services. Your trust in us means a great deal, and we are grateful for the opportunity to serve you. We will notify you as soon as possible about the medical examination results. If you have any further questions or concerns, please don't hesitate to reach out to us.<br><br>
                Thank you once again for choosing us. We look forward to seeing you again soon.<br>
                Best regards,<br>
                The LifeClinic Team`
                // `Dear ${patient.Name},\n\nI wanted to take a moment to express my sincere gratitude for choosing our services. Your trust in us means a great deal, and we are grateful for the opportunity to serve you. You can check the medical examination results on our website. If you have any further questions or concerns, please don't hesitate to reach out to us.\n\nThank you once again for choosing us. We look forward to seeing you again soon.\n\nBest regards,\nThe LifeClinic Team`
            )
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0 }
}

const statsBooking = async (id, flag) => {

    if (id === "all") id = {
        [Op.not]: null
    };

    if (flag === "doctor") {
        var id_doc = id
        var id_hc = null
    } else {
        var id_doc = null
        var id_hc = id
    }

    try {
        var all = await db.booking.count({
            include: [
                {
                    model: db.schedule,
                    where: {
                        [Op.and]: [
                            // Sequelize.where(
                            //     Sequelize.fn('Year', Sequelize.fn('STR_TO_DATE', Sequelize.col('Date'), '%m-%d-%Y')),
                            //     year
                            // ),
                            { ID_doctor: id_doc },
                            { ID_healthcare_package: id_hc }
                        ]
                    }
                },
            ],
        });
        var pending = await db.booking.count({
            include: [
                {
                    model: db.schedule,
                    where: {
                        [Op.and]: [
                            // Sequelize.where(
                            //     Sequelize.fn('Year', Sequelize.fn('STR_TO_DATE', Sequelize.col('Date'), '%m-%d-%Y')),
                            //     year
                            // ),
                            { ID_doctor: id_doc },
                            { ID_healthcare_package: id_hc }
                        ]
                    }
                },
            ],
            where: {
                Status: "Pending"
            }
        });
        var approved = await db.booking.count({
            include: [
                {
                    model: db.schedule,
                    where: {
                        [Op.and]: [
                            // Sequelize.where(
                            //     Sequelize.fn('Year', Sequelize.fn('STR_TO_DATE', Sequelize.col('Date'), '%m-%d-%Y')),
                            //     year
                            // ),
                            { ID_doctor: id_doc },
                            { ID_healthcare_package: id_hc }
                        ]
                    }
                },
            ],
            where: {
                Status: "Approved"
            }
        });
        var finished = await db.booking.count({
            include: [
                {
                    model: db.schedule,
                    where: {
                        [Op.and]: [
                            // Sequelize.where(
                            //     Sequelize.fn('Year', Sequelize.fn('STR_TO_DATE', Sequelize.col('Date'), '%m-%d-%Y')),
                            //     year
                            // ),
                            { ID_doctor: id_doc },
                            { ID_healthcare_package: id_hc }
                        ]
                    }
                },
            ],
            where: {
                Status: "Finished"
            }
        });
        var cancelled = await db.booking.count({
            include: [
                {
                    model: db.schedule,
                    where: {
                        [Op.and]: [
                            // Sequelize.where(
                            //     Sequelize.fn('Year', Sequelize.fn('STR_TO_DATE', Sequelize.col('Date'), '%m-%d-%Y')),
                            //     year
                            // ),
                            { ID_doctor: id_doc },
                            { ID_healthcare_package: id_hc }
                        ]
                    }
                },
            ],
            where: {
                Status: "Cancelled"
            }
        });
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    // filterAll = all.filter((item) => {
    //     console.log(dayjs(item["schedule.Date"], "MM-DD-YYYY").year())
    //     // return dayjs(item["schedule.Date"], "MM-DD-YYYY").year() == year
    // })


    let result = {
        all: all,
        pending: pending,
        approved: approved,
        finished: finished,
        cancelled: cancelled
    }

    return {
        message: "Success", code: 0, result
    }
}

const statsRevenue = async (id, year, flag) => {

    if (id === "all") id = {
        [Op.not]: null
    };

    try {

        var scheduleDate = null

        if (flag === "doctor") {
            scheduleDate = await db.booking.findAll({
                attributes: [[Sequelize.fn('COUNT', Sequelize.col('Date')), 'Date_count'], 'schedule.ID_doctor', 'Total_price'],
                include: [
                    { model: db.schedule, attributes: ['Date'], where: { ID_doctor: id }, include: [{ model: db.doctor }] },
                ],
                where: { Status: "Finished" },
                group: ['Date', 'schedule.ID_doctor', 'Total_price'],
                raw: true,
            });
        } else {
            scheduleDate = await db.booking.findAll({
                attributes: [[Sequelize.fn('COUNT', Sequelize.col('Date')), 'Date_count'], 'schedule.ID_healthcare_package', 'Total_price'],
                include: [
                    { model: db.schedule, attributes: ['Date'], where: { ID_healthcare_package: id }, include: [{ model: db.healthcare_package }] },
                ],
                where: { Status: "Finished" },
                group: ['Date', 'schedule.ID_healthcare_package', 'Total_price'],
                raw: true,
            });
        }

        var totalPerMonth = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0
        };
        var revenue = 0

        for (let item of scheduleDate) {
            if (dayjs(item["schedule.Date"], "MM-DD-YYYY").year() == year) {
                switch (dayjs(item["schedule.Date"], "MM-DD-YYYY").month() + 1) {
                    case 1:
                        totalPerMonth.Jan += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 2:
                        totalPerMonth.Feb += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 3:
                        totalPerMonth.Mar += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 4:
                        totalPerMonth.Apr += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 5:
                        totalPerMonth.May += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 6:
                        totalPerMonth.Jun += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 7:
                        totalPerMonth.Jul += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 8:
                        totalPerMonth.Aug += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 9:
                        totalPerMonth.Sep += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 10:
                        totalPerMonth.Oct += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 11:
                        totalPerMonth.Nov += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                    case 12:
                        totalPerMonth.Dec += item["Date_count"] * item.Total_price;
                        revenue += item["Date_count"] * item.Total_price;
                        break;
                }
            }
        }

        var result = {
            revenue: revenue,
            // scheduleDate: scheduleDate,
            totalPerMonth: totalPerMonth
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return {
        message: "Success", code: 0, result
    }
}

const getBookingForAdmin = async (id, status, date, time, page, flag) => {

    if (id === "all") id = {
        [Op.not]: null
    };

    if (date === "all") date = {
        [Op.not]: null
    };

    if (status === "all") status = {
        [Op.not]: null
    };

    if (time === "all") time = {
        [Op.not]: null
    };

    let limit = 10;
    let offset = (limit * page) - limit;

    try {

        var booking = null;
        var scheduleDate = null

        if (flag === "doctor") {
            booking = await db.booking.findAndCountAll({
                offset: offset,
                limit: limit,
                include: [
                    { model: db.payment },
                    { model: db.patient, include: [{ model: db.account, attributes: ['ID', 'Username'] }] },
                    { model: db.schedule, where: { Date: date }, include: [{ model: db.doctor, where: { ID: id } }, { model: db.time_type, where: { ID: time } }] },
                ],
                where: { Status: status }
            })

            scheduleDate = await db.booking.findAll({
                attributes: [],
                include: [
                    { model: db.schedule, attributes: ['Date'], where: { ID_doctor: id } },
                ],
                where: { Status: status },
                group: ['Date'],
                raw: true,
            });

        } else {
            booking = await db.booking.findAndCountAll({
                offset: offset,
                limit: limit,
                include: [
                    { model: db.payment },
                    { model: db.booking_package_service, include: [{ model: db.healthcare_service }] },
                    { model: db.patient, include: [{ model: db.account, attributes: ['ID', 'Username'] }] },
                    { model: db.schedule, where: { Date: date }, include: [{ model: db.healthcare_package, where: { ID: id } }, { model: db.time_type, where: { ID: time } }] },
                ],
                where: { Status: status }
            })


            scheduleDate = await db.booking.findAll({
                attributes: [],
                include: [
                    { model: db.schedule, attributes: ['Date'], where: { ID_healthcare_package: id } },
                ],
                where: { Status: status },
                group: ['Date'],
                raw: true,
            });
        }

        let data = getPagingData(booking, page, limit)

        var result = {
            booking: data,
            scheduleDate: scheduleDate.map((x) => Object.values(x)).flat(1)
        }

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const getMedicalResultByID = async (id) => {

    try {
        var result = await db.medical_result.findOne({
            where: { ID_booking: id }
        })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const updateMedicalResult = async (data) => {
    try {
        var result = await db.medical_result.update(data, {
            where: { ID: data.ID }
        })

        var booking = await db.booking.findOne({
            where: { ID: data.ID_booking }
        })

        var patient = await db.patient.findOne({
            where: { ID: booking.ID_patient }
        })

        // send email
        sendMail(patient.Email,
            "Medical Examination Result",
            `Dear ${patient.Name},<br><br>
            Medical examination result is available and attached below.<br>Thank you once again for choosing us. We look forward to seeing you again soon.<br>
            Best regards,<br>
            The LifeClinic Team`,
            data.Result
        )

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const createMedicalResult = async (data) => {
    try {
        var result = await db.medical_result.create(data)

        var booking = await db.booking.findOne({
            where: { ID: data.ID_booking }
        })

        var patient = await db.patient.findOne({
            where: { ID: booking.ID_patient }
        })

        // send email
        sendMail(patient.Email,
            "Medical Examination Result",
            `Dear ${patient.Name},<br><br>
            Medical examination result is available and attached below.<br>Thank you once again for choosing us. We look forward to seeing you again soon.<br>
            Best regards,<br>
            The LifeClinic Team`,
            data.Result
        )

    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
}

const deleteMedicalResult = async (id) => {
    try {
        var result = await db.medical_result.destroy({
            where: { ID: id }
        })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Success", code: 0, result }
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