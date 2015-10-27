angular
	.module('imagXchange')
	.controller('PhotoController', PhotoController);
//inject the $http
PhotoController.$inject = [ '$state', '$http' ]
//PhotoController.$inject = [ 'photosFactory' ]

//refer to the photo module
function PhotoController( $state, $http ){
	
	var vm = this

	vm.photos = []
	vm.photo = {}
	vm.newPhoto = {}
	vm.$http = $http
	vm.getPhotos()

	
}

PhotoController.prototype.uploadPic = function( ) {
	var formData = new FormData( document.getElementById( "profileForm" ) )
	this.$http
		.post( "http://localhost:8080/api/photos/", { data: formData} )
	console.log("bananas")
}

//gets all photos 
PhotoController.prototype.getPhotos = function() {


	var vm = this

	vm.$http
		.get( "http://localhost:8080/api/photos" )
		.then( response => {
			vm.all = response.data
			console.log(response)
			console.log(vm.all)
	})
}

PhotoController.prototype.viewPhotos = function(id) {
	console.log("Working")

	var vm = this

	console.log("viewphotos function is running " + id)

	vm.$http
		.get( "http://localhost:8080/api/photos/" + id )

		.then( response => {

		vm.photo = response.data

			console.log(vm.photo)

		window.location.href = "#/photos/" + response.data._id

		})

}

PhotoController.prototype.buyPhoto = function(id) {
	console.log("buy button is hitting")

	var vm = this

	console.log(vm.photo.currentprice)

	if (vm.photo.currentprice >= vm.photo.startingprice){
	
		vm.photo.currentprice = (vm.photo.currentprice + 1)

		console.log(vm.photo.currentprice)	

	// return $http.post( "http://localhost:8080/api/photos/" + id,
	// vm.photo.currentprice

	}
}






