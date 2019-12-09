export class ModelClass{
    constructor(_Epochs,_Inputs,_Labels){
        this.settings = {};
        this.settings.epochs = _Epochs;
        this.inputData = _Inputs;
        this.labelData = _Labels;
        this.model = tf.sequential();
    }
    
    function LoadSettings(){
        
    }
    
    function GetSettings(){
        
    }
    
    function BuildModel(layers,_loss,_optimizer,_metrics){
        for(let i = 0; i<layers.length; i++){
            this.model.add(layers[i]);
        }
        this.model.compile({loss: _loss, optimizer: _optimizer, metrics: _metrics});
    }
    
    function TrainModel(callbackMethod, yeild){
        return model.fit(this.inputData, this.labelData, {
            epochs: this.settings.epochs,
            callbacks: callbackMethod,
            yeildEvery: yeild
        });
    }
    
    
    
    
    
    
}