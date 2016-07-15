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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var cryptogram_service_1 = require('../cryptogram/cryptogram.service');
var loading_dialog_component_1 = require('./loading-dialog.component');
var about_component_1 = require('./about.component');
var DashboardComponent = (function () {
    function DashboardComponent(router, cryptogramService) {
        this.router = router;
        this.cryptogramService = cryptogramService;
        this.info = false;
    }
    DashboardComponent.prototype.getRandomQuote = function () {
        var _this = this;
        this.cryptogramService.getRandomQuote()
            .then(function (quote) {
            console.log('quote', quote);
            _this.cryptogram = {
                puzzle: quote,
                solution: quote,
                progress: 0
            };
        });
    };
    DashboardComponent.prototype.encrypt = function (str) {
        var puzzle = this.cryptogramService.encrypt(str);
        this.cryptogram = {
            puzzle: puzzle,
            solution: puzzle,
            progress: 0
        };
    };
    DashboardComponent.prototype.decrypt = function (puzzle) {
        this.loading = true;
        // this.cryptogramService.decrypt(puzzle).subscribe((cryptogram: Cryptogram) => {
        //   //this.cryptogram = cryptogram;
        //   if(this.cryptogram.progress < 100){
        //     this.loading = true;
        //   }
        //   console.log('cryptogram!', cryptogram);
        // });
    };
    DashboardComponent.prototype.ngOnInit = function () {
        this.getRandomQuote();
        this.connection = this.cryptogramService
            .connect();
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.connection.unsubscribe();
    };
    DashboardComponent.prototype.toggleInfo = function () {
        this.info = !this.info;
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            moduleId: module.id,
            directives: [loading_dialog_component_1.LoadingDialog, about_component_1.About],
            templateUrl: 'dashboard.component.html',
            styleUrls: ['dashboard.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, cryptogram_service_1.CryptogramService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map