const StatsCards = ({
    stats,
    loading
}) => {
    const totalTitles = Number(
        stats?.totalTitles || 0
    );

    const totalQuantity = Number(
        stats?.totalQuantity || 0
    );

    const availableQuantity =
        Number(
            stats?.availableQuantity ||
                0
        );

    /*
     * Always derive borrowed copies
     * from the actual inventory math.
     *
     * Borrowed = Total Copies - Available Copies
     */
    const borrowedQuantity =
        Math.max(
            totalQuantity -
                availableQuantity,
            0
        );

    const statistics = [
        {
            label: "Total Titles",
            value: totalTitles
        },
        {
            label: "Available",
            value: availableQuantity
        },
        {
            label: "Borrowed",
            value: borrowedQuantity
        }
    ];

    return (
        <section
            className="stats-grid"
            aria-label="Library statistics"
        >
            {statistics.map(
                (stat) => (
                    <article
                        className="stat-card"
                        key={stat.label}
                    >
                        <span className="stat-label">
                            {stat.label}
                        </span>

                        <strong
                            className="stat-value"
                            aria-label={`${stat.label}: ${
                                loading
                                    ? "loading"
                                    : stat.value
                            }`}
                        >
                            {loading
                                ? "—"
                                : stat.value}
                        </strong>
                    </article>
                )
            )}
        </section>
    );
};

export default StatsCards;