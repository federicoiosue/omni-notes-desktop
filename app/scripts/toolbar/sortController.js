angular.module('ONApp').controller('sortController', ['$rootScope', '$scope', '$q', '$log', '$mdDialog', 'CONSTANTS', 'notesService', function ($rootScope, $scope, $q, $log, $mdDialog, CONSTANTS, notesService) {

    $scope.currentSortPredicate = notesService.getSortPredicate();
    $scope.currentSortDirection = notesService.getSortDirection();

    $scope.sortOptions = [{
        sortPredicate: CONSTANTS.SORT_TITLE,
        title: 'Title',
        icon: 'sort_by_alpha'
    }, {
        sortPredicate: CONSTANTS.SORT_ALARM,
        title: 'Reminder',
        icon: 'access_alarm'
    }, {
        sortPredicate: CONSTANTS.SORT_CREATION,
        title: 'Creation',
        icon: 'note_add'
    }, {
        sortPredicate: CONSTANTS.SORT_LAST_MODIFICATION,
        title: 'Last modification',
        icon: 'access_time'
    }];

    $scope.sortOptionDirections = [{
        direction: 'ASC',
        title: 'Acending',
        icon: 'keyboard_arrow_down'
    }, {
        direction: 'DESC',
        title: 'Descending',
        icon: 'keyboard_arrow_up'
    }];

    $scope.isCurrentSortOption = function (sortOption) {
        return $scope.currentSortPredicate == sortOption.sortPredicate;
    };

    $scope.isCurrentSortDirection = function (sortDirection) {
        return $scope.currentSortDirection == sortDirection.direction;
    };

    $scope.confirmSort = function () {
        notesService.sortNotes($scope.currentSortPredicate, $scope.currentSortDirection);
        $mdDialog.hide();
    };

    $scope.setSortOption = function (sortOption) {
        $scope.currentSortPredicate = sortOption.sortPredicate;
    };

    $scope.setSortOptionDirection = function (sortOptionDirection) {
        $scope.currentSortDirection = sortOptionDirection.direction;
    };

}]);
