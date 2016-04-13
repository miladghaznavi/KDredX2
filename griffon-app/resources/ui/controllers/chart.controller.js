function ChartController() {
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
        'showSkewnessTextData',
        'showMSWDTextData',

        // Weighted mean chart title
        'WMShowTitle',

        // KDE chart title
        'KDEShowTitle',
    ];

    ChartController.inputToBeChecked = {
        // WM X Axis
        //-- Axis Scale
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

    ChartController.DEFAULT_AXIS_SCALES = {
        WMXAxisLowDefault    : 1,
        WMYAxisDivisorDefault: 16,
        KDEXAxisDivisorDefault: 16,
    };

    ChartController.IMAGE_TYPES = {
        PNG: 'png',
        JPG: 'jpg',
        SVG: 'svg',
        PDF: 'pdf'
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
        // Weighted Mean Chart - Axis X
        self.model.WMXAxisLow = (self.model.WMXAxisLow  == null) ?
            ChartController.DEFAULT_AXIS_SCALES.WMXAxisLowDefault : self.model.WMXAxisLow;
        self.model.WMXAxisHigh = (self.model.WMXAxisHigh == null) ?
            Math.max(self.model.values.length, self.model.WMXAxisLow + 1): self.model.WMXAxisHigh;
        self.model.WMXAxisDivisor = (self.model.WMXAxisDivisor == null) ?
            self.model.WMXAxisHigh - self.model.WMXAxisLow : self.model.WMXAxisDivisor;

        self.view.setInputValue('WMXAxisLow'    , self.model.WMXAxisLow , true);
        self.view.setInputValue('WMXAxisHigh'   , self.model.WMXAxisHigh, true);
        self.view.setInputValue('WMXAxisDivisor', self.model.WMXAxisDivisor, true);

        // Weighted Mean Chart - Axis Y
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;
        for (var i = 0; i < self.model.values.length; ++i) {
            minY = Math.min(minY, self.model.values[i] - 2 * self.model.uncertainties[i]);
            maxY = Math.max(maxY, self.model.values[i] + 2 * self.model.uncertainties[i]);
        }//for
        minY = Math.floor(minY);
        maxY = Math.ceil (maxY);

        self.model.WMYAxisLow = (self.model.WMYAxisLow  == null) ?
            minY : self.model.WMYAxisLow;
        self.model.WMYAxisHigh = (self.model.WMYAxisHigh == null) ?
            maxY : self.model.WMYAxisHigh;
        self.model.WMYAxisDivisor = (self.model.WMYAxisDivisor == null) ?
            ChartController.DEFAULT_AXIS_SCALES.WMYAxisDivisorDefault : self.model.WMYAxisDivisor;

        self.view.setInputValue('WMYAxisLow'    , self.model.WMYAxisLow , true);
        self.view.setInputValue('WMYAxisHigh'   , self.model.WMYAxisHigh, true);
        self.view.setInputValue('WMYAxisDivisor', self.model.WMYAxisDivisor, true);

        // Kernel Density Estimation - Axis X
        self.model.KDEXAxisLow = (self.model.KDEXAxisLow  == null) ?
            Util.min(self.model.kde) : self.model.KDEXAxisLow;

        self.model.KDEXAxisHigh = (self.model.KDEXAxisHigh == null) ?
            Util.max(self.model.kde): self.model.KDEXAxisHigh;

        self.model.KDEXAxisDivisor = (self.model.KDEXAxisDivisor == null) ?
            ChartController.DEFAULT_AXIS_SCALES.KDEXAxisDivisorDefault : self.model.KDEXAxisDivisor;
        self.view.setInputValue('KDEXAxisLow'    , self.model.KDEXAxisLow , true);
        self.view.setInputValue('KDEXAxisHigh'   , self.model.KDEXAxisHigh, true);
        self.view.setInputValue('KDEXAxisDivisor', self.model.KDEXAxisDivisor, true);

        // Kernel Density Estimation - Axis Y
        self.model.KDEYAxisLow     = self.model.WMYAxisLow;
        self.model.KDEYAxisHigh    = self.model.WMYAxisHigh;
        self.model.KDEYAxisDivisor = self.model.WMYAxisDivisor;
    };

    // This function prepares bandwidth and variables.
    self.prepareData = function () {
        var uncertainties = [];
        for (var i = 0; i < self.model.uncertainties.length; ++i) {
            uncertainties.push(self.model.uncertainties[i] / self.model.uncertaintyInterpret);
        }//for

        var bandwidthRange = KernelDensityEstimation.bandwidthRange(self.model.values, uncertainties);
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
        self.view.setInputValue('bandwidth', self.model.bandwidth, true);

        self.model.variables = KernelDensityEstimation.variables(
            self.model.values, uncertainties, self.model.variablesCount.from);
    };

    self.plot = function() {
        if (self.model.dataAvailable) {
            self.prepareData();
            self.model.calculate();
            self.prepareAxisScales();
            self.view.update();

            self.model.chartBeenDrawn = true;
        }//if
    };

    self.saveAs = function (event) {
        Util.notifyInfo(event.data.type);
        var images = null;
        var type = event.data.type;
        switch(type) {
            case ChartController.IMAGE_TYPES.SVG:
                images = Util.saveAsSVG(ChartView.CHART_BOX);
                window.location.href = images[0];
                break;

            case ChartController.IMAGE_TYPES.PDF:
                images = Util.saveAsPDF(ChartView.CHART_BOX);
                console.log(images);
                break;

            default:
                Util.notifyWarning('TODO: save as ' + type);
                break;
        }//switch
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