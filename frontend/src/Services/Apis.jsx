import axios from "axios";
import Cookies from 'js-cookie';
import { useState } from "react";

// Set the base URL once
const api = axios.create({
    // baseURL: 'http://localhost:5000', // Update to your live URL if needed
    baseURL: 'https://tourist-guide-ha95.onrender.com'
});

const getAuthConfig = () => ({
    headers: {
        "Authorization": `vikash ${Cookies.get("priestToken")}`
    }
});

const handleError = (error) => {
    if(error.response.status==404){

    }
    else if (error.response) {
        console.error('Error message:', error.response.data.error);
        // alert(error.response.data.error);
    } else {
        console.error('Unexpected error:', error.message);
    }
};

// API Requests
export const registration = async (data) => {
    
    try {
        const res = await api.post('/priest/register', data);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const priestLogin = async (data) => {
    try {
        const res = await api.post('/priest/login', data);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const updateProfile = async (data) => {
    try {
        const res = await api.post('/priest/update', data, getAuthConfig());
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const getPriests = async () => {
    try {
        const res = await api.get('/priests/get');
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const getProfile = async () => {
    try {
        const res = await api.get('/priest/get', getAuthConfig());
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const deleteProfile = async () => {
    try {
        const res = await api.delete('/priest/delete', getAuthConfig());
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const phoneExit = async (Phone) => {
    try {
        const res = await api.get(`/phone/exit?Phone=${Phone}`);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const getFeedback = async (priestId) => {
    try {
        const res = await api.get(`/feedback/get?priestId=${priestId}`);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}

export const addFeedback = async (data) => {
    try {
        const res = await api.post('/add/feedback', data);
        return res.data;
    } catch (error) {
        handleError(error);
    }
}
