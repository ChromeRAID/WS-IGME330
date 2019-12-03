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

let model;
function createModel(){
    model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [65536]}));
    
    model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
    
    let inputs = getInput(250);
    
    model.fit(inputs[0],inputs[1],{epochs:10}).then(()=>
    {
        predictTest();
    });
}

//returns a 2d tensor of image data
function getInput(amountToGrab){
    let inputArray = [];
    let labelArray = [];
    let typesCount  = Object.keys(dataDict).length;
    for(let i = 0; i<amountToGrab; i++){
        let index = Math.floor(typesCount*Math.random());
        let type = Object.keys(dataDict)[index];
        labelArray.push(index);
        let fullArray = dataDict[type];
        index = Math.floor(Math.random()*fullArray.length);
        
        let data = fullArray[index];
        for(let j = 0; j<data.data.length; j++){
            inputArray.push(data.data[j]/255);
        }
        
        
        //Image processing goes here
       // dataInput = tf.image.resize(dataInput)
        
        
    }
    let inputTensor = tf.tensor2d(inputArray,[amountToGrab,65536]);
    let labelTensor = tf.tensor2d(labelArray,[amountToGrab,1]);
    return [inputTensor,labelTensor];
}

function predict(imageData){
    model.predict(tf.tensor2d(imageData,[65536,1])).print();
}

function predictTest(){
    let inputArray = [];
        let typesCount  = Object.keys(dataDict).length;
        let index = Math.floor(typesCount*Math.random());
        let type = Object.keys(dataDict)[index];
        let fullArray = dataDict[type];
        index = Math.floor(Math.random()*fullArray.length);
        
        let data = fullArray[index];
        let dataInput = new Float32Array(65536);
    
        imagedata_to_image(data);
    
        for(let j = 0; j<data.data.length; j++){
            inputArray.push(data.data[j]/255);
        }
        
        let inputTensor = tf.tensor2d(inputArray,[1,65536]);
    
        let prediction = model.predict(inputTensor).asScalar();
        
        
        const a = prediction;
        var array = [];
        array.push(a);

        let values = array.map(t => t.dataSync()[0])
        console.log(values);
    
        let val = values[0];
        let predictType = Object.keys(dataDict)[Math.floor(val*typesCount)];
        console.log(predictType);
        app.guess = predictType;
       return predictType;
       
}

function imagedata_to_image(imagedata) {
    var canvas = document.querySelector('#mainCanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    app.image = canvas.toDataURL();
}