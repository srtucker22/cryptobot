import * as utils from '../utils';

const defaults = {
  minCharacters: 2000,
  maxCharacters: 5000
};

// return a random quote from a random file with a random size within params
export function getRandomQuote(req, res) {
  const filename = utils.getRandomFile();
  const length = Math.floor(Math.random() * (defaults.maxCharacters - defaults.minCharacters)) + defaults.minCharacters;
  res.send({quote: utils.getRandomQuote(filename, length)});
}
