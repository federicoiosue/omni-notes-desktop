angular.module('ONApp').controller('drawerController', ['$rootScope', '$scope', '$q', '$log', '$mdDialog', 'notesService', 'CONSTANTS', 'navigationService', function ($rootScope, $scope, $q, $log, $mdDialog, notesService, CONSTANTS, navigationService) {

    $scope.menu = [{
        filterPredicate: function (note) {
            return !note.archived && !note.trashed;
        },
        title: 'Notes',
        icon: 'insert_drive_file',
        fabVisible: true
    }, {
        filterPredicate: function (note) {
            return note.alarm;
        },
        title: 'Reminders',
        icon: 'alarm',
        fabVisible: true
    }, {
        filterPredicate: function (note) {
            return note.archived && !note.trashed;
        },
        title: 'Archive',
        icon: 'archive',
        fabVisible: false
    }, {
        filterPredicate: function (note) {
            return note.trashed;
        },
        title: 'Trash',
        icon: 'delete',
        fabVisible: false
    }, {
        filterPredicate: function (note) {
            return !note.category;
        },
        title: 'Uncategorized',
        icon: 'label_outline',
        fabVisible: true
    }];

    $scope.menuFooter = [{
        method: 'showSettings',
        title: 'Settings',
        icon: 'settings'
    }];

    $scope.categories = {};

    $rootScope.$on(CONSTANTS.NOTES_LOADED, function (event, notes) {
        $scope.categories = notesService.getCategories();
        filterOnNotesEvent();
    });

    $rootScope.$on(CONSTANTS.NOTE_MODIFIED, function (event, notes) {
        filterOnNotesEvent();
    });

    $rootScope.$on(CONSTANTS.NOTES_SEARCH_CANCELED, function (event) {
        filterOnNotesEvent();
    });

    function filterOnNotesEvent() {
        var navigationItem = navigationService.getNavigation();
        var navigationItemMenu = _.find($scope.menu, {
            title: navigationItem.title
        });
        if (navigationItemMenu) {
            $scope.filterNotes(navigationItemMenu);
        } else {
            $scope.filterCategory(navigationItem);
        }
    }

    $rootScope.$on(CONSTANTS.CATEGORY_MODIFIED, function (event, categories) {
        $scope.categories = categories;
    });

    $scope.filterNotes = function (item) {
        notesService.filterNotes(item.filterPredicate);
        navigationService.setNavigation(item);
    };

    $scope.filterCategory = function (category) {
        notesService.filterNotes(function (note) {
            return note.category && note.category.id === category.id;
        });
        navigationService.setNavigation(category);
    };

    $scope.isCurrentNavigation = function (item) {
        return navigationService.isCurrentNavigation(item);
    };

    $scope.editCategory = function (category) {
        $mdDialog.show({
            templateUrl: 'app/scripts/categories/category.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            controller: 'categoryController',
            locals: {
                category: category
            }
        })
    };

    $scope.showSettings = function (ev) {
        $mdDialog.show({
            templateUrl: 'app/scripts/settings/settings.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };

}]);
