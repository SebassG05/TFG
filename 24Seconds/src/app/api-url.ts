// Centraliza la URL base de la API para todo el frontend
export const API_URL = (typeof process !== 'undefined' && process.env && process.env['API_URL'])
  ? process.env['API_URL']
  : 'https://tfg-z7pz.onrender.com/api';
