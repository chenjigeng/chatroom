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
						$scope.privateMessages[$scope.chater].push({message: $scope.message, nickname: $scope.nickname});
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
						if(data.received == $scope.nickname) {
							console.log("receive message", data);
							if(!$scope.privateMessages[data.nickname])
								$scope.privateMessages[data.nickname] = [];
							$scope.privateMessages[data.nickname].push({message:data.message, nickname: data.nickname});
							console.log("privateMessages", $scope.privateMessages);
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
					console.log("chater:", $scope.chater);
					console.log("$scope.messages", $scope.messages);
				}
				$scope.update = function() {
					if ($scope.chater) {
						$scope.messages = $scope.privateMessages[$scope.chater];
					}
					else {
						$scope.messages = $scope.publicMessages;
					}
				}
				socket.on("userRemoved", function(data) {
					console.log($scope.nickname, "enter");
					$scope.$apply(function(){
					for (var i = 0; i < $scope.allUsers.length; i++)
			      if ($scope.allUsers[i] == data.nickname) {
			        $scope.allUsers.splice(i, 1);
			        break;
			      }
			    $scope.publicMessages.push({message:"有个玩家离开了聊天室", nickname:"系统"});
					})
				})
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