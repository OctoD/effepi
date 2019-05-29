pipe
====

Put your functions in a pipeline.

## What pipe is

Pipe is a functional way to enqueue and use different functions. You can put your functions in a pipeline and resolve them both asynchronously or synchronously, creating new async functions or sync functions.

## Install

```bash
npm i pipe

# or 

yarn add pipe
```

## How to use it

```ts
import { pipe, functions } from 'pipe';

const {
  divideBy,
  multiplyBy,
  useCallValue,
} = functions;

export const calculateVat = (vatPercentage: number) =>
  pipe<number, number>(useCallValue())
    .pipe(divideBy(100))
    .pipe(multiplyBy(vatPercentage))
    .toSyncFunction();

vatCalculator(22)(100); // 22
vatCalculator(22)(1285); // 282.7
```

To create a pipeline, use the `pipe` function. This function can be used with any function, althought is recommended if you are building a function from a pipeline to use the `useCallValue` function.

```ts
const p = pipe(useCallValue()).toSyncFunction();

p(10) // returns 10
p('hello world') // returns 'hello world'
```

A pipeline can be memoized, it is useful when you have to call a pipeline a lot of times.

```ts
const test = pipe(useCallValue(), true)
  .pipe(add(10))
  .pipe(multiplyBy(2))
  .toSyncFunction();

test(1) // returns 22
test(1) // returns the cached previous result
test(2) // returns 24
test(2) // returns the cached previous result
test(2) // returns the cached previous result
```

#### pipeline context

Each function passed in a pipeline can use the previous value and can access to the current pipeline context. A passed context can be enriched with a `mutation` function, which is the only way to mutate the pipeline from the inside of a function.

```ts
const aFunctionUsingContext = (previousValue, context) => {
  // mutations are always executed after the current function
  context.mutate = () => {
    const pipeline = [
      (arg: number) => {
        const isEven = arg % 2 === 0;

        console.log(isEven);
        
        return isEven;
      },
    ];

    return { pipeline };
  };
  console.log(previousValue);
  return previousValue;
};

const isEven = pipe(useCallValue())
  .pipe(aFunctionUsingContext) // uses console.log for context callValue
  .toSyncFunction(); // returns true if the number is even

isEven(10) // logs 10, logs true, returns true
```

A context has also the `apply` method, which can be used to invoke a function with
the previous value as argument.

```ts
pipe(useCallValue())
  .pipe(
    (value, context) => context.apply(add(10)
  )
).resolveSync(0); // returns 10
```

## Functions

#### Array functions

###### applyEach

Applies the result of a pipeline to each element in an array of another pipeline.

```ts
applyEach<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => Promise<R>[]
```

###### applyEachSync

Is the same of applyEach, except it does not work with async functions

```ts
applyEachSync<T, R>(pipe: IPipe<T, R>): (arg: T[], context: IContext<T[], R>) => R[]
```

#### Math functions

###### add

Sums a value to the previous one. 

```ts
pipe(useCallValue()).pipe(add(1)).resolveSync(10) // 11
```

###### changeSign

Changes previous value sign, from positive to negative and vice-versa.

```ts
pipe(put(-123)).pipe(changeSign()) // 123
```

###### divideBy

Divides the previous value by the passed one.

```ts
pipe(useCallValue()).pipe(divideBy(2)).resolve(44) // 22
```

###### multiplyBy

Multiplies the previous value by the given one

```ts
pipe(useCallValue()).pipe(multiplyBy(2)).resolve(44) // 88
```

###### negative

Converts previous' value from positive sign to negative unless is already negative.

```ts
pipe(useCallValue()).pipe(negative()).resolve(44) // -44
pipe(useCallValue()).pipe(negative()).resolve(-12) // -12
```

###### positive

Converts previous' value from negative sign to positive unless is already positive.

```ts
pipe(useCallValue()).pipe(positive()).resolve(44) // 44
pipe(useCallValue()).pipe(positive()).resolve(-12) // 12
```

###### pow

Raises to power the previous value by a given exponent

```ts
pipe(useCallValue()).pipe(pow(4)).resolve(2) // 16
pipe(useCallValue()).pipe(pow(2)).resolve(-2) // 4
```

###### root

Extracts the root of the previous value by a given exponent

```ts
pipe(useCallValue()).pipe(root(2)).resolve(4) // 2
pipe(useCallValue()).pipe(root(2)).resolve(9) // 3
```

###### subtract

Subtracts the previous value by the given one

```ts
pipe(useCallValue()).pipe(subtract(2)).resolve(9) // 7
```

###### takeBetween

Takes all numbers in a number array between two values (inclusive)

```ts
pipe(useCallValue()).pipe(takeBetween(5, 7)).resolve([4, 5, 6, 7, 8]) // [5, 6, 7]
```

###### takeGreater

Returns the greater number in a number array

```ts
pipe(useCallValue()).pipe(takeGreater()).resolve([4, 5, 44, 6, 7, 8]) // 44
```

###### takeGreaterThan

Takes all numbers in a number array greater than a given value. 

```ts
pipe(useCallValue()).pipe(takeGreaterThan(8)).resolve([4, 5, 44, 6, 7, 8]) // [44]
```

This function accepts a second parameter (boolean) to include also the same value

```ts
pipe(useCallValue()).pipe(takeGreaterThan(8, true)).resolve([4, 5, 44, 6, 7, 8]) // [8, 44]
```

###### takeLower

Returns the lower number in a number array

```ts
pipe(takeLower()).pipe(takeGreater()).resolve([4, 5, 44, 6, 7, 8]) // 4
```

###### takeLowerThan

Takes all numbers in a number array lower than a given value. 

```ts
pipe(useCallValue()).pipe(takeLowerThan(5)).resolve([4, 5, 44, 6, 7, 8]) // [4]
```

This function accepts a second parameter (boolean) to include also the same value

```ts
pipe(useCallValue()).pipe(takeLowerThan(8, true)).resolve([4, 5, 44, 6, 7, 8]) // [4, 5, 6, 7, 8]
```

###### takeOuter

Takes all numbers in a number array lower than the first passed value or greater than the second passed value. Matching elements are discarded.

```ts
pipe(useCallValue()).pipe(takeOuter(5, 10)).resolveSync([3,4,5,10,11]) // [3, 4, 11]
```


#### Logical operators functions

###### createSwitch

Is the same of the `switch` construct.

```ts
// silly example: checking if a string is inside an array of strings
const cities = pipe(useCallValue())
  .pipe(
    createSwitch(
      createSwitchDefault('City not found'),
      createSwitchOption('Munich', 'Beerfest!'),
      createSwitchOption('Rome', 'We love carbonara'),
      createSwitchOption('London', 'God save the queen'),
    )
  )
  .toSyncFunction();

cities('Munich') // 'Beerfest!'
cities('Rome') // 'We love carbonara'
cities('London') // 'God save the queen'
cities('Casalpusterlengo') // 'City not found'
```

To create the default, you can use the `createSwitchDefault` method, whilst using `createSwitchOption` you can add a switch case.

###### fold

This function is the same of the `if/else` statement. 

It takes two arguments, the `left` and the `right` part. The left part is intended as the `false` comparison result, while the `right` is the `true`.

```ts
const smsLengthCheck = pipe(useCallValue())
  .pipe(isGreaterThan(144))
  .pipe(fold('', 'Maximum character'))
  .toSyncFunction();

smsLengthCheck('lorem') // ''
smsLengthCheck('lorem'.repeat(2000)) // 'Maximum character'
```

#### Object functions

###### exclude

Returns previous value except for the given keys. This applies only to objects.

```ts
pipe(useCallValue())
  .pipe(exclude('foo'))
  .resolveSync({ foo: 123, bar: 'baz' }); // { bar: 'baz' }
```

###### hasProperty

Returns if an object has a owned property

```ts
pipe(useCallValue())
  .pipe(hasProperty('foo'))
  .resolveSync({ foo: new Date() }) // true
```

###### merge

Merges the previous object with the given one

```ts
pipe(useCallValue())
  .pipe(merge({ foo: 'bar' }))
  .resolveSync({ bar: 'baz' }) // { foo: 'bar', bar: 'baz' }
```

###### pick

Returns a new object (previous value) with the given keys. This applies only to objects.

```ts
pipe(useCallValue())
  .pipe(pick('foo'))
  .resolveSync({ foo: 123, bar: 'baz' }); // { foo: 123 }
```

#### Misc functions

###### apply

Applies a pipeline using the async `resolve` method.

```ts
const injectedPipeline = pipe(functions.useCallValue())
        .pipe(functions.add(10));

const testPipeline = pipe(functions.useCallValue())
  .pipe(functions.apply(injectedPipeline))
  .pipe(functions.multiplyBy(2)); 

testPipeline.resolve(2) // Promise(24)
```

###### applySync

Applies a pipeline using the sync `resolveSync` method.

```ts
const injectedPipeline = pipe(functions.useCallValue())
        .pipe(functions.add(10));

const testPipeline = pipe(functions.useCallValue())
  .pipe(functions.applySync(injectedPipeline))
  .pipe(functions.multiplyBy(2)); 

testPipeline.resolve(2) // 24
```

###### put

Use this function to put a value at the beginning of the pipeline

```ts
pipe(put(10)).resolveSync(0) // 10
```

###### safeCall

Use this function to perform a safe function call

```ts
pipe(useCallValue())
  .pipe(safeCall(() => throw new Error('hello world')))
  .resolveSync(100) // will not throw, instead it will return 100
```

###### useCallValue

Use this function at the beginning of your pipeline to use the passed value to `resolve`/`resolveSync` and to function invokation

```ts
const p = pipe(useCallValue()).add(100);

p.resolve(200) // Promise(300)
p.resolveSync(10) // 110
p.toFunction()(123) // Promise(223)
p.toSyncFunction()(1000) // 1100
```

###### useValue

Use this function to return the previous pipeline value

```ts
pipe(useCallValue())
  .pipe(add(10))
  .pipe(useValue())
  .resolveSync(10) // 20
```

#### String functions

###### chars

Returns previous value as an array of chars. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(chars())
  .resolveSync('hello') // returns ['h', 'e', 'l', 'l', 'o']
```

###### length

Returns previous value length. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(length())
  .resolveSync('hello') // 5
```

###### lowercase

Returns previous value in lower case. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(lowercase())
  .resolveSync('HELLO') // 'hello'
```

###### replaceAll

Replaces all occurencies from the previous value. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(replaceAll('l', '1'))
  .resolveSync('hello') // he110
```

###### uppercase

Returns previous value in upper case. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(uppercase())
  .resolveSync('hello') // 'HELLO'
```

#### Type functions

###### toArray

Converts previous value to an array.

```ts
pipe(useCallValue()).pipe(toArray()).resolveSync(10) // [10]
```

###### toDate

Converts previous value to a Date instance.

```ts
pipe(useCallValue())
  .pipe(toDate())
  .resolveSync(`2019-01-01T00:00:000Z`) // Date(2019, 0, 1, 0, 0, 0)
```

###### toNumber

Converts previous value to a number.

```ts
pipe(useCallValue())
  .pipe(toNumber())
  .resolveSync('12000') // 12000
```

###### toString

Converts previous value to a string.

```ts
pipe(useCallValue())
  .pipe(toString())
  .resolveSync([1,2,3]) // "1,2,3"
```

## Examples

## Contributing

Every contribution is welcome! Before creating pull-request or opening issues, ensure you have read the [contribution guidelines](./CONTRIBUTING.md)

## Licence

This library is released under the [MIT licence](./LICENCE)
