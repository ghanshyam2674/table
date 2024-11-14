import React from 'react';
import { FiDownload, FiMaximize, FiMinimize } from 'react-icons/fi';

const TableHeader = ({ enableGlobalSearch, globalFilterText, setGlobalFilterText, enableDownload, setShowPanel, showPanel, isFullscreen, setIsFullscreen,downloadExcel }) => (
    <div className="flex justify-between items-center mb-4">
        <div className="flex items-center sm:space-x-4">
            {enableDownload && (
                <button onClick={downloadExcel} className="flex items-center text-blue-700 sm:font-semibold px-3 py-1 rounded text-sm">
                    <FiDownload className="mr-2 text-2xl" />
                    <span className='hidden sm:inline-block'>Download Excel</span>
                </button>
            )}
            {enableGlobalSearch && (
                <input
                    type="text"
                    placeholder="Global Search..."
                    className="p-1 border rounded w-[100px] sm:w-auto"
                    value={globalFilterText}
                    onChange={(e) => setGlobalFilterText(e.target.value)}
                />
            )}
        </div>
        <div className="flex items-center space-x-4">
            <button
                onClick={() => setShowPanel(!showPanel)}
                className="text-blue-700 border-blue-500 border-[1px] sm:border-2 sm:font-semibold px-4 py-1 rounded sm:mt-0"
            >
                {showPanel ? 'Hide Columns' : 'Show Columns'}
            </button>
            <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
        </div>
    </div>
);

export default TableHeader;
