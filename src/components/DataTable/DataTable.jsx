import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableActions from './TableActions';
import ColumnVisibilityPanel from './ColumnVisibilityPanel';
import TableBody from './TableBody';
import * as XLSX from 'xlsx';
import { getData, addData, updateData, deleteData } from '../../pages/apiService'; // Import API functions

const DataTable = ({
    data: initialData, // Incoming data from App.js
    columnsData,
    enableGlobalSearch = true,
    enableColumnSearch = true,
    enableAddRow = true,
    enableDownload = true,
    enableEdit = true,
    enableDelete = true,
}) => {
    const [data, setData] = useState(initialData);
    const [visibleColumns, setVisibleColumns] = useState(
        columnsData.map((col) => ({ ...col, isVisible: true, search: '' }))
    );
    const [globalFilterText, setGlobalFilterText] = useState('');
    const [newRow, setNewRow] = useState({});
    const [editRowId, setEditRowId] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Fetch data from API on initial render
    useEffect(() => {
        if (initialData.length === 0) fetchData(); // If initialData is empty, fetch from API
    }, []);

    const fetchData = async () => {
        try {
            const fetchedData = await getData(); // Fetch data from API
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Add new row using POST (Handle in DataTable.js)
    const handleAddRow = async () => {
        try {
            if (Object.keys(newRow).length === columnsData.length) {
                const addedRow = await addData(newRow); // Use POST for creating new row
                setData((prevData) => [...prevData, addedRow]);
                setNewRow({});
            }
        } catch (error) {
            console.error('Error adding row:', error);
        }
    };

    // Update existing row using POST (Handle in DataTable.js)
    const handleUpdateRow = async (id, updatedRow) => {
        try {
            // Optimistically update the row in the UI
            setData((prevData) =>
                prevData.map((item) => (item.id === id ? updatedRow : item))
            );
    
            updatedRow.id = id; // Ensure updatedRow has id
            await updateData(updatedRow); // Persist the update in the backend
    
            setEditRowId(null); // Clear edit mode after updating
        } catch (error) {
            console.error('Error updating row:', error);
            // Optionally revert the UI update if the update fails
            fetchData(); // Refetch data in case of failure to keep UI in sync
        }
    };
    
    // Delete row using POST (Handle in DataTable.js)
    const handleDelete = async (id) => {
        try {
            await deleteData(id); // Use POST for deleting row
            setData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const filteredData = Array.isArray(data) ? data.filter((row) => {
        const globalMatch = Object.keys(row).some((key) =>
            row[key]?.toString().toLowerCase().includes(globalFilterText.toLowerCase())
        );

        const columnMatch = visibleColumns.every((col) => {
            return !col.search || row[col.id]?.toString().toLowerCase().includes(col.search.toLowerCase());
        });

        return globalMatch && columnMatch;
    }) : [];


    // Handle Excel download
    const downloadExcel = () => {
        const sheetData = filteredData.map((row) => {
            const visibleRow = {};
            visibleColumns.forEach((col) => {
                if (col.isVisible) visibleRow[col.id] = row[col.id];
            });
            return visibleRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

        XLSX.writeFile(workbook, 'TableData.xlsx');
    };

    return (
        <div className={`p-4 bg-white rounded shadow-lg w-full relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
            {!isFullscreen && enableAddRow && (
                <TableActions
                    columnsData={columnsData}
                    newRow={newRow}
                    setNewRow={setNewRow}
                    handleAddRow={handleAddRow}
                    handleUpdateRow={handleUpdateRow}
                    editRowId={editRowId}
                    setEditRowId={setEditRowId}
                    data={data}
                />
            )}

            <TableHeader
                enableGlobalSearch={enableGlobalSearch}
                globalFilterText={globalFilterText}
                setGlobalFilterText={setGlobalFilterText}
                enableDownload={enableDownload}
                setShowPanel={setShowPanel}
                showPanel={showPanel}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                downloadExcel={downloadExcel}
            />

            {showPanel && (
                <ColumnVisibilityPanel
                    columnsData={visibleColumns}
                    toggleColumnVisibility={(columnId, visibility) =>
                        setVisibleColumns((prevCols) =>
                            prevCols.map((col) =>
                                col.id === columnId ? { ...col, isVisible: visibility } : col
                            )
                        )
                    }
                />
            )}

            <TableBody
                data={filteredData}
                visibleColumns={visibleColumns}
                enableEdit={enableEdit}
                enableDelete={enableDelete}
                setData={setData}
                setEditRowId={setEditRowId}
                setNewRow={setNewRow}
                handleColumnSearchChange={(columnId, value) =>
                    setVisibleColumns((prevCols) =>
                        prevCols.map((col) =>
                            col.id === columnId ? { ...col, search: value } : col
                        )
                    )
                }
                enableColumnSearch={enableColumnSearch}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default DataTable;
