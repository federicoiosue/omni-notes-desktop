angular.module('ONApp').controller('settingsController', ['$rootScope', '$scope', '$mdDialog', 'CONSTANTS', 'storageService', function ($rootScope, $scope, $mdDialog, CONSTANTS, storageService) {

    $scope.notesFolder = storageService.getNotesFolder();

    $rootScope.$on(CONSTANTS.NOTES_LOADED, function () {
        $scope.notesFolder = storageService.getNotesFolder();
    });

    $scope.closeSettings = function () {
        $mdDialog.hide();
    };

    $scope.showChangelog = function() {
        $mdDialog.show({
            controllerAs: 'dialogCtrl',
            controller: function ($mdDialog) {
                this.confirm = function () {
                    $mdDialog.hide();
                };
            },
            autoWrap: true,
            multiple: true,
            clickOutsideToClose: true,
            templateUrl: 'app/scripts/settings/changelog.html'
        });
    }

}]);
