angular.module('ONApp').controller('detailController', ['$rootScope', '$scope', '$q', '$log', 'CONSTANTS', 'notesService', 'storageService', 'note', '$mdDialog', 'hotkeys', 'Upload', 'thumbnailService', function ($rootScope, $scope, $q, $log, CONSTANTS, notesService, storageService, note, $mdDialog, hotkeys, Upload, thumbnailService) {

    $scope.note = _.cloneDeep(note) || {};
    $scope.attachmentsRoot = storageService.getAttachmentsFolder();

    // Keyboard shortcuts
    hotkeys.add({
        combo: 'ctrl+s',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            $scope.saveNote();
        }
    });

    $scope.saveNote = function () {
        notesService.saveNote($scope.note, true);
        $mdDialog.hide();
    };

    $scope.addAttachment = function (files) {
        if (files && files.length) {
            if (!$scope.note.attachmentsList) {
                $scope.note.attachmentsList = [];
            }
            _.each(files, function (file) {
                var attachment = notesService.createNewAttachment(file, $scope.attachmentsRoot);
                if (attachment.mime_type == 'application/pdf') {
                    thumbnailService.generatePdfThumbnail(attachment, $scope.attachmentsRoot)
                        .then(function () {
                            $scope.note.attachmentsList.push(attachment);
                        });
                } else {
                    $scope.note.attachmentsList.push(attachment);
                }
            });
        }
    };

    $scope.openAttachment = function (attachment) {
        storageService.openAttachment(attachment);
    };

    $scope.deleteAttachment = function (attachmentToDelete) {
        $mdDialog.show({
            controllerAs: 'dialogCtrl',
            controller: function ($mdDialog) {
                this.confirm = function () {
                    $mdDialog.hide();
                };
                this.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            preserveScope: true,
            autoWrap: true,
            skipHide: true,
            clickOutsideToClose: true,
            templateUrl: 'app/scripts/detail/attachmentDeletionDialog.html'
        }).then(function () {
            $scope.note.attachmentsListOld = $scope.note.attachmentsListOld || [];
            $scope.note.attachmentsListOld.push(attachmentToDelete);
            $scope.note.attachmentsList = _.reject($scope.note.attachmentsList, function (attachment) {
                return attachment.id === attachmentToDelete.id;
            });
        });
    };

    $scope.setCategory = function () {
        $mdDialog.show({
            skipHide: true,
            controller: 'categoriesSelectionController',
            templateUrl: 'app/scripts/categories/categoriesSelection.html',
            clickOutsideToClose: true,
            locals: {
                category: $scope.note.category,
                allowAdd: false
            }
        }).then(function (category) {
            if (category) {
                $scope.note.category = category;
            }
        });
    };

}]);
