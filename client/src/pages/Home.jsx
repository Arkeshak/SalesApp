import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderList } from '../redux/slices/orderSlice';
import { getOrders } from '../services/apiService';
import Button from '../components/Button';

const COLUMNS = [
  { label: 'Invoice No',    key: 'invoiceNo' },
  { label: 'Customer Name', key: 'customerName' },
  { label: 'Invoice Date',  key: 'invoiceDate' },
  { label: 'Total Excl',    key: 'totalExcl' },
  { label: 'Total Tax',     key: 'totalTax' },
  { label: 'Total Incl',    key: 'totalIncl' },
];

const formatDate = (val) => {
  if (!val) return '';
  try { return new Date(val).toLocaleDateString(); } catch { return val; }
};

const formatAmount = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? '' : n.toFixed(2);
};

const Home = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const orders    = useSelector((state) => state.orders.orderList);

  useEffect(() => {
    getOrders()
      .then(res => {
        if (res.data && res.data.length > 0) {
          dispatch(setOrderList(res.data));
        }
        // if empty, just leave the list empty — no fake data on home
      })
      .catch(() => {
        // API offline — show placeholder demo rows
        dispatch(setOrderList([
          { id: 1, invoiceNo: 'INV-001', customerName: 'John Doe',   invoiceDate: new Date().toISOString(), totalExcl: 1200.00, totalTax: 120.00, totalIncl: 1320.00 },
          { id: 2, invoiceNo: 'INV-002', customerName: 'Jane Smith', invoiceDate: new Date().toISOString(), totalExcl: 350.00,  totalTax:  35.00, totalIncl:  385.00 },
        ]));
      });
  }, [dispatch]);

  const formatCell = (key, val) => {
    if (key === 'invoiceDate')  return formatDate(val);
    if (['totalExcl', 'totalTax', 'totalIncl'].includes(key)) return formatAmount(val);
    return val ?? '';
  };

  return (
    <div className="p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="border border-black max-w-5xl mx-auto bg-gray-200 shadow-lg">

        {/* Title Bar */}
        <div className="flex items-center justify-between border-b-2 border-black bg-gray-300 p-1">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
          </div>
          <div className="text-sm font-semibold">Home — Sales Orders</div>
          <div className="w-10"></div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-3">

          <div className="border-b border-black mb-3 pb-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/order')}
              className="px-6"
            >
              + Add New
            </Button>
          </div>

          <table className="w-full border-collapse border border-black text-sm mb-4">
            <thead>
              <tr className="bg-gray-300">
                {COLUMNS.map((col) => (
                  <th key={col.key} className="border border-black p-2 text-left font-semibold whitespace-nowrap">
                    <span className="text-xs mr-1">▼</span>{col.label}
                  </th>
                ))}
                <th className="border border-black p-2 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="border border-black p-4 text-center text-gray-400 italic">
                    No orders found. Click "+ Add New" to create one.
                  </td>
                </tr>
              )}
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  onDoubleClick={() => navigate(`/order/${order.id}`)}
                  className={`cursor-pointer hover:bg-blue-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="border border-black p-2 h-10">
                      {formatCell(col.key, order[col.key])}
                    </td>
                  ))}
                  <td className="border border-black p-2 h-10 text-center">
                    <button
                      className="bg-gray-200 border border-black px-3 py-0.5 hover:bg-gray-300 text-xs"
                      onClick={(e) => { e.stopPropagation(); navigate(`/order/${order.id}`); }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Home;
