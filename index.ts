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
//    Создание текораторов методов
function logTrade (target: any, key: any, descriptor: any) {
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
