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
const roadGraph = roads.reduce((graph, road) => {
    let [from, to] = road.split("-");
    if (from in graph) {
        graph[from].push(to);
    } else {
        graph[from] = [to]
    }
    if (to in graph) {
        graph[to].push(from);
    } else {
        graph[to] = [from]
    }
    return graph;
}, {})

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
function compareRobots(){
    let robot1Turns = [];
    let robot2Turns = [];
    let robot3Turns = [];
    for(let i = 1; i<=100; i++){
        let randomVillageState = VillageState.random(5);
        robot1Turns.push(runRobot(randomVillageState, routeRobot, mailRoute))
        robot2Turns.push(runRobot(randomVillageState, goalOrientedRobot))
        robot3Turns.push(runRobot(randomVillageState, goalOrientedRobotAlternate))
    }
    console.log(robot1Turns.reduce((p,c) => p += c, 0) / robot1Turns.length, " - Route Robot Average steps");
    console.log(robot2Turns.reduce((p,c) => p += c, 0) / robot2Turns.length, " - Goal Oriented Robot Average steps");
    console.log(robot3Turns.reduce((p,c) => p += c, 0) / robot3Turns.length, " - Goal Oriented Robot Alt Average steps");
}