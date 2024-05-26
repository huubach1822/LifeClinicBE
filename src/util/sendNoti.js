const cron = require('node-cron');
import db from "../models/db";
import dayjs from "dayjs";

const sendNoti = () => {

    cron.schedule('0 7 * * *', async () => {
        
        let day = dayjs().add(1, 'day');
        let date = day.format("MM-DD-YYYY");

        let temp = await db.booking.findAll({
            include: [
                {
                    model: db.schedule, where: {
                        Date: date
                        // , ID_time_type: timeID 
                    },
                    include: [{ model: db.time_type }]
                },
                { model: db.patient }
            ],
            where: {
                Status: "Pending"
            },
        })

        if (temp.length != 0) {
            for (let i = 0; i < temp.length; i++) {

                let tempString = ``

                if (temp[i].schedule.ID_doctor != null) {
                    var tempDoc = await db.doctor.findOne({ where: { ID: temp[i].schedule.ID_doctor }, include: { model: db.clinic, attributes: ['Name'] } })
                    tempString = `Doctor: ${tempDoc.Name}\nClinic: ${tempDoc.clinic.Name}`
                } else {
                    var tempHCP = await db.healthcare_package.findOne({ where: { ID: temp[i].schedule.ID_healthcare_package }, include: { model: db.clinic, attributes: ['Name'] } })
                    tempString = `Healthcare package: ${tempHCP.Name}\nClinic: ${tempHCP.clinic.Name}`
                }

                sendMail(temp[i].patient.Email,
                    "Appointment Reminder",
                    `Dear ${temp[i].patient.Name},\n\nThis is a friendly reminder of your upcoming medical appointment scheduled at LifeClinic. Here are the details of your appointment:\nBooking ID: ${temp[i].ID}.\nDate: ${temp[i].schedule.Date}.\nTime: ${temp[i].schedule.time_type.Value}.\n${tempString}\n\nThank you for choosing LifeClinic for your healthcare needs. We look forward to seeing you soon.\n\nBest regards,\nThe LifeClinic Team`
                )
            }
        }

    });
}

export default sendNoti


    // cron.schedule('* * * * *', async () => {

    //     console.log('Running a task every minute');
    //     let day = dayjs()
    //     let date = day.format("MM-DD-YYYY");
    //     let time = day.format("HH:mm");
    //     let timeID = null

    //     switch (time) {
    //         case "07:00":
    //             timeID = 1
    //             break;
    //         case "08:00":
    //             timeID = 2
    //             break;
    //         case "09:00":
    //             timeID = 3
    //             break;
    //         case "10:00":
    //             timeID = 4
    //             break;
    //         case "11:00":
    //             timeID = 5
    //             break;
    //         case "13:00":
    //             timeID = 6
    //             break;
    //         case "14:00":
    //             timeID = 7
    //             break;
    //         case "15:00":
    //             timeID = 8
    //             break;
    //         case "16:00":
    //             timeID = 9
    //             break;
    //         case "17:00":
    //             timeID = 10
    //             break;
    //         default:
    //             timeID = null
    //     }

    //     let temp = await db.booking.findAll({
    //         include: [
    //             {
    //                 model: db.schedule, where: {
    //                     Date: date
    //                     // , ID_time_type: timeID 
    //                 },
    //                 include: [{ model: db.time_type }]
    //             },
    //             { model: db.patient }
    //         ],
    //         where: {
    //             Status: "Pending"
    //         },
    //     })

    //     console.log(temp.dataValues);
    //     console.log(date);
    //     console.log(time);
    //     console.log(timeID);


    //     if (temp.length != 0) {
    //         for (let i = 0; i < temp.length; i++) {

    //             let tempString = ``

    //             if (temp[i].schedule.ID_doctor != null) {
    //                 var tempDoc = await db.doctor.findOne({ where: { ID: temp[i].schedule.ID_doctor }, include: { model: db.clinic, attributes: ['Name'] } })
    //                 tempString = `Doctor: ${tempDoc.Name}\nClinic: ${tempDoc.clinic.Name}`
    //             } else {
    //                 var tempHCP = await db.healthcare_package.findOne({ where: { ID: temp[i].schedule.ID_healthcare_package }, include: { model: db.clinic, attributes: ['Name'] } })
    //                 tempString = `Healthcare package: ${tempHCP.Name}\nClinic: ${tempHCP.clinic.Name}`
    //             }

    //             sendMail(temp[i].patient.Email,
    //                 "Appointment Reminder",
    //                 `Dear ${temp[i].patient.Name},\n\nThis is a friendly reminder of your upcoming medical appointment scheduled at LifeClinic. Here are the details of your appointment:\nBooking ID: ${temp[i].ID}.\nDate: ${temp[i].schedule.Date}.\nTime: ${temp[i].schedule.time_type.Value}.\n${tempString}\n\nThank you for choosing LifeClinic for your healthcare needs. We look forward to seeing you soon.\n\nBest regards,\nThe LifeClinic Team`
    //             )
    //         }
    //     }

    // });