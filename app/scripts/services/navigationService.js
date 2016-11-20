angular.module("ONApp").service('navigationService', ['$rootScope', 'CONSTANTS', 'storageService', function($rootScope, CONSTANTS, storageService) {

    var currentNavigationItem;

    this.setNavigation = function(navigationItem) {
        currentNavigationItem = navigationItem;
        storageService.put('currentNavigation', navigationItem);
        $rootScope.$emit(CONSTANTS.NAVIGATION_CHANGED, navigationItem);
    };

    this.getNavigation = function() {
        return currentNavigationItem || storageService.get('currentNavigation');
    };

    this.isCurrentNavigation = function(navigationItem) {
        return currentNavigationItem && (navigationItem === currentNavigationItem);
    };

}]);
