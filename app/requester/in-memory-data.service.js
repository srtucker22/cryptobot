"use strict";
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var cryptogram = {
            id: 1,
            puzzle: 'i am a puzzle',
            solution: 'i am a solution',
            progress: 100
        };
        return { cryptogram: cryptogram };
    };
    return InMemoryDataService;
}());
exports.InMemoryDataService = InMemoryDataService;
//# sourceMappingURL=in-memory-data.service.js.map