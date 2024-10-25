import roadsGraph from "./roads.js";
console.log("Chapter 7:\n\n")

console.log("Robot Project\n")

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"

];
// destinations we can reach from a given place
const roadGraph = roadsGraph;

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }
    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return { place: destination, address: p.address };
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

function runRobot(state, robot, memory = []) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            // console.log(`Done in ${turn} turns`);
            return turn;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        // console.log(`Moved to ${action.direction}`);
    }
}

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}
function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }];
    for (let i = 0; i < work.length; i++) {
        let { at, route } = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({ at: place, route: route.concat(place) });
            }
        }
    }

}

function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
            // console.log(route, "WORK")
        } else {
            route = findRoute(roadGraph, place, parcel.address);
            // console.log(route, "WORK")
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

function goalOrientedRobotAlternate({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels.find(parcel => parcel.place === place) || parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
            console.log(route, "Place != Place")
        } else {
            route = findRoute(roadGraph, place, parcel.address);
            console.log(route, "Place == Place")
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

VillageState.random = function (parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({ place, address });
    }
    // console.log(parcels, "PARCELS")
    return new VillageState("Post Office", parcels);
};

runRobot(VillageState.random(), goalOrientedRobotAlternate);

// let first = new VillageState(
//     "Post Office",
//     [{ place: "Post Office", address: "Alice's House" }]
// );
// let next = first.move("Alice's House");

// console.log(roadGraph, "\n")
// console.log(first.place, first.parcels)
// console.log(next.place, next.parcels)
compareRobots();
function compareRobots() {
    let robot1Turns = [];
    let robot2Turns = [];
    let robot3Turns = [];
    for (let i = 1; i <= 100; i++) {
        let randomVillageState = VillageState.random(5);
        robot1Turns.push(runRobot(randomVillageState, routeRobot, mailRoute))
        robot2Turns.push(runRobot(randomVillageState, goalOrientedRobot))
        robot3Turns.push(runRobot(randomVillageState, goalOrientedRobotAlternate))
    }
    console.log(robot1Turns.reduce((p, c) => p += c, 0) / robot1Turns.length, " - Route Robot Average steps");
    console.log(robot2Turns.reduce((p, c) => p += c, 0) / robot2Turns.length, " - Goal Oriented Robot Average steps");
    console.log(robot3Turns.reduce((p, c) => p += c, 0) / robot3Turns.length, " - Goal Oriented Robot Alt Average steps");
}

console.log("Chapter 8:\n\n")

console.log("Retry\n")

class MultiplicatorUnitFailure extends Error { }

const primitiveMultiply = (x, y) => {
    for (; ;) {
        try {
            const randomNumber = Math.ceil(Math.random() * 10);
            if (randomNumber >= 8) {
                return x * y;
            } else throw new MultiplicatorUnitFailure("Error multiplying numbers");
        } catch (error) {
            if (error instanceof MultiplicatorUnitFailure) console.log(error.message);
            else throw error;
        }
    }

}

const num = primitiveMultiply(5, 5);
console.log(num);

console.log("The Locked Box\n");

const box = new class {
    locked = true;
    #content = [];
    unlock() { this.locked = false; }
    lock() { this.locked = true; }
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this.#content;
    }
};

const withBoxUnlocked = (func) => {
    let initiallyUnlocked = !box.locked;
    try{
        if(!initiallyUnlocked) box.unlock();
        if(!func) throw new Error("You have to pass in a function!");
        func();
    }catch(error){
        console.log(error.message);
    }finally{
        if(!initiallyUnlocked) box.lock();
        console.log(box.locked)
    }
}

withBoxUnlocked(() => {});

console.log("Chapter 9:\n\n")

console.log("RegExp Golf\n");


const reg1 = /ca(r|t)/;
console.log(reg1.test("car"), reg1.test("cat"))
const reg2 = /pr?op/;
console.log(reg2.test("prop"), reg2.test("pop"))
const reg3 = /ferr\w+/;
console.log(reg3.test("ferret"), reg3.test("ferry"), reg3.test("ferrari"));
const reg4 = /\w*(ious)$/
console.log(reg4.test("Furious"), reg4.test("Furiou"), reg4.test("ious"), reg4.test("Ravagious"));
const reg5 = / [.,:;]/;
console.log(reg5.test(" ;"),reg5.test(" "),reg5.test(" ."),reg5.test(" ,"),reg5.test(" :"))
const reg6 = /\w{6,}/;
console.log(reg6.test("five"),reg6.test("letters asd"))
const reg7 = /\b[a-df-zA-DF-Z]+\b/i;
console.log(reg7.test("five"),reg7.test("asd"))


console.log("Chapter 11:\n\n")

console.log("RegExp Golf\n");