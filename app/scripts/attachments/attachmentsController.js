angular.module('ONApp').controller('attachmentsController', ['$scope', 'storageService', 'thumbnailService', function ($scope, storageService, thumbnailService) {

    $scope.attachmentsRoot = storageService.getAttachmentsFolder();

    $scope.getNoteThumbnail = function (attachment) {
        return thumbnailService.getAttachmentThumbnail(attachment, $scope.attachmentsRoot);
    };

    // $scope.getNotePdfThumbnail = function (note) {
    //     thumbnailService.getAttachmentThumbnail(note.attachmentsList[0], $scope.attachmentsRoot)
    //         .then(function (page) {
    //             var viewport = page.getViewport(0.2);
    //             var canvas = $('#pdf-' + note.attachmentsList[0].id)[0];
    //             canvas.height = viewport.height;
    //             canvas.width = viewport.width;
    //             page.render({
    //                 canvasContext: canvas.getContext('2d'),
    //                 viewport: viewport
    //             });
    //         });
    // };

    $scope.isImgOrPdf = function (attachment) {
        return _.some(['image', 'pdf'], function (mimeType) {
            return attachment.mime_type && attachment.mime_type.indexOf(mimeType) > -1;
        });
    };

    $scope.getMimeTypeSimple = function (attachment) {
        if (!attachment.mime_type) return "";
        var simpleMimeType = _.last(attachment.mime_type.split('/')[1].split('.'));
        return simpleMimeType.charAt(0).toUpperCase() + simpleMimeType.slice(1);
    };


}]);
