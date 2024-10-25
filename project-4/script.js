let canvas = document.querySelector("#robot-canvas");
let robotGIF = document.querySelector("#robot-gif");
let robotFrame = document.querySelector("#robot-frame");
let factButton = document.querySelector("#fact-button");
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

async function fetchTextToVoice(text) {
    const data = new FormData();
    data.append('src', text);
    data.append('hl', 'en-us');
    data.append('r', '0');
    data.append('c', 'mp3');
    data.append('f', '8khz_8bit_mono');
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '79ce217751msh381c0850f0fd946p109c8ejsn51a636ac2a6d',
            'x-rapidapi-host': 'voicerss-text-to-speech.p.rapidapi.com'
        },
        body: data
    };
    try {
        const res = await fetch("https://voicerss-text-to-speech.p.rapidapi.com/", options);
        if (res.ok) {
            let blob = await res.blob();
            const url = URL.createObjectURL(blob);
            audioElement.src = url;
        } else {
            throw new Error(`(${res.status}) - ${res.statusText} - ${res.type}`);
        }
    } catch (err) {
        throw new Error(err);
    }
}

factButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try{
        let {fact} = await fetchRandomFact();
        let voice = await fetchTextToVoice(fact);
        factElement.innerHTML = fact;
        factElement.parentElement.style.display = "block";
        factElement.parentElement.style.top = "-" + factElement.clientHeight + "px";
        robotGIF.style.display = "block";
        robotFrame.style.display = "none";
    }catch(err){
        console.log(err)
    }
})


robotGIF.addEventListener("load", () => {
    let robotElem = robotGIF.cloneNode(true);
    robotElem.style.display = "inline";
    canvas.getContext("2d").drawImage(robotElem, 40, 40);
})