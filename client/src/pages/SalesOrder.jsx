import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClients, getItems, getOrderById, createOrder, updateOrder } from '../services/apiService';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const emptyLine = () => ({
  itemCode: '', description: '', note: '', quantity: '', price: '',
  taxRate: '', exclAmount: '', taxAmount: '', inclAmount: ''
});

const SalesOrder = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEditing = Boolean(id);

  const [clients,  setClients]  = useState([]);
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const [order, setOrder] = useState({
    clientId:     '',
    customerName: '',
    invoiceNo:    '',
    invoiceDate:  '',
    referenceNo:  '',
    note:         '',
    address1: '', address2: '', address3: '',
    suburb: '', state: '', postCode: '',
    lines:      [emptyLine()],
    totalExcl:  '0.00',
    totalTax:   '0.00',
    totalIncl:  '0.00',
  });

  // Load clients and items from the database via the API
  useEffect(() => {
    getClients()
      .then(res => setClients(res.data || []))
      .catch(() => setError('Cannot connect to API. Please start the backend in Visual Studio.'));

    getItems()
      .then(res => setItems(res.data || []))
      .catch(() => {});
  }, []);

  // Load existing order when editing
  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    getOrderById(id)
      .then(res => {
        const o = res.data;
        const mappedLines = (o.lines || []).map(l => ({
          id:          l.id,
          itemId:      l.itemId,
          itemCode:    l.itemCode    || '',
          description: l.description || '',
          note:        l.note        || '',
          quantity:    l.quantity    || '',
          price:       l.price       || '',
          taxRate:     l.taxRate     || '',
          exclAmount:  l.exclAmount  || '',
          taxAmount:   l.taxAmount   || '',
          inclAmount:  l.inclAmount  || '',
        }));
        // Always keep one empty trailing row
        mappedLines.push(emptyLine());

        setOrder({
          clientId:     o.clientId      || '',
          customerName: o.customerName  || '',
          invoiceNo:    o.invoiceNo     || '',
          invoiceDate:  o.invoiceDate ? o.invoiceDate.split('T')[0] : '',
          referenceNo:  o.referenceNo   || '',
          note:         o.note          || '',
          address1:     '',
          address2:     '',
          address3:     '',
          suburb:       '',
          state:        '',
          postCode:     '',
          lines:        mappedLines,
          totalExcl:    parseFloat(o.totalExcl  || 0).toFixed(2),
          totalTax:     parseFloat(o.totalTax   || 0).toFixed(2),
          totalIncl:    parseFloat(o.totalIncl  || 0).toFixed(2),
        });
      })
      .catch(() => setError('Failed to load order.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  // When clients load while editing, fill address fields
  useEffect(() => {
    if (!isEditing || !order.clientId || clients.length === 0) return;
    const client = clients.find(c => c.id === parseInt(order.clientId));
    if (client) {
      setOrder(prev => ({
        ...prev,
        address1: client.address1 || '',
        address2: client.address2 || '',
        address3: client.address3 || '',
        suburb:   client.suburb   || '',
        state:    client.state    || '',
        postCode: client.postCode || '',
      }));
    }
  }, [clients, order.clientId, isEditing]);

  const handleCustomerChange = (e) => {
    const typedName = e.target.value;
    // Try to match against existing clients by name
    const client = clients.find(
      c => c.customerName.toLowerCase() === typedName.toLowerCase()
    );
    if (client) {
      setOrder(prev => ({
        ...prev,
        clientId:     client.id,
        customerName: client.customerName,
        address1:     client.address1 || '',
        address2:     client.address2 || '',
        address3:     client.address3 || '',
        suburb:       client.suburb   || '',
        state:        client.state    || '',
        postCode:     client.postCode || '',
      }));
    } else {
      // Allow typing a new/custom customer name without auto-fill
      setOrder(prev => ({
        ...prev,
        clientId:     '',
        customerName: typedName,
      }));
    }
  };

  const handleLineChange = (index, field, value) => {
    const newLines = order.lines.map((l, i) => i === index ? { ...l, [field]: value } : l);

    // Auto-fill item details when item code or description changes
    if (field === 'itemCode' || field === 'description') {
      const item = items.find(i => i.itemCode === value || i.description === value);
      if (item) {
        newLines[index] = {
          ...newLines[index],
          itemCode:    item.itemCode,
          description: item.description,
          itemId:      item.id,
          price:       item.price,
        };
      }
    }

    // Recalculate amounts for this line
    const qty      = parseFloat(newLines[index].quantity)  || 0;
    const price    = parseFloat(newLines[index].price)     || 0;
    const taxRate  = parseFloat(newLines[index].taxRate)   || 0;
    const excl     = qty * price;
    const tax      = (excl * taxRate) / 100;
    const incl     = excl + tax;

    newLines[index].exclAmount = excl  > 0 ? excl.toFixed(2)  : '';
    newLines[index].taxAmount  = tax   > 0 ? tax.toFixed(2)   : '';
    newLines[index].inclAmount = incl  > 0 ? incl.toFixed(2)  : '';

    // Auto-add a new empty row when the last row gets an item
    if (index === newLines.length - 1 && newLines[index].itemCode) {
      newLines.push(emptyLine());
    }

    // Recalculate totals
    const tExcl = newLines.reduce((s, l) => s + (parseFloat(l.exclAmount) || 0), 0);
    const tTax  = newLines.reduce((s, l) => s + (parseFloat(l.taxAmount)  || 0), 0);
    const tIncl = newLines.reduce((s, l) => s + (parseFloat(l.inclAmount) || 0), 0);

    setOrder(prev => ({
      ...prev,
      lines:     newLines,
      totalExcl: tExcl.toFixed(2),
      totalTax:  tTax.toFixed(2),
      totalIncl: tIncl.toFixed(2),
    }));
  };

  const handleSave = async () => {
    if (!order.clientId) { setError('Please select a customer.'); return; }
    if (!order.invoiceNo) { setError('Please enter an Invoice No.'); return; }

    setError('');
    setSaving(true);

    // Build payload — strip the trailing empty line
    const filledLines = order.lines.filter(l => l.itemCode);
    const payload = {
      id:          isEditing ? parseInt(id) : 0,
      clientId:    parseInt(order.clientId),
      invoiceNo:   order.invoiceNo,
      invoiceDate: order.invoiceDate || new Date().toISOString(),
      referenceNo: order.referenceNo || null,
      note:        order.note        || null,
      totalExcl:   parseFloat(order.totalExcl),
      totalTax:    parseFloat(order.totalTax),
      totalIncl:   parseFloat(order.totalIncl),
      lines: filledLines.map(l => ({
        id:          l.id   || 0,
        itemId:      l.itemId || 0,
        itemCode:    l.itemCode,
        description: l.description || '',
        note:        l.note        || null,
        quantity:    parseInt(l.quantity)     || 0,
        price:       parseFloat(l.price)      || 0,
        taxRate:     parseFloat(l.taxRate)    || 0,
        exclAmount:  parseFloat(l.exclAmount) || 0,
        taxAmount:   parseFloat(l.taxAmount)  || 0,
        inclAmount:  parseFloat(l.inclAmount) || 0,
      })),
    };

    try {
      if (isEditing) {
        await updateOrder(parseInt(id), payload);
      } else {
        await createOrder(payload);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save order. Please check the API is running.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="p-8 text-center">Loading order...</div>;

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      `}</style>

      <div className="p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="border-2 border-black max-w-5xl mx-auto shadow-lg bg-white">

          {/* Title Bar */}
          <div className="flex items-center justify-between border-b-2 border-black bg-gray-200 p-1 no-print">
            <div className="flex gap-1 pl-1">
              <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
            </div>
            <div className="text-sm font-semibold">
              {isEditing ? `Edit Order — ${order.invoiceNo}` : 'New Sales Order'}
            </div>
            <div className="w-10"></div>
          </div>

          {/* Action Bar */}
          <div className="border-b border-black p-2 pt-3 flex gap-2 items-center no-print">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              <span className="bg-black text-white rounded-full w-4 h-4 inline-flex items-center justify-center text-xs mr-1">✓</span>
              {saving ? 'Saving...' : (isEditing ? 'Update Order' : 'Save Order')}
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              🖨 Print
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              ← Back
            </Button>
            {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
          </div>



          {/* Form Fields */}
          <div className="p-4 flex gap-8">
            {/* Left column — customer */}
            <div className="flex-1 flex flex-col gap-2">
              {/* Customer Name — typeable combo box */}
              <div className="flex items-center text-sm">
                <div className="w-32 text-sm">Customer Name</div>
                <div className="flex-1 relative">
                  <input
                    id="customerName"
                    type="text"
                    list="clients-list"
                    className="border border-black w-full p-1 text-sm outline-none"
                    placeholder="Type or select a customer..."
                    value={order.customerName}
                    onChange={handleCustomerChange}
                    autoComplete="off"
                  />
                  <datalist id="clients-list">
                    {clients.map(c => (
                      <option key={c.id} value={c.customerName} />
                    ))}
                  </datalist>
                </div>
              </div>
              <TextInput label="Address 1"  value={order.address1}  onChange={(e) => setOrder({...order, address1:  e.target.value})} labelWidth="w-32" />
              <TextInput label="Address 2"  value={order.address2}  onChange={(e) => setOrder({...order, address2:  e.target.value})} labelWidth="w-32" />
              <TextInput label="Address 3"  value={order.address3}  onChange={(e) => setOrder({...order, address3:  e.target.value})} labelWidth="w-32" />
              <TextInput label="Suburb"     value={order.suburb}    onChange={(e) => setOrder({...order, suburb:    e.target.value})} labelWidth="w-32" />
              <TextInput label="State"      value={order.state}     onChange={(e) => setOrder({...order, state:     e.target.value})} labelWidth="w-32" />
              <TextInput label="Post Code"  value={order.postCode}  onChange={(e) => setOrder({...order, postCode:  e.target.value})} labelWidth="w-32" />
            </div>

            {/* Right column — invoice info */}
            <div className="flex-1 flex flex-col gap-2">
              <TextInput label="Invoice No."   value={order.invoiceNo}   onChange={(e) => setOrder({...order, invoiceNo:   e.target.value})} labelWidth="w-28" />
              <TextInput label="Invoice Date"  value={order.invoiceDate} onChange={(e) => setOrder({...order, invoiceDate: e.target.value})} labelWidth="w-28" type="date" />
              <TextInput label="Reference No"  value={order.referenceNo} onChange={(e) => setOrder({...order, referenceNo: e.target.value})} labelWidth="w-28" />
              <div className="flex text-sm mt-1">
                <div className="w-28 text-sm">Note</div>
                <textarea
                  className="border border-black flex-1 p-1 h-20 resize-none text-sm"
                  value={order.note}
                  onChange={(e) => setOrder({...order, note: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Line Items Grid */}
          <div className="p-4 pt-0">
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-300">
                  {['Item Code','Description','Note','Qty','Price','Tax %','Excl Amt','Tax Amt','Incl Amt'].map((col, idx) => (
                    <th key={idx} className="border border-black p-1 font-semibold text-left whitespace-nowrap text-xs">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-black p-0 h-8">
                      <select
                        className="w-full h-full outline-none p-1 appearance-none bg-transparent text-sm"
                        value={line.itemCode}
                        onChange={(e) => handleLineChange(index, 'itemCode', e.target.value)}
                      >
                        <option value=""></option>
                        {items.map(i => <option key={i.id} value={i.itemCode}>{i.itemCode}</option>)}
                      </select>
                    </td>
                    <td className="border border-black p-0 h-8">
                      <select
                        className="w-full h-full outline-none p-1 appearance-none bg-transparent text-sm"
                        value={line.description}
                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      >
                        <option value=""></option>
                        {items.map(i => <option key={i.id} value={i.description}>{i.description}</option>)}
                      </select>
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="text" className="w-full h-full outline-none p-1 bg-transparent text-sm" value={line.note} onChange={(e) => handleLineChange(index, 'note', e.target.value)} />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="number" className="w-16 h-full outline-none p-1 text-right bg-transparent text-sm" value={line.quantity} onChange={(e) => handleLineChange(index, 'quantity', e.target.value)} min="0" />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="number" className="w-20 h-full outline-none p-1 text-right bg-gray-50 text-sm" readOnly value={line.price} />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="number" className="w-16 h-full outline-none p-1 text-right bg-transparent text-sm" value={line.taxRate} onChange={(e) => handleLineChange(index, 'taxRate', e.target.value)} min="0" max="100" />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="text" className="w-24 h-full outline-none p-1 text-right bg-gray-50 text-sm" readOnly value={line.exclAmount} />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="text" className="w-24 h-full outline-none p-1 text-right bg-gray-50 text-sm" readOnly value={line.taxAmount} />
                    </td>
                    <td className="border border-black p-0 h-8">
                      <input type="text" className="w-24 h-full outline-none p-1 text-right bg-gray-50 text-sm" readOnly value={line.inclAmount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mt-4">
              <div className="flex flex-col gap-1 w-72 text-sm">
                {[['Total Excl', order.totalExcl], ['Total Tax', order.totalTax], ['Total Incl', order.totalIncl]].map(([label, val]) => (
                  <div key={label} className="flex items-center">
                    <div className="w-28 text-right pr-3 font-semibold">{label}</div>
                    <input
                      type="text"
                      readOnly
                      value={val}
                      className="border border-black flex-1 p-1 text-right bg-gray-100 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SalesOrder;
