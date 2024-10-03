// get required dom elements
const getPageFromParams = new URLSearchParams(window.location);
const mainTable = document.querySelector("#main-table");
const tableBody = mainTable.querySelector("tbody");
const paginationButtons = document.querySelectorAll(".pagination-button");
const randomFactButton = document.querySelector("#generate-random-fact-button");
const randomFactElement = document.querySelector("#random-fact");

// fetch data and returned parsed json
async function fetchFactsData(url) {
    const res = await fetch(url);
    if (res.ok) {
        const jsonData = await res.json();
        return jsonData;
    } else {
        throw new Error("An error occured while fetching the facts");
    }
}
// fact object = {fact: string, length: number} , will pass index as No# additionaly
// function generates a table row for each data entry
function generateNewRow(rowData) {
    const { index, fact, length } = rowData;
    return `<tr><td>${index}</td><td>${fact}</td><td>${length}</td></tr>`
}

// function that fetches the data and fills the table
async function fetchAndFillData(url) {
    try {
        const factsData = await fetchFactsData(url || "https://catfact.ninja/facts?page=1");
        if (factsData && factsData.data.length) {
            // generate table rows
            const tableRows = factsData.data.map((fact, index) => generateNewRow({ ...fact, index: factsData.from + index}))
            tableBody.innerHTML = tableRows.join('');
            paginationButtons.forEach(button => {
                // api already provides links for these buttons so just add href and toggle buttons
                const { first_page_url, last_page_url, next_page_url, prev_page_url, current_page, last_page } = factsData;
                switch (button.id) {
                    case 'first':
                        if (first_page_url && current_page != 1) {
                            button.style.display = "inline";
                            button.href = first_page_url;
                        }else button.style.display = "none"
                        break;
                    case 'prev':
                        if (prev_page_url && current_page != 1) {
                            button.style.display = "inline";
                            button.href = prev_page_url;
                        }else button.style.display = "none"
                        break;
                    case 'current':
                        button.innerHTML = current_page;
                        break;
                    case 'next':
                        if (next_page_url && current_page !== last_page) {
                            button.style.display = "inline";
                            button.href = next_page_url;
                        }else button.style.display = "none"
                        break;
                    case 'last':
                        if (last_page_url && current_page !== last_page) {
                            button.style.display = "inline";
                            button.href = last_page_url;
                        }else button.style.display = "none"
                        break;
                }
            })
        } else {
            tableBody.innerHTML = "<tr colspan='3'><td>No Data to Show</td></tr>";
        }
    } catch (err) {
        console.log("ERROR:", err.message)
        tableBody.innerHTML = "<tr colspan='3'><td>Error while fetching the data</td></tr>";
    }
}

// add event listeners on each button to trigger fetch calls based on href
paginationButtons.forEach(button => button.addEventListener("click", (event) => {
    event.preventDefault();
    fetchAndFillData(button.href);
}))

// handler for clicking the generate button that fetches single fact and populates paragraph under
randomFactButton.addEventListener("click" , async () => {
    try{
        const factData = await fetchFactsData("https://catfact.ninja/fact");
        if(factData) randomFactElement.innerHTML = factData.fact;
    }catch(err){
        randomFactElement.innerHTML("Error occured while fetching fact");
    }
})

// initial call
fetchAndFillData()


