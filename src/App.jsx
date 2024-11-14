import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable/DataTable';
import columnsData from './components/DataTable/columnsData';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/data');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const fetchedData = await response.json();
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]); // Set data to empty array if fetch fails
        }
    };


    return (
        <DataTable
            data={data} // Passing data to DataTable
            columnsData={columnsData} // Column definitions
            enableGlobalSearch={true}
            enableColumnSearch={true}
            enableAddRow={true}
            enableDownload={true}
            enableEdit={true}
            enableDelete={true}
        />
    );
};

export default App;
