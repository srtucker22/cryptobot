export class InMemoryDataService {
  createDb() {
    let cryptogram = {
      puzzle: 'i am a puzzle',
      progress: 100
    };
    return {cryptogram};
  }
}
