  //Breed Lists
	
let breeds = ["hound","terrier","spaniel","retriever","labrador"];
let images = {};
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
	console.log(images[breed])

}

function parse_image(filename){
  parts = tf.strings.split(file_path, '/');
  label = parts[-2];

  image = tf.io.read_file(filename);
  image = tf.image.decode_jpeg(image);
  image = tf.image.convert_image_dtype(image, tf.float32);
  image = tf.image.resize(image, [128, 128]);
  return image, label;
}

console.log(images);
let file_path = images;
let image, label = parse_image(file_path);
function show(image, label){
  plt.figure();
  plt.imshow(image)
  plt.title(label.numpy().decode('utf-8'));
  plt.axis('off');
}

show(image, label);


