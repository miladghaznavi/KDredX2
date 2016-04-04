function MainView(id) {
    var self = this;
    id = typeof id !== 'undefined' ? id : null;

    self.id = id;

    self.init = function (args) {
        self.update();
        self.registerEvents();
    };

    self.update = function () {

    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $('#plotButton').click(controller.plot);
    };
    
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}