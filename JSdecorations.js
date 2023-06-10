 /*                       ДЕКОРАТОРЫ И ПЕРЕАДРЕСАЦИЯ ВЫЗОВО               */
 //                 Прозрачное кеширование

 function slow (x) {
     //здесь могут быть ресурсоёмкие вычисления
        console.log(`Called with ${x}`);
        return x;
 }

 function cachingDecorator(func) {
     let cache = new Map();

     return function(x) {
         if (cache.has(x)) {    // если кеш содержит такой x,
             return cache.get(x); // читаем из него результат
         }

         let result = func(x); // иначе, вызываем функцию

         cache.set(x, result); // и кешируем (запоминаем) результат
         return result;
     };
 }

 slow = cachingDecorator(slow);

 console.log(slow(1));  //кешируем
 console.log("Again:  " + slow(1))  //возвращаем из кеша

 console.log(slow(2));  //кешируем
 console.log("Again:  " + slow(2))  //возвращаем из кеша
/*****-------------------------------------------------------------*****/
 // Применение "func.call" для передачи контента

 let worker = {
     someMethod() {
         return 1;
     },

     slow(x) {
         console.log("Called with " + x);
         return x * this.someMethod(); // (*)
     }
 };

 function cachingDecoratorCall(func) {
     let cache = new Map();
     return function(x) {
         if (cache.has(x)) {
             return cache.get(x);
         }
         let result = func.call(this, x); // теперь 'this' передаётся правильно
         cache.set(x, result);
         return result;
     };
 }

 worker.slow = cachingDecoratorCall(worker.slow); // теперь сделаем её кеширующей

 console.log( worker.slow(2)    ); // работает
 console.log( worker.slow(2) ); // работает, не вызывая первоначальную функцию (кешируется)
 /*****-------------------------------------------------------------*****/
 // несколько аргументов "func.apply"

 let workerCall = {
        slow(min, max) {
            console.log(`called with ${min}, ${max}`);
            return min + max;
        }
     };

 function cachingDecoratorCall2 (func, hash) {
     let cache = new Map();
     return function () {
         let key = hash(arguments);
         if(cache.has(key)) {
             return cache.get(key);
         }
         let result = func.call(this, ...arguments);   // === func.apply(this, arguments)

         cache.set(key, result);
         return result;
     }
 }
 function hash(args) {
     return args[0] + ',' + args[1];
 }
 workerCall.slow = cachingDecoratorCall2(workerCall.slow, hash)

 console.log(workerCall.slow(3, 5))
 console.log('Again', workerCall.slow(3, 5))