let urls = "https://api.imgur.com/3/gallery/r/";
let status = {
    isFinished: 1,
    message: ""
};
let dataDict = {};
let activeModel;
let imagesToLoad = 0;
//Loads Images for all subreddits in vue instance
function loadImages(){
	for(let i = 0; i<app.subreddits.length; i++){
        imagesToLoad++;
		XHRRequest(urls+app.subreddits[i],dataLoaded,dataError);
	}
}
//Handles XHR Request for images
function XHRRequest(url,load,error){
    let xhrRequest = new XMLHttpRequest();
    //Set onload Handler
    xhrRequest.onload = load;
    //Set the onerror handler
    xhrRequest.onerror = error;
    //Open connection and set the request
    xhrRequest.open("GET", url);
    xhrRequest.setRequestHeader("Authorization", "Client-ID 1226bd29241e849");
    xhrRequest.send();
}
//If there is an error this is called
function dataError(e) {
    imagesToLoad--;
    console.log("ERROR LOADING DATA");
    console.log("ABORTING...");
    console.log("ABORTED");
}
//If the data is loaded successfully
function dataLoaded(e) {
    imagesToLoad--;
	//If this is called and the call is not successful remove this subreddit from app
    let label = e.target.responseURL.split("/")[6];
	if(e.target.status != "200"){
		app.subreddits = app.subreddits.filter(function(value,index, arr){
			return value!=label;
		});
		return;
	}
    let JSONObj = JSON.parse(e.target.responseText);
	//If successful but there is no data remove this from the app
	if(JSONObj.data.length == 0){
		app.subreddits = app.subreddits.filter(function(value,index, arr){
			return value!=label;
		});
		return;
	}
	//If valid 
    let array = JSONObj.data;
    imagesToLoad+=array.length;
    for (let i = 0; i < array.length; i++) {
        let imageUrl = array[i].link;
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;
        image.onload = getDataImages;
        image.onerror = function(){
            imagesToLoad--; 
        };
        image.class = label;
    }
}
//Converts image to imageData
function getDataImages(e) {

    //app.isLoading = false;
    app.loadingMessage = "Loading images please wait...";
    let canvas = document.createElement("canvas");
    let image = e.path[0];
    canvas.width = 64;
    canvas.height = 64;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image,0,0,64,64);
    let data = ctx.getImageData(0,0,64,64);
    if(dataDict[image.class] == undefined){
        dataDict[image.class] = [];
    }
    dataDict[image.class].push(data);
    imagesToLoad--;
}
//returns a 2d tensor of image data
function getInput(amountToGrab) {
    let inputArray = [];
    let labelArray = [];
    let typesCount = Object.keys(dataDict).length;
    for (let i = 0; i < amountToGrab; i++) {
        let index = Math.floor(typesCount * Math.random());
        let type = Object.keys(dataDict)[index];
        labelArray.push(index);
        let fullArray = dataDict[type];
        index = Math.floor(Math.random() * fullArray.length);

        let data = fullArray[index];
        for(let j = 0; j<data.data.length/4; j++){
            inputArray.push(data.data[j]/255);
        	inputArray.push(data.data[j+1]/255);
			inputArray.push(data.data[j+2]/255);
		}
	}
    let inputTensor = tf.tensor4d(inputArray,[amountToGrab,64,64,3]);
    let labelTensor = tf.tensor2d(labelArray,[amountToGrab,1]);
    return [inputTensor,labelTensor];
}
//Converts image data to image useful for prediction visuals
function imagedata_to_image(imagedata) {
    var canvas = document.querySelector('#mainCanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    app.image = canvas.toDataURL();
}
//Creates a visual of a model
async function createVisual(){
	let visor = tfvis.visor();
	let modelDisplay = visor.surface({name:"Model Summary", tab:"Model Info"});
	tfvis.show.modelSummary(modelDisplay,activeModel.model);
}


//Saves a model to firebase
function SaveModel(){
    //Save stuff to firebase
}
//Loads a model from firebase
function LoadModel(){
    //Get stuff from firebase   
}
//Creates a new model object
function initModel(){
    imagesToLoad = 0;
    dataDict = {};
    loadImages();
    checkIfFinished();
    
}
function checkIfFinished(){
    if(imagesToLoad!=0)
    {
        setTimeout(checkIfFinished,1000);
    }
    else
    {
        CreateModel();
    }
}
//Creates a model based on settings
function CreateModel(){
    let inputData = getInput(250);
    activeModel = new ModelClass(15,inputData[0],inputData[1]);
    let layers = [];
    layers.push(tf.layers.conv2d({filters:8, kernelSize:5,padding:'same',activation:'relu',inputShape:[64,64,3]}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.conv2d({filters:16, kernelSize:3,padding:'same',activation:'relu'}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.flatten());
	layers.push(tf.layers.dense({units:64, activation:'relu'}));
    layers.push(tf.layers.dense({units:Object.keys(dataDict).length,  activation:'softmax'}));
    let loss = "sparseCategoricalCrossentropy";
    let optimizer = "adam";
    let metrics = ["accuracy"];
    activeModel.BuildModel(layers,loss,optimizer,metrics);
    TrainModel();
}
//Trains the model
async function TrainModel(){
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
	const container = {
		name: 'Model Training', styles: { height: '1000px' }
	};
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
    
    app.loadingMessage = "Training Please Wait...";
    await createVisual();
    await activeModel.TrainModel(fitCallbacks,"batch");
}
//Tests the model off of a random image
function predictTest(){
    let inputArray = [];
        let typesCount  = Object.keys(dataDict).length;
        let index = Math.floor(typesCount*Math.random());
        let types = Object.keys(dataDict);
        let type = types[index];
        let fullArray = dataDict[type];
        index = Math.floor(Math.random()*fullArray.length);
        
        let data = fullArray[index];
    
        imagedata_to_image(data);
    
        for(let j = 0; j<data.data.length/4; j++){
            inputArray.push(data.data[j]/255);
        	inputArray.push(data.data[j+1]/255);
			inputArray.push(data.data[j+2]/255);
		}
        
        let inputTensor = tf.tensor4d(inputArray,[1,64,64,3]);
    
        let prediction = activeModel.model.predict(inputTensor).dataSync();
        
        let maxIndex = 0;
        for(let k = 1; k<prediction.length; k++){
            if(prediction[k] > prediction[maxIndex]){
                maxIndex = k;
            }
        }
        let predictType = types[maxIndex];
        let accuracy = prediction[maxIndex];
		app.guess = `This is a ${predictType}. I'm ${accuracy}% sure. `;
		app.loadingMessage = "";
       	return predictType;
}
//Tests the model off of an uploaded image
function predictUpload(){
    let inputArray = [];
        let typesCount  = Object.keys(dataDict).length;
        let index = Math.floor(typesCount*Math.random());
        let type = Object.keys(dataDict)[index];
        let fullArray = dataDict[type];
        index = Math.floor(Math.random()*fullArray.length);
        
        let data = fullArray[index];
    
        imagedata_to_image(data);
    
        for(let j = 0; j<data.data.length/4; j++){
            inputArray.push(data.data[j]/255);
        	inputArray.push(data.data[j+1]/255);
			inputArray.push(data.data[j+2]/255);
		}
        
        let inputTensor = tf.tensor4d(inputArray,[1,64,64,3]);
    
        let prediction = activeModel.predict(inputTensor).asScalar();
        
        
        const a = prediction;
        var array = [];
        array.push(a);

        let values = array.map(t => t.dataSync()[0])
        console.log(values);
    
        let val = values[0];
        let predictType = Object.keys(dataDict)[Math.floor(val*typesCount)];
        console.log(predictType);
		app.guess = `This is a ${predictType}. I'm ${values[0]}% sure. `;
		app.loadingMessage = "";
       	return predictType;
}


import {app} from "./vue.js";
import {ModelClass} from "./Classes/Model.js";
export {initModel,loadImages,SaveModel,LoadModel,CreateModel,TrainModel,predictTest,predictUpload};