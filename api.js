/*Ideally both BASE URL and TOKEN should be stored in an env file, I've created a sample env file for this.
If token rotates or APi gets deployed elsewhere, one place to chagne it.*/

require("dotenv").config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_TOKEN = process.env.API_TOKEN || 'pat_abcdefghijklmnopqrstuvwxyz0123456789';

//One secure pathway for API routing dealing with the auth
async function getApiData (path){
    try {
        const res = await fetch(`${API_BASE_URL}/${path}`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
        if (!res.ok){
            const body = await res.json().catch (()=>null);
            console.error(`API request failed due to - ${res.status}: ${body?.error ?? 'unkonwn error'}`)
            return null;
        }   
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
module.exports = { getApiData };