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
var DashboardComponent = (function () {
    function DashboardComponent(router, cryptogramService) {
        this.router = router;
        this.cryptogramService = cryptogramService;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.cryptogram = {
            id: 0,
            puzzle: 'this is a test',
            solution: 'this is a solution',
            progress: 0
        };
        this.connection = this.cryptogramService
            .connect()
            .subscribe(function (cryptogram) {
            console.log('cryptogram!', cryptogram);
            //this.cryptogram = cryptogram;
        });
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.connection.unsubscribe();
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            moduleId: module.id,
            templateUrl: 'dashboard.component.html',
            styleUrls: ['dashboard.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, cryptogram_service_1.CryptogramService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map