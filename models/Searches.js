import axios from "axios";

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
