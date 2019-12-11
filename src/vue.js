// Define a new component called button-counter
Vue.component('subredditTemplate', {
  	props: ['name'],
  	template: '<div><p>{{name}}</p><button @click=removeSubreddit</div>'
});

Vue.component("predictionTemplate",{
	props: ['prediction','imageURL','actual'],
	template: '<div></div>'
});

const app = new Vue({
	el: '#root',
	data: {
		result: [],
		selected: 'hound',
		subreddits: ["people","dogs","djhfiosd","cats","hsdjiodjaspdj","lego"],
		url: URL,
		guess: "WAITING FOR TRAINING",
		isLoading: false,
		loadingMessage: "",
		image: "https://i.imgur.com/JlUvsxa.jpg"

	},
	created: function(){
		//LoadStuff();
	},
	methods: {
		LoadStuff(){
			LoadModel();
		},
		async create() {	    
			setTimeout( async function(){
				await createModel();
			},1000);
		},
		async run() {	    
			setTimeout( async function(){
				await trainModel();
			},1000);
		},
		predictImage(){
			predictTest();
		},
		removeSubreddit(e){
			console.log(e);
		}
	}
});
