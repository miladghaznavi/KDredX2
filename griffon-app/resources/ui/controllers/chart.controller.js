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

    self.kernelFunctionChange = function() {
        Util.notifyInfo(this.id + ":" + this.value);
        self.model.kernelFunction = this.value;
    };

    self.uncertaintyInterpretChange = function() {
        Util.notifyInfo(this.id + ":" + this.value);
        self.model.uncertaintyInterpret = this.value;
    };

    self.rejectionRangeChange = function() {
        Util.notifyInfo(this.id + ":" + this.value);
        self.model.rejectionRange = this.value;
    };

    self.bandwidthChange = function() {
        Util.notifyInfo(this.id + ":" + this.value);
        self.bandwidth = this.value;
    };

    self.variablesCountChange = function() {
        self.variablesCount = this.value;
        Util.notifyInfo(this.value);
    };

    self.setBandwidthRange = function(dataModel) {
        var bandwdithRange = KernelDensityEstimation.bandwidthRange(dataModel.values, dataModel.uncertainties);
        if (self.model.bandwidth == MainModel.INVALID_VALUE) {
            self.model.bandwidth = bandwdithRange.default;
        }//if
        else if (self.model.bandwidth < bandwdithRange.min && self.model.bandwidth >bandwdithRange.max) {
            self.model.bandwidth = bandwidth.default;
        }//else
    };

    // This function prepares bandwidth and variables.
    self.prepareData = function () {
        var bandwidthRange = KernelDensityEstimation.bandwidthRange(self.model.values, self.model.uncertainties);
        if (self.model.bandwidth == null ||
            self.model.bandwidth <  bandwidthRange.min ||
            self.model.bandwidth >  bandwidthRange.max) {
            //set bandwidth to a default value
            self.model.bandwidth = bandwidthRange.default;
        }//if

        // update bandwidth ui without change event
        self.view.setBandwidth(self.model.bandwidth, true);

        self.model.variables = KernelDensityEstimation.variables(
            self.model.values, self.model.uncertainties, self.model.variablesCount);
    };

    self.preparePreferences = function() {

    };

    self.plot = function() {
        self.prepareData();
        self.preparePreferences();
        self.model.calculate();

        //TODO: add some options
        var options = {
            precision: 2
        };
        self.view.update(options);
    };

    self.replot = function() {
        Util.notifyInfo(event.data.options);
    };

    self.saveAs = function (event) {
        Util.notifyInfo(event.data.type);
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

