
async function createModel(){
    let layers = [];
    layers.push(tf.layers.conv2d({filters:8, kernelSize:5,padding:'same',activation:'relu',inputShape:[64,64,3]}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.conv2d({filters:16, kernelSize:3,padding:'same',activation:'relu'}));
	layers.push(tf.layers.maxPooling2d({poolSize:2}));
	layers.push(tf.layers.flatten());
	layers.push(tf.layers.dense({units:64, activation:'relu'}));
    layers.push(tf.layers.dense({units:1,  activation:'sigmoid'}));
    model.compile({loss: 'meanSquaredError', optimizer: 'adam', metrics: ['accuracy']});
    app.loadingMessage = "Training please wait...";
	await createVisual();
	
    let inputs = getInput(250);
    
   	await train(model, inputs);


}

async function train(model, inputs){
	const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
	const container = {
		name: 'Model Training', styles: { height: '1000px' }
	};
	const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

	let trainXs = inputs[0];
	let trainYs = inputs[1];
	let testXs = inputs[0];
	let testYs = inputs[1];
	
	return model.fit(trainXs, trainYs, {
		epochs: 1,
		callbacks: fitCallbacks,
		yeildEvery: 'batch'
	});
}

function SaveModel(){
    //Save stuff to firebase
}

function LoadModel(){
    //Get stuff from firebase   
}

function initModel(){
    activeModel = new ModelClass(app.settings);
}

function CreateModel(){
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

function TrainModel(){
    app.loadingMessage = "Training Please Wait...";
    await createVisual();
    let inputs  = getInput(250);
    await 
}

import {ModelClass} from "./Classes/Model.js"