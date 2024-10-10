const videoElem = document.getElementById("pip-video");
const videoElemButton = document.getElementById("pip-video-button");
const specificElementButton = document.getElementById("pip-specific-element");
const mainContainter = document.getElementById("main-container");

videoElemButton.addEventListener("click", () => {
    triggerMediaCapturing();
})

specificElementButton.addEventListener("click", () => {
    triggerElementPiP();
})

async function triggerMediaCapturing(){
    try{
        let captureStream = await navigator.mediaDevices.getDisplayMedia();
        if(captureStream){
            videoElem.srcObject = captureStream;
        }
    }catch(err){
        console.log(err)
    }
}

async function triggerElementPiP(){
    try{
        let pipObject = window.documentPictureInPicture;
        const pipWindow = await pipObject.requestWindow({
            width: mainContainter.clientWidth,
            height: mainContainter.clientHeight,
        });
        pipWindow.document.body.append(mainContainter)
        console.log(pipWindow, "WINDOW")
    }catch(err){
        console.log(err)
    }
}

async function main(){
    
    
    
}

main();