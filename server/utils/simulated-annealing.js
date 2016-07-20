import * as utils from './utils';
import _ from 'underscore';
import doUntil from 'async/doUntil';

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

// return the deciphered puzzle
function getCipherText(cipher, puzzle) {
  const answer = _.map(puzzle, (x)=> {
    return _.has(cipher, x.toLowerCase()) ?
      (x == x.toLowerCase() ? cipher[x] :
        cipher[x.toLowerCase()].toUpperCase()) : x;
  });
  return answer.join('');
}

// get the frequency of occurrences of all ngrams within a given text
// e.g {'aa': 1, 'ab': 10} = 'ab' showed up 10 times in the text
function getFrequencies(text, ngrams = digrams) {
  let sublength = ngrams[0].length;
  let frequencies = {};
  _.each(ngrams, (ngram)=> {
    frequencies[ngram] = 0;
  });

  for (let i = 0; i <= text.length - sublength; i++) {
    let sub = text.substring(i, i + sublength).toLowerCase();
    if (frequencies[sub] !== undefined) {
      frequencies[sub]++;
    }
  }

  let totalCount = _.reduce(_.map(frequencies, x => x), (x, y)=> x + y);
  _.each(frequencies, (v, k)=> {
    frequencies[k] = v / totalCount;
  });
  return frequencies;
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
function cost(cipherDigramFrequency) {
  return _.reduce(_.map(cipherDigramFrequency, (val, key)=> {
    return Math.abs(val - expectedDigramFrequencies[key]);
  }), (t, s)=> t + s);
}

export default class Solver {
  constructor() {
    console.log('expectedDigramFrequencies', expectedDigramFrequencies);
    console.log('expectedSortedLetterFrequencies', expectedSortedLetterFrequencies);
  }

  // takes a Cryptogram {puzzle: string, progress: integer(0-100)}
  // performs simulated annealing
  static simulatedAnnealing(cryptogram, socket) {
    console.log('cryptogram starting', cryptogram.puzzle);
    let killed = false;
    socket.on('disconnect', () => {
      killed = true;
    });

    const fullPuzzle = cryptogram.puzzle;

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
    let parentFrequencies = getFrequencies(cipherText);
    let parentCost = cost(parentFrequencies);

    let bestCipher = _.clone(cipher);
    let bestCost = parentCost;

    let temp = T_MAX;

    // execute the annealing
    let progressCounter = 0;
    let progressIncrement = 100 / (
      Math.log(T_MIN / T_MAX) / Math.log(ALPHA)
    );

    // first update
    socket.emit('data', Object.assign({}, cryptogram, {
      puzzle: getCipherText(bestCipher, fullPuzzle),
      progress: progressIncrement * progressCounter
    }));

    function fn(t) {
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

        // simplified algorithm for efficiency -- runs O(letters) times
        // alternative would run O(ngram) times but would work for more than digrams
        let childFreqencies = _.clone(parentFrequencies);
        _.each(letters, (l)=> {
          let original = getCipherText(cipher, l + a);
          let replacement = getCipherText(childCipher, l + a);
          childFreqencies[replacement] = parentFrequencies[original];
          childFreqencies[original] = parentFrequencies[replacement];

          original = getCipherText(cipher, a + l);
          replacement = getCipherText(childCipher, a + l);
          childFreqencies[replacement] = parentFrequencies[original];
          childFreqencies[original] = parentFrequencies[replacement];
        });

        childFreqencies[getCipherText(childCipher, a + b)] = parentFrequencies[getCipherText(cipher, a + b)];

        // get the cost of the new cipher
        let childCost = cost(childFreqencies);

        // if the child is better than the parent, child is the new parent
        if (childCost < parentCost) {
          parentFrequencies = childFreqencies;
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
            parentFrequencies = childFreqencies;
            parentCost = childCost;
            cipher = childCipher;
          }
        }

        counter += 1;
      });

      console.log('emitting', progressIncrement * progressCounter);
      console.log(fullPuzzle, bestCipher, getCipherText(bestCipher, fullPuzzle));
      socket.emit('data', Object.assign({}, cryptogram, {
        puzzle: getCipherText(bestCipher, fullPuzzle),
        progress: progressIncrement * progressCounter
      }));
      progressCounter++;

      // drop the temperature and tighten our allowance for child < parent
      setTimeout(()=> {
        if (t < T_MIN) {
          console.log(fullPuzzle, bestCipher, getCipherText(bestCipher, fullPuzzle));
          return;
        }

        fn(t * ALPHA);
      }, 0);
    }
    fn(temp);
  }
};
