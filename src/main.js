let urls = "https://api.imgur.com/3/gallery/r/";
let status = {
    isFinished: 1,
    message: ""
};
let dataDict = {};
let activeModel;
//Loads Images for all subreddits in vue instance
function loadImages(){
	for(let i = 0; i<app.subreddits.length; i++){
		console.log(urls+app.subreddits[i]);
		XHRRequest(urls+app.subreddits[i],dataLoaded,dataError);
	}
}
//Handles XHR Request for images
function XHRRequest(url,load,error){
    let xhrC = new XMLHttpRequest();
    //Set onload Handler
    xhrC.onload = load;

    //Set the onerror handler
    xhrC.onerror = error;

    //Open connection and set the request
    xhrC.open("GET", url);
    xhrC.setRequestHeader("Authorization", "Client-ID 1226bd29241e849");
    xhrC.send();

}
//If there is an error this is called
function dataError(e) {
    console.log("ERROR LOADING DATA");
    console.log("ABORTING...");
    console.log("ABORTED");
}
//If the data is loaded successfully
function dataLoaded(e) {
	//If this is called and the call is not successful remove this subreddit from app
	if(e.target.status != "200"){
		let tag = e.target.responseURL.split("/")[6];
		app.subreddits = app.subreddits.filter(function(value,index, arr){
			return value!=tag;
		});
		return;
	}
    let label = e.target.responseURL.split("/")[6];
    let JSONObj = JSON.parse(e.target.responseText);
	//If successful but there is no data remove this from the app
	if(JSONObj.data.length == 0){
		let tag = e.target.responseURL.split("/")[6];
		app.subreddits = app.subreddits.filter(function(value,index, arr){
			return value!=tag;
		});
		return;
	}
	//If valid 
    let array = JSONObj.data;
    for (let i = 0; i < array.length; i++) {
        try{
        let imageUrl = array[i].link;
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;
        image.onload = getDataImages;
        image.class = label;
        }
        catch(e){
            console.log(e);
        }
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
    loadImages();
    let input  = getInput(250);
    activeModel = new ModelClass(15,input[0],input[1]);
}
//Creates a model based on settings
function CreateModel(){
    initModel();
    let layers = [];
    layers.push(tf.layers.conv2d({filters:8, kernelSize:5,padding:'same',activation:'relu',inputShape:[64,64,3]}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.conv2d({filters:16, kernelSize:3,padding:'same',activation:'relu'}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.flatten());
	layers.push(tf.layers.dense({units:64, activation:'relu'}));
    layers.push(tf.layers.dense({units:1,  activation:'sigmoid'}));
    let loss = "meanSquaredError";
    let optimizer = "adam";
    let metrics = ["accuracy"];
    activeModel.BuildModel(layers,loss,optimizer,metrics);
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
    let inputs  = getInput(250);
    await activeModel.TrainModel(fitCallbacks,"batch");
}
//Tests the model off of a random image
function predictTest(){
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
    
        let prediction = activeModel.model.predict(inputTensor).asScalar();
        
        
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
export {loadImages,SaveModel,LoadModel,CreateModel,TrainModel,predictTest,predictUpload};