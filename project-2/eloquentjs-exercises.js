const SCRIPTS = require('./scriptsArray.js')

require('./scriptsArray.js')

console.log("Chapter 5:\n\n")

console.log("Flattening\n")

// Use the reduce method in combination with the concat method to “flatten”
// an array of arrays into a single array that has all the elements of the original
// arrays

const flattenArray = (arr) => {
    return arr.reduce((prev,curr) => {
        if(Array.isArray(curr)) prev = prev.concat(flattenArray(curr))
        else prev.push(curr)
        return prev
    },[])
}
console.log(flattenArray([1, [2,3,[4,[5,6]]]]))


console.log("\nYour own loop\n")

// Write a higher-order function loop that provides something like a for loop
// statement. It should take a value, a test function, an update function, and
// a body function. Each iteration, it should first run the test function on the
// current loop value and stop if that returns false. It should then call the body
// function, giving it the current value, and finally call the update function to
// create a new value and start over from the beginning.
// When defining the function, you can use a regular loop to do the actual
// looping.


const loop = (value, test, body, update) => {
    for(let i=0; i<value.length; i++){
        if(test(value[i])){
            body(value[i])
            update(value, i)
        }
    }
    return value
}
console.log(loop([1,2,"a","b",4], (val) => parseInt(val) === 0 ? true : !!parseInt(val), (val) => console.log(val), (val, ind) => (val[ind] = "VALID")))


console.log("\nEverything\n")

// Arrays also have an every method analogous to the some method. This method
// returns true when the given function returns true for every element in the array.
// In a way, some is a version of the || operator that acts on arrays, and every is
// like the && operator.
// Implement every as a function that takes an array and a predicate function
// as parameters. Write two versions, one using a loop and one using the some
// method.

const every = (array, func) => {
    for(let i=0; i<array.length; i++){
        if(!func(array[i])) return false;
    }
    return true;
}

const everyWithSome = (array, func) => {
    return !array.some((item) => !func(item))
}


console.log(every([1,2,3], (num) => num > 0))
console.log(every([1,2,0], (num) => num > 0))
console.log(everyWithSome([1,2,0], (num) => num > 0))
console.log(everyWithSome([1,2,3], (num) => num > 0))

console.log("\nDominant writing direction\n")

// Write a function that computes the dominant writing direction in a string of
// text. Remember that each script object has a direction property that can be
// "ltr" (left to right), "rtl" (right to left), or "ttb" (top to bottom).
// The dominant direction is the direction of a majority of the characters that
// have a script associated with them. The characterScript and countBy functions defined earlier in the chapter are probably useful here.

const dominantWritingDirection = (str) => {
    let directionCount = {ltr: 0, rtl: 0, ttb: 0};
    for(let i=0; i<str.length; i++){
        let charCode = str.codePointAt(i);
        let script = SCRIPTS.find(item => item.ranges.some(range => charCode >= range[0] && charCode <= range[1]));
        if(script)
        directionCount[script.direction]++;
    }
    console.log(directionCount)
    const {ltr,rtl,ttb} = directionCount;
    return ltr >= rtl && ltr > ttb ? "ltr " + ltr : rtl >= ltr && rtl > ttb ? "rtl " + rtl : ttb
}

console.log(dominantWritingDirection(`英国的狗说"woof俄罗斯的狗说"тяв" فيهن انفسك`))



console.log("Chapter 6:\n\n")

console.log("\nVector Type\n");

class Vec {
    x;
    y;
    #length;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    plus(vec){
        return new Vec(this.x + vec.x, this.y + vec.y)
    }

    minus(vec){
        return new Vec(this.x - vec.x, this.y - vec.y)
    }

    get length(){
        return [this.x, this.y];
    }
}

const vec1 = new Vec(1,2);
const vec2 = vec1.plus(new Vec(1,2));
const vec3 = vec1.minus(new Vec(3,5));
console.log(vec1, vec1.length, vec2.length, vec3.length)

console.log("\nGroups\n");

class Group{
    #group;
    constructor(){
        this.#group = [];
    }
    add(item){
        if(!this.#group.indexOf(item) >= 0) this.#group = [...this.#group, item]
    }
    delete(item){
        this.#group = this.#group.filter(i => i !== item);
    }
    has(item){
        return this.#group.indexOf(item) >= 0;
    }
    get group(){
        return this.#group;
    }
    static from(iterableObject){
        let newGroup = new this();
        let iterator = iterableObject[Symbol.iterator];
        if(iterator){
            let values;
            iterator = iterableObject[Symbol.iterator]();
            do{
                values = iterator.next();
                if(values.value) newGroup.add(values.value)
            }while(!values.done);
        }
        return newGroup;
    }
}

class GroupIterator{
    constructor(instance){
        this.group = instance.group;
    }
    next(){
        let done = this.group.length === 0;
        let value = this.group.shift();
        return {value, done}
    }
}

let group1 = Group.from([1,2,3,4,5]);
Group.prototype[Symbol.iterator] = function(){
    return new GroupIterator(this);
}
Group.prototype.toString = function(){
    return this.group.toString();
}
group1.delete(3);

console.log("group has 1?",group1.has(1), group1.toString(), group1[Symbol.iterator]())

for(let member of group1){
    console.log(member, "for ... of")
}