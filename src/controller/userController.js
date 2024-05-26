import userService from '../service/userSerVice';

const register = async (req, res) => {
    let result = await userService.register(req.body);
    return res.status(200).json(result)
}

const login = async (req, res) => {
    let result = await userService.login(req.body);
    return res.status(200).json(result)
}

const changePassword = async (req, res) => {
    let result = await userService.changePassword(req.body);
    return res.status(200).json(result)
}

module.exports = {
    register: register,
    login: login,
    changePassword: changePassword
}