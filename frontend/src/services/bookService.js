import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000
});


const getBooks = async (
    page = 1,
    limit = 10,
    search = ""
) => {
    const response = await api.get(
        "/books",
        {
            params: {
                page,
                limit,
                search
            }
        }
    );

    return response.data;
};


const getBookById = async (id) => {
    const response =
        await api.get(`/books/${id}`);

    return response.data;
};


const createBook = async (bookData) => {
    const response =
        await api.post(
            "/books",
            bookData
        );

    return response.data;
};


const updateBook = async (
    id,
    bookData
) => {
    const response =
        await api.put(
            `/books/${id}`,
            bookData
        );

    return response.data;
};


const deleteBook = async (id) => {
    const response =
        await api.delete(
            `/books/${id}`
        );

    return response.data;
};


const getStats = async () => {
    const response =
        await api.get("/books/stats");

    return response.data;
};


export {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStats
};