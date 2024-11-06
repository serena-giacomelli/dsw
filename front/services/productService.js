import { API_BASE_URL } from "../config/apiConfig";

export const getProductsByStock = async (cantidad) => {
  try {
    const response = await fetch(`${API_BASE_URL}/producto/cantidad/${cantidad}`);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Error buscando productos por cantidad en stock:", error);
    throw error;
  }
};

export const getProductsByType = async (codtipoProducto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/producto/categoria/${codtipoProducto}`);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Error buscando productos por tipo:", error);
    throw error;
  }
};