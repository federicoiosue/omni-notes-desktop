angular.module('ONApp').service('hotkeysRegistrationService', ['hotkeys', function (hotkeys) {

    this.createCheatSheet = function () {

        var addHotkey = function (combo, description) {
            hotkeys.add({
                combo: combo,
                description: description,
                callback: function () {
                }
            });
        };

        // addHotkey("ctrl+n", "New note");
        addHotkey("ctrl+s", "Save note or category");
        addHotkey("esc", "Leaves note editing");
        addHotkey("ctrl+e", "Set category during note editing");
        addHotkey("ctrl+o", "Add attachments");
    }

}]);
