import {
    useCallback,
    useEffect,
    useState
} from "react";

import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import BookTable from "./components/BookTable";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import DeleteModal from "./components/DeleteModal";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import Toast from "./components/Toast";

import {
    getBooks,
    getStats,
    createBook,
    updateBook,
    deleteBook
} from "./services/bookService";

import "./App.css";

const initialStats = {
    totalTitles: 0,
    totalQuantity: 0,
    availableQuantity: 0,
    borrowedQuantity: 0,
    lowStock: 0,
    outOfStock: 0
};


const App = () => {

    const [books, setBooks] =
        useState([]);

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        });

    const [stats, setStats] =
        useState(initialStats);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [statsLoading, setStatsLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [showBookModal, setShowBookModal] =
        useState(false);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [deleteBookItem, setDeleteBookItem] =
        useState(null);

    const [toast, setToast] =
        useState({
            message: "",
            type: "success"
        });


    /*
    |--------------------------------------------------------------------------
    | Toast
    |--------------------------------------------------------------------------
    */

    const showToast = (
        message,
        type = "success"
    ) => {
        setToast({
            message,
            type
        });

        setTimeout(() => {
            setToast({
                message: "",
                type: "success"
            });
        }, 3500);
    };


    /*
    |--------------------------------------------------------------------------
    | Fetch Books
    |--------------------------------------------------------------------------
    */

    const fetchBooks =
        useCallback(
            async (page = 1) => {

                try {

                    setLoading(true);

                    const result =
                        await getBooks(
                            page,
                            10,
                            search
                        );

                    setBooks(
                        result.data || []
                    );

                    setPagination(
                        result.pagination || {
                            page: 1,
                            limit: 10,
                            total: 0,
                            totalPages: 0
                        }
                    );

                } catch (error) {

                    console.error(
                        "Failed to fetch books:",
                        error
                    );

                    showToast(
                        error.response?.data
                            ?.message ||
                            "Unable to load books. Check your connection.",
                        "error"
                    );

                } finally {

                    setLoading(false);

                }
            },
            [search]
        );


    /*
    |--------------------------------------------------------------------------
    | Fetch Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    const fetchStats =
        useCallback(
            async () => {

                try {

                    setStatsLoading(true);

                    const result =
                        await getStats();

                    const data =
                        result?.data || {};

                    /*
                    |--------------------------------------------------------------------------
                    | Normalize backend response
                    |--------------------------------------------------------------------------
                    */

                    const totalTitles =
                        Number(
                            data.totalTitles ?? 0
                        );

                    const totalQuantity =
                        Number(
                            data.totalQuantity ?? 0
                        );

                    const availableQuantity =
                        Number(
                            data.availableQuantity ?? 0
                        );

                    const borrowedQuantity =
                        Number(
                            data.borrowedQuantity ??
                            Math.max(
                                totalQuantity -
                                    availableQuantity,
                                0
                            )
                        );

                    setStats({
                        totalTitles,
                        totalQuantity,
                        availableQuantity,
                        borrowedQuantity,
                        lowStock:
                            Number(
                                data.lowStock ?? 0
                            ),
                        outOfStock:
                            Number(
                                data.outOfStock ?? 0
                            )
                    });

                } catch (error) {

                    console.error(
                        "Failed to fetch statistics:",
                        error
                    );

                    showToast(
                        error.response?.data
                            ?.message ||
                            "Unable to load dashboard statistics.",
                        "error"
                    );

                    setStats(
                        initialStats
                    );

                } finally {

                    setStatsLoading(
                        false
                    );

                }
            },
            []
        );


    /*
    |--------------------------------------------------------------------------
    | Initial Dashboard Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchStats();

    }, [fetchStats]);


    /*
    |--------------------------------------------------------------------------
    | Search / Pagination
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const timer =
            setTimeout(() => {
                fetchBooks(1);
            }, 350);

        return () =>
            clearTimeout(timer);

    }, [fetchBooks]);


    /*
    |--------------------------------------------------------------------------
    | Save Book
    |--------------------------------------------------------------------------
    */

    const handleSave = async (
        bookData
    ) => {

        try {

            setSaving(true);

            if (selectedBook) {

                await updateBook(
                    selectedBook._id,
                    bookData
                );

                console.log(
                    "[Analytics] User interacted with Express API"
                );

                showToast(
                    "Book updated successfully."
                );

            } else {

                await createBook(
                    bookData
                );

                console.log(
                    "[Analytics] User interacted with Express API"
                );

                showToast(
                    "Book added successfully."
                );
            }

            setShowBookModal(false);

            setSelectedBook(null);

            /*
            |--------------------------------------------------------------------------
            | Refresh table + dashboard
            |--------------------------------------------------------------------------
            */

            await Promise.all([
                fetchBooks(
                    pagination.page
                ),
                fetchStats()
            ]);

        } catch (error) {

            console.error(
                "Save error:",
                error
            );

            showToast(
                error.response?.data
                    ?.message ||
                    "Unable to save book.",
                "error"
            );

        } finally {

            setSaving(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Delete Book
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async () => {

            if (!deleteBookItem) {
                return;
            }

            try {

                setDeleting(true);

                await deleteBook(
                    deleteBookItem._id
                );

                console.log(
                    "[Analytics] User interacted with Express API"
                );

                showToast(
                    "Book deleted successfully."
                );

                setDeleteBookItem(null);

                const nextPage =
                    books.length === 1 &&
                    pagination.page > 1
                        ? pagination.page - 1
                        : pagination.page;

                await Promise.all([
                    fetchBooks(
                        nextPage
                    ),
                    fetchStats()
                ]);

            } catch (error) {

                console.error(
                    "Delete error:",
                    error
                );

                showToast(
                    error.response?.data
                        ?.message ||
                        "Unable to delete book.",
                    "error"
                );

            } finally {

                setDeleting(false);

            }
        };


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page >
                pagination.totalPages
        ) {
            return;
        }

        fetchBooks(page);
    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="app">

            <Navbar />

            <main className="main-container">

                <section className="hero-section">

                    <div>

                        <span className="eyebrow">
                            Inventory Management
                        </span>

                        <h2>
                            Library Book Inventory
                        </h2>

                        <p>
                            Manage, track and
                            organize your
                            library collection
                            from one place.
                        </p>

                    </div>

                </section>


                <StatsCards
                    stats={stats}
                    loading={statsLoading}
                />


                <section className="inventory-section">

                    <div className="section-header">

                        <div>

                            <span className="eyebrow">
                                Collection
                            </span>

                            <h2>
                                Books
                            </h2>

                        </div>

                        <span className="book-count">

                            {
                                pagination.total
                            }{" "}

                            {
                                pagination.total === 1
                                    ? "title"
                                    : "titles"
                            }

                        </span>

                    </div>


                    <SearchBar
                        search={search}
                        setSearch={
                            setSearch
                        }
                        onAdd={() => {

                            setSelectedBook(
                                null
                            );

                            setShowBookModal(
                                true
                            );

                        }}
                    />


                    {
                        loading ? (

                            <Loading />

                        ) : books.length === 0 ? (

                            <EmptyState
                                search={
                                    search
                                }
                            />

                        ) : (

                            <>

                                <div className="desktop-table">

                                    <BookTable
                                        books={
                                            books
                                        }

                                        onEdit={(
                                            book
                                        ) => {

                                            setSelectedBook(
                                                book
                                            );

                                            setShowBookModal(
                                                true
                                            );

                                        }}

                                        onDelete={(
                                            book
                                        ) => {

                                            setDeleteBookItem(
                                                book
                                            );

                                        }}
                                    />

                                </div>


                                <div className="mobile-books">

                                    {
                                        books.map(
                                            (
                                                book
                                            ) => (

                                                <BookCard
                                                    key={
                                                        book._id
                                                    }

                                                    book={
                                                        book
                                                    }

                                                    onEdit={(
                                                        item
                                                    ) => {

                                                        setSelectedBook(
                                                            item
                                                        );

                                                        setShowBookModal(
                                                            true
                                                        );

                                                    }}

                                                    onDelete={(
                                                        item
                                                    ) => {

                                                        setDeleteBookItem(
                                                            item
                                                        );

                                                    }}
                                                />

                                            )
                                        )
                                    }

                                </div>

                            </>

                        )
                    }


                    {
                        !loading &&
                        pagination.totalPages >
                            0 && (

                            <nav
                                className="pagination"
                                aria-label="Book pagination"
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.page -
                                                1
                                        )
                                    }
                                    disabled={
                                        pagination.page ===
                                        1
                                    }
                                    aria-label="Previous page"
                                >
                                    ←
                                </button>


                                <span>

                                    Page{" "}

                                    <strong>
                                        {
                                            pagination.page
                                        }
                                    </strong>{" "}

                                    of{" "}

                                    <strong>
                                        {
                                            pagination.totalPages
                                        }
                                    </strong>

                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.page +
                                                1
                                        )
                                    }
                                    disabled={
                                        pagination.page ===
                                        pagination.totalPages
                                    }
                                    aria-label="Next page"
                                >
                                    →
                                </button>

                            </nav>

                        )
                    }

                </section>

            </main>


            {
                showBookModal && (

                    <BookModal
                        book={
                            selectedBook
                        }

                        loading={
                            saving
                        }

                        onClose={() => {

                            setShowBookModal(
                                false
                            );

                            setSelectedBook(
                                null
                            );

                        }}

                        onSave={
                            handleSave
                        }
                    />

                )
            }


            {
                deleteBookItem && (

                    <DeleteModal
                        book={
                            deleteBookItem
                        }

                        loading={
                            deleting
                        }

                        onClose={() =>
                            setDeleteBookItem(
                                null
                            )
                        }

                        onConfirm={
                            handleDelete
                        }
                    />

                )
            }


            <Toast
                message={
                    toast.message
                }

                type={
                    toast.type
                }

                onClose={() =>
                    setToast({
                        message: "",
                        type: "success"
                    })
                }
            />

        </div>
    );
};


export default App;