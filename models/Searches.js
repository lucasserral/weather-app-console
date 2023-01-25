import axios from "axios";
import fs from "fs";

class Searches {
  #searchesList = [];
  constructor(data = []) {
    this.#searchesList = data;
  }

  get paramsMapbox() {
    return {
      proximity: "ip",
      limit: 5,
      language: "es",
      types: [
        "country",
        "region",
        "district",
        "locality",
        "neighborhood",
        "place",
      ],
      access_token: process.env.MAPBOX_TOKEN,
    };
  }

  updateHistory(newElement){
    const path = "./db/.data.json";
    const dirPath = "./db"
    this.#searchesList.unshift(newElement)
    if( this.#searchesList.length > 5 ) this.#searchesList.pop();
    const data = JSON.stringify(this.#searchesList)
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path, data);
  }

  async getCities(place = "") {
    const searchTerm = place.split(" ").join("%20");
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json`,
        params: this.paramsMapbox,
      });
      const response = await instance.get();
      return response.data.features.map((feature) => ({
        id: feature.id,
        place_name: feature.place_name,
        longitude: feature.center[0],
        latitude: feature.center[1],
      }));
    } catch (err) {
      console.log(err);
    }
  }
}

export default Searches;
