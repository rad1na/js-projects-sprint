// get required dom elements
const mainTable = document.querySelector("#main-table");
const tableWrapper = document.querySelector(".table-wrapper");
const mainLoader = document.querySelector("#main-loader");
const tableBody = mainTable.querySelector("tbody");
const paginationButtons = document.querySelectorAll(".pagination-button");
const randomFactButton = document.querySelector("#generate-random-fact-button");
const randomFactElement = document.querySelector("#random-fact");
const loaderOverlay = document.querySelector(".loading-overlay");
const errorFetchButton = document.querySelector("#simulate-error-fetch");
const errorMessageWrapper = document.querySelector(".error-message-wrapper");
const retryFetchButton = document.querySelector("#retry-button");


// fetch data and returned parsed json
async function fetchFactsData(url) {
    const res = await fetch(url);
    if (res.ok) {
        const jsonData = await res.json();
        return jsonData;
    } else {
        throw new Error(`(${res.status}) - ${res.statusText} - ${res.type}`);
    }
}
// fact object = {fact: string, length: number} , will pass index as No# additionaly
// function generates a table row for each data entry
function generateNewRow(rowData) {
    const { index, fact, length } = rowData;
    return `<tr><td>${index}</td><td>${length}</td><td>${fact}</td></tr>`
}

// function that fetches the data and fills the table
async function fetchAndFillData(url, initialLoad) {
    const tableRetryLoader = document.querySelector("#table-retry-loader");
    tableRetryLoader.classList.remove("hidden");
    loaderOverlay.classList.remove("hidden");
    try {
        const factsData = await fetchFactsData(url || "https://catfact.ninja/facts?page=1");
        if (factsData && factsData.data.length) {
            // generate table rows
            const tableRows = factsData.data.map((fact, index) => generateNewRow({ ...fact, index: factsData.from + index }))
            tableBody.innerHTML = tableRows.join('');
            paginationButtons.forEach(button => {
                // api already provides links for these buttons so just add href and toggle buttons
                const { first_page_url, last_page_url, next_page_url, prev_page_url, current_page, last_page } = factsData;
                switch (button.id) {
                    case 'first':
                        if (first_page_url && current_page != 1) {
                            button.classList.remove("disabled");
                            button.href = first_page_url;
                        } else button.classList.add("disabled")
                        break;
                    case 'prev':
                        if (prev_page_url && current_page != 1) {
                            button.classList.remove("disabled");
                            button.href = prev_page_url;
                        } else button.classList.add("disabled")
                        break;
                    case 'current':
                        button.innerHTML = current_page;
                        break;
                    case 'next':
                        if (next_page_url && current_page !== last_page) {
                            button.classList.remove("disabled");
                            button.href = next_page_url;
                        } else button.classList.add("disabled")
                        break;
                    case 'last':
                        if (last_page_url && current_page !== last_page) {
                            button.classList.remove("disabled");
                            button.href = last_page_url;
                        } else button.classList.add("disabled")
                        break;
                }
            })
            mainTable.scrollIntoView();
            tableWrapper.classList.remove("hidden")
            errorMessageWrapper.classList.add("hidden")
        } else {
            tableBody.innerHTML = "<tr colspan='3'><td>No Data to Show</td></tr>";
        }
    } catch (err) {
        tableWrapper.classList.add("hidden")
        errorMessageWrapper.classList.remove("hidden")
        errorMessageWrapper.firstElementChild.innerHTML = `Error fetching table data: ${err.message}`;
    } finally {
        if (initialLoad) {
            mainLoader.classList.add("hidden")
        }
        loaderOverlay.classList.add("hidden");
        tableRetryLoader.classList.add("hidden");
    }
}

async function generateRandomFact(url) {
    const randomFactLoader = document.querySelector("#random-fact-loader");
    try {
        randomFactLoader.classList.remove("hidden");
        randomFactElement.innerHTML = "";
        const factData = await fetchFactsData(url || "https://catfact.ninja/fact");
        if (factData) {
            randomFactElement.nextElementSibling.innerHTML = "Generate";
            randomFactElement.parentElement.classList.remove("bordered-red")
            randomFactElement.innerHTML = `<q>${factData.fact}</q>`
        };
    } catch (err) {
        randomFactElement.innerHTML = `<h2>Error generating random fact: ${err.message}</h2>`;
        randomFactElement.nextElementSibling.innerHTML = "Retry";
        randomFactElement.parentElement.classList.add("bordered-red")
    } finally {
        randomFactLoader.classList.add("hidden");
    }
}

// add event listeners on each button to trigger fetch calls based on href
paginationButtons.forEach(button => button.addEventListener("click", (event) => {
    event.preventDefault();
    fetchAndFillData(button.href);
}))

// handlers for clicking the generate button that fetches single fact and populates paragraph under
randomFactButton.addEventListener("click", () => {
    generateRandomFact()
})

retryFetchButton.addEventListener("click", () => {
    fetchAndFillData("")
})

// simulate bad fetch calls
errorFetchButton.addEventListener("click", () => {
    generateRandomFact("https://catfact.ninja/facttt");
    fetchAndFillData("https://catfact.ninja/this-is-wrong-endpoint")
})

// initial call
fetchAndFillData("", true)


