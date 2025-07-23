import axios from 'axios';

export const fetchAssets = async () => {
    const response = await axios.get('https://localhost:3000/assets');
    return response.data;
}