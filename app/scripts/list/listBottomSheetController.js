angular.module('ONApp').controller('listBottomSheetController', ['$rootScope', '$scope', '$q', '$log', '$mdBottomSheet', 'navigationService', function ($rootScope, $scope, $q, $log, $mdBottomSheet, navigationService) {

    $scope.bottomSheetItems = [{
        method: 'setCategory',
        params: '',
        title: 'Change category',
        icon: 'label',
        show: true
    }, {
        method: 'archiveNotes',
        params: '',
        title: 'Archive',
        icon: 'archive',
        show: navigationService.getNavigation().title === 'Notes'
    }, {
        method: 'restoreFromArchiveNotes',
        params: '',
        title: 'Restore from archive',
        icon: 'unarchive',
        show: navigationService.getNavigation().title === 'Archive'
    }, {
        method: 'trashNotes',
        params: '',
        title: 'Trash',
        icon: 'delete',
        show: navigationService.getNavigation().title !== 'Trash'
    }, {
        method: 'restoreFromTrashNotes',
        params: '',
        title: 'Restore from trash',
        icon: 'delete_sweep',
        show: navigationService.getNavigation().title === 'Trash'
    }];


    $scope.actionSelected = function (bottomSheetItem) {
        $mdBottomSheet.hide(bottomSheetItem.method);
    };

}]);
