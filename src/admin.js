const app = new Vue({
    el: '#root',
    data: {
        epochHist: {},
        dataHist: {},
        subHist: {}
    }
});

database.ref("stats").on("value",dataChanged,firebaseError);

function firebaseError(error) {
   
}

function dataChanged(data){
    app.epochHist = data.val().epochHist;
    app.dataHist = data.val().dataHist;
    app.subHist = data.val().subreddits;
}