import React, { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

const TableActions = ({
    columnsData,
    newRow,
    setNewRow,
    handleAddRow,
    editRowId,
    setEditRowId,
    data,
    handleUpdateRow,
}) => {
    // Populate newRow state with existing data if editing
    useEffect(() => {
        if (editRowId !== null) {
            const rowToEdit = data.find((row) => row.id === editRowId);
            if (rowToEdit) {
                setNewRow(rowToEdit);  // Fill the form with the row data for editing
            }
        } else {
            setNewRow({});  // Clear form if not editing
        }
    }, [editRowId, data, setNewRow]);

    const handleSaveRow = () => {
        if (editRowId === null) {
            // Adding a new row
            handleAddRow();
        } else {
            // Updating an existing row
            handleUpdateRow(editRowId, newRow);
            setEditRowId(null);  // Clear edit mode after updating
        }
    };

    const handleReloadData = () => {
        const savedData = JSON.parse(localStorage.getItem('tableData')) || initialData;
        setData(savedData);
    };

    return (
        <div className="mb-4 p-4 border rounded bg-gray-100 flex flex-col sm:flex-row flex-wrap items-end gap-y-3 justify-center sm:justify-start">
            <h3 className="text-lg font-semibold mb-4 w-full">
                {editRowId !== null ? 'Edit Row' : 'Add New Row'}
            </h3>
            {columnsData.map((col) => (
                <div key={col.id} className="flex flex-col mr-4 w-[95%] sm:w-auto">
                    <label className="text-sm font-semibold mb-1">{col.label}</label>
                    <input
                        type="text"
                        value={newRow[col.id] || ''}
                        onChange={(e) => setNewRow((prevRow) => ({ ...prevRow, [col.id]: e.target.value }))}
                        className="p-2 border rounded outline-black"
                    />
                </div>
            ))}
            <button
                onClick={handleSaveRow}
                className="w-[95%] sm:w-auto p-2 bg-blue-500 text-white rounded sm:ml-4 flex items-center justify-center sm:justify-normal"
            >
                <FiPlus className="mr-2" /> {editRowId !== null ? 'Save Row' : 'Add Row'}
            </button>
        </div>
    );
};

export default TableActions;
