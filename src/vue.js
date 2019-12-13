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
	template: '<div class="row"><div class="col s6"><h6>{{name}}</h6></div><div class="col s6"><input @click=removeSubreddit class="btn waves-effect waves-light" type="Submit" value="Remove"></div></div>'
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
		guess: "WAITING FOR TRAINING",
		appState: {loadingMessage: "", isLoading: false },
		upload: '',
		image: "https://i.imgur.com/JlUvsxa.jpg",
		toAdd: "",
		trainEnabled: false,
		predictEnabled: false,
		epochLimits: [5, 10, 15, 20, 25],
		dataLimits: [100, 200, 250, 300, 350],
		epochSelected: 15,
		dataSelected: 250,
		userID: 0
	},
	methods: {
		LoadStuff() {
			LoadModel();
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
		addSubreddit() {
			if (this.toAdd != "" && !this.subreddits.includes(this.toAdd)) {
				this.subreddits.push(this.toAdd);
			}
		},
		/*onFileChange(e) {
			let img = new Image();
			
			img.src = URL.createObjectURL(e.target.files[0])
			img.createImage();
			this.upload = img.src;
			
			//const x = 500;
			//imagedata_to_image(app.upload);
			//this.SetSavedImage();
			console.log(app.upload);
			//predictTest();
			/*let img = document.querySelector('image');
			let canvas = document.createElement("canvas");
			let ctx = canvas.getContext("2d");

			// Make sure canvas is as big as the picture
			canvas.width = x;
			canvas.height = x;

			// Draw image into canvas element
			ctx.drawImage(img, 0, 0, x, x);

			// Get canvas contents as a data URL
			let imgAsDataURL = canvas.toDataURL("image/png");
			this.upload = imgAsDataURL;
			this.image = this.upload;
			this.SetSavedImage();

		},*/
		onFileChange(e){
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = imageLoaded;
		},
		removeSubreddit() {
			for (let val = 0; val < app.subreddits.length; val++) {
				if (app.subreddits[val] == this.name) {
					app.subreddits.splice(val, 1);
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
}

import { initModel, LoadModel, predictTest, predictUpload, TrainModel, CreateModel } from "./main.js"
export { app }