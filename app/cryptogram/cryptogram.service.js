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
var io = require('socket.io-client');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var Observable_1 = require('rxjs/Observable');
var CryptogramService = (function () {
    function CryptogramService(http) {
        this.http = http;
        this.cryptogramUrl = 'http://localhost:8000'; // URL to web api
        this.oldUrl = 'app/cryptogram';
    }
    CryptogramService.prototype.getCryptogram = function () {
        return this.http.get(this.cryptogramUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    CryptogramService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    CryptogramService.prototype.solveRequest = function (cryptogram) {
        this.socket.emit('solve', cryptogram);
    };
    CryptogramService.prototype.connect = function () {
        var _this = this;
        var observable = new Observable_1.Observable(function (observer) {
            _this.socket = io(_this.cryptogramUrl);
            _this.socket.on('data', function (data) {
                observer.next(data);
            });
            return function () {
                _this.socket.disconnect();
            };
        });
        return observable;
    };
    CryptogramService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CryptogramService);
    return CryptogramService;
}());
exports.CryptogramService = CryptogramService;
//# sourceMappingURL=cryptogram.service.js.map