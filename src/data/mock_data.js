let BREWERIES = [
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01",
    name: "AB InBev",
    location: "BELGIUM",
  },
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr02",
    name: "Duvel Moortgat",
    location: "BELGIUM",
  },
];

let BEERS = [
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01",
    name: "Stella Artois",
    percentage: 5.2,
    brewery: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr01",
      name: "AB InBev",
    },
  },
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe02",
    name: "Duvel",
    percentage: 8.5,
    brewery: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbr02",
      name: "Duvel Moortgat",
    },
  },
];

let REVIEWS = [
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abre01",
    rating: 4.5,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "2021-05-08T00:00:00.000Z",
    user: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
      name: "Jentl Suy",
    },
    beer: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe01",
      name: "Stella Artois",
    },
  },
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abre02",
    rating: 4,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "2021-05-21T12:30:00.000Z",
    user: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abus01",
      name: "Jentl Suy",
    },
    beer: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe02",
      name: "Duvel",
    },
  },
  {
    id: "7f28c5f9-d711-4cd6-ac15-d13d71abre03",
    rating: 3.75,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "2021-05-25T17:40:00.000Z",
    user: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abus02",
      name: "Glenn De Bock",
    },
    beer: {
      id: "7f28c5f9-d711-4cd6-ac15-d13d71abbe02",
      name: "Duvel",
    },
  },
];

module.exports = { REVIEWS, BEERS, BREWERIES };
