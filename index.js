import * as dotenv from "dotenv";
dotenv.config();
import "colors";
import inquirer from "inquirer";
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

async function main() {
  const searches = new Searches();
  let action;
  do {
    console.clear();
    action = await getAction();

    switch (action) {
      case 1:
        const city = await getSearch();
        const response = await searches.getCities(city);
        console.log(response);
        await pause();
        break;
      case 2:
        break;
    }
  } while (!!action);
}

// main();
