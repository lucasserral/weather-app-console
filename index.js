import * as dotenv from "dotenv";
dotenv.config();
import "colors";
import fs from "fs"
import inquirer from "inquirer";
import axios from "axios";
import Searches from "./models/Searches.js";

const menuQuestion = [
  {
    type: "list",
    pageSize: 4,
    name: "action",
    message: "What would you like to do?",
    choices: [
      {
        value: 1,
        name: `${"1. ".green} Look up a city`,
      },
      {
        value: 2,
        name: `${"2. ".green} Search history`,
      },
      {
        value: 0,
        name: `${"0. ".green} Exit`,
      },
    ],
  },
];
const searchQuestions = [
  {
    type: "input",
    name: "searched",
    message: "Enter your search: ",
  },
];

async function selectFromList(options) {
  const choices = options.map((city) => ({
    value: city.id,
    name: `${" - ".green} ${city.place_name}`,
  }));
  choices.push({ value: 0, name: "Cancel" });

  const list = await inquirer.prompt({
    type: "list",
    name: "selection",
    message: "These are the coincidences to your search. Select one:",
    choices: choices,
  });
  return list.selection;
}

async function pause() {
  const pause = await inquirer.prompt({
    type: "input",
    message: "Press ENTER to continue",
    name: "pause",
  });
  return;
}

async function getAction() {
  const list = await inquirer.prompt(menuQuestion);
  return list.action;
}

async function getSearch() {
  const input = await inquirer.prompt(searchQuestions);
  return input.searched;
}

async function getWeather(lat, lon){
  const response = await axios.get("https://api.openweathermap.org/data/2.5/weather",{
    params: {
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
      lat,
      lon,
    }
  })

  return response.data;

}

function loadData(){
  try {
    const data = JSON.parse(fs.readFileSync("./db/.data.json"));
    return data;
  } catch (error) {
    console.log(error)
    return [];
  }
};

async function main() {
  const searches = new Searches(loadData());
  let action;
  do {
    console.clear();
    action = await getAction();

    switch (action) {
      case 1:
        const city = await getSearch();
        const response = await searches.getCities(city);
        const responseSelected = await selectFromList(response);
        const citySelected = response.find(
          (resp) => resp.id == responseSelected
        );
        const weather = await getWeather(citySelected.latitude, citySelected.longitude)

        searches.updateHistory(citySelected.place_name)

        console.log("----------------------------------------".green)
        console.log("---------------   INFO   ---------------".green)
        console.log("----------------------------------------\n".green)
        console.log("Place:".green, citySelected.place_name)
        console.log("Longitude:".green, citySelected.longitude)
        console.log("Latitude:".green, citySelected.latitude)
        console.log("---")
        console.log("Weather:".green, weather.weather[0].description)
        console.log("Temp:".green, weather.main.temp, "°C")
        console.log("Max:".green, weather.main.temp_max, "°C")
        console.log("Min:".green, weather.main.temp_min, "°C")
        console.log("Humidity:".green, weather.main.humidity)
        await pause();
        break;
      case 2:
        searches.showHistory()
        await pause()
        break;
    }
  } while (!!action);
}

export { pause }

main();
