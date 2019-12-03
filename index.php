<!DOCTYPE html>
<html lang="en">

	<head>
		<!--Let browser know website is optimized for mobile-->
		<meta name="viewport" content="width=device-width, initial-scale=1.0"
			charset="utf-8" />
		<title>Giphy Finder</title>
		<!-- Vue Import-->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
		<!--Import Google Icon Font-->
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
			rel="stylesheet">
		<!--Import materialize.css-->
		<link type="text/css" rel="stylesheet" href="css/materialize.min.css"
			media="screen,projection" />
	</head>


	<body>

		<div class="row">

			<div class="col s5">
				<h2>Train Model</h2>
				<form action="#">
					<p>
						<label>
							<input class="with-gap" name="group1"
								type="radio" />
							<span>Option1</span>
						</label>
					</p>
					<p>
						<label>
							<input class="with-gap" name="group1"
								type="radio" />
							<span>Option2</span>
						</label>
					</p>
					<p>
						<label>
							<input class="with-gap" name="group1"
								type="radio" />
							<span>Option 3</span>
						</label>
					</p>
					<p>
						<label>
							<input name="group1" type="radio"
								disabled="disabled" />
							<span>Option 4</span>
						</label>
					</p>
				</form>
				<button class="btn waves-effect waves-light" type="submit"
					name="action">Submit
					<i class="material-icons right">send</i>
				</button>
			</div>

			<div class="col s5">
				<h1>Upload Picture</h1>
				<div id='root'>
					<div id="console">
						<img class="responsive-img" id="img" v-bind:src="image" crossorgin="Anonymous"
							width="500" height="500" />
					</div>
					<div class="input-field col s12">

					<p><input class="btn waves-effect waves-light" id="input" type="file"
							accept='image/jpeg, image/png' size="50"
							maxlength="50" autofocus
							value="Upload image here" /></p>
					<select class="browser-default" onchange="selectChange(this)"
						v-model:value="selected">
						<option v-for="item in options"
							v-bind:value="item.value">{{item.text}}</option>
					</select>
					<span>Selected: {{ selected }}<br></span>
					<button class="btn waves-effect waves-light" type="submit" @click='search'>Search</button>
					<button class="btn waves-effect waves-light" type="submit" @click='run'>Run</button>
					<p id="output"></p>

				</div>
			</div>

		</div>

		<canvas id="mainCanvas" width=128 height=128>

		</canvas>
		<!-- #1 - link to Firebase goes here  -->
		<script
			src="https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js"></script>
		<script
			src="https://www.gstatic.com/firebasejs/7.4.0/firebase-auth.js"></script>
		<script
			src="https://www.gstatic.com/firebasejs/7.4.0/firebase-database.js"></script>

		<script>
			function loadSelected() {
				let savedID = localStorage.getItem("sru-proj2");
				if (savedID == undefined) {
					localStorage.setItem("sru-proj2", Math.floor(Math.random() * 1000000000));
					return;
				}
				let path = 'savedValue/' + savedID;
				firebase.database().ref(path).on("value", getData);

			}
			/* #2 - The rest of the Firebase setup code goes here */
			// Your web app's Firebase configuration
			var firebaseConfig = {
				apiKey: "AIzaSyAajUn4yXP77CnJZFKQckx9O1NqLr0ynAo",
				authDomain: "fir-exer-f2cb4.firebaseapp.com",
				databaseURL: "https://fir-exer-f2cb4.firebaseio.com",
				projectId: "fir-exer-f2cb4",
				storageBucket: "fir-exer-f2cb4.appspot.com",
				messagingSenderId: "1084930185158",
				appId: "1:1084930185158:web:5a83f966ca3cc2a7c444c7"
			};
			// Initialize Firebase
			firebase.initializeApp(firebaseConfig);

			let URLStart = `https://dog.ceo/api/breed/`
			let URLEnd = `/images`;
			const app = new Vue({
				el: '#root',
				data: {
					result: [],
					selected: 'hound',
					options: [
						{ text: 'hound', value: 'hound' },
						{ text: 'terrier', value: 'terrier' },
						{ text: 'spaniel', value: 'spaniel' },
						{ text: 'retriever', value: 'retriever' },
						{ text: 'labrador', value: 'labrador' }

					],
					url: URL,
					image: "https://i.imgur.com/JlUvsxa.jpg"

				},
				created() {
					loadSelected();
				},
				methods: {
					search() {
						//if (! this.term.trim()) return;
						fetch(URLStart + this.selected + URLEnd)
							.then(response => {
								if (!response.ok) {
									throw Error(`ERROR: ${response.statusText}`);
								}
								return response.json();
							})
							.then(json => {
								this.result = json;
								let arrayImages = json.message;
								this.image = arrayImages[Math.floor(arrayImages.length * Math.random())]



							})
					}, // end search
					run() {
						let img = document.querySelector("#img").src;
						//let canvas = document.querySelector("#mainCanvas");
						//let ctx = canvas.getContext("2d");
						//ctx.drawImage(img,0,0,128,128);
						//console.log(ctx.getImageData(0,0,128,128));
						let imageURL = "https://images.dog.ceo/breeds/hound-blood/n02088466_7731.jpg";

						downloadedImg = new Image;
						downloadedImg.crossOrigin = "Anonymous";
						downloadedImg.addEventListener("load", imageReceived, false);
						downloadedImg.src = imageURL;
					}
				}
			});
			function selectChange(e) {
				let savedID = localStorage.getItem("sru-proj2");
				let path = 'savedValue/' + savedID;
				firebase.database().ref(path).set({
					selected: document.querySelector("select").value
				});
			}
			function getData(data) {
				if (data.val() != null) {
					app.selected = data.val().selected;
					app.search();
					return;
				}
				app.selected = "hound";
				app.search();
			}
			function error(val) {
				console.log(error);
			}
			function imageReceived() {
				let canvas = document.createElement("canvas");
				let context = canvas.getContext("2d");

				canvas.width = downloadedImg.width;
				canvas.height = downloadedImg.height;

				context.drawImage(downloadedImg, 0, 0);
				document.body.appendChild(canvas);

				try {
					localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
				}
				catch (err) {
					console.log("Error: " + err);
				}
			}
		</script>



		<!-- The core Firebase JS SDK is always required and must be listed first -->
		<!--Tensorflow-->
		<script
			src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
		<script
			src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>
		<!--<script type=module src="src/main.js"></script>-->



		<!-- TODO: Add SDKs for Firebase products that you want to use
	https://firebase.google.com/docs/web/setup#available-libraries -->
		<!--JavaScript at end of body for optimized loading-->
		<script type="text/javascript" src="js/materialize.min.js"></script>

	</body>

</html>