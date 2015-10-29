var baseUrl = "http://localhost:8080/api/photos"

angular.module('photoFactory', [])

	.factory('Photos', function($http){
		return {
			get : function(){
				return $http.get(baseUrl)
				console.log("testing")
			},
			create : function(photoData) {
				return $http.post(baseUrl, photoData)
			},
			destroy : function(id) {
				return $http.delete(baseUrl + id)
			}
			
		}
	})