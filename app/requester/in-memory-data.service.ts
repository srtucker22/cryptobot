export class InMemoryDataService {
  createDb() {
    let cryptogram = {
      id: 1,
      puzzle: 'i am a puzzle',
      solution: 'i am a solution',
      progress: 100
    };
    return {cryptogram};
  }
}
