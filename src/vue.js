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

Vue.component("predictionTemplate", {
	props: ['prediction', 'imageURL', 'actual'],
	template: '<div><p>Guess:{{prediction}}</p><img v-bind:src=imageURL><p>Actual:{{actual}}</div>'
});
Vue.directive('visible', function(el, binding) {
	el.style.visibility = !!binding.value ? 'visible' : 'hidden';
});
let checkLocalStorage = (string) => {
	if (localStorage.getItem(string) != undefined) {
		return true
	}
	return false;
}

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
		trainEnabled: false,
		predictEnabled: false,
		userUpload: false,
		epochLimits: [5, 10, 15, 20, 25],
		dataLimits: [100, 200, 250, 300, 350],
		epochSelected: 15,
		dataSelected: 250,
		userID: 0
	},
	computed:{
		UserPredictEnabled: function(){
			return (this.trainEnabled && this.userUpload);
		}
	},
	methods: {
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
			if (this.subreddits.length == 0) { return; }
			initModel();
		},
		predictImage() {
			predictTest();
		},
        predictUploadButton() {
			predictUpload();
		},
		addSubreddit() {
			if (this.toAdd != "" && !this.subreddits.includes(this.toAdd)) {
				this.subreddits.push(this.toAdd);
			}
		},
		onFileChange(e){
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = imageLoaded;
			
		},
		removeSubreddit() {
			for (let val = 0; val < this.subreddits.length; val++) {
				if (this.subreddits[val] == this.name) {
					this.subreddits.splice(val, 1);
				}
			}
		},
		GetUserID() {
			if (checkLocalStorage("sru4607-proj2")) {
				this.userID = localStorage.getItem("sru4607-proj2");
			}
			else {
				this.userID = Math.floor(Math.random() * 1000000000000);
				localStorage.setItem("sru4607-proj2", this.userID);
			}
		},
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
		SetSavedImage() {
			localStorage.setItem("sru4607-proj2-image", this.upload);
		}
	},
	created() {
		this.LoadStuff();
		this.GetUserID();
		this.GetSavedImage();
		if (checkLocalStorage("sru4607-proj2-image")) {
			this.image = localStorage.getItem("sru4607-proj2-image");
		}
	}
});

function imageLoaded(e){
	let modDataURL = e.target.result.replace("/^data:image\/(png|jpg);base64,/", "");
	app.upload = modDataURL;
	app.SetSavedImage();
	app.image =  modDataURL;
	app.userUpload = true;
	
}

import { initModel, LoadModel, predictTest, predictUpload, TrainModel, CreateModel } from "./main.js"
export { app }