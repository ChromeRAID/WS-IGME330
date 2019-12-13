//A simple vue to hold and update stats about the usage of the site
const app = new Vue({
    el: '#root',
    data: {
        epochHist: {},
        dataHist: {},
        subHist: {}
    }
});
//On any updates to the stats call the respective methods
database.ref("stats").on("value",dataChanged,firebaseError);
//If there is an error reading the data
function firebaseError(error) {
   
}
//On reading data set the vue values
function dataChanged(data){
    app.epochHist = data.val().epochHist;
    app.dataHist = data.val().dataHist;
    app.subHist = data.val().subreddits;
}