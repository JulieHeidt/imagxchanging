angular
	.module('imagXchange')
	.controller('MainController', MainController)

MainController.$inject = ['$state', 'authFactory', '$rootScope']

function MainController($state, authFactory, $rootScope){
	
	var vm = this
	vm.user = {}
	vm.loggedIn = null
	vm.signup = signup
	vm.login = login
	vm.logout = logout
	vm.getUser = getUser
	vm.error = null

	$rootScope.$on('$stateChangeStart', function() {
		vm.loggedIn = authFactory.isLoggedIn();	
		getUser()
		vm.error = null	
	});	

	function logout(){
		$state.go('loggedOut')
		authFactory.logout();
		
	}

	function getUser(){
		authFactory.getUser()
		.then(function(response){
			console.log(response)
		})
	}

	function signup(){
		console.log("Hitting signup")
		authFactory.signup(vm.user.email, vm.user.password)

		.then(function(response){
			

			if(response.data.success){
				
				vm.login()
			} else {

				vm.error = response.data.message
			}
		})
	}

	function login(){
		console.log("Getting to login")
		authFactory.login(vm.user.email, vm.user.password)
		

		.then(function(response){
			if(response.data.success){
				

				$state.go("home")
			} else {

				
				vm.error = response.data.message

			}
		})
	}

}