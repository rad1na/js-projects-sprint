const mainImageContainer = document.querySelector("#main-image-container");
const maxFlexGrow = 4;

// Function that generates a random flex columns to make site a little bit more dynamic and random
function generateRandomFlexColumns(max){
    let flexArray = [];
    let tempFlexFr = max;
    while(tempFlexFr > 0){
        let randomNum = Math.floor(Math.random() * (max - 1) + 1);
        flexArray.push(randomNum);
        tempFlexFr -= randomNum
    }
    return flexArray;
}

function generateFlexRowElement(number){
    return `<div class="flex-row-col flex-grow-${number} animate__animated animate__fadeInUp"><div class="loading"></div></div>`;
}

function generateNewFlexRow(){
    let flexArray = generateRandomFlexColumns(maxFlexGrow);
    let element = document.createElement("div");
    element.classList.add("flex-row");
    flexArray.forEach(number => element.innerHTML += generateFlexRowElement(number));
    return element;
}

function main(){
    let i = 5;
    while(i !== 0){
        mainImageContainer.append(generateNewFlexRow());
        i--;
    }
}

main();
