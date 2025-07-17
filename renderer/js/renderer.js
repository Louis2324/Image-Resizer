const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
    const file = e.target.files[0];
    if(!isImg(file)){
        alertMsg("Please select an image","e");
        return;
    }

    //get dimensions 
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function() {
        widthInput.value = this.width;
        heightInput.value = this.height;
    }
    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = window.path.join(window.os.homedir(),'imageresizer');
}


function isImg (file) {
    const formats = ['image/gif','image/png','image/jpeg'];
    return file && formats.includes(file.type);
}

function alertMsg(message, state = "s") {
    const success = state === "s";

    Toastify({
        text: message,
        duration: 3000,
        close: false,
        style: {
            background: success ? "green" : "red",
            color: "white",
            textAlign: "center",
        }
    }).showToast(); // ✅ call showToast() on the result
}

function sendImage(e) {

    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    e.preventDefault();
    if(!img.files[0]){
        alertMsg("please upload an image","e");
        return;
    }

    if(!width || !height || width === "" || height === "") {
        alertMsg("please fill in a height and a width","e");
        return;
    }

    window.ipcRenderer.send('image:resize', {
        imgPath,
        width,
        height,
    })

}

window.ipcRenderer.on("image:done",()=>{
    alertMsg(`Image resize complete`,"s");
});
img.addEventListener("change",loadImage);
form.addEventListener("submit",sendImage);