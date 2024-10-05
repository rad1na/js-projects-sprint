console.log("Chapter 2:\n\nLooping a triangle\n")
// Write a loop that makes seven calls to console.log to output the following
// triangle:
// #
// ##
// ###
// ####
// #####
// ######
// #######

for(let i=1; i<=7; i++){
    console.log("#".repeat(i))
}

console.log("\n\nFizzBuzz\n")

// Write a program that uses console.log to print all the numbers from 1 to 100,
// with two exceptions. For numbers divisible by 3, print "Fizz" instead of the
// number, and for numbers divisible by 5 (and not 3), print "Buzz" instead.
// When you have that working, modify your program to print "FizzBuzz" for
// numbers that are divisible by both 3 and 5 (and still print "Fizz" or "Buzz"
// for numbers divisible by only one of those).

for(let i=1; i<=100; i++){
    if(i % 3 === 0 && i % 5 === 0) console.log("FizzBuzz");
    else if(i % 3 === 0) console.log("Fizz");
    else if(i % 5 === 0) console.log("Buzz");
    else console.log(i)
}

// Write a program that creates a string that represents an 8×8 grid, using newline
// characters to separate lines. At each position of the grid there is either a space
// or a "#" character. The characters should form a chessboard.
// Passing this string to console.log should show something like this:
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #


console.log("\n\nCheesboard\n")


for(let i=1; i<=8; i++){
    let str = "";
    for(let j=1; j<=8; j++){
        if((i+j) % 2 === 0) str += "#";
        else str += " ";
    }
    console.log(str + "\n")
}

console.log("Chapter 3:\n")

console.log("\n\nMinimum\n");

// The previous chapter introduced the standard function Math.min that returns
// its smallest argument. We can write a function like that ourselves now. Define
// the function min that takes two arguments and returns their minimum

const min = (x,y) => x <= y ? x : y;
console.log(min(2,3))

console.log("\n\nRecursive isEven\n");

// We’ve seen that we can use % (the remainder operator) to test whether a number
// is even or odd by using % 2 to see whether it’s divisible by two. Here’s another
// way to define whether a positive whole number is even or odd:
// • Zero is even.
// • One is odd.
// • For any other number N, its evenness is the same as N - 2.
// Define a recursive function isEven corresponding to this description. The
// function should accept a single parameter (a positive, whole number) and return
// a Boolean.
// Test it on 50 and 75. See how it behaves on -1. Why? Can you think of a
// way to fix this?

const isEven = (x) => x < 0 ? isEven(Math.abs(x)) : x === 0 ? true : x === 1 ? false : isEven(x-2);
console.log(isEven(-10))

console.log("\n\nBean Counting\n");

// You can get the Nth character, or letter, from a string by writing [N] after the
// string (for example, string[2]). The resulting value will be a string containing
// only one character (for example, "b"). The first character has position 0, which
// causes the last one to be found at position string.length - 1. In other words,
// a two-character string has length 2, and its characters have positions 0 and 1.
// Write a function called countBs that takes a string as its only argument and
// returns a number that indicates how many uppercase B characters there are in
// the string.
// Next, write a function called countChar that behaves like countBs, except
// it takes a second argument that indicates the character that is to be counted
// (rather than counting only uppercase B characters). Rewrite countBs to make
// use of this new function.

const countBs = (str) => {
    let count = 0;
    for(let i=0; i<str.length; i++){
        if(str[i] === 'B') count++;
    }
    return count;
}
console.log(countBs("BBBasdasdbbbbBBB"));
const countChar = (str, char) => {
    let count = 0;
    for(let i=0; i<str.length; i++){
        if(str[i] === char) count++;
    }
    return count;
}
console.log(countChar("BBBasdasdbbbbBBB", "a"));

console.log("Chapter 4:\n")

console.log("\n\nThe Sum of A Range\n");

// Write a range function that takes two arguments, start and end, and returns
// an array containing all the numbers from start up to and including end.
// Next, write a sum function that takes an array of numbers and returns the
// sum of these numbers. Run the example program and see whether it does
// indeed return 55.
// As a bonus assignment, modify your range function to take an optional third
// argument that indicates the “step” value used when building the array. If no
// step is given, the elements should go up by increments of one, corresponding
// to the old behavior. The function call range(1, 10, 2) should return [1,
// 3, 5, 7, 9]. Make sure this also works with negative step values so that
// range(5, 2, -1) produces [5, 4, 3, 2].

const range = (start,end,step) => {
    let arr = [];
    for(let i=start; end > start ? i <= end : i>=end; step ? i+=step : i++) arr.push(i);
    return arr;
}
const sum = (array) => array.reduce((previous,current) => previous += current, 0);
console.log(sum(range(2,5,1)))

console.log("\n\nReversing an Array\n");

// Arrays have a reverse method that changes the array by inverting the order in
// which its elements appear. For this exercise, write two functions, reverseArray
// and reverseArrayInPlace. The first, reverseArray, should take an array as its
// argument and produce a new array that has the same elements in the inverse
// order. The second, reverseArrayInPlace, should do what the reverse method
// does: modify the array given as its argument by reversing its elements. Neither
// may use the standard reverse method.
// Thinking back to the notes about side effects and pure functions in the
// previous chapter, which variant do you expect to be useful in more situations?
// Which one runs faster?

let mainArray = [1,2,3,4,5,25];
const reverseArray = (array) => {
    // should not mutate original
    let newArr = [];
    for(let i = array.length - 1; i >= 0; i--) newArr.push(array[i])
    return newArr;
}
const reverseArrayInPlace = (array) => {
    // should mutate original
    for(let i = array.length - 1; i >= 0 && i >= array.length - 1 - i; i--){
        let temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - i - 1] = temp;
    }
}

let reversedArray = reverseArray(mainArray);
reverseArrayInPlace(mainArray);
console.log(reversedArray, mainArray, "Is it the same reference -> ",reversedArray === mainArray)

console.log("\n\nList\n");

// let list = {
//     value: 1,
//     rest: {
//          value: 2,
//          rest: {
//              value: 3,
//              rest: null
//          }
//      }
// };
// Write a function arrayToList that builds up a list structure like the one
// shown when given [1, 2, 3] as argument. Also write a listToArray function
// that produces an array from a list. Add the helper functions prepend, which
// takes an element and a list and creates a new list that adds the element to the
// front of the input list, and nth, which takes a list and a number and returns
// the element at the given position in the list (with zero referring to the first
// element) or undefined when there is no such element.
// If you haven’t already, also write a recursive version of nth.

const arrayToList = (array) => {
    let list = {};
    list.value = array.shift();
    if(array.length){
        list.rest = arrayToList(array)
    } else list.rest = null;
    return list;
}

const listToArray = (list, array = []) => {
    array.push(list.value);
    if(list.rest){
        listToArray(list.rest, array)
    }
    return array;
}

const prependInList = (element, list) => {
    return ({value: element, rest: list})
}
const nth = (element, list) => {
    if(element === 0) return list;
    else if(list.rest) return nth(element - 1, list.rest);
    else return undefined;
}

console.log(JSON.stringify(arrayToList([1,2,3])))
console.log(listToArray(arrayToList([1,2,3])))
console.log(prependInList(0, arrayToList([1,2])))
console.log(nth(3,arrayToList([1,2,3,4])))

console.log("\n\nDeep Equal\n");

// The == operator compares objects by identity, but sometimes you’d prefer to
// compare the values of their actual properties.
// Write a function deepEqual that takes two values and returns true only
// if they are the same value or are objects with the same properties, where
// the values of the properties are equal when compared with a recursive call to
// deepEqual.
// To find out whether values should be compared directly (using the === operator for that) or have their properties compared, you can use the typeof
// operator. If it produces "object" for both values, you should do a deep comparison. But you have to take one silly exception into account: because of a
// historical accident, typeof null also produces "object".
// The Object.keys function will be useful when you need to go over the properties of objects to compare them.

const deepEqual = (val1, val2) => {
    let flag = val1 === val2;
    if(typeof val1 === 'object' && typeof val2 === 'object'){
        let keys = Object.keys(val1)
        for(let i=0; i<keys.length; i++){
            if(!val2.hasOwnProperty(keys[i])) return false;
            else flag = deepEqual(val1[keys[i]], val2[keys[i]])
        }
    }else if(typeof val1 !== typeof val2){
        flag = false
    }
    return flag;
}

console.log(deepEqual({id:2, nested: {id: 1}},{id: 2, nested: {id: 1}}))
console.log(deepEqual({id:2, nested: {id: 1}},{id: 2, nested: {id: 2}}))
console.log(deepEqual({id:2, nested: {id: 1, nest: {id:3}}},{id: 2, nested: {id: 1, nest: {id:3}}}))