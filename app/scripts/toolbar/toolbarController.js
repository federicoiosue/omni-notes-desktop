angular.module('ONApp').controller('toolbarController', ['$rootScope', '$scope', '$q', '$log', '$window', '$mdDialog', 'CONSTANTS', 'notesService', 'hotkeys', function($rootScope, $scope, $q, $log, $window, $mdDialog, CONSTANTS, notesService, hotkeys) {

    $scope.showSearch = false;
    $scope.multiSelection = false;
    $scope.searchQuery;

    // Keyboard shortcuts
    hotkeys.add({
        combo: 'ctrl+f',
        description: 'Toggle search',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
            $scope.showSearch = !$scope.showSearch;
        }
    });

    $rootScope.$on(CONSTANTS.NOTES_SELECTED, function(event, notes) {
        $scope.multiSelection = notes.length > 0;
        $scope.multiSelectionNumber = notes.length;
    });

    $rootScope.$on(CONSTANTS.NAVIGATION_CHANGED, function() {
        $scope.showSearch = false;
    });

    $scope.exit = function() {
        $window.close();
    }

    $scope.queryChanged = function() {
        var regexp = new RegExp(escapeSearchQuery($scope.searchQuery));
        notesService.filterNotes(function(note) {
            return (note.title && regexp.test(note.title)) || (note.content && regexp.test(note.content));
        });
    }

    $scope.$watch('showSearch', function(show) {
        if (show) {
            $rootScope.$emit(CONSTANTS.NOTES_SELECTED_CONFIRM, false);
        } else {
            $scope.searchQuery = '';
            $rootScope.$emit(CONSTANTS.NOTES_SEARCH_CANCELED);
        }
    });

    $scope.toggleHelp = function() {
        $log.info(hotkeys);
        hotkeys.toggleCheatSheet();
    }

    $scope.confirmMultiSelection = function(confirmed) {
        $rootScope.$emit(CONSTANTS.NOTES_SELECTED_CONFIRM, confirmed);
    }

    $scope.sort = function() {
        $mdDialog.show({
            controller: 'sortController',
            templateUrl: 'app/scripts/toolbar/sort.html',
            clickOutsideToClose: true
        });
    }

    var escapeSearchQuery = function(input) {
        return input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

}]);
