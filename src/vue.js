// Define a new component called button-counter
Vue.component('subredditTemplate', {
  	props: ['name'],
	methods: {
		removeSubreddit(){
			for(let val = 0; val<app.subreddits.length; val++){
				if(app.subreddits[val] == this.name){
					app.subreddits.splice(val, 1);
				}
			}
		}	
	},
  	template: '<div><p style="display:inline">{{name}}</p><input @click=removeSubreddit style="display:inline; margin-left: 10px;" class="btn waves-effect waves-light" type="Submit" value="Remove"></div>'
});

Vue.component("predictionTemplate",{
	props: ['prediction','imageURL','actual'],
	template: '<div><p>Guess:{{prediction}}</p><img v-bind:src=imageURL><p>Actual:{{actual}}</div>'
});

const app = new Vue({
	el: '#root',
	data: {
		result: [],
		selected: 'hound',
		subreddits: [],
		url: URL,
		guess: "WAITING FOR TRAINING",
		appState: {hiddenVal: 'show', loadingMessage: "" },
		upload: '',
		image: "https://i.imgur.com/JlUvsxa.jpg",
		toAdd: "",
        trainEnabled: false,
        predictEnabled:false

	},
	methods: {
		LoadStuff(){
			LoadModel();
		},
		async create() {
		},
		async run() {
            if(this.subreddits.length == 0) {return;}
            CreateModel();
			TrainModel();
		},
		predictImage(){
			predictTest();
		},
		addSubreddit(){
			if(this.toAdd != "" && !this.subreddits.includes(this.toAdd)){
				this.subreddits.push(this.toAdd);
			}
		},
        onFileChange(e) {
            app.upload = e.target.files[0];
            console.log(app.upload);
            //predictTest();
        }
	},
	created(){
		this.LoadStuff();
	}
});

import {LoadModel,predictTest,predictUpload,TrainModel,CreateModel} from "./main.js"
export {app}