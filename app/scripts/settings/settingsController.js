angular.module('ONApp').controller('settingsController', ['$rootScope', '$scope', '$mdDialog', 'CONSTANTS', 'storageService', function ($rootScope, $scope, $mdDialog, CONSTANTS, storageService) {

    $scope.notesFolder = storageService.getNotesFolder();

    $rootScope.$on(CONSTANTS.NOTES_LOADED, function () {
        $scope.notesFolder = storageService.getNotesFolder();
    });

    $scope.closeSettings = function () {
        $mdDialog.hide();
    }

}]);
