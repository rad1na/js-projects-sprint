const mainImageContainer = document.querySelector("#main-image-container");
const maxFlexGrow = 6;
const API_ACCESS_KEY = "SIfA-F0dOU9yGm7XYy7c9oQL8jWNKwYk0STYTQLX3lo"

// Function that generates a random flex columns to make site a little bit more dynamic and random
function generateRandomFlexColumns(max) {
    let flexArray = [];
    let tempFlexFr = max;
    while (tempFlexFr > 0) {
        let randomNum = Math.floor(Math.random() * (max - 1) + 1);
        flexArray.push(randomNum);
        tempFlexFr -= randomNum
    }
    return flexArray;
}

// fetch images & handle errors
async function fetchUnsplashImages(count) {
    try {
        const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${API_ACCESS_KEY}&count=${count}`);
        const jsonData = await res.json();
        if (res.ok) {
            return jsonData;
        } else {
            let errorMessage = "";
            if(jsonData.errors){
                jsonData.errors.forEach(error => errorMessage = errorMessage.concat(error,"\n"))
            }
            throw new Error(`(${res.status} / ${res.type.toUpperCase()}) - ${errorMessage}`);
        }
    } catch (error) {
        throw new Error(error)
    }
}

// generate single element (image element) with loader. I've already added img element to avoid unecessary js creation of element
function generateFlexRowElement(number) {
    return `<div class="flex-row-col flex-grow-${number} animate__animated animate__fadeInUp loading"><img class="placeholder" src=""/><div class="spinner-wrapper"><div class="spinner"></div></div></div>`;
}

// generate new placeholder row of elements and append them to target (main container)
function generateNewFlexRow(target) {
    let flexArray = generateRandomFlexColumns(maxFlexGrow);
    let element = document.createElement("div");
    element.classList.add("flex-row");
    flexArray.forEach(number => element.innerHTML += generateFlexRowElement(number));
    target.append(element)
    return flexArray.length;
}

// in generateNewFlexRow i am not appending any data cause i want to show placeholder loaders, once the data is read fill it with image sources.
// if not ready show error
function switchLoadingWithData(images, error) {
    const loadingElements = mainImageContainer.querySelectorAll(".flex-row-col.loading");
    loadingElements.forEach((element, index) => {
        if(images.length){
            element.firstElementChild.classList.remove("placeholder");
            element.firstElementChild.src = images[index].urls.regular;
            element.firstElementChild.alt = images[index].alt_description;
        }else{
            element.innerHTML = `<p class="error-message-p">Error loading image: ${error.message}</p>`
        }
        element.classList.remove("loading");
    })
}

// generate placeholder rows, fetch the data, and switch the image sources
// amount represents how many rows should be generated
async function generateRows(amount) {
    let numOfElementsGenerated = 0;
    while (amount !== 0) {
        numOfElementsGenerated += generateNewFlexRow(mainImageContainer);
        amount--;
    }
    try {
        const data = await fetchUnsplashImages(numOfElementsGenerated);
        switchLoadingWithData(data);
    } catch (error) {
        console.log(error);
        switchLoadingWithData([], error);
    }
}

// initilazed 5 rows, create observer and handle intersection
function main() {
    generateRows(5);
    const callback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                generateRows(5);
            }
        });
    };
    // since the intersecting element has 300px height, trigger when it reaches half of the box with threshold just to demonstrate
    const observer = new IntersectionObserver(callback, { threshold: 0.5 });
    // created observer on the dummy element that its always going to be at the bottom of the page
    observer.observe(document.querySelector("#intersecting-element"));
}

main();
