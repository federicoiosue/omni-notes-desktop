angular.module('ONApp').controller('categoriesSelectionController', ['$rootScope', '$scope', '$q', '$log', '$mdDialog', 'category', 'allowAdd', 'notesService', function($rootScope, $scope, $q, $log, $mdDialog, category, allowAdd, notesService) {

    $scope.categories = notesService.getCategories();
    $scope.preSelected = category;
    $scope.allowAdd = allowAdd;

    $scope.categorySelected = function(category) {
        $mdDialog.hide(category);
    }

    $scope.addNewCategory = function() {
        $mdDialog.hide();
    }

    $scope.removeCategory = function() {
        $mdDialog.hide({});
    }

    $scope.isPreselected = function(category) {
        category == $scope.preSelected;
    }

}]);
