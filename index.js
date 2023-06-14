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
grt.sayHello(); //Hello MR. Anton
/*------------------------------------------------------------------
ФОРМАЛЬЛНЫЕ ОБЪЯВЛЕНИЯ СИГНАТУРЫ ДЕКОРЫТОРОВ
declare type ClassDecorator = <TFunction extends Function> (target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T> (target: Object, propertyKey: string | symbol, TypedPropertyDescriptor <T>) => TypedPropertyDescriptor <T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
------------------------------------------------------------------*/
//    Создание декораторов методов
function logTrade(target, key, descriptor) {
    const originalCode = descriptor.value;
    descriptor.value = function () {
        console.log(`Invoked ${key} providing: `, arguments);
        return originalCode.apply(this, arguments);
    };
    return descriptor;
}
class Trade {
    placeOrder(stockName, quantity, operation, tradedID) {
        //Здесь помещается реалиизация кода
    }
}
__decorate([
    logTrade
], Trade.prototype, "placeOrder", null);
const trade = new Trade();
trade.placeOrder('IBM', 100, 'Buy', 123);
const worker = { name: 'John', age: 33 };
function doStuff(person) {
    person.age = 23;
}
doStuff(worker);
/**
 * Make all properties in T readonly
 */
// type Readonly<T> = {
//     readonly [P in keyof T]: T[P];
// };
/**
 * From T, pick a set of properties whose keys are in the union K
 */
// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// };
//  Ущербная версия функции
// function felterBy<T>(
//     property: any,
//     value: any,
//     array: T[]
// ) {
//     return array.filter(item => item[property] === value);
// }
// Версия с ошибкой
const persons = [
    { name: 'John', age: 34 },
    { name: 'Vas9', age: 23 }
];
function filterBy(property, value, array) {
    return array.filter(item => item[property] === value);
}
console.log(filterBy('name', 'John', persons));
console.log(filterBy('lastName', 'John', persons));
console.log(filterBy('age', 'twenty', persons));
// Улучшенная версия filterBy
function filterByS(//Проверяет, что бы переданное свойсво P принадлежало объединению [keyof T]
property, //Свойсво для фильтра
value, //Значение для фильтра должно иметь тип переданного свойсва P
array) {
    return array.filter(item => item[property] === value);
}
const worker1 = { name: "John", age: 34 };
worker1.age = 63; //error
const worker2 = { name: "John", age: 34 };
worker2.age = 74;
// type Partial<T> = {               //lib.es5.d.ts
//     [P in keyof T]?: T[P];
// };
const workerPartial = { name: "Anton" }; // workerPartial -- Error
const workerPartial1 = { name: "Anton" };
// type Required<T> = {                        //lib.es5.d.ts
//     [P in keyof T]-?: T[P];
// };
const workerRequired = { name: "Anton" };
const workerRequired1 = { name: "Anton" }; // workerRequired1 -- Error
const workerCustom = { name: "Fros9" }; //инициализируется name, но age опциаональное
workerCustom.name = "Mary"; //error (Readonly)
// Условные типы
class Product {
}
const getProducts = function (id) {
    if (typeof id === 'number')
        return { id: 123 };
    else
        return [{ id: 123 }, { id: 9393 }];
};
const result1 = getProducts(123); // Product
const result2 = getProducts(); // Product[]
// type Exclude<T, U> = T extends U ? never : T;              //lib.es5.d.ts
class TvPerson {
}
class AsyncService {
    getA() {
        return Promise.resolve('');
    }
}
let service = new AsyncService();
let result = service.getA();
