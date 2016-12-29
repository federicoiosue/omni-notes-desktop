angular.module("ONApp").service('thumbnailService', ['$q', 'CONSTANTS', function ($q, CONSTANTS) {

    var fs = require('fs-extra');

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
        return attachmentsFolder + '/' + attachment.id + CONSTANTS.ATTACHMENTS_THUMB_POSTFIX;
    };

    this.getVideoThumbnail = function (attachment, attachmentsFolder) {
        return './app/assets/images/file-video.svg';
    };

    this.getAudioThumbnail = function (attachment, attachmentsFolder) {
        return './app/assets/images/file-music.svg';
    };

    this.generatePdfThumbnail = function (attachment, attachmentsFolder) {
        var defer = $q.defer();
        require('pdfjs-dist');
        var fs = require('fs');
        var file = attachmentsFolder + '/' + _.last(attachment.uriPath.split('/'));
        var data = new Uint8Array(fs.readFileSync(file));
        var canvas = document.createElement('canvas');
        PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.min.js';
        PDFJS.getDocument(data)
            .then(function (pdf) {
                return pdf.getPage(1);
            })
            .then(function (page) {
                var viewport = page.getViewport(1.5);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                return page.render({canvasContext: context, viewport: viewport});
            })
            .then(function () {
                var data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "");
                var thumbFile = attachmentsFolder + '/' + attachment.id + CONSTANTS.ATTACHMENTS_THUMB_POSTFIX;
                fs.writeFile(thumbFile, new Buffer(data, 'base64'), function (err) {
                    if (err) {
                        console.log("err", err);
                    }
                    defer.resolve();
                });
            });
        return defer.promise;
    };

}]);
