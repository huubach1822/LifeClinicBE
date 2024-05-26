import db from "../models/db";
import _ from 'lodash';
import { hashPassword, comparePassword } from "../util/hashPassword";


const register = async (account) => {
    try {
        let user = await db.account.findOne({
            where: {
                Username: account.username
            }
        });

        if (!_.isEmpty(user)) {
            return { message: "Username already exists", code: 1 };
        } else {
            let pass = await hashPassword(account.password);
            var tempacc = await db.account.create({ Username: account.username, Password: pass, ID_account_type: 1 });
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Sucess", code: 0, account: tempacc }
}

const login = async (account) => {
    try {
        var user = await db.account.findOne({
            where: {
                Username: account.username,
            },
            include: [{
                model: db.doctor,
                include: [
                    { model: db.speciality },
                    { model: db.degree },
                    { model: db.clinic, attributes: ['ID', 'Name'] },
                ]
            }]
        });

        if (_.isEmpty(user)) {
            return { message: "Username not found", code: 1 };
        } else {
            var flag = await comparePassword(account.password, user.Password);
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    if (flag) {
        return { message: "Success", code: 0, account: user };
    } else {
        return { message: "Wrong username or password", code: 1 };
    }
}

const changePassword = async (account) => {

    try {

        var user = await db.account.findOne({
            where: { ID: account.id },
            include: [{
                model: db.doctor,
                include: [
                    { model: db.speciality },
                    { model: db.degree },
                    { model: db.clinic, attributes: ['ID', 'Name'] },
                ]
            }]
        });
        var flag = await comparePassword(account.oldPassword, user.Password);

        if (flag) {
            user.Password = await hashPassword(account.newPassword);
            await user.save({ fields: ["Password"] });
        } else {
            return { message: "Wrong old password", code: 1 };
        }
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }

    return { message: "Sucess", code: 0, account: user };
}

module.exports = {
    register: register,
    login: login,
    changePassword: changePassword
}