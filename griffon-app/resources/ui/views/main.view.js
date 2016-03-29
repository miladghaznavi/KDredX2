function MainView(id) {
    var self = this;
    id = typeof id !== 'undefined' ? id : null;

    self.id = id;

    self.init = function (args) {
        self.update();
        self.registerEvents();
    };

    self.update = function () {
        $('#variablesCount').ionRangeSlider({
            grid: true,
            step: 1,
            min : 3,
            max : 200,
            from: 100
        });
    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $('#plotButton').click(controller.plot);
    };
    
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}