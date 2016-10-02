function App() {
    var self = this;

    self.classes = [];
    self.controllerClasses = {};
    self.controllers = {};
    self.args = {};
    self.contextMenuTargetsWhitelist = [];

    self.registerClass = function (classType) {
        self.classes.push(classType);
    };

    self.register = function (id, args, controllerClass) {
        self.args[id] = args;
        self.controllerClasses[id] = controllerClass;
    };

    self.getModel = function (id) {
        return self.controllers[id].model;
    };

    self.getView = function (id) {
        return self.controllers[id].view;
    };

    self.getController = function (id) {
        return self.controllers[id];
    };

    self.catchContextMenuEvent = function () {
        document.addEventListener("contextmenu", function (e) {
            var found = false;
            var id = $(e.target).attr('id');
            for(var i = 0; i < self.contextMenuTargetsWhitelist.length && !found; ++i) {
                found = (self.contextMenuTargetsWhitelist[i] == id);
            }//for

            console.log(e);
            console.log(id);
            console.log(found);

            // If the element is not found in the white list, we disable the right click event
            if(!found) {
                e.preventDefault();
            }//if
        });
    };

    self.init = function () {
        self.catchContextMenuEvent();
        for (var i in self.classes) {
            for (var id in self.controllerClasses) {
                if (self.controllerClasses[id] == self.classes[i]) {
                    self.controllers[id] = new self.classes[i]();
                    self.controllers[id].mvcInit(self.args[id]);
                    self.controllers[id].model.init(self.args[id]);
                    self.controllers[id].view .init(self.args[id]);

                    self.controllers[id].loadDefaults();
                }//if
            }//for
        }//for
    };
}

app = new App();

$(document).ready(function() {
    app.init();
});