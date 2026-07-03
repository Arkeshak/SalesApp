import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getClients = () => axios.get(`${API_URL}/clients`);
export const getItems = () => axios.get(`${API_URL}/items`);
export const getOrders = () => axios.get(`${API_URL}/orders`);
export const getOrderById = (id) => axios.get(`${API_URL}/orders/${id}`);
export const createOrder = (order) => axios.post(`${API_URL}/orders`, order);
export const updateOrder = (id, order) => axios.put(`${API_URL}/orders/${id}`, order);
