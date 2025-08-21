import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getTransactionSlice } from '../redux/HomeSlice';
import { useDispatch } from 'react-redux';

const MyTransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch()
      const perPage = 10; // Or any number you set for pagination

    const getMyTransaction = async () => {
        try {
            const res = await dispatch(getTransactionSlice()).unwrap();
            // console.log(res.data);
            const data = res.data ?? [];
            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            // console.error("Transaction fetch error", error);
        }
    };
  useEffect(() => {
    getMyTransaction();
  }, []);

    const getTransactionDescription = (item) => {
    switch (item.transaction_type) {
      case "Package":
        return item.subscription?.name || "Package Purchase";
      case "Wallet":
        return "Wallet Recharge";
      case "Test":
        return "Test Purchase";
      case "Material":
        return "Study Material Purchase";
      case "Course":
        return "Course Purchase";
      default:
        return item.transaction_type || "Transaction";
    }
  };

    const columns = [
        {
            name: '#',
            cell: (row, index, column, id) => (
                (currentPage - 1) * perPage + index + 1
            ),
            width: '60px',
        },
        {
            name: 'Date',
            selector: row =>
                new Date(row.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
            sortable: true,
        },
        {
            name: 'Order Id',
            selector: row => row.order_id,
            sortable: true,
        },
        {
            name: 'Payment Id',
            selector: row => row.payment_id,
            sortable: true,
        },
        {
            name: 'Amount',
            selector: row => `₹${parseFloat(row.amount).toFixed(2)}`,
            sortable: true,
            cell: row => <span className={`${row.paying_status === 'true' ? 'text-green-500' : 'text-red-500'
                } font-bold`}>₹{parseFloat(row.amount).toFixed(2)}</span>,
        },
        {
            name: 'Description',
            selector: row => getTransactionDescription(row),
        },
        {
            name: 'Status',
            selector: row => row.paying_status,
            cell: row => (
                <div
                    className={`p-2 text-white text-center rounded-sm ${row.paying_status === 'true' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                >
                    {row.paying_status === 'true' ? 'Success' : 'Failed'}
                </div>
            ),
            sortable: true,
        },
    ];


    return (
        <>
            {/* Transaction History */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    💰 Transaction History
                </h2>
                <DataTable
                    columns={columns}
                    data={transactions}
                    pagination
                    highlightOnHover
                    onChangePage={(page) => setCurrentPage(page)}
                    striped
                    noDataComponent="No Transactions Found"
                />
            </div>
        </>
    )
}

export default MyTransactionPage