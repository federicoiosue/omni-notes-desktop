angular.module("ONApp").service('thumbnailService', ['$q', function ($q) {

    this.getAttachmentThumbnail = function (attachment, attachmentsFolder) {
        if (attachment.mime_type.match('image')) {
            return this.getImageThumbnail(attachment, attachmentsFolder);
        } else if (attachment.mime_type.match('pdf')) {
            return this.getPdfThumbnail(attachment, attachmentsFolder);
        } else if (attachment.mime_type.match('video')) {
            return this.getVideoThumbnail(attachment, attachmentsFolder);
        } else if (attachment.mime_type.match('audio')) {
            return this.getAudioThumbnail(attachment, attachmentsFolder);
        } else {
            return './app/assets/images/file.svg';
        }
    };

    this.getImageThumbnail = function (attachment, attachmentsFolder) {
        return attachmentsFolder + '/' + _.last(attachment.uriPath.split('/'));
    };

    this.getPdfThumbnail = function (attachment, attachmentsFolder) {
        var defer = $q.defer();
        require('pdfjs-dist');
        PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.min.js';
        var fs = require('fs');
        var file = attachmentsFolder + '/' + _.last(attachment.uriPath.split('/'));
        var data = new Uint8Array(fs.readFileSync(file));
        PDFJS.getDocument(data)
            .then(function (pdf) {
                return pdf.getPage(1);
            })
            .then(function (page) {
                defer.resolve(page);
            });
        return defer.promise;
    };

    this.getVideoThumbnail = function (attachment, attachmentsFolder) {
        return './app/assets/images/file-video.svg';
    };

    this.getAudioThumbnail = function (attachment, attachmentsFolder) {
        return './app/assets/images/file-music.svg';
    };

}]);
