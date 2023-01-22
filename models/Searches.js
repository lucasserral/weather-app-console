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
      types: "country%2Cregion%2Cdistrict%2Clocality%2Cneighborhood%2Cplace",
      access_token: MAPBOX_TOKEN,
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
      return response.data;
    } catch (err) {}
  }
}

export default Searches;
