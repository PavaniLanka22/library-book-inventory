const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="brand">
                    <div
                        className="brand-icon"
                        aria-hidden="true"
                    >
                        LB
                    </div>

                    <div>
                        <h1>Library Inventory</h1>
                        <span>
                            Book Management System
                        </span>
                    </div>
                </div>

                <div
                    className="api-status"
                    aria-label="API status: online"
                >
                    <span
                        className="status-dot"
                        aria-hidden="true"
                    />
                    <span>API Online</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;