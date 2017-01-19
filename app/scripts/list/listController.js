angular.module('ONApp').controller('listController', ['$rootScope', '$scope', '$q', '$log', 'CONSTANTS', 'notesService', 'storageService', '$mdDialog', '$mdBottomSheet', '$mdToast', 'hotkeys', 'navigationService', 'hotkeysRegistrationService', function ($rootScope, $scope, $q, $log, CONSTANTS, notesService, storageService, $mdDialog, $mdBottomSheet, $mdToast, hotkeys, navigationService, hotkeysRegistrationService) {

    $scope.notesBackupFolder = storageService.getNotesFolder();
    $scope.attachmentsRoot = storageService.getAttachmentsFolder();
    $scope.notes = [];
    $scope.shownNotes = [];
    $scope.selectedNotes = [];
    $scope.multiSelection = false;
    $scope.currentNavigation = navigationService.getNavigation();
    $scope.currentSorting = storageService.get('sortPredicate') || 'title';

    // Keyboard shortcuts
    function createHotkeysCheatsheet() {
        hotkeysRegistrationService.createCheatSheet();
    }

    createHotkeysCheatsheet();

    hotkeys.add({
        combo: 'ctrl+n',
        description: 'New note',
        callback: function () {
            $scope.editNote();
        }
    });

    $rootScope.$on(CONSTANTS.NOTES_FILTERED, function (event, notes) {
        $scope.cancelMultiSelection();
        $scope.notes = notes;
        $scope.shownNotes = _.slice($scope.notes, 0, 20);
        $scope.$applyAsync();
    });

    $rootScope.$on(CONSTANTS.NOTES_SORTED, function (event, notes) {
        $scope.cancelMultiSelection();
        $scope.notes = notes;
        $scope.currentSorting = storageService.get('sortPredicate') || 'title';
        $scope.$applyAsync();
    });

    $rootScope.$on(CONSTANTS.NOTES_SELECTED_CONFIRM, function (event, confirmed) {
        if (confirmed) {
            $scope.showGridBottomSheet();
        } else {
            $scope.cancelMultiSelection();
        }
    });

    $rootScope.$on(CONSTANTS.NAVIGATION_CHANGED, function (event, navigationItem) {
        $scope.currentNavigation = navigationItem;
    });

    $scope.noteClicked = function ($event, note) {
        if (!$scope.multiSelection) {
            $scope.editNote(note, $event.currentTarget);
        } else {
            selectNote(note);
        }
    };

    $scope.noteRightClicked = function (note) {
        if (!$scope.multiSelection) {
            $scope.multiSelection = true;
        }
        selectNote(note);
    };

    var selectNote = function (note) {
        if (!_.includes($scope.selectedNotes, note)) {
            $scope.selectedNotes.push(note);
        } else {
            $scope.selectedNotes = _.without($scope.selectedNotes, note);
            if (!$scope.selectedNotes.length) {
                $scope.cancelMultiSelection();
                return;
            }
        }
        $rootScope.$emit(CONSTANTS.NOTES_SELECTED, $scope.selectedNotes);
    };

    $scope.cancelMultiSelection = function () {
        $scope.selectedNotes = [];
        $scope.multiSelection = false;
        $rootScope.$emit(CONSTANTS.NOTES_SELECTED, []);
    };

    $scope.showAsSelected = function (note) {
        return $scope.multiSelection && _.includes($scope.selectedNotes, note);
    };

    $scope.editNote = function (note, currentTarget) {
        currentTarget = currentTarget || '#fab';
        $scope.cancelMultiSelection();
        $mdDialog.show({
            templateUrl: 'app/scripts/detail/detail.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            controller: 'detailController',
            openFrom: currentTarget,
            locals: {
                note: note
            }
        })
        .finally(function() {
            createHotkeysCheatsheet();
        });
    };

    // Bulk actions

    $scope.showGridBottomSheet = function () {
        $mdBottomSheet.show({
            templateUrl: 'app/scripts/list/list-bottom-sheet-template.html',
            controller: 'listBottomSheetController'
        }).then(function (actionMethod, currentScope) {
            $scope[actionMethod]();
        });
    };

    $scope.archiveNotes = function () {
        notesService.archiveNotes($scope.selectedNotes, true);
        $scope.selectedNotes = [];
    };

    $scope.restoreFromArchiveNotes = function () {
        notesService.archiveNotes($scope.selectedNotes, false);
        $scope.selectedNotes = [];
    };

    $scope.trashNotes = function () {
        notesService.trashNotes($scope.selectedNotes, true);
        $scope.selectedNotes = [];
    };

    $scope.restoreFromTrashNotes = function () {
        notesService.trashNotes($scope.selectedNotes, false);
        $scope.selectedNotes = [];
    };

    $scope.setCategory = function () {
        $mdDialog.show({
            controller: 'categoriesSelectionController',
            templateUrl: 'app/scripts/categories/categoriesSelection.html',
            clickOutsideToClose: true,
            locals: {
                category: {},
                allowAdd: true
            }
        })
            .then(function (category) {
                if (category) {
                    $log.debug('Set category "' + category.name);
                    notesService.setCategory($scope.selectedNotes, category);
                    $scope.selectedNotes = [];
                } else {
                    $mdDialog.show({
                        templateUrl: 'app/scripts/categories/category.html',
                        clickOutsideToClose: true,
                        controller: 'categoryController',
                        locals: {
                            category: {}
                        }
                    }).then(function (category) {
                        $scope.setCategory();
                    });
                }
            });
    };

    $scope.isFabVisible = function () {
        return $scope.currentNavigation.fabVisible;
    };

    $scope.openAttachment = function (attachment) {
        storageService.openAttachment(attachment);
    };

    $scope.loadMore = function () {
        $scope.shownNotes = _.concat($scope.shownNotes, _.slice($scope.notes, $scope.shownNotes.length, $scope.shownNotes.length + 20));
    };

    notesService.loadNotes($scope.notesBackupFolder);

}]);
