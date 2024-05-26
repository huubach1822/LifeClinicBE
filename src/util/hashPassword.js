import bycrypt from "bcrypt"

const hashPassword = async (password) => {
    const salt = await bycrypt.genSalt(10)
    const hashPw = await bycrypt.hash(password, salt)
    return hashPw
}

const comparePassword = async (password, hashPw) => {
    const isMatch = await bycrypt.compare(password, hashPw)
    return isMatch
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
}