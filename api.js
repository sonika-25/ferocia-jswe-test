const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_TOKEN = process.env.API_TOKEN || 'pat_abcdefghijklmnopqrstuvwxyz0123456789';

async function getApiData (path){
    try {
        const res = await fetch(`${API_BASE_URL}/${path}`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}
export default getApiData