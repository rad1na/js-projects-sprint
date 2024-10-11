const videoElem = document.getElementById("pip-video");
const videoElemButton = document.getElementById("pip-video-button");
const specificElementButton = document.getElementById("pip-specific-element");
const overlay = document.getElementById("overlay");
const dummyElementsWrapper = document.getElementById("dummy-elements-wrapper");
const stopButton = document.getElementById("stop-button");
let appendedElement;


videoElemButton.addEventListener("click", () => {
    triggerMediaCapturing();
})

specificElementButton.addEventListener("click", () => {
    triggerElementPiP();
})

stopButton.addEventListener("click", () => {
    stopCapture(appendedElement ? "element" : null);
})

// Show button to stop streaming if we want to do it manually and hide other buttons
function showStopButton(show) {
    document.querySelectorAll(".button-options .main-button").forEach(button => show ? button.style.display = "none" : button.style.display = "inline-block");
    stopButton.style.display = show ? "inline-block" : "none";
}

// Call Screen Capture API -> https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API
// Get the stream object after confirmation and append it to the video element
async function triggerMediaCapturing() {
    try {
        let captureStream = await navigator.mediaDevices.getDisplayMedia();
        if (captureStream) {
            videoElem.srcObject = captureStream;
        }
        showStopButton(true);
    } catch (err) {
        console.log(err)
    }
}

// Depending what button is clicked "element" or "video" detects what stream needs to be stopped
// If Element, re-add element to dom and close the pip window
// If Video Stream, get all tracks from video element, stop them and reset video src
function stopCapture(type) {
    if (type === 'element') {
        let replacementNode = document.querySelector("#replacement-node");
        replacementNode.insertAdjacentElement("afterend", appendedElement);
        replacementNode.remove()
        window.documentPictureInPicture.window.close();
    } else {
        let tracks = videoElem.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoElem.srcObject = null;
    }
    showStopButton(false);
}

// After document (element) pip window is created, we have to re-add the stylesheets in order
// to see same styling as in main window element
function appendStylesheetsToWindow(targetWindow) {
    [...document.styleSheets].forEach((styleSheet) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = styleSheet.type;
        link.media = styleSheet.media;
        link.href = styleSheet.href;
        targetWindow.document.head.appendChild(link);
    })
}

function triggerElementPiP() {
    let nodes = dummyElementsWrapper.childNodes;
    // this is a placeholder node that will be there once we move main element to pip window
    let replacementNode = document.createElement("span");
    replacementNode.innerHTML = "Element loaded in PIP window";
    replacementNode.id = "replacement-node";
    overlay.classList.add("active");
    dummyElementsWrapper.classList.add("active");
    dummyElementsWrapper.style.top = dummyElementsWrapper.offsetTop;
    dummyElementsWrapper.style.left = dummyElementsWrapper.offsetLeft;
    const clickCallback = (e) => {
        e.target.insertAdjacentElement("afterend", replacementNode)
        loadPipWindow(e.target);
        overlay.classList.remove("active");
        dummyElementsWrapper.style.zIndex = null;
        dummyElementsWrapper.classList.remove("active");
        nodes.forEach(node => node.removeEventListener("click", clickCallback));
    }
    nodes.forEach(node => node.addEventListener("click", clickCallback));
    showStopButton(true);
}

// Use Document Picture-in-Picture API -> https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API
async function loadPipWindow(element) {
    try {
        let pipObject = window.documentPictureInPicture;
        // requestWindow method returns a window that we are going to use to append elements to it
        const pipWindow = await pipObject.requestWindow({
            width: element.clientWidth,
            height: element.clientHeight,
        });
        pipWindow.document.body.append(element);
        appendStylesheetsToWindow(pipWindow);
        appendedElement = element;
        pipWindow.addEventListener("pagehide", () => {
            stopCapture("element");
        });
    } catch (err) {
        console.log(err)
    }
}