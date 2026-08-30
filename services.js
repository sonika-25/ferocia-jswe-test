const api = require("./api")

//get Tax and HEM on annual income from API, return error if API call fails

async function getTax (income){
    const data = await api.getApiData(`api/tax?income=${income}`)
    if (!data) {
        throw new Error("Could not get tax from the API")
    }
    return data.tax
}

async function getHem (income,dependents){
    const data = await api.getApiData(`api/hem?income=${income}&dependents=${dependents}`)
    if (!data) {
        throw new Error("Could not get HEM from the API")
    }
    return data.hem
}

module.exports = { getTax, getHem };
