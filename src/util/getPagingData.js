const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: result } = data;
    const currentPage = page ? + page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, currentPage, result };
};

export default getPagingData