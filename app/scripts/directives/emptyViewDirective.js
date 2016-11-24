ONApp.directive('emptyView', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            navitem: '='
        },
        template: '<div layout-align="center end">' +
            '<ng-md-icon icon="{{navitem.icon}}" style="fill: #BBB" size="192"/>' +
            '<p>Nothing here...</p>' +
            '</div>'
    }
});
