<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Giphy Finder</title>
    <!-- Vue Import-->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>


<body>
    <h1>Upload Picture</h1>
    <div id='root'>
        <p><input id="input" type="file" accept='image/jpeg, image/png' size="50" maxlength="50" autofocus
                value="Upload image here" /></p>
        <select onchange="selectChange(this)" v-model:value="selected">
            <option v-for="item in options" v-bind:value="item.value">{{item.text}}</option>
        </select>
        <span>Selected: {{ selected }}</span>
        <button type="submit" @click='search'>Search</button>
        <button type="submit" @click='run'>Run</button>
        <p id="output"></p>
        <div id="console">
        	<img id="img" v-bind:src="image" crossorgin = "Anonymous" width="227" height="227" />
    	</div>
    </div>
    <canvas id="mainCanvas" width=128 height=128>
    	
    </canvas>
		<!-- #1 - link to Firebase goes here  -->
<script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-database.js"></script>

<script>
		function loadSelected(){
			let savedID = localStorage.getItem("sru-proj2");
			if(savedID == undefined){
				localStorage.setItem("sru-proj2",Math.floor(Math.random()*1000000000));
				return;
			}
			let path = 'savedValue/' + savedID;
			firebase.database().ref(path).on("value",getData);
			
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
                    fetch(URLStart+this.selected+URLEnd)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(`ERROR: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(json => {
                            this.result = json;
							let arrayImages = json.message;
							this.image = arrayImages[Math.floor(arrayImages.length*Math.random())]
							
							

                        })
                }, // end search
				run(){
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
		function selectChange(e){
			let savedID = localStorage.getItem("sru-proj2");
			let path = 'savedValue/' + savedID;
			firebase.database().ref(path).set({
				selected: document.querySelector("select").value
			});
		}
		function getData(data){
			if(data.val() != null){
				app.selected = data.val().selected;
				app.search();
				return;
			}
			app.selected = "hound";
			app.search();
		}
		function error(val){
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
		  catch(err) {
			console.log("Error: " + err);
		  }  
		}
    </script>



    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <!--Tensorflow-->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>
	<!--<script type=module src="src/main.js"></script>-->



    <!-- TODO: Add SDKs for Firebase products that you want to use
    https://firebase.google.com/docs/web/setup#available-libraries -->

</body>

</html>