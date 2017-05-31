angular.module('ONApp').controller('listController', ['$http', '$timeout', '$rootScope', '$scope', '$q', '$log', '$window', 'CONSTANTS', 'notesService', 'storageService', '$mdDialog', '$mdBottomSheet', '$mdToast', 'hotkeys', 'navigationService', 'hotkeysRegistrationService',
    function ($http, $timeout, $rootScope, $scope, $q, $log, $window, CONSTANTS, notesService, storageService, $mdDialog, $mdBottomSheet, $mdToast, hotkeys, navigationService, hotkeysRegistrationService) {

        $scope.notesBackupFolder = storageService.getNotesFolder();
        $scope.attachmentsRoot = storageService.getAttachmentsFolder();
        $scope.notes = [];
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
            $scope.dynamicItems = new DynamicItems();
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
                .finally(function () {
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

        let DynamicItems = function () {
            this.loadedPages = {};
            this.numItems = 0;
            this.PAGE_SIZE = CONSTANTS.PAGE_SIZE;
            this.after = '';
            this.fetchNumItems_();
        };

        DynamicItems.prototype.getItemAtIndex = function (index) {
            let pageNumber = Math.floor(index / this.PAGE_SIZE);
            let page = this.loadedPages[pageNumber];
            if (page) {
                return page[index % this.PAGE_SIZE];
            } else if (page !== null) {
                this.fetchPage_(pageNumber);
            }
        };

        DynamicItems.prototype.getLength = function () {
            return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function (pageNumber) {
            this.loadedPages[pageNumber] = null;
            this.loadedPages[pageNumber] = [];
            let pageOffset = pageNumber * this.PAGE_SIZE;

            let items = _.slice($scope.notes, pageOffset, pageOffset + this.PAGE_SIZE);
            for (let i in items) {
                this.loadedPages[pageNumber].push(items[i]);
            }
        };

        DynamicItems.prototype.fetchNumItems_ = function () {
            this.numItems = $scope.notes.length;
        };

        // Workaround for vinrtual-repeat height: https://github.com/angular/material/issues/4314
        this.getListHeight = function() {
            return {height: '' + ($window.innerHeight - 72) + 'px'};
        };
        $window.addEventListener('resize', onResize);
        function onResize() {
            $scope.$digest();
        }
        $scope.$on('$destroy', function() {
            $window.removeEventListener('resize', onResize);
        });

        notesService.loadNotes($scope.notesBackupFolder);

    }]);
