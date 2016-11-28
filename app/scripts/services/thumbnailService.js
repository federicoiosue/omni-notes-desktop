angular.module("ONApp").service('thumbnailService', [function() {

    this.getAttachmentThumbnail = function(attachment, attachmentsFolder) {
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

    this.getImageThumbnail = function(attachment, attachmentsFolder) {
        return attachmentsFolder + '/' + attachment.uriPath.substring(attachment.uriPath.lastIndexOf('files'), attachment.uriPath.length);
    }

    this.getPdfThumbnail = function(attachment, attachmentsFolder) {
        return './app/assets/images/file-pdf.svg';
    }

    this.getVideoThumbnail = function(attachment, attachmentsFolder) {
        return './app/assets/images/file-video.svg';
    }

    this.getAudioThumbnail = function(attachment, attachmentsFolder) {
        return './app/assets/images/file-music.svg';
    }

}]);;
