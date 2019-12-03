let url = "https://api.imgur.com/3/gallery/r/";
let dogResponse;
let catResponse;

let testURLDog = url + "dogs"
let testURLCats = url + "cats"
//let url = "https://images.dog.ceo/breeds/hound-english/n02089973_48.jpg";
//Create a new XHR object
let xhr = new XMLHttpRequest();
//Set onload Handler
xhr.onload = dataLoaded;

//Set the onerror handler
xhr.onerror = dataError;

//Open connection and set the request
xhr.open("GET",testURLDog);
xhr.setRequestHeader("Authorization","Client-ID 1226bd29241e849");
xhr.send();


let xhrC = new XMLHttpRequest();
//Set onload Handler
xhrC.onload = dataLoaded;

//Set the onerror handler
xhrC.onerror = dataError;

//Open connection and set the request
xhrC.open("GET",testURLCats);
xhrC.setRequestHeader("Authorization","Client-ID 1226bd29241e849");
xhrC.send();

function dataError(){
    console.log("ERROR LOADING DATA");
    console.log("ABORTING...");
    console.log("ABORTED"); 
}

let dataDict = {};

function dataLoaded(e){
    let label = e.target.responseURL.split("/")[6];
    let JSONObj = JSON.parse(e.target.responseText);
    let array = JSONObj.data;
   
    for(let i = 0; i<array.length; i++){
        let imageUrl = array[i].link;
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;
        image.onload = getData;
        image.class = label;
    }
    
    
}

function getData(e){
    let canvas = document.createElement("canvas");
    let image = e.path[0];
    canvas.width = 128;
    canvas.height = 128;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image,0,0,128,128);
    let data = ctx.getImageData(0,0,128,128);
    if(dataDict[image.class] == undefined){
        dataDict[image.class] = [];
    }
    dataDict[image.class].push(data);
    console.log(dataDict);
}
