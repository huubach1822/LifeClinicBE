import blogService from '../service/blogService';

const createBlog = async (req, res) => {
    let result = await blogService.createBlog(req.body, req.file);
    return res.status(200).json(result)
}

const getAllBlogs = async (req, res) => {
    let result = await blogService.getAllBlogs(req.params.page, req.params.queryString);
    return res.status(200).json(result)
}

const deleteBlog = async (req, res) => {
    let result = await blogService.deleteBlog(req.params.id);
    return res.status(200).json(result)
}

const updateBlogByID = async (req, res) => {
    let result = await blogService.updateBlogByID(req.body, req.file);
    return res.status(200).json(result)
}

const getBlogByID = async (req, res) => {
    let result = await blogService.getBlogByID(req.params.id);
    return res.status(200).json(result)
}

module.exports = {
    createBlog: createBlog,
    getAllBlogs: getAllBlogs,
    deleteBlog: deleteBlog,
    updateBlogByID: updateBlogByID,
    getBlogByID: getBlogByID
}