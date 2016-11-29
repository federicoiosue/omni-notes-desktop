ONApp.directive('materialFileInput', ['notesService', function(notesService) {
    return {
        restrict: 'E',
        scope: {
            notesFolder: '@'
        },
        template: '<input id="fileInput" type="file" class="ng-hide">' +
        ' <md-button id="uploadButton" class="md-primary" aria-label="attach_file">Choose file</md-button>' +
        ' <md-input-container md-no-float>' +
        ' <input id="textInput" ng-model="notesFolder" type="text" placeholder="No file chosen" ng-readonly="true"/>' +
        '</md-input-container>',

        link: function (scope, element) {
            var input = $(element[0].querySelector('#fileInput'));
            var button = $(element[0].querySelector('#uploadButton'));
            var textInput = $(element[0].querySelector('#textInput'));

            if (input.length && button.length && textInput.length) {
                button.click(function (e) {
                    input.click();
                });
                textInput.click(function (e) {
                    input.click();
                });
            }

            input.on('change', function (e) {
                var files = e.target.files;
                if (files[0]) {
                    scope.notesFolder = files[0].name;
                    var backupFolderPath = files[0].path.substr(0, files[0].path.lastIndexOf("/"));
                    notesService.loadNotes(backupFolderPath);
                } else {
                    scope.notesFolder = null;
                }
                scope.$apply();
            });
        }
    };
}]);
