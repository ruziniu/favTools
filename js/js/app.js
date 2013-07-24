// function Nav($scope){
// 	$scope.links = [
// 		{name:'天气',url:'weather.html'},
// 		{name:'计算器',url:'calc.html'},
// 		{name:'秒表',url:'countdown.html'},
// 		{name:'公交',url:'traffic.html'}
// 	];
// 	$scope.indexUrl = 'weather.html';
// 	$scope.changeTemp = function(tempUrl){
// 		$scope.indexUrl = tempUrl;
// 	};
// }


function Ctrl($scope) {
  $scope.templates =
    [ { name: 'weather', url: 'weather.html'}
    , { name: 'calc', url: 'calc.html'} ];
  $scope.template = $scope.templates[0];
}