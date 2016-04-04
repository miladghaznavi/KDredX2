function ChartController() {
    var self = this;
    self.id    = null;
    self.model = null;
    self.view  = null;

    ChartController.inputsForcingReplot = [
        'uncertaintyInterpret',
        'rejectionRange',
        'variablesCount',
        'kernelFunction',
        'bandwidth'
    ];

    ChartController.textDataInputs = [
        'showErrorBarTextData',
        'showMeanTextData',
        'showRejectionTextData',
        'showSkewnessTextData'
    ];

    self.mvcInit = function (options) {
        self.id = options.id;
        self.model = new ChartModel(options.id, options.title, options.dirty);
        self.view  = new ChartView(options.id);
    };

    self.kernelFunctionChange = function(element) {
        Util.notifyInfo(element.id + ":" + element.value);
        self.model.kernelFunction = element.value;
    };

    self.uncertaintyInterpretChange = function(element) {
        Util.notifyInfo(element.id + ":" + element.value);
        self.model.uncertaintyInterpret = element.value;
    };

    self.rejectionRangeChange = function(element) {
        Util.notifyInfo(element.id + ":" + element.value);
        self.model.rejectionRange = element.value;
    };

    self.bandwidthChange = function(element) {
        Util.notifyInfo(element);
        self.bandwidth = element.value;
    };

    self.variablesCountChange = function(element) {
        self.variablesCount = element.value;
        Util.notifyInfo(element.value);
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
        var uncertaintyInterpret = this.model.uncertaintyInterpret;
        if (uncertaintyInterpret > 1) {
            for (var i = 0; i < self.model.uncertainties.length; ++i) {
                self.model.uncertainties[i] = self.model.uncertainties[i] / uncertaintyInterpret;
            }//for
        }//if

        var bandwidthRange = KernelDensityEstimation.bandwidthRange(self.model.values, self.model.uncertainties);
        if (self.model.bandwidth == null ||
            self.model.bandwidth <  bandwidthRange.min ||
            self.model.bandwidth >  bandwidthRange.max) {
            //set bandwidth to a default value
            self.model.bandwidth = bandwidthRange.from;
            self.view.setInputValue(
                'bandwidth',
                bandwidthRange.from,
                true
            );
        }//if

        // update bandwidth ui without change event
        self.view.setInputValue('bandwidth', bandwidthRange.from, true);

        self.model.variables = KernelDensityEstimation.variables(
            self.model.values, self.model.uncertainties, self.model.variablesCount.from);
    };

    self.plot = function() {
        if (self.model.dataAvailable) {
            self.prepareData();
            self.model.calculate();
            self.view.update();
        }//if
    };

    self.saveAs = function (event) {
        Util.notifyInfo(event.data.type);
    };

    self.saveEvent = function () {

    };

    self.loadDefaults = function () {
        for (var key in ChartModel.defaultValues) {
            var value = ChartModel.defaultValues[key];
            self.view.setInputValue(key, value, true);
        }//for
    };

    self.inputChanged = function (input, newValue) {
        this.model[input] = newValue;
        Util.notifyInfo(input + ':' + newValue);
        if (ChartController.inputsForcingReplot.indexOf(input) != -1) {
            self.plot();
        }//if
        else if (ChartController.textDataInputs.indexOf(input) != -1) {

        }//if
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