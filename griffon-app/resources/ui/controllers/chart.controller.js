function ChartController() {
    var self = this;
    self.id    = null;
    self.model = null;
    self.view  = null;

    self.mvcInit = function (options) {
        self.id = options.id;
        self.model = new ChartModel(options.id, options.title, options.dirty);
        self.view  = new ChartView(options.id);
    };

    self.plot = function() {
        self.model.calculate();
        //TODO: add some options
        var options = {
            precision: 2
        };
        self.view.update(options);
    };

    self.replot = function() {

    };

    self.saveAs = function () {

    };

    self.saveEvent = function () {

    };
}

app.registerClass(ChartController);

app.register(
    1,
    {
        id: 1,
        title: null,
        dirty: false,
        dataAvailable: false
    },
    ChartController
);

