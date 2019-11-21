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

}