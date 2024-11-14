import axios from 'axios';

const API_URL = 'http://localhost:5000/data'; // Your API URL

// Function to fetch data from the server (GET request)
export const getData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Function to add a new row to the server (POST request)
export const addData = async (newRow) => {
    try {
        const response = await axios.post(API_URL, newRow);
        return response.data; // Return the added row
    } catch (error) {
        console.error('Error adding data:', error);
        throw error;
    }
};

// Function to update an existing row on the server (POST request as Update)
export const updateData = async (updatedRow) => {
    try {
        // Use POST with the same URL to overwrite the data at that ID
        const response = await axios.post(`${API_URL}/${updatedRow.id}`, updatedRow); // Use POST for update
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

// Function to delete a row from the server (POST request as Delete)
export const deleteData = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`); // Use DELETE for deleting row
        return response.data; // Returns the response after deletion
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};
