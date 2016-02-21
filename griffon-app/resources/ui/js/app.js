function App() {
    var self = this;

    self.classes = [];
    self.controllerClasses = {};
    self.controllers = {};
    self.args = {};

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

    self.init = function () {
        for (var i in self.classes) {
            for (var id in self.controllerClasses) {
                if (self.controllerClasses[id] == self.classes[i]) {
                    self.controllers[id] = new self.classes[i]();
                    self.controllers[id].mvcInit(self.args[id]);
                    self.controllers[id].model.init(self.args[id]);
                    self.controllers[id].view .init(self.args[id]);
                }//if
            }//for
        }//for
    };
}

app = new App();

$(document).ready(function() {
    app.init();
});