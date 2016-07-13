import * as utils from './utils';
import _ from 'underscore';

// ITERATIONS per temperature
const ITERATIONS = 2000;

// max characters in puzzle + last letters of a word
const MAX_CHARACTERS = 2000;

const T_MAX = .1;
const T_MIN = .001;
const ALPHA = 2 / 3;

// basic constants for analysis
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const letters = alphabet + ' ';
const digrams = utils.cartesianProduct(letters, letters); // aa, ab, ac...

// filename declaration and analysis -- we only read the file once
const filename = utils.getFile('moby_dick.txt');
// read the file
const mobyDick = utils.getText(filename);

// get the expected letter and digram frequencies from moby dick
// this will be our source of truth for testing ciphers
const expectedDigramFrequencies = getFrequencies(mobyDick, digrams);
const expectedSortedLetterFrequencies = getSortedLetterFrequencies(mobyDick);

function occurrences(string, subString, allowOverlapping = true) {
  string += '';
  subString += '';

  if (subString.length <= 0) {
    return string.length + 1;
  }

  let n = 0;
  let pos = 0;
  let step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      n++;
      pos += step;
    } else {
      break;
    }
  }

  return n;
}

// return the deciphered puzzle
function getCipherText(cipher, puzzle) {
  const answer = _.map(puzzle, (x)=> {
    return _.has(cipher, x) ? cipher[x] : x;
  });
  return answer.join('');
}

// get the frequency of occurrences of all ngrams within a given text
// e.g {'aa': 1, 'ab': 10} = 'ab' showed up 10 times in the text
function getFrequencies(text, ngrams = digrams) {
  const ngramCounts = _.map(ngrams, (ngram)=> {
    return occurrences(text, ngram);
  });
  const ngramTotal = _.reduce(ngramCounts, (t, s) => t + s);
  return _.object(ngrams, _.map(ngramCounts, count => count / ngramTotal));
}

// sort letters of the alphabet by their frequency within the text
function getSortedLetterFrequencies(text) {
  const frequencies = getFrequencies(text, alphabet);
  return _.pluck(_.sortBy(_.map(frequencies, (v, k) => {
    return {key: k, freq: v};
  }), 'freq'), 'key');
}

// get the cost of the cipher
// cost = sum(abs(expected digram frequency - observed digram frequency)) for all digrams
function cost(cipherText) {
  const cipherDigramFrequency = getFrequencies(cipherText, digrams);
  return _.reduce(_.map(cipherDigramFrequency, (val, key)=> {
    return Math.abs(val - expectedDigramFrequencies[key]);
  }), (t, s)=> t + s);
}

export default class Solver {
  constructor() {
    console.log('expectedDigramFrequencies', expectedDigramFrequencies);
    console.log('expectedSortedLetterFrequencies', expectedSortedLetterFrequencies);
  }

  // takes a Cryptogram {puzzle: string, solution: string, progress: integer(0-100)}
  // performs simulated annealing
  static simulatedAnnealing(cryptogram) {
    const fullPuzzle = cryptogram.puzzle.toLowerCase();

    // shorten the puzzle for faster ITERATIONS -- 2000 characters for now
    let puzzle;
    if (fullPuzzle.length > MAX_CHARACTERS) {
      const nextSpace = fullPuzzle.indexOf(' ', MAX_CHARACTERS);
      puzzle = fullPuzzle.substring(0, nextSpace > -1 ? nextSpace : MAX_CHARACTERS);
    } else {
      puzzle = fullPuzzle;
    }

    // get the sorted letter frequency for the puzzle
    let puzzleSortedLetterFrequencies = getSortedLetterFrequencies(puzzle);

    // create a cipher based on most common letters in puzzle mapped to training letter frequency
    let cipher = _.object(_.map(alphabet, (letter, i)=> {
      return [
        puzzleSortedLetterFrequencies[i],
        expectedSortedLetterFrequencies[i]
      ];
    }));

    let cipherText = getCipherText(cipher, puzzle);
    let parentCost = cost(cipherText);

    let bestCipher = _.clone(cipher);
    let bestCost = parentCost;

    // TODO: update the guess object here

    let t = T_MAX;

    // execute the annealing
    while (t > T_MIN) {
      let counter = 0;
      _.each(_.range(ITERATIONS), (j)=> {
        // get two random letters
        let a = _.sample(alphabet);
        let b = _.sample(alphabet);

        let childCipher = _.clone(cipher);

        // swap letters in the cipher
        let temp = childCipher[a].slice(0);
        childCipher[a] = childCipher[b];
        childCipher[b] = temp;

        // get the cost of the new cipher
        let childCost = cost(getCipherText(childCipher, puzzle));

        // if the child is better than the parent, child is the new parent
        if (childCost < parentCost) {
          parentCost = childCost;
          cipher = childCipher;

          // if child is better than the best, child is the new best
          if (childCost < bestCost) {
            bestCipher = _.clone(cipher);
            bestCost = childCost;
          }
        } else {
          // here is the annealing function
          // if child is worse than parent, get a score e^((parent - child)/t) and compare to a random number between 0 and 1
          // if score > rand, child is the new parent
          let r = Math.random();
          let p = Math.pow(Math.E, ((parentCost - childCost) / t));

          if (p > r) {
            parentCost = childCost;
            cipher = childCipher;
          }
        }

        counter += 1;
      });

      console.log('temp', t);
      console.log('bestCipher', bestCipher);
      console.log('guess', getCipherText(bestCipher, fullPuzzle));

      // drop the temperature and tighten our allowance for child < parent
      t *= ALPHA;
    }

    // Guesses.update {_id: guessId}, {$set: status:
    //   'status': 'final guess',
    //   'cipher': bestCipher,
    //   'cost': bestCost,
    //   'guess': getCipherText bestCipher, fullPuzzle,
    //   'temperature' : t
    // }
  }
};
