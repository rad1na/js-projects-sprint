let canvas = document.querySelector("#robot-canvas");
let robotGIF = document.querySelector("#robot-gif");
let robotFrame = document.querySelector("#robot-frame");
let factButton = document.querySelector("#fact-button");
let repeatButton = document.querySelector("#repeat-button");
let audioElement = document.querySelector("#audio-element");
let factElement = document.querySelector(".fact");

async function fetchRandomFact() {
    try {
        const res = await fetch("https://catfact.ninja/fact");
        if (res.ok) {
            const jsonData = await res.json();
            return jsonData;
        } else {
            throw new Error(`(${res.status}) - ${res.statusText} - ${res.type}`);
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function createTextToVoice(text) {
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '79ce217751msh381c0850f0fd946p109c8ejsn51a636ac2a6d',
            'x-rapidapi-host': 'large-text-to-speech.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    };
    try {
        const res = await fetch("https://large-text-to-speech.p.rapidapi.com/tts", options);
        if (res.ok) {
            let resJson = await res.json();
            return resJson;
        } else {
            throw new Error(`(${res.status}) - ${res.statusText} - ${res.type}`);
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function fetchAudioURL(id) {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '79ce217751msh381c0850f0fd946p109c8ejsn51a636ac2a6d',
            'x-rapidapi-host': 'large-text-to-speech.p.rapidapi.com',
        }
    };
    try {
        const res = await fetch(`https://large-text-to-speech.p.rapidapi.com/tts?id=${id}`, options);
        if (res.ok) {
            let { status, url } = await res.json();
            if (status === 'success')
                audioElement.src = url;
                audioElement.play();
                repeatButton.style.display = "block";
        } else {
            throw new Error(`(${res.status}) - ${res.statusText} - ${res.type}`);
        }
    } catch (err) {
        throw new Error(err);
    }
}

audioElement.addEventListener("play", () => {
    robotGIF.style.display = "block";
    robotFrame.style.display = "none";
})

audioElement.addEventListener("ended", () => {
    robotGIF.style.display = "none";
    robotFrame.style.display = "block";
    repeatButton.removeAttribute("disabled");
    factButton.removeAttribute("disabled");
})

repeatButton.addEventListener("click", ()=> {
    audioElement.play();
    repeatButton.disabled = "true";
    factButton.disabled = "true";
});

factButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        let { fact } = await fetchRandomFact();
        let { id, status, eta } = await createTextToVoice(fact);
        if (status === 'processing') {
            factElement.innerHTML = `Preparing a fact for you, hold on... ETA: ${eta / 2} seconds`;
            factElement.parentElement.style.display = "block";
            factElement.parentElement.style.top = "-" + factElement.clientHeight + "px";
            e.target.disabled = "true";
            repeatButton.disabled = "true";
            setTimeout(async () => {
                await fetchAudioURL(id)
                factElement.innerHTML = fact;
            }, eta * 1000 / 2);
        }
    } catch (err) {
        console.log(err)
    }
})


robotGIF.addEventListener("load", () => {
    let robotElem = robotGIF.cloneNode(true);
    robotElem.style.display = "inline";
    canvas.getContext("2d").drawImage(robotElem, 40, 40);
})