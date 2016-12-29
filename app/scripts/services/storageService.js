angular.module("ONApp").service("storageService", ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {

    this.put = function (key, value) {
        localStorageService.set(key, value);
    };

    this.get = function (key) {
        return localStorageService.get(key);
    };

    this.getNotesFolder = function () {
        return this.get('notes_backup_folder') || __dirname + '/data';
    };

    this.getAttachmentsFolder = function () {
        return this.get('notes_backup_folder') + '/files/';
    };

    this.openAttachment = function (attachment) {
        function getCommandLine() {
            switch (process.platform) {
                case 'darwin':
                    return 'open';
                case 'linux':
                    return 'xdg-open';
                default:
                    return 'start';
            }
        }

        var exec = require('child_process').exec;
        var path = this.getAttachmentsFolder() + _.last(attachment.uriPath.split('/'));
        exec(getCommandLine() + ' ' + path);
    };

}]);
