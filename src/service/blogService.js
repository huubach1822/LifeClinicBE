import db from "../models/db";
import _, { includes } from 'lodash';
import Sequelize from "sequelize";
const { Op } = require("sequelize");
import dayjs from "dayjs";
import path from 'path';
import fs from 'fs';
import getPagingData from "../util/getPagingData";
import processImgContent from "../util/ImageConvert";

const createBlog = async (obj, image) => {

    let blog = JSON.parse(obj.blog)

    blog.Image = image?.filename
    blog.Date = dayjs().format('MM-DD-YYYY')
    blog.Content = await processImgContent(blog.Content)

    try {
        await db.blog.create(blog);
    } catch (error) {
        console.log(error)
        return { message: "error", code: 1 }
    }
    return { message: "success", code: 0 }
}

const getAllBlogs = async (page, queryString) => {

    const Op = Sequelize.Op;
    if (_.isEmpty(page)) page = 1;
    if (_.isEmpty(queryString)) queryString = "";

    let limit = 9;
    let offset = (limit * page) - limit;

    try {
        var rawData = await db.blog.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                Name: {
                    [Op.like]: `%${queryString}%`
                },
            },
            include: [{
                model: db.account
            }]
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

const deleteBlog = async (id) => {
    try {
        await db.blog.destroy({ where: { ID: id } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0 }
}

const updateBlogByID = async (obj, image) => {

    try {
        let blog = JSON.parse(obj.blog)
        if (!_.isEmpty(image?.filename)) {
            let tempBlog = await db.blog.findOne({ where: { ID: blog.ID } })
            fs.unlink(path.join(__dirname, '..', 'images', tempBlog.Image), (err => { if (err) console.log(err); }))
            blog.Image = image.filename
        }
        blog.Content = await processImgContent(blog.Content)
        var result = await db.blog.update(blog, { where: { ID: blog.ID } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

const getBlogByID = async (id) => {
    try {
        var result = await db.blog.findOne({ where: { ID: id } })
    } catch (error) {
        console.log(error)
        return { message: "Something went wrong", code: 1 }
    }
    return { message: "Success", code: 0, result }
}

module.exports = {
    createBlog,
    getAllBlogs,
    deleteBlog,
    updateBlogByID,
    getBlogByID
}