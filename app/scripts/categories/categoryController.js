angular.module('ONApp').controller('categoryController', ['$rootScope', '$scope', '$q', '$log', 'CONSTANTS', 'notesService', 'category', '$mdDialog', 'hotkeys', function ($rootScope, $scope, $q, $log, CONSTANTS, notesService, category, $mdDialog, hotkeys) {

    var initCategory = function (category) {
        var category = _.clone(category);
        if (!category.color) {
            category.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        }
        return category;
    };

    // Keyboard shortcuts
    hotkeys.add({
        combo: 'ctrl+s',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            $scope.saveCategory();
        }
    });

    $scope.customSettings = {
        control: 'brightness',
        position: 'top left'
    };

    $scope.saveCategory = function () {
        if ($scope.category.name) {
            notesService.saveCategory($scope.category);
            $mdDialog.hide($scope.category);
        }
    };

    $scope.deleteCategory = function () {
        if ($scope.category.name) {
            notesService.deleteCategory($scope.category);
            $mdDialog.hide($scope.category);
        }
    };

    $scope.category = initCategory(category);

}]);
