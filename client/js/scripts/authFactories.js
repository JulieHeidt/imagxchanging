
angular.module('imagXchange')
.factory('authTokenFactory', authTokenFactory)
authTokenFactory.$inject = ['$window']
function authTokenFactory($window){

	var authTokenFactory = {}

	// get the token
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token')
	}

	// set the token
	authTokenFactory.setToken = function(token){
		if(token){
			$window.localStorage.setItem('token', token)
		} else {
			$window.localStorage.removeItem('token')
		}
	}

	return authTokenFactory
}



// ================================================
// ================================================
// ================================================


angular.module('imagXchange')
.factory('authInterceptorFactory', authInterceptorFactory)
authInterceptorFactory.$inject = ['$q', '$location', 'authTokenFactory']
function authInterceptorFactory($q, $location, authTokenFactory){

	var authInterceptorFactory = {}
	// attach the token to every request
	authInterceptorFactory.request = function(config){
		var token = authTokenFactory.getToken()
		if(token){
			config.headers['x-access-token'] = token;
		}
		return config
	}

	authInterceptorFactory.responseError = function(response){
		if(response.status == 403){
			$location.path('/login')
		}
		return $q.reject(response)
	}

	// redirect if the token doesn't authenticate

	return authInterceptorFactory
}



// ================================================
// ================================================
// ================================================




angular.module('imagXchange')
.factory('authFactory', authFactory)
authFactory.$inject = ['$http', '$q', 'authTokenFactory']
function authFactory($http, $q, authTokenFactory){

	var authFactory = {}

	authFactory.index = function(){
		return $http.get('http://localhost:8080/api/users')
	}
	// handles login
	authFactory.login = function(email, password){
		console.log("auth factory log in is running")
		
		
		return $http.post('http://localhost:8080/api/users/authenticate', {
			email: email,
			password: password
		}).then(function(response){
			authTokenFactory.setToken(response.data.token)
			console.log("token set")
			return response
		})
	}

	authFactory.signup = function(email, password){

		return $http.post('http://localhost:8080/api/users', {

			// username: username,
			email: email,
			password: password

		})

	}

	// handles logout
	authFactory.logout = function(){
		authTokenFactory.setToken()
	}

	// checks if a user is logged in
	authFactory.isLoggedIn = function(){
		if(authTokenFactory.getToken()){
			return true
		} else {
			return false
		}
	}

	// gets that user's info
	authFactory.getUser = function(){
		if(authTokenFactory.getToken()){
			return $http.get('http://localhost:8080/api/me')
		} else {
			return $q.reject({message: 'User has no token'})
		}
	}

	return authFactory
}