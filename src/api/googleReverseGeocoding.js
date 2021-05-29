import axios from "axios"

const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
const API_KEY = "AIzaSyA7DUp8WVvBeE7to9pjYRTKxfsWHVxDwA8"
const reverseGeocodeAPI = async (latlng) => {
  const res = await axios.get(`${BASE_URL}?latlng=${latlng}&key=${API_KEY}`)
  return res.data.results[0].formatted_address
}

export {reverseGeocodeAPI}