import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaUser } from "react-icons/fa";

const LeaderBoardTable = ({ data, rankScore }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // console.log("data", data)

    const columns = [
        {
            name: "Sr. No.",
            cell: (row, index) =>
                (currentPage - 1) * rowsPerPage + index + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Rank",
            cell: row => (
                <div className="flex items-center justify-center font-bold text-center bg-amber-200 w-8 h-8 rounded-full">
                    {row.rank}
                </div>
            ),
            sortable: true,
            width: "100px",
        },
        {
            name: "User",
            cell: row => (
                <div className="flex items-center gap-2">
                    {
                        row.user_image ? (
                            <img
                                src={row.user_image}
                                alt={row.user_name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) :
                            <FaUser />
                    }

                    <span>{row.user_name}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Score",
            selector: row => row.marks,
            sortable: true,

        },
    ];

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard</h2>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationPerPage={rowsPerPage}
                onChangePage={page => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setRowsPerPage(newPerPage);
                    setCurrentPage(page);
                }}
                responsive
                highlightOnHover
                striped
                dense
                customStyles={{
                    rows: {
                        style: {
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            textAlign: 'center',
                        },
                    },
                    headCells: {
                        style: {
                            fontSize: "14px",
                            fontWeight: "600",
                            textAlign: 'center',
                        },
                    },
                    cells: {
                        style: {
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            textAlign: 'start',
                        },
                    },
                }}
            />
        </div>
    );
};

export default LeaderBoardTable;
