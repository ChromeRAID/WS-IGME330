// Define a new component called button-counter
Vue.component('subredditTemplate', {
	props: ['name'],
	methods: {
		removeSubreddit() {
			for (let val = 0; val < app.subreddits.length; val++) {
				if (app.subreddits[val] == this.name) {
					app.subreddits.splice(val, 1);
				}
			}
		}
	},
	template: '<div class="row card-panel blue-grey darken-1"><div class="col s6"><h6>{{name}}</h6></div><div class="col s6"><input @click=removeSubreddit class="btn waves-effect waves-light" type="Submit" value="Remove"></div></div>'
	//template: '<div><ul><li v-for="sub in subreddits" v-bind:name="sub" v-bind:key="sub">{{name}}</li></ul></div>'

});
//Component for prediction
Vue.component("predictionTemplate", {
	props: ['prediction', 'imageURL', 'actual'],
	template: '<div><p>Guess:{{prediction}}</p><img v-bind:src=imageURL><p>Actual:{{actual}}</div>'
});
//Directive for visibility
Vue.directive('visible', function(el, binding) {
	el.style.visibility = !!binding.value ? 'visible' : 'hidden';
});
//checks local storage for specified string
let checkLocalStorage = (string) => {
	if (localStorage.getItem(string) != undefined) {
		return true
	}
	return false;
}
//The main vue object
const app = new Vue({
	el: '#root',
	data: {
		result: [],
		selected: 'hound',
		subreddits: ["dogs", "cats"],
		url: URL,
		guess: 'Waiting for Training',
		appState: {loadingMessage: "", isLoading: false },
		upload: '',
		image: "https://i.imgur.com/JlUvsxa.jpg",
		toAdd: "",
		//Buttons enabled
		trainEnabled: false,
		predictEnabled: false,
		userUpload: false,
		//Limits are the options for the dropdowns
		epochLimits: [5, 10, 15, 20, 25],
		dataLimits: [100, 200, 250, 300, 350],
		//Selected are the option selected in the dropdowns
		epochSelected: 15,
		dataSelected: 250,
		//ID for saving to firebase
		userID: 0
	},
	computed:{
		UserPredictEnabled: function(){ //returns true if user should be able to predict with uploaded image
			return (this.trainEnabled && this.userUpload);
		}
	},
	methods: {
		//initalize model
		LoadStuff(){
			let settings  = LoadModel(this.userID);
			if(settings!=undefined){
            this.epochSelected = settings.epochs;
            this.dataSelected = settings.datas;
			this.subreddits = settings.subreddits;
			}
		},
		async create() {
		},
		async run() {
			//If there are subreddits in the list start creating the model
			if (this.subreddits.length == 0) { return; }
			initModel();
		},
		predictImage() {
			//Predict of a random image
			predictTest();
		},
        predictUploadButton() {
			//predict of a uploaded image
			predictUpload();
		},
		//adds subreddits to search
		addSubreddit() {
			//add to a list from toAdd
			if (this.toAdd != "" && !this.subreddits.includes(this.toAdd)) {
				this.subreddits.push(this.toAdd);
			}
		},
		//to-do when file upload changes
		onFileChange(e){
			//Upon loading a file create a reader that reads as a data url and call imageLoaded when loaded
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = imageLoaded;
			
		},
		//removes subreddits to search
		removeSubreddit() {
			for (let val = 0; val < this.subreddits.length; val++) {
				if (this.subreddits[val] == this.name) {
					this.subreddits.splice(val, 1);
				}
			}
		},
		//gets user Id is local storage
		GetUserID() {
			if (checkLocalStorage("sru4607-proj2")) {
				this.userID = localStorage.getItem("sru4607-proj2");
			}
			else {
				this.userID = Math.floor(Math.random() * 1000000000000);
				localStorage.setItem("sru4607-proj2", this.userID);
			}
		},
		//gets the saved image in local storage 
		GetSavedImage() {
			if (checkLocalStorage("sru4607-proj2-image")) {
				this.upload = localStorage.getItem("sru4607-proj2-image");
				this.userUpload = true;
			}
			else {
				this.upload = this.image;
				//this.upload = URL.createObjectURL(this.upload);
				localStorage.setItem("sru4607-proj2-image", this.upload);
			}
		},
		//sets the saved image 
		SetSavedImage() {
			localStorage.setItem("sru4607-proj2-image", this.upload);
		}
	},
	created() {
		//Loads important information
		this.LoadStuff();
		this.GetUserID();
		this.GetSavedImage();
		if (checkLocalStorage("sru4607-proj2-image")) {
			this.image = localStorage.getItem("sru4607-proj2-image");
		}
	}
});

function imageLoaded(e){
	//Modifies the data url
	let modDataURL = e.target.result.replace("/^data:image\/(png|jpg);base64,/", ""); //regex parse replace
	//Sets necessary vue information from loaded url
	app.upload = modDataURL;
	app.SetSavedImage();
	app.image =  modDataURL;
	app.userUpload = true;
	
}

import { initModel, LoadModel, predictTest, predictUpload, TrainModel, CreateModel } from "./main.js"
export { app }