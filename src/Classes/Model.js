//A class originally meant to be saved to firebase
class ModelClass{
	//A simple constructor to hold various pieces of information
    constructor(_Epochs,_Inputs,_Labels){
        this.settings = {};
        this.settings.epochs = _Epochs;
        this.inputData = _Inputs;
        this.labelData = _Labels;
        this.model = tf.sequential();
        this.classNames = [];
    }
    //Create a model based on the layers, and other settings
    BuildModel(layers,_loss,_optimizer,_metrics){
        for(let i = 0; i<layers.length; i++){
            this.model.add(layers[i]);
        }
        this.model.compile({loss: _loss, optimizer: _optimizer, metrics: _metrics});
    }
    //Train the model and on batch and epoch end call the callback method. Yeild to let stuff run based on yeild
    TrainModel(callbackMethod, yeild){
        return this.model.fit(this.inputData, this.labelData, {
            epochs: this.settings.epochs,
            callbacks: callbackMethod,
            yeildEvery: yeild
        });
    }
    
}

export {ModelClass};