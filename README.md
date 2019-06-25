<div align="center">
  <img src="./logo.svg" />
</div>

effepi [![Build Status](https://travis-ci.org/OctoD/effepi.svg?branch=master)](https://travis-ci.org/OctoD/effepi)
======

Fun functional programming with pipelinable functions.

## What effepi is

Effepi is a functional way to enqueue and use different functions. You can put your functions in a pipeline and resolve them both asynchronously or synchronously, creating new async functions or sync functions.

## Install

#### Npm 

```bash
npm i effepi
```

#### Yarn 

```bash
yarn add effepi
```

## Index

- [effepi ![Build Status](https://travis-ci.org/OctoD/effepi)](#effepi-Build-Statushttpstravis-ciorgOctoDeffepi)
  - [What effepi is](#What-effepi-is)
  - [Install](#Install)
      - [Npm](#Npm)
      - [Yarn](#Yarn)
  - [Index](#Index)
  - [Install](#Install-1)
  - [How to use it](#How-to-use-it)
      - [pipeline context](#pipeline-context)
  - [Functions](#Functions)
      - [Array functions](#Array-functions)
          - [applyEach](#applyEach)
          - [applyEachSync](#applyEachSync)
          - [concat](#concat)
          - [filter](#filter)
          - [filterWith](#filterWith)
          - [find](#find)
          - [findExact](#findExact)
          - [join](#join)
          - [length](#length)
          - [nth](#nth)
          - [reverse](#reverse)
      - [Boolean functions](#Boolean-functions)
          - [F](#F)
          - [T](#T)
          - [inverse](#inverse)
      - [Math functions](#Math-functions)
          - [add](#add)
          - [changeSign](#changeSign)
          - [decrement](#decrement)
          - [divideBy](#divideBy)
          - [increment](#increment)
          - [multiplyBy](#multiplyBy)
          - [negative](#negative)
          - [positive](#positive)
          - [pow](#pow)
          - [root](#root)
          - [subtract](#subtract)
          - [takeBetween](#takeBetween)
          - [takeGreater](#takeGreater)
          - [takeGreaterThan](#takeGreaterThan)
          - [takeLower](#takeLower)
          - [takeLowerThan](#takeLowerThan)
          - [takeOuter](#takeOuter)
      - [Logical operators functions](#Logical-operators-functions)
          - [createSwitch](#createSwitch)
          - [fold](#fold)
          - [ifElse](#ifElse)
      - [Object functions](#Object-functions)
          - [exclude](#exclude)
          - [hasProperty](#hasProperty)
          - [keys](#keys)
          - [maybe](#maybe)
          - [merge](#merge)
          - [pick](#pick)
      - [Misc functions](#Misc-functions)
          - [apply](#apply)
          - [applySync](#applySync)
          - [breakpoint](#breakpoint)
          - [put](#put)
          - [safeCall](#safeCall)
          - [useCallValue](#useCallValue)
          - [useValue](#useValue)
      - [String functions](#String-functions)
          - [camelCase](#camelCase)
          - [chars](#chars)
          - [concat](#concat-1)
          - [includes](#includes)
          - [length](#length-1)
          - [lowercase](#lowercase)
          - [pascalCase](#pascalCase)
          - [repeat](#repeat)
          - [replaceAll](#replaceAll)
          - [toBinaryArray](#toBinaryArray)
          - [uppercase](#uppercase)
      - [Type functions](#Type-functions)
          - [exactTypeOf](#exactTypeOf)
          - [ofType](#ofType)
          - [toArray](#toArray)
          - [toBoolean](#toBoolean)
          - [toDate](#toDate)
          - [toNumber](#toNumber)
          - [toSet](#toSet)
          - [toString](#toString)
  - [Examples](#Examples)
  - [Contributing](#Contributing)
  - [Licence](#Licence)

## Install

```bash
npm i pipe

# or 

yarn add pipe
```

## How to use it

```ts
import { pipe, math, misc } from 'effepi';

export const calculateVat = (vatPercentage: number) =>
  pipe<number, number>(misc.useCallValue())
    .pipe(math.divideBy(100))
    .pipe(math.multiplyBy(vatPercentage))
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

A context has also the `call` method, which can be used to invoke a function with
the previous value as argument.

```ts
pipe(useCallValue())
  .pipe(
    (value, context) => context.call(add(10))
  )
).resolveSync(0); // returns 10
```

Within a context you can also call the `break` method, which will add a `breakpoint` at the current mutation index. 

Read this for an explanation of using [`breakpoints`](#breakpoint).

## Functions

#### Array functions

Array functions are under the `array` module.

```ts
import { array } from 'effepi';
```

###### applyEach

Applies the result of a pipeline to each element in an array of another pipeline.

Note: invoking a pipeline using this function with a sync method will throw an error.

```ts
const doMath = pipe(useCallValue())
  .pipe(sum(2))
  .pipe(multiplyBy(3));

pipe(useCallValue())
  .pipe(applyEach(doMath))
  .resolve([10, 20, 30]) // Promise([36, 66, 96])
```

###### applyEachSync

Is the same of applyEach, except it does not work with async functions

Note: invoking a pipeline using this function with an async method will throw an error.

```ts
const doMath = pipe(useCallValue())
  .pipe(sum(2))
  .pipe(multiplyBy(3));

pipe(useCallValue())
  .pipe(applyEach(doMath))
  .resolveSync([10, 20, 30]) // [36, 66, 96]
```

###### concat

Concatenates previous value with another array.

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(concat([4,5,6]))
  .resolveSync([1,2,3]) // [1,2,3,4,5,6]
```

###### filter

Filters the previous value with a given callback. The callback must return a boolean value. 

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(filter(a => a > 2))
  .resolveSync([1,2,3]) // [3]
```

###### filterWith

Filters the previous value with a given value.

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(filterWith(2))
  .resolveSync([1,2,3,2,3,2]) // [2,2,2]
```

###### find

Finds a value as specified by a find callback. The callback must return `true`.

If the value is not found, the pipe will return an `undefined`

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(find((arg: number) => arg === 1))
  .resolveSync([1,2,3,2,3,2]) // 1
```

###### findExact

Finds an exacts value.

If the value is not found, the pipe will return an `undefined`

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(find(1))
  .resolveSync([1,2,3,2,3,2]) // 1
```

###### join

Joins the previous value with a given char. 

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(join('*'))
  .resolveSync([1,2,3]) // '1*2*3'
```

###### length

Returns the length of the previous value.

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(length())
  .resolveSync([1,2,3]) // 3
```

###### nth

Returns the nth element in the previous value.

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(nth(3))
  .resolveSync([0, 2, 5, 12, 24]) // 12
```

###### reverse

Reverses the previous value. 

If the previous value is not an array an error will be thrown

```ts
pipe(useCallValue())
  .pipe(reverse())
  .resolveSync([1,2,3]) // [3,2,1]
```

#### Boolean functions

Boolean functions are under the `boolean` module.

```ts
import { boolean } from 'effepi';
```

###### F

Puts a `false` value.

```ts
pipe(F()).resolveSync(undefined) // false
```

###### T

Puts a `true` value.

```ts
pipe(T()).resolveSync(undefined) // true
```

###### inverse

Inverts previous value. 

Previous value must be boolean.

```ts
pipe(useCallValue()).pipe(inverse()).resolveSync(true) // false
pipe(useCallValue()).pipe(inverse()).resolveSync(false) // true
```

#### Math functions

Math functions are under the `math` module.

```ts
import { math } from 'effepi';
```

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

###### decrement

Decrements the previous value by one.

```ts
pipe(useCallValue()).pipe(decrement()).resolve(44) // 41
```

###### divideBy

Divides the previous value by the passed one.

```ts
pipe(useCallValue()).pipe(divideBy(2)).resolve(44) // 22
```

###### increment

Increments the previous value by one.

```ts
pipe(useCallValue()).pipe(increment()).resolve(44) // 45
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

Logical operators functions are under the `logical` module.

```ts
import { logical } from 'effepi';
```

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

###### ifElse

This function works like the `if/else` statement. 

It requires three arguments:

* a Condition (a `function` which returns a `boolean`)
* a Left, which can be a value or another `pipe`. If is a pipe, it will be resolved using the context's async/sync flow
* a Right, which can be a value or another `pipe`. If is a pipe, it will be resolved using the context's async/sync flow

```ts
const simple = pipe(useCallValue())
  .pipe(
    logical.ifElse(
      (arg: number) => arg > 5,
      'lower than 5',
      'greater than 5'
    )
  )
  .toSyncFunction();

const complex = pipe(useCallValue())
  .pipe(
    logical.ifElse(
      (arg: number) => arg > 5, 
      pipe(useCallValue()).pipe(math.pow(2)), 
      pipe(useCallValue()).pipe(math.divideBy(2)),
    )
  ).toSyncFunction();

simple(4) // lower than 5
simple(10) // greater than 5
complex(4) // 14
complex(10) // 5
```

#### Object functions

Object functions are under the `object` module.

```ts
import { object } from 'effepi';
```

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

###### keys

Returns previous's value keys. Works only for objects

```ts
pipe(useCallValue())
  .pipe(keys())
  .resolveSync({ bar: 123, foo: new Date() }) // ['bar', 'foo']
```

###### maybe

Returns a property key value by a given path. This applies only to objects.

```ts
pipe(useCallValue())
  .pipe(maybe('foo.bar'))
  .resolveSync({ foo: { bar: 100 } }) // 100
```

You can provide a fallback value or a fallback pipeline if the path does not match the object schema.

If you start you pipeline with the `useCallValue` function, the monad will be invoked with an `undefined` value.

```ts
pipe(useCallValue())
  .pipe(maybe('foo.bar.baz', 123))
  .resolveSync({ foo: { bar: 100 } }) // 123

// or
const fallback = pipe(useCallValue());

pipe(useCallValue())
  .pipe(maybe('foo.bar.baz', fallback))
  .resolveSync({ foo: { bar: 100 } }) // undefined

// or
const fallback = pipe(put(10));

pipe(useCallValue())
  .pipe(maybe('foo.bar.baz', fallback))
  .resolveSync({ foo: { bar: 100 } }) // 10
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

Misc functions are under the `misc` module.

```ts
import { misc } from 'effepi';
```

###### apply

Applies a pipeline using the async `resolve` method. 

Note: invoking a pipeline using this function with a sync method will throw an error.

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

Note: invoking a pipeline using this function with an async method will throw an error.

```ts
const injectedPipeline = pipe(functions.useCallValue())
        .pipe(functions.add(10));

const testPipeline = pipe(functions.useCallValue())
  .pipe(functions.applySync(injectedPipeline))
  .pipe(functions.multiplyBy(2)); 

testPipeline.resolve(2) // 24
```

###### breakpoint

Breaks execution (resolve or call) at a certain point.

It should be used with the `iter` method.

It allows you to go forward and backward the pipeline, 
making it ideal for writing tests and for iterating values.

```ts
const p = pipe(useCallValue())
    .pipe(add(10))
    .pipe(breakpoint())
    .pipe(multiplyBy(2))
    .pipe(breakpoint())
    .pipe(multiplyBy(2))
    .iter(10);

p.hasNext(); // true
const step1 = p.next(); // 20
step1.hasNext(); // true
const step2 = p.next(); // 40
step2.hasNext(); // true
const step3 = p.next(); // 80
step3.hasNext(); // false
```

**warning**: iterable pipelines are evaluated in sync, PromiseLike values
have to be handled manually

```ts
const p = pipe(useCallValue())
    .pipe(arg => Promise.resolve(arg))
    .iter(10)
;

p.hasNext(); // true
p.next(); // Promise(10)
p.value(); // Promise(10)

await p.value<Promise<number>>(); // 10
```

###### put

Use this function to put a value at the beginning of the pipeline

```ts
pipe(put(10)).resolveSync(0) // 10
```

###### safeCall

Use this function to perform a safe function call (will not throw) with the previous value as argument

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

String functions are under the `string` module.

```ts
import { string } from 'effepi';
```

###### camelCase

Returns previous value in camel-case. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(camelCase())
  .resolveSync('hello world') // 'helloWorld'
```

###### chars

Returns previous value as an array of chars. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(chars())
  .resolveSync('hello') // returns ['h', 'e', 'l', 'l', 'o']
```

###### concat

Concatenate previous value with another string. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(concat('world'))
  .resolveSync('hello') // 'helloworld'
```

###### includes

Returns if the previous value contains a portion of text. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(includes('llo'))
  .resolveSync('hello') // true
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

###### pascalCase

Returns previous value in pascal-case. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(pascalCase())
  .resolveSync('hello world') // 'HelloWorld'
```

###### repeat

Repeats previous value a number of times. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(repeat())
  .resolveSync('hello') // hellohello

pipe(useCallValue())
  .pipe(repeat(2))
  .resolveSync('hello') // hellohellohello
```

###### replaceAll

Replaces all occurencies from the previous value. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(replaceAll('l', '1'))
  .resolveSync('hello') // he110
```

###### toBinaryArray

Returns previous value in a binary representation. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(toBinary())
  .resolveSync('hello world') // [ '1101000', '1100101', '1101100', '1101100', '1101111', '100000', '1110111', '1101111', '1110010', '1101100', '1100100' ] 
```

###### uppercase

Returns previous value in upper case. Previous value must be a string.

```ts
pipe(useCallValue())
  .pipe(uppercase())
  .resolveSync('hello') // 'HELLO'
```

#### Type functions

Type functions are under the `type` module.

```ts
import { type } from 'effepi';
```

###### exactTypeOf

Throws if the previous value is not of the same type expected.

TypeName is the second portion of a `Object.prototype.toString` call in **lowerCase**:

> [object **TypeName**] --> `typename` 

```ts
pipe(useCallValue())
  .pipe(exactTypeOf('date'))
  .resolveSync(123) // throws!

pipe(useCallValue())
  .pipe(exactTypeOf('date'))
  .resolveSync(new Date()) // 2019-03-26T02:17:000Z
```

###### ofType

Throws if the previous value is not of the same type expected.

Internally uses the `typeof` operator.

```ts
pipe(useCallValue())
  .pipe(exactTypeOf('number'))
  .resolveSync(123) // 123

pipe(useCallValue())
  .pipe(exactTypeOf('number'))
  .resolveSync(`hello world!`) // throws!
```

###### toArray

Converts previous value to an array.

```ts
pipe(useCallValue()).pipe(toArray()).resolveSync(10) // [10]
```

###### toBoolean

Converts previous value to a boolean value.

```ts
pipe(useCallValue()).pipe(toBoolean()).resolveSync(10) // true
pipe(useCallValue()).pipe(toBoolean()).resolveSync(0) // false
pipe(useCallValue()).pipe(toBoolean()).resolveSync(null) // false
pipe(useCallValue()).pipe(toBoolean()).resolveSync(undefined) // false
pipe(useCallValue()).pipe(toBoolean()).resolveSync('') // false
pipe(useCallValue()).pipe(toBoolean()).resolveSync('123') // true
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

###### toSet

Converts previous value to a set. Previous value must be an array.

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

This library is released under the [MIT licence](./LICENSE)
