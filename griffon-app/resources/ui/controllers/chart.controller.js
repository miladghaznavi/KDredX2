function ChartController() {
    ChartController.inputToBeChecked = {
        // WM X Axis
        //-- Axis Scale
        WMXAxisUnit: {
            default: null,
            other: 'WMXAxisUnit', // dummy value
            validator: Util.checkUnit
        },
        WMXAxisLow : {
            default: null,
            other: 'WMXAxisHigh',
            validator: Util.checkScale
        },
        WMXAxisHigh: {
            default: null,
            other: 'WMXAxisLow',
            validator: Util.checkScale,
            kwargs: {swap: true}
        },
        // WM Y Axis
        //-- Axis Scale
        WMYAxisUnit: {
            default: null,
            other: 'WMYAxisUnit', // dummy value
            validator: Util.checkUnit,
            kwargs: {swap: true}
        },
        WMYAxisLow: {
            default: null,
            other: 'WMYAxisHigh',
            validator: Util.checkScale
        },
        WMYAxisHigh: {
            default: null,
            other: 'WMYAxisLow',
            validator: Util.checkScale,
            kwargs: {swap: true}
        },

        // KDE X Axis
        //-- Axis Scale
        KDEXAxisUnit: {
            default: null,
            other: 'KDEXAxisUnit', // dummy value
            validator: Util.checkUnit,
            kwargs: {swap: true}
        },
        KDEXAxisLow: {
            default: null,
            other: 'KDEXAxisHigh',
            validator: Util.checkScale
        },
        KDEXAxisHigh: {
            default: null,
            other: 'KDEXAxisLow',
            validator: Util.checkScale,
            kwargs: {swap: true}
        }
    };

    ChartController.IMAGE_TYPES = {
        PNG: 'png',
        SVG: 'svg',
        PDF: 'pdf',
        EPS: 'eps'
    };

    var self = this;
    self.id    = null;
    self.model = null;
    self.view  = null;

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

    self.prepareAxisScales = function() {
        self.view.setInputValue('WMXAxisLow' , self.model.WMXAxisLow , true);
        self.view.setInputValue('WMXAxisHigh', self.model.WMXAxisHigh, true);
        self.view.setInputValue('WMXAxisUnit', self.model.WMXAxisUnit, true);

        self.view.setInputValue('WMYAxisLow' , self.model.WMYAxisLow , true);
        self.view.setInputValue('WMYAxisHigh', self.model.WMYAxisHigh, true);
        self.view.setInputValue('WMYAxisUnit', self.model.WMYAxisUnit, true);

        self.view.setInputValue('KDEXAxisLow' , self.model.KDEXAxisLow , true);
        self.view.setInputValue('KDEXAxisHigh', self.model.KDEXAxisHigh, true);
        self.view.setInputValue('KDEXAxisUnit', self.model.KDEXAxisUnit, true);
    };

    // This function prepares bandwidth and variables.
    self.prepareData = function () {
        self.view.setInputValue('bandwidth', self.model.bandwidth, true);
    };

    self.prepareTitle = function() {
        self.view.setInputValue('WMTitleText' , self.model.WMTitleText);
        self.view.setInputValue('KDETitleText', self.model.KDETitleText);
    };

    self.plot = function() {
        if (self.model.dataAvailable) {
            self.model.calculate();
            self.prepareTitle();
            self.prepareData();
            self.prepareAxisScales();
            self.view.update();

            self.model.chartBeenDrawn = true;

            Util.notifySuccess("The chart has been plotted!");
        }//if
    };

    self.saveAs = function (event) {
        var images = null;
        var type = event.data.type;
        var serializer = new XMLSerializer();
        var serialized = serializer.serializeToString(document.getElementById('chart-box'));

        if (typeof JavaJSBridge != typeof undefined) {
            var jsonData = JSON.parse(JavaJSBridge.saveAs(serialized, type));
            if (jsonData.errors.length > 0) {
                Util.notifyError("Error in saving the image file!");
            }//if
        }//if
        else {
            switch (type) {
                case ChartController.IMAGE_TYPES.SVG:
                    images = Util.saveAsSVG(ChartView.CHART_BOX);
                    window.location.href = images[0];
                    break;

                case ChartController.IMAGE_TYPES.EPS:
                    images = Util.saveAsEPS(ChartView.CHART_BOX);
                    console.log(images);
                    break;

                case ChartController.IMAGE_TYPES.PDF:
                    images = Util.saveAsPDF(ChartView.CHART_BOX);
                    console.log(images);
                    break;

                default:
                    Util.notifyWarning('TODO: save as ' + type);
                    break;
            }//switch
        }//else
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

        if (input in ChartController.inputToBeChecked) {
            var defaultVal = ChartController.inputToBeChecked[input].default;
            var other      = ChartController.inputToBeChecked[input].other;
            var kwargs     = ChartController.inputToBeChecked[input].kwargs;
            var validator  = ChartController.inputToBeChecked[input].validator;
            if (!validator(newValue, this.model[other], kwargs)) {
                this.model[input] = defaultVal;
                self.view.setInputValue(input, this.model[input], true);
            }//if
        }//if

        // Util.notifyInfo(input + ':' + this.model[input]);
        // if (ChartController.inputsForcingReplot.indexOf(input) != -1) {
        //     self.plot();
        // }//if
        // TODO: make this more efficient, we do not need to replot and recalculate every thing, when only some styles are changed
        self.plot();
    };

    self.resetAndPlot = function() {
        // Reset some values
        self.model.bandwidth = null;

        self.model.WMXAxisLow = null;
        self.model.WMXAxisHigh = null;
        self.model.WMXAxisUnit = null;
        self.model.WMXAxisDivisor = null;

        self.model.WMYAxisLow = null;
        self.model.WMYAxisHigh = null;
        self.model.WMYAxisUnit = null;
        self.model.WMYAxisDivisor = null;

        self.model.KDEXAxisLow = null;
        self.model.KDEXAxisHigh = null;
        self.model.KDEXAxisUnit = null;
        self.model.KDEXAxisDivisor = null;

        self.model.KDEYAxisLow = null;
        self.model.KDEYAxisHigh = null;
        self.model.KDEYAxisUnit = null;
        self.model.KDEYAxisDivisor = null;

        // Load defaults for other fields
        self.model.loadDefaults();

        // Load defaults to view
        self.loadDefaults();

        // Update the view
        self.view.update();

        self.plot();
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