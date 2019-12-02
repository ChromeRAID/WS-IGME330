  //Breed Lists
export {init};
function init(){
let breeds = ["hound","terrier","spaniel","retriever","labrador"];
let images = {};
let trainingImages = [];
let validationImages = [];
let IMAGE_SIZE = 128*128;
for(let i = 0; i<breeds.length; i++){
	
    getData(breeds[i]);
}

function getData(breed){
    let url = "https://dog.ceo/api/breed/"+breed+"/images";

    //Create a new XHR object
    let xhr = new XMLHttpRequest();

    //Set onload Handler
    xhr.onload = dataLoaded;

    //Set the onerror handler
    xhr.onerror = dataError;

    //Open connection and set the request
    xhr.open("GET",url);
    xhr.send();
	
	
}

function dataError(){
    console.log("ERROR LOADING DATA");
    console.log("ABORTING...");
    console.log("ABORTED"); 
}

function dataLoaded(e){
    let breed = e.target.responseURL.split("/")[5];
    let JSONObj = JSON.parse(e.target.responseText);
    images[breed] = JSONObj.message;
	parse_images(JSONObj.message);

}

function parse_images(array){
	let img = new Image();
	let canvas = document.querySelector("#mainCanvas");
	let ctx = canvas.getContext("2d");
	let datasetBytesBuffer = new ArrayBuffer(IMAGE_SIZE * 4 * array.length);
	let datasetImages;
	
	let headers = new Headers({'Access-Control-Allow-Orgin':'*'});
	let options = {
		method: 'GET',
  		mode: 'cors',
		headers: headers,
  		cache: 'default'
	};
	
	let request = new Request(array[0]);
	let imageStr;
	let image;
	fetch(request,options).then((response) => {
		response.arrayBuffer().then((buff) => {
			imageStr = arrayBufferToBase64(buff);
			image = document.createElement("img");
			image.src="data:image/jpeg;" +imageStr;
			document.appendChild(image);
	    });		   
    });
//	for(let i = 0; i<array.length;i++){
//		let imageRequest = new Promise((resolve,reject)=>{
//			img.onload = () => {
//				img.width = img.naturalWidth;
//				img.height = img.naturalHeight;
//
//				canvas.width = img.width;
//				canvas.height = img.height;
//				
//
//				ctx.drawImage(img,0,0,128,128);
//
//				let imageData = ctx.getImageData(0,0,128,128);
//
//				for(let j = 0; j<imageData.data.length; j++ ){
//					datasetBytesBuffer[j+IMAGE_SIZE*i] = imageData.data[j]/255;
//				}
//				datasetImages = new Float32Array(datasetBytesBuffer);
//				
//				resolve();
//			};
//			img.src = array[i];
//					
//			
//		});
//	}
  //parts = tf.strings.split(file_path, '/');
  //label = parts[-2];

  //image = tf.io.read_file(filename);
  //image = tf.image.decode_jpeg(image);
  //image = tf.image.convert_image_dtype(image, tf.float32);
  //image = tf.image.resize(image, [128, 128]);
  //return image;
}
	
function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => binary += String.fromCharCode(b));

  return window.btoa(binary);
};

//let file_path = images["hound"];
//let image, label = parse_images(file_path);
function show(image, label){
  plt.figure();
  plt.imshow(image)
  plt.title(label.numpy().decode('utf-8'));
  plt.axis('off');
}

//show(image, label);

}

