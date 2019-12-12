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
    activeModel.compileModel();
}

function TrainModel(){
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

import {ModelClass} from "./Classes/Model.js"
import {app} from "./vue.js"