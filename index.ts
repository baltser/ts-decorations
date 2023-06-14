///////////////// Создание декораторов классов
function whoAmI(target: Function): void {
    console.log(`You are: \n ${target}`);
}
@whoAmI
class Friend {
    constructor(private  name: string, private age: number) {}
}
////////
function UIcomponent (html: string) {
    console.log(`The decorator received ${html} \n`);
    return function (target: Function) {
        console.log(`Someone wants to create a UI component from \n ${target}`);
    }
}
@UIcomponent('<h1>Hello Shopper</h1>')
class Shopper {
    constructor(private name: string) {}
}
// примиси(миксины)
type constructorMixin = { new(...args: any[]): {} };

function useSalutation( salutation: string){
   return function <T extends constructorMixin> (target: T) {
        return class extends target {
            name: string | undefined;
            // @ts-ignore
            private massage: string = 'Hello ' + salutation + this.name;

            sayHello() { console.log(`${this.massage}`); }
        }
    }
}
@useSalutation("MR. ")
class Greeter {
    constructor(public name: string) {}
    sayHello() { console.log(`Hello ${this.name}`); }
}
const grt = new Greeter('Anton');
grt.sayHello();  //Hello MR. Anton
/*------------------------------------------------------------------
ФОРМАЛЬЛНЫЕ ОБЪЯВЛЕНИЯ СИГНАТУРЫ ДЕКОРЫТОРОВ
declare type ClassDecorator = <TFunction extends Function> (target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T> (target: Object, propertyKey: string | symbol, TypedPropertyDescriptor <T>) => TypedPropertyDescriptor <T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
------------------------------------------------------------------*/
//    Создание декораторов методов
function logTrade (target, key, descriptor) {
    const originalCode = descriptor.value;
    descriptor.value = function () {
        console.log(`Invoked ${key} providing: `, arguments);
        
        return originalCode.apply(this, arguments);
    };
    return descriptor;
}
class Trade {

    @logTrade
    placeOrder(stockName: string, quantity: number, operation: string, tradedID: number) {
        //Здесь помещается реалиизация кода
    }
}

const trade = new Trade();
trade.placeOrder('IBM', 100, 'Buy', 123);

/*****************      ОТОБРАЖЕННЫЕ ТИПЫ        ****************/
// отображенный тип readonly

interface Person {
    name: string;
    age: number;
}

const worker: Person = {name: 'John', age: 33};
function doStuff(person: Readonly<Person>){
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
const persons: Person[] = [
    {name: 'John', age: 34},
    {name: 'Vas9', age: 23}
];
function filterBy<T>(
        property: any,
        value: any,
        array: T[]
){
    return array.filter(item => item[property] === value);
}
console.log(filterBy('name', 'John', persons))
console.log(filterBy('lastName', 'John', persons))
console.log(filterBy('age', 'twenty', persons))

// Улучшенная версия filterBy
function filterByS<T, P extends keyof T>(    //Проверяет, что бы переданное свойсво P принадлежало объединению [keyof T]
    property: P,          //Свойсво для фильтра
    value: T[P],          //Значение для фильтра должно иметь тип переданного свойсва P
    array: T[]
){
    return array.filter(item => item[property] === value);
}
//Объявление собственных отображенных типов
interface PersonModifiable {
    readonly name: string;
    readonly age: number;
}
type Modifiable<T> = {
    -readonly [P in keyof T]: T[P];
}
const worker1: PersonModifiable = {name: "John", age: 34};
worker1.age = 63;    //error

const worker2: Modifiable<Person> = {name: "John", age: 34};
worker2.age = 74;
//Другие встроенные отображенные типы
// /**
//  * Make all properties in T optional  -- если не все они дожны быть опциональными
//  */
interface PersonPartial {
    name: string;
    age: number;
}
// type Partial<T> = {               //lib.es5.d.ts
//     [P in keyof T]?: T[P];
// };
const workerPartial: PersonPartial = {name: "Anton"};            // workerPartial -- Error
const workerPartial1: Partial<PersonPartial> = {name: "Anton"};
// /**
//  * Make all properties in T required  */-- идаляет опциональное свойство
//
interface PersonRequired {
    name?: string;
    age?: number;
}
// type Required<T> = {                        //lib.es5.d.ts
//     [P in keyof T]-?: T[P];
// };
const workerRequired: PersonRequired = {name: "Anton"};
const workerRequired1: Required<PersonRequired> = {name: "Anton"};    // workerRequired1 -- Error

// Пример более одного отображенного типа
interface PersonCustom {
    name: string;
    age: number;
}
const workerCustom: Readonly<Partial1<PersonCustom>> = { name: "Fros9" };  //инициализируется name, но age опциаональное
workerCustom.name = "Mary";   //error (Readonly)

// Еще один полезный тип - Pick
interface PersonPick {
    name: string;
    age: number;
    address: string;
}

// type Pick<T, K extends keyof T> = {             //lib.es5.d.ts
//     [P in K]: T[P]
// }
type PersonNameAddress<T, K> = Pick<PersonPick, 'name' | 'address'>;

// Условные типы
class Product {
    id: number;
}
const getProducts = function<T>(id?: T): T extends number ? Product : Product[] {

    if(typeof id === 'number') return { id: 123 } as any;
    else return [{id: 123}, {id: 9393}] as any;
}
const result1 = getProducts(123);   // Product
const result2 = getProducts();        // Product[]

// type Exclude<T, U> = T extends U ? never : T;              //lib.es5.d.ts

class TvPerson {
    id: number;
    name: string;
    age: number;
}
type RemoveProps<T, K> = Exclude<keyof T, K>;
type RemainingProps = RemoveProps<TvPerson, 'name' | 'age'>;
type PersonBlindAuditions = Pick<TvPerson, RemainingProps>

//          Ключевое слово 'infer'

type ReturnPromise<T> =
    T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T;

type Promisify<T> = {
    [P in keyof T]: ReturnPromise<T[P]>;
};

interface SyncService {
    baseUrl: string;
    getA(): string;
}

class AsyncService implements Promisify<SyncService> {
    baseUrl: string;

    getA(): Promise<string> {
        return Promise.resolve('');
    }
}

let service = new AsyncService();


let result = service.getA();