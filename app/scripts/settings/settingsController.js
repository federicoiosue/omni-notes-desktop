angular.module('ONApp').controller('settingsController', ["$scope", '$q', '$log', '$mdDialog', function ($scope, $q, $log, $mdDialog) {
    $log.debug('settings loaded');

    $scope.closeSettings = function () {
        $mdDialog.hide();
    };

}]);
