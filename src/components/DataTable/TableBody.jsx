import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

const TableBody = ({
    data,
    visibleColumns,
    enableEdit,
    enableDelete,
    setData,
    setEditRowId,
    setNewRow,
    enableColumnSearch,
    handleColumnSearchChange,
    isFullscreen,
}) => {
    const [pinnedColumns, setPinnedColumns] = useState([]);
    const [showSearch, setShowSearch] = useState({});
    const [showOptions, setShowOptions] = useState({});

    const toggleSearchVisibility = (columnId) => {
        setShowSearch((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    };

    const toggleOptionsVisibility = (columnId) => {
        setShowOptions((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    };

    const handleEdit = (rowId) => {
        const rowToEdit = data.find((row) => row.id === rowId);
        console.log(rowId);
        
        setEditRowId(rowId);
        setNewRow(rowToEdit); // Set row to be edited
    };

    const handleDelete = (rowId) => {
        setData((prevData) => prevData.filter((row) => row.id !== rowId));
        console.log(rowId);
        
    };

    const pinColumn = (columnId) => {
        setPinnedColumns((prev) =>
            prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
        );
    };

    const orderedColumns = [
        ...visibleColumns.filter((col) => pinnedColumns.includes(col.id)),
        ...visibleColumns.filter((col) => !pinnedColumns.includes(col.id)),
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm relative">
                <thead className="bg-gray-100">
                    <tr>
                        {orderedColumns.map((col, index) =>
                            col.isVisible ? (
                                <th
                                    key={col.id}
                                    className={`px-4 py-2 border relative min-w-[120px] ${pinnedColumns.includes(col.id) ? 'bg-gray-100' : ''}`}
                                    style={{
                                        position: pinnedColumns.includes(col.id) ? 'sticky' : 'static',
                                        left: pinnedColumns.includes(col.id) ? `${index * 120}px` : 'auto',
                                        zIndex: pinnedColumns.includes(col.id) ? 120 : 'auto',
                                    }}
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        <button onClick={() => toggleOptionsVisibility(col.id)} className="ml-2">
                                            <FiInfo />
                                        </button>
                                    </div>

                                    {showOptions[col.id] && (
                                        <div className="absolute z-10 mt-2 w-32 bg-white border rounded shadow-lg">
                                            <ul className="p-2">
                                                <li
                                                    className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                                                    onClick={() => toggleSearchVisibility(col.id)}
                                                >
                                                    Search
                                                </li>
                                                <li onClick={() => pinColumn(col.id)} className="cursor-pointer hover:bg-gray-200 p-1 rounded">
                                                    Pin column
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
                            ) : null
                        )}
                        {!isFullscreen ? (<th className="px-4 py-2 border sticky right-0 bg-white min-w-[120px]">Actions</th>) : null}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {orderedColumns.map((col, index) =>
                                    col.isVisible ? (
                                        <td
                                            key={col.id}
                                            className={`px-4 py-2 border ${pinnedColumns.includes(col.id) ? 'bg-gray-100' : ''} min-w-[120px]`}
                                            style={{
                                                position: pinnedColumns.includes(col.id) ? 'sticky' : 'static',
                                                left: pinnedColumns.includes(col.id) ? `${index * 120}px` : 'auto',
                                                zIndex: pinnedColumns.includes(col.id) ? 1 : 'auto',
                                            }}
                                        >
                                            {row[col.id]}
                                        </td>
                                    ) : null
                                )}
                                {!isFullscreen ? (<td className="px-5 py-2 border min-w-[120px] sticky right-0 bg-white">
                                    {enableEdit && (
                                        <button onClick={() => handleEdit(row.id)} className="text-blue-600 mr-2">
                                            <FiEdit />
                                        </button>
                                    )}
                                    {enableDelete && (
                                        <button onClick={() => handleDelete(row.id)} className="text-red-600">
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </td>) : null}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={orderedColumns.length + 1} className="px-4 py-2 border text-center">
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableBody;
