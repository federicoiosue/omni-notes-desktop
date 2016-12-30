angular.module("ONApp").service("notesService", ['$rootScope', '$log', 'CONSTANTS', 'storageService', function ($rootScope, $log, CONSTANTS, storageService) {

    var fs = require('fs-extra');
    var notes = [];
    var categories = {};
    var sortPredicate = storageService.get('sortPredicate') || 'title';
    var sortDirection = storageService.get('sortDirection') || 'ASC';

    this.loadNotes = function (backupFolderPath) {
        if (backupFolderPath) {
            storageService.put('notes_backup_folder', backupFolderPath);
            fs.readdir(backupFolderPath, function (err, files) {
                var filtered = files.filter(function (fileName) {
                    return new RegExp("[0-9]{13}\\.json").test(fileName);
                });
                filtered.forEach(function (fileName) {
                    var filePath = backupFolderPath + '/' + fileName;
                    $log.debug('Reading content of file: ' + filePath);
                    fs.readFile(filePath, function (err, data) {
                        var note = JSON.parse(data);
                        notes.push(note);
                        if (note.category) {
                            categories[note.category.id] = note.category;
                        }
                        if (notes.length === filtered.length) {
                            storageService.put('notes_backup_folder', backupFolderPath);
                            applyNotesSorting();
                            $rootScope.$emit(CONSTANTS.NOTES_LOADED, notes);
                        }
                    });
                });
            });
        }
    };

    this.getNotes = function () {
        return notes;
    };

    this.getCategories = function () {
        return categories;
    };

    this.filterNotes = function (filterPredicate) {
        var filteredNotes = _.filter(notes, filterPredicate);
        $rootScope.$emit(CONSTANTS.NOTES_FILTERED, filteredNotes);
    };

    this.saveNotes = function (updatedNotes, updateLastModification) {
        var service = this;
        _.each(updatedNotes, function (updateNote) {
            service.saveNote(updateNote, updateLastModification, false);
        });
        $rootScope.$emit(CONSTANTS.NOTE_MODIFIED, notes);
    };

    this.archiveNotes = function (updatedNotes, archive) {
        var service = this;
        _.each(updatedNotes, function (updateNote) {
            updateNote.archived = archive;
            service.saveNote(updateNote, false, false);
        });
        $rootScope.$emit(CONSTANTS.NOTE_MODIFIED, notes);
    };

    this.trashNotes = function (updatedNotes, archive) {
        var service = this;
        _.each(updatedNotes, function (updateNote) {
            updateNote.trashed = archive;
            service.saveNote(updateNote, false, false);
        });
        $rootScope.$emit(CONSTANTS.NOTE_MODIFIED, notes);
    };

    this.saveNote = function (updatedNote, updateLastModification, emitEvent) {
        var now = new Date().getTime();
        updatedNote.lastModification = !updateLastModification ? updatedNote.lastModification || now : now;
        if (updatedNote.creation) {
            var i = _.findIndex(notes, function (note) {
                return note.creation === updatedNote.creation;
            });
            notes[i] = updatedNote;
        } else {
            updatedNote.creation = now;
            notes.push(updatedNote);
        }
        applyNotesSorting();
        fs.writeFile(storageService.get('notes_backup_folder') + '/' + updatedNote.creation + '.json', JSON.stringify(updatedNote, replacer), function (err) {
            if (err) throw err;
            if (!emitEvent) {
                $rootScope.$emit(CONSTANTS.NOTE_MODIFIED, notes);
            }
        });
        cleanRemovedAttachments(updatedNote);
    };

    function cleanRemovedAttachments(note) {
        var attachmentsFolder = storageService.getAttachmentsFolder();
        _.each(note.attachmentsListOld, function (attachment) {
            fs.remove(attachmentsFolder + _.last(attachment.uriPath.split('/')), function (err) {
                if (err) $log.error(err);
            })
        });
    }

    function replacer(key, value) {
        if (key == "attachmentsListOld") return undefined;
        else return value;
    }

    this.saveCategory = function (updatedCategory) {
        updatedCategory.id = updatedCategory.id || new Date().getTime();
        categories[updatedCategory.id] = updatedCategory;
        var service = this;
        notes = _.each(notes, function (note) {
            if (note.category && note.category.id === updatedCategory.id) {
                note.category = updatedCategory;
                service.saveNote(note, false, false);
            }
            return note;
        });
        $rootScope.$emit(CONSTANTS.CATEGORY_MODIFIED, categories);
    };

    this.deleteCategory = function (categoryToDelete) {
        var service = this;
        if (categoryToDelete.id) {
            notes = _.each(notes, function (note) {
                if (note.category && note.category.id === categoryToDelete.id) {
                    delete note.category;
                }
                service.saveNote(note, false, false);
            });
        }
        categories = _.omit(categories, categoryToDelete.id);
        $rootScope.$emit(CONSTANTS.CATEGORY_MODIFIED, categories);
    };

    this.setCategory = function (updatedNotes, category) {
        var service = this;
        _.each(updatedNotes, function (updateNote) {
            if (category) {
                updateNote.category = category;
            } else {
                delete updateNote.category;
            }
            service.saveNote(updateNote, false, false);
        });
        $rootScope.$emit(CONSTANTS.NOTE_MODIFIED, notes);
    };

    this.createNewAttachment = function (file, attachmentsRoot) {
        var Attachment = function (file) {
            this.id = new Date().getTime();
            this.name = file.name;
            var ext = _.last(file.name.split('.'));
            this.uriPath = attachmentsRoot + this.id + (ext ? '.' + ext : '');
            this.mime_type = file.type;
            this.size = file.size;
        };
        var attachment = new Attachment(file);
        fs.copySync(file.path, attachment.uriPath)
        return attachment;
    };

    this.sortNotes = function (newSortPredicate, newSortDirection) {
        if (newSortPredicate != sortPredicate || sortDirection != newSortDirection) {
            sortPredicate = newSortPredicate;
            storageService.put('sortPredicate', newSortPredicate);
            sortDirection = newSortDirection;
            storageService.put('sortDirection', newSortDirection);
            applyNotesSorting();
            $rootScope.$emit(CONSTANTS.NOTES_SORTED, notes);
        }
    };

    function applyNotesSorting() {
        notes = _.sortBy(notes, [function(note) {
            return typeof note[sortPredicate] == 'string' ? note[sortPredicate].toLowerCase() : note[sortPredicate];
        }]);
        if ('DESC' == sortDirection) {
            notes.reverse();
        }
    }

    this.getSortPredicate = function () {
        return sortPredicate;
    };

    this.getSortDirection = function () {
        return sortDirection;
    };


}]);
