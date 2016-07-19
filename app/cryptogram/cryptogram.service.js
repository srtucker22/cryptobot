"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _ = require('underscore');
var io = require('socket.io-client');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var Observable_1 = require('rxjs/Observable');
var ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
var CryptogramService = (function () {
    function CryptogramService(http) {
        this.http = http;
        this.cryptogramUrl = 'http://localhost:8000'; // URL to web api
        this.oldUrl = 'app/cryptogram';
        this.socket = io(this.cryptogramUrl);
        console.log('this.socket', this.socket);
    }
    CryptogramService.prototype.getRandomQuote = function () {
        return this.http.get(this.cryptogramUrl + '/files/random')
            .toPromise()
            .then(function (response) { return response.json().quote; })
            .catch(this.handleError);
    };
    CryptogramService.prototype.encrypt = function (str) {
        // return the deciphered puzzle
        function getCipherText(cipher, puzzle) {
            var answer = _.map(puzzle, function (x) {
                return _.has(cipher, x.toLowerCase()) ? (x == x.toLowerCase() ? cipher[x] : cipher[x.toLowerCase()].toUpperCase()) : x;
            });
            return answer.join('');
        }
        var shuffled = _.shuffle(ALPHABET);
        var cipher = _.object(_.map(ALPHABET, function (letter, index) {
            return [letter, shuffled[index]];
        }));
        return getCipherText(cipher, str);
    };
    CryptogramService.prototype.decrypt = function (puzzle) {
        var _this = this;
        this.socket.emit('decrypt', {
            puzzle: puzzle,
            progress: 0
        });
        this.observable = new Observable_1.Observable(function (observer) {
            _this.socket.on('data', function (data) {
                console.log('data', data);
                observer.next(data);
            });
            return function () {
                _this.socket.disconnect();
            };
        });
        return this.observable;
    };
    CryptogramService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    CryptogramService.prototype.solveRequest = function (cryptogram) {
        this.socket.emit('solve', cryptogram);
    };
    CryptogramService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CryptogramService);
    return CryptogramService;
}());
exports.CryptogramService = CryptogramService;
//# sourceMappingURL=cryptogram.service.js.map