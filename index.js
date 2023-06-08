"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///////////////// Создание декораторов классов
function whoAmI(target) {
    console.log(`You are: \n ${target}`);
}
let Friend = class Friend {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
};
Friend = __decorate([
    whoAmI
], Friend);
////////
function UIcomponent(html) {
    console.log(`The decorator received ${html} \n`);
    return function (target) {
        console.log(`Someone wants to create a UI component from \n ${target}`);
    };
}
let Shopper = class Shopper {
    constructor(name) {
        this.name = name;
    }
};
Shopper = __decorate([
    UIcomponent('<h1>Hello Shopper</h1>')
], Shopper);
function useSalutation(salutation) {
    return function (target) {
        return class extends target {
            constructor() {
                super(...arguments);
                // @ts-ignore
                this.massage = 'Hello ' + salutation + this.name;
            }
            sayHello() { console.log(`${this.massage}`); }
        };
    };
}
let Greeter = class Greeter {
    constructor(name) {
        this.name = name;
    }
    sayHello() { console.log(`Hello ${this.name}`); }
};
Greeter = __decorate([
    useSalutation("MR. ")
], Greeter);
const grt = new Greeter('Anton');
grt.sayHello();
