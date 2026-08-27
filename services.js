const api = require("./api")

async function getTax (income){
    const data = await api.getApiData(`api/tax?income=${income}`)
    const tax = data?.tax ?? Math.round(income * 0.25)
    return tax 
}
async function getHem (income,dependents){
    const data = await api.getApiData(`api/hem?income=${income}&dependents=${dependents}`)
    const hem = data?.hem ?? (2000 + (dependents*400))
    return hem 
}
module.exports = { getTax, getHem };
