import React, { useState } from 'react';
import dataJson from './data.json';
import { FiDownload, FiInfo, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const columnsData = [
    { id: 'orderQty', label: 'Order EX QTY' },
    { id: 'cuttingQty', label: 'Cutting Quantity' },
    { id: 'readToLoad', label: 'Read to load' },
    { id: 'finalPacking', label: 'Final Packing' },
    { id: 'packingMD', label: 'Packing - MD Point' },
];

const Table = () => {
    const [data, setData] = useState(dataJson);
    const [visibleColumns, setVisibleColumns] = useState(
        columnsData.map((col) => ({ ...col, isVisible: true, search: '' }))
    );
    const [showSearch, setShowSearch] = useState({});
    const [showPanel, setShowPanel] = useState(false);
    const [showOptions, setShowOptions] = useState({});
    const [globalFilterText, setGlobalFilterText] = useState("");
    const [newRow, setNewRow] = useState({});
    const [editRowId, setEditRowId] = useState(null);

    const toggleColumnVisibility = (columnId) => {
        setVisibleColumns((prevCols) =>
            prevCols.map((col) =>
                col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
            )
        );
    };

    const toggleSearchVisibility = (columnId) => {
        setShowSearch((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    };

    const toggleOptions = (columnId) => {
        setShowOptions((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    };

    const handleGlobalSearchChange = (value) => {
        setGlobalFilterText(value);
    };

    const handleColumnSearchChange = (columnId, value) => {
        setVisibleColumns((prevCols) =>
            prevCols.map((col) =>
                col.id === columnId ? { ...col, search: value } : col
            )
        );
    };

    const filteredData = data.filter((row) => {
        const globalMatch = Object.keys(row).some((key) =>
            row[key]?.toString().toLowerCase().includes(globalFilterText.toLowerCase())
        );

        const columnMatch = visibleColumns.every((col) => {
            return !col.search || row[col.id]?.toString().toLowerCase().includes(col.search.toLowerCase());
        });

        return globalMatch && columnMatch;
    });

    const handleDownload = () => {
        // CSV download code here
    };

    const handleAddRow = () => {
        if (Object.keys(newRow).length === columnsData.length) {
            setData((prevData) => [...prevData, newRow]);
            setNewRow({});
        }
    };

    const handleDeleteRow = (rowIndex) => {
        setData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    const handleEditRow = (rowIndex) => {
        setEditRowId(rowIndex);
        setNewRow(data[rowIndex]);
    };

    const handleSaveEditRow = () => {
        setData((prevData) => prevData.map((row, index) => (index === editRowId ? newRow : row)));
        setEditRowId(null);
        setNewRow({});
    };

    const handleInputChange = (colId, value) => {
        setNewRow((prevRow) => ({ ...prevRow, [colId]: value }));
    };

    return (
        <div className="p-4 bg-white rounded shadow-lg w-full relative">
            {/* Add New Row Section */}
            <div className="mb-4 p-4 border rounded bg-gray-100 flex flex-wrap items-end">
                <h3 className="text-lg font-semibold mb-4 w-full">Add New Row</h3>
                {columnsData.map((col) => (
                    <div key={col.id} className="flex flex-col mr-4">
                        <label className="text-sm font-semibold mb-1">{col.label}</label>
                        <input
                            type="text"
                            value={newRow[col.id] !== null && newRow[col.id] !== undefined ? newRow[col.id] : ''}
                            onChange={(e) => handleInputChange(col.id, e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                ))}
                {editRowId === null ? (
                    <button onClick={handleAddRow} className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded ml-4">
                        <FiPlus /> Add Row
                    </button>
                ) : (
                    <button onClick={handleSaveEditRow} className="p-2 bg-green-500 text-white rounded ml-4">
                        Save Edit
                    </button>
                )}
            </div>


            {/* Top Bar */}
            <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center text-blue-700 font-semibold px-3 py-1 rounded"
                    >
                        <FiDownload className="mr-2" />
                        Download Excel
                    </button>
                    <input
                        type="text"
                        placeholder="Global Search..."
                        className="p-1 border rounded"
                        value={globalFilterText}
                        onChange={(e) => handleGlobalSearchChange(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowPanel(!showPanel)}
                    className="text-blue-700 border-blue-500 border-2 font-semibold px-4 py-1 rounded mt-2 sm:mt-0"
                >
                    {showPanel ? 'Hide Columns Panel' : 'Show Columns Panel'}
                </button>
            </div>

            {/* Column Visibility Panel */}
            {showPanel && (
                <div className="absolute right-4 top-50 bg-white shadow-md border rounded p-4 w-64 z-10">
                    <h3 className="text-lg font-semibold mb-2">Column Visibility</h3>
                    <div className="flex justify-between mb-2">
                        <button
                            className="text-blue-700 font-semibold px-2"
                            onClick={() => setVisibleColumns(columnsData.map((col) => ({ ...col, isVisible: true })))}
                        >
                            Show All
                        </button>
                        <button
                            className="text-blue-700 font-semibold px-2 rounded"
                            onClick={() => setVisibleColumns(columnsData.map((col) => ({ ...col, isVisible: false })))}
                        >
                            Hide All
                        </button>
                    </div>
                    {visibleColumns.map((col) => (
                        <div key={col.id} className="flex items-center justify-between mb-1">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={col.isVisible}
                                    onChange={() => toggleColumnVisibility(col.id)}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span>{col.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {visibleColumns.map(
                                (col) =>
                                    col.isVisible && (
                                        <th key={col.id} className="px-4 py-2 border relative">
                                            <div className="flex items-center">
                                                {col.label}
                                                <button onClick={() => toggleOptions(col.id)} className="ml-2">
                                                    <FiInfo />
                                                </button>
                                            </div>
                                            {showOptions[col.id] && (
                                                <div className="absolute z-10 mt-2 w-32 bg-white border rounded shadow-lg">
                                                    <ul className="p-2">
                                                        <li
                                                            className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                                                            onClick={() => {
                                                                toggleSearchVisibility(col.id);
                                                                setShowOptions((prev) => ({ ...prev, [col.id]: false }));
                                                            }}
                                                        >
                                                            Search
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                            {showSearch[col.id] && (
                                                <input
                                                    type="text"
                                                    placeholder={`Search ${col.label}`}
                                                    className="mt-2 p-1 border rounded"
                                                    style={{ width: '100%' }}
                                                    value={col.search}
                                                    onChange={(e) => handleColumnSearchChange(col.id, e.target.value)}
                                                />
                                            )}
                                        </th>
                                    )
                            )}
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {visibleColumns.map(
                                        (col) =>
                                            col.isVisible && (
                                                <td key={col.id} className="px-4 py-2 border">
                                                    {row[col.id]}
                                                </td>
                                            )
                                    )}
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => handleEditRow(rowIndex)}
                                            className="text-blue-600 mr-2"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRow(rowIndex)}
                                            className="text-red-600"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={visibleColumns.length + 1} className="px-4 py-2 border text-center">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;