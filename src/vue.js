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
  	template: '<div><p style="display:inline">{{name}}</p><input @click=removeSubreddit style="display:inline" class="btn waves-effect waves-light" type="Submit" value="Remove"></div>'
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
		isLoading: false,
		loadingMessage: "",
		image: "https://i.imgur.com/JlUvsxa.jpg",
		toAdd: ""

	},
	methods: {
		LoadStuff(){
			LoadModel();
		},
		async create() {	    
			setTimeout( async function(){
				await createModel();
			},1000);
		},
		async run() {	    
			setTimeout( async function(){
				await trainModel();
			},1000);
		},
		predictImage(){
			predictTest();
		},
		addSubreddit(){
			if(this.toAdd != "" && !this.subreddits.includes(this.toAdd)){
				this.subreddits.push(this.toAdd);
			}
		}
	},
	created(){
		this.LoadStuff();
	}
});

import {LoadModel} from "./main.js"