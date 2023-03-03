import axios from "axios"

const BASE_URL = ""
const API_KEY = ""
const reverseGeocodeAPI = async (latlng) => {
  const res = await axios.get(`${BASE_URL}?latlng=${latlng}&key=${API_KEY}`)
  return res.data.results[0].formatted_address
}

export {reverseGeocodeAPI}
