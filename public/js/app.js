var app = angular.module("app", ["ui.router", "ngMaterial"]);
app.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider) {
	$stateProvider
		.state("chat", {
			url: "/chat/:nickname",
			templateUrl: "partials/chat.html",
			controller: function($scope, $stateParams, $rootScope) {
				var socket = io();
				$scope.nickname = $stateParams.nickname;
				console.log($scope.nickname);
				$scope.message = ""
				$scope.messages = [];
				$scope.publicMessages = [];
				$scope.privateMessages = {};
				$scope.chater = "";
				$scope.allUsers = $rootScope.allUsers || [];
				$scope.send = function() {
					if ($scope.chater) {
						socket.emit("addMessage", {"message": $scope.message, "nickname": $scope.nickname, "received": $scope.chater});
						if (!$scope.privateMessages[$scope.chater])
							$scope.privateMessages[$scope.chater] = [];
						$scope.privateMessages[$scope.chater].push($scope.message);
						$scope.message = "";
						$scope.update();
						return;
					}
					socket.emit("addMessage", {"message": $scope.message, "nickname": $scope.nickname});
					$scope.publicMessages.push({"message":$scope.message, "nickname":$scope.nickname});
					$scope.message = "";
					$scope.update();
				}
				socket.on("Message", function(data) {
					$scope.$apply(function() {
						if(data.received) {
							if(!$scope.privateMessages[data.received])
								$scope.privateMessages[data.received] = [];
							$scope.privateMessages[data.received].push(data.message);
						}
						else {
							$scope.publicMessages.push({message: data.message, nickname: data.nickname});
						}
						if (data.allUsers)
							$scope.allUsers = data.allUsers;
						$scope.update();
					});
				})
				$scope.chatwith = function(user) {
					if(user == "群聊") {
						$scope.messages = $scope.publicMessages;
						$scope.chater = "";
						return;
					}
					if (!$scope.privateMessages[user])
						$scope.privateMessages[user] = [];
					$scope.messages = $scope.privateMessages[user];
					$scope.chater = user;
				}
				$scope.update = function() {
					if ($scope.chater) {
						$scope.messages = $scope.privateMessages[$scope.chater];
					}
					else {
						$scope.messages = $scope.publicMessages;
					}
				}
			}
		})
})
/*app.controller("chat", chat);
function chat($scope) {
	var socket = io();
	$scope.message = "test";
	$scope.messages = [];
	$scope.send = function() {
		socket.emit("addMessage", {"message": $scope.message});
		$scope.messages.push($scope.message);
		$scope.message = "";
	}
	socket.on("Message", function(data) {
		console.log("receive message");
//	console.log(data);
		$scope.$apply(function() {
			$scope.messages.push(data.message);
		});
/*		console.log($scope.messages);
	})
}*/