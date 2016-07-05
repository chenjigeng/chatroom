angular.module("app")
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/login");
		$stateProvider
			.state("login", {
				url:"/login",
				templateUrl: "partials/login.html",
				controller: function($rootScope ,$scope, $state) {
					console.log("enter");
					var socket = io();
					$scope.nickname = "";
					$scope.login = function() {
						socket.emit("addUser", {nickname: $scope.nickname}, function(data) {
							if (data.result) {
								console.log("gogo");
								$state.go("chat", {nickname: $scope.nickname});
								$rootScope.allUsers = data.allUsers;
							}
							else {
								$scope.error = "false";
							}
						});
					}
				}
			})
	})