import * as utils from './utils';

const defaults = {
  minCharacters: 2000,
  maxCharacters: 3000
};

export function getRandomQuote(opts){
  if(!!opts){
    opts.maxCharacters = opts.maxCharacters || defaults.maxCharacters;
    opts.minCharacters = opts.maxCharacters || defaults.minCharacters;
  } else {
    opts = defaults;
  }

  const min = 0;
  const max = utils.getFileSize(filename);
  const length = Math.floor(Math.random() * (opts.maxCharacters - opts.minCharacters)) + opts.minCharacters;
  const start = Math.floor(Math.random() * (max - length - min)) + min;
  utils.partialFSReadSync(__dirname , start, start + length);
}
