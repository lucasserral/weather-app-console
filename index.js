import "colors";
import inquirer from "inquirer";

const questions = [
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

async function getAction() {
  const list = await inquirer.prompt(questions);
  return list.action;
}

async function main() {
  let action;
  do {
    console.clear();
    action = await getAction();

    switch (action) {
      case 1:
        break;
      case 2:
        break;
    }
  } while (!!action);
}

main();
