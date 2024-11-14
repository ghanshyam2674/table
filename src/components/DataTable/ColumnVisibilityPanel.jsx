import React, { useState, useEffect } from 'react';

const ColumnVisibilityPanel = ({ columnsData, toggleColumnVisibility }) => {
    const [allVisible, setAllVisible] = useState(true);

    // Sync the visibility with columnsData
    useEffect(() => {
        const allVisibleState = columnsData.every((col) => col.isVisible);
        setAllVisible(allVisibleState);
    }, [columnsData]);

    // Toggle visibility for all columns
    const toggleAllColumns = () => {
        const newVisibility = !allVisible;
        columnsData.forEach((col) => toggleColumnVisibility(col.id, newVisibility));
        setAllVisible(newVisibility);
    };

    return (
        <div className="absolute right-4 top-50 bg-white shadow-md border rounded p-4 w-64 z-10">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-2">Column Visibility</h3>
                <button
                    className="text-blue-700 font-semibold mb-4"
                    onClick={toggleAllColumns}
                >
                    {allVisible ? 'Hide All' : 'Show All'}
                </button>
            </div>
            <div>
                {columnsData.map((col) => (
                    <label key={col.id} className="flex items-center space-x-2 mb-2">
                        <button
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${col.isVisible ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            onClick={() => toggleColumnVisibility(col.id, !col.isVisible)}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full transition-transform ${col.isVisible ? 'transform translate-x-6' : ''
                                    }`}
                            />
                        </button>
                        <span>{col.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ColumnVisibilityPanel;
