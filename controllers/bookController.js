const { Book } = require("../models");

//get all data buku
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Books",
            data: books,
        });
    } catch (error) {
        console.log(error);
    }
};

//get data buku by id
exports.getBookById = async (req, res) => {
    try {
        const id = req.params.id
        const books = await Book.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 0,
                id: id
            }
        });
        res.status(200).json({
            success: true,
            message: "List book by id",
            data: books,
        });
    } catch (error) {
        console.log(error);
    }
};

//get all data buku yang terdelete (is_deleted = 0)
exports.getDeletedBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: {
                is_deleted: 1
            }
        });
        res.status(200).json({
            success: true,
            message: "List All Deleted Books",
            data: books,
        });
    } catch (error) {
        console.log(error);
    }
};

// deleteBook
exports.deleteBook = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req

        console.log(tokenUser.role);

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.is_deleted = 1 //set is_deleted = 1
        body.user_id = tokenUser.userId //set tokenUser yang login

        await Book.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Book.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Delete Buku berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//updateBook
exports.updateBook = async (req, res) => {
    try {
        const id = req.params.id
        const tokenUser = req.user
        const { body } = req

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update book ini

        console.log(body);
        await Book.update(body, {
            where: {
                id: id,
            },
        });

        //untuk nampilkan response
        const updatedDate = await Book.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id: id }
        });

        res.status(200).json({
            success: true,
            message: "Update Buku berhasil",
            data: updatedDate,
        });
    } catch (error) {
        console.log(error);
    }
};

//createBook
exports.createBook = async (req, res) => {
    try {
        const tokenUser = req.user
        const { body } = req

        // validasi agar member tidak bisa melakukan operasi ini
        if (tokenUser.role === "member") {
            return res.status(200).json({
                success: false,
                message: "role member tidak boleh melakukan operasi API ini",

            });
        }

        body.is_deleted = 0 // set is_deleted = 0
        body.user_id = tokenUser.userId //set tokenUser yang login untuk agar bisa tau siapa yang update book ini

        const createdData = await Book.create(body);

        // const parsedData = JSON.stringify(createdData)
        res.status(200).json({
            success: true,
            message: "Buku berhasil ditambahkan",
            data: createdData,
        });
    } catch (error) {
        console.log(error);
    }
};