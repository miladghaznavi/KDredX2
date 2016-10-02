function ChartModel(id, title, dirty, dataAvailable) {
    ChartModel.defaultValues = {
        /* Data Preferences */

        // Interpreting Data
        uncertaintyInterpret: 1,
        rejectionRange      : 0,

        // Kernel Density Estimation
        variablesCount      : {'min': 3, 'max': 300, 'from': 150},
        kernelFunction      : 'gaussian',

        /* Chart Preferences */
        // Weighted Mean
        //-- Title
        WMShowTitle             : true,
        WMTitleText             : 'Weighted Mean',
        WMTitleFontFamily       : 'Times',
        WMTitleFontSize         : 14,
        WMTitleFontBold         : false,
        WMTitleFontItalic       : false,
        WMTitleFontUnderline    : false,
        WMTitleFontStrikethrough: false,
        WMTitleFontColor        : '#000',

        //-- Text
        showErrorBarTextData : true,
        showMeanTextData     : true,
        showRejectionTextData: true,
        showMSWDTextData     : true,
        WMTextFontFamily       : 'Times',
        WMTextFontSize         : 11,
        WMTextFontBold         : false,
        WMTextFontItalic       : false,
        WMTextFontUnderline    : false,
        WMTextFontStrikethrough: false,
        WMTextFontColor        : '#8D8D8D',

        //-- Size
        WMChartWidth : 600,
        WMChartHeight: 400,

        //-- Data Points & bars
        WMShowPoints : true,
        WMPointsWidth: 10,
        WMPointsColor: '#FB110B',
        WMShowCaps   : true,
        WMBarWidth   : 2,
        WMBarColor   : '#FB110B',

        //-- Rejected Data Points & bars
        WMShowRejectedPoints : true,
        WMRejectedPointsWidth: 10,
        WMRejectedPointsColor: '#8303A6',
        WMShowRejectedCaps   : true,
        WMRejectedBarWidth   : 2,
        WMRejectedBarColor   : '#8303A6',

        //-- Mean
        WMBoxColor: '#118002',
        WMLineStyle: 'dashed',
        WMLineWidth: 1,
        WMLineColor: '#F4F1F1',

        // Kernel Density Estimation Chart
        //-- Title
        KDEShowTitle             : true,
        KDETitleText             : 'Kernel Density Estimation',
        KDETitleFontFamily       : 'Times',
        KDETitleFontSize         : 14,
        KDETitleFontBold         : false,
        KDETitleFontItalic       : false,
        KDETitleFontUnderline    : false,
        KDETitleFontStrikethrough: false,
        KDETitleFontColor        : '#000',
        // -- Text
        showSkewnessTextData    : true,
        KDETextFontFamily       : 'Times',
        KDETextFontSize         : 11,
        KDETextFontBold         : false,
        KDETextFontItalic       : false,
        KDETextFontUnderline    : false,
        KDETextFontStrikethrough: false,
        KDETextFontColor        : '#8D8D8D',

        // Size
        KDEChartWidth: 300,
        // Line
        KDELineStyle: 'solid line',
        KDELineWidth: 1,
        KDELineColor: '#929292',

        /* Axis Preferences */
        // WM X Axis
        //-- Grid Lines
        WMXGridLinesShow : false,
        WMXGridLineStroke: 'dashed',
        WMXGridLineWidth : 1,
        WMXGridLineColor : '#8D8D8D',
        //-- Labels
        WMXLabelsShow             : true,
        WMXLabelsFontFamily       : 'Times',
        WMXLabelsFontSize         : 11,
        WMXLabelsFontBold         : false,
        WMXLabelsFontItalic       : false,
        WMXLabelsFontUnderline    : false,
        WMXLabelsFontStrikethrough: false,
        WMXLabelsFontColor        : '#8D8D8D',

        // WM Y Axis
        //-- Grid Lines
        WMYGridLinesShow : true,
        WMYGridLineStroke: 'dashed',
        WMYGridLineWidth : 1,
        WMYGridLineColor : '#8D8D8D',
        //-- Labels
        WMYLabelsShow             : true,
        WMYLabelsFontFamily       : 'Times',
        WMYLabelsFontSize         : 11,
        WMYLabelsFontBold         : false,
        WMYLabelsFontItalic       : false,
        WMYLabelsFontUnderline    : false,
        WMYLabelsFontStrikethrough: false,
        WMYLabelsFontColor        : '#8D8D8D',

        // KDE X Axis
        //-- Grid Lines
        KDEXGridLinesShow : false,
        KDEXGridLineStroke: false,
        KDEXGridLineWidth : 1,
        KDEXGridLineColor : '#8D8D8D',
        //-- Labels
        KDEXLabelsShow             : false,
        KDEXLabelsFontFamily       : 'Times',
        KDEXLabelsFontSize         : 11,
        KDEXLabelsFontBold         : false,
        KDEXLabelsFontItalic       : false,
        KDEXLabelsFontUnderline    : false,
        KDEXLabelsFontStrikethrough: false,
        KDEXLabelsFontColor        : '#8D8D8D',

        // KDE Y Axis
        //-- Grid Lines
        KDEYGridLinesShow : false,
        KDEYGridLineStroke: 'dashed',
        KDEYGridLineWidth : 1,
        KDEYGridLineColor : '#8D8D8D',
        //-- Labels
        KDEYLabelsShow: false,
        KDEYLabelsFontFamily       : 'Times',
        KDEYLabelsFontSize         : 11,
        KDEYLabelsFontBold         : false,
        KDEYLabelsFontItalic       : false,
        KDEYLabelsFontUnderline    : false,
        KDEYLabelsFontStrikethrough: false,
        KDEYLabelsFontColor        : '#8D8D8D'
    };
    ChartModel.preferencesList = [
        /* Data Preferences */
        // Interpreting Data
        'uncertaintyInterpret',
        'rejectionRange',

        // Kernel Density Estimation
        'variablesCount',
        'kernelFunction',
        'bandwidth',

        /* Chart Preferences */
        // Weighted Mean
        //-- Title
        'WMShowTitle',
        'WMTitleText',
        'WMTitleFontFamily',
        'WMTitleFontSize',
        'WMTitleFontBold',
        'WMTitleFontItalic',
        'WMTitleFontUnderline',
        'WMTitleFontStrikethrough',
        'WMTitleFontColor',

        //-- Text
        'showErrorBarTextData',
        'showMeanTextData',
        'showRejectionTextData',
        'showMSWDTextData',
        'WMTextFontFamily',
        'WMTextFontSize',
        'WMTextFontBold',
        'WMTextFontItalic',
        'WMTextFontUnderline',
        'WMTextFontStrikethrough',
        'WMTextFontColor',

        //-- Size
        'WMChartWidth',
        'WMChartHeight',

        //-- Data Points & bars
        'WMShowPoints',
        'WMPointsWidth',
        'WMPointsColor',
        'WMShowCaps',
        'WMBarWidth',
        'WMBarColor',

        //-- Rejected Data Points & bars
        'WMShowRejectedPoints',
        'WMRejectedPointsWidth',
        'WMRejectedPointsColor',
        'WMShowRejectedCaps',
        'WMRejectedBarWidth',
        'WMRejectedBarColor',

        //-- Mean
        'WMBoxColor',
        'WMLineStyle',
        'WMLineWidth',
        'WMLineColor',

        // Kernel Density Estimation Chart
        //-- Title
        'KDEShowTitle',
        'KDETitleText',
        'KDETitleFontFamily',
        'KDETitleFontSize',
        'KDETitleFontBold',
        'KDETitleFontItalic',
        'KDETitleFontUnderline',
        'KDETitleFontStrikethrough',
        'KDETitleFontColor',
        // -- Text
        'showSkewnessTextData',
        'KDETextFontFamily',
        'KDETextFontSize',
        'KDETextFontBold',
        'KDETextFontItalic',
        'KDETextFontUnderline',
        'KDETextFontStrikethrough',
        'KDETextFontColor',

        // Size
        'KDEChartWidth',
        // Line
        'KDELineStyle',
        'KDELineWidth',
        'KDELineColor',

        /* Axis Preferences */
        // WM X Axis
        //-- Axis Scale
        'WMXAxisLow',
        'WMXAxisHigh',
        'WMXAxisDivisor',
        //-- Grid Lines
        'WMXGridLinesShow',
        'WMXGridLineStroke',
        'WMXGridLineWidth',
        'WMXGridLineColor',
        //-- Labels
        'WMXLabelsShow',
        'WMXLabelsFontFamily',
        'WMXLabelsFontSize',
        'WMXLabelsFontBold',
        'WMXLabelsFontItalic',
        'WMXLabelsFontUnderline',
        'WMXLabelsFontStrikethrough',
        'WMXLabelsFontColor',

        // WM Y Axis
        //-- Axis Scale
        'WMYAxisLow',
        'WMYAxisHigh',
        'WMYAxisDivisor',
        //-- Grid Lines
        'WMYGridLinesShow',
        'WMYGridLineStroke',
        'WMYGridLineWidth',
        'WMYGridLineColor',
        //-- Labels
        'WMYLabelsShow',
        'WMYLabelsFontFamily',
        'WMYLabelsFontSize',
        'WMYLabelsFontBold',
        'WMYLabelsFontItalic',
        'WMYLabelsFontUnderline',
        'WMYLabelsFontStrikethrough',
        'WMYLabelsFontColor',

        // KDE X Axis
        //-- Axis Scale
        'KDEXAxisLow',
        'KDEXAxisHigh',
        'KDEXAxisDivisor',
        //-- Grid Lines
        'KDEXGridLinesShow',
        'KDEXGridLineStroke',
        'KDEXGridLineWidth',
        'KDEXGridLineColor',
        //-- Labels
        'KDEXLabelsShow',
        'KDEXLabelsFontFamily',
        'KDEXLabelsFontSize',
        'KDEXLabelsFontBold',
        'KDEXLabelsFontItalic',
        'KDEXLabelsFontUnderline',
        'KDEXLabelsFontStrikethrough',
        'KDEXLabelsFontColor',

        // KDE Y Axis
        //-- Axis Scale
        // KDEYAxisLow    : '#kdeYAxisLow',
        // KDEYAxisHigh   : '#kdeYAxisHigh',
        // KDEYAxisDivisor: '#kdeYAxisDivisor',
        //-- Grid Lines
        'KDEYGridLinesShow',
        'KDEYGridLineStroke',
        'KDEYGridLineWidth',
        'KDEYGridLineColor',
        //-- Labels
        'KDEYLabelsShow',
        'KDEYLabelsFontFamily',
        'KDEYLabelsFontSize',
        'KDEYLabelsFontBold',
        'KDEYLabelsFontItalic',
        'KDEYLabelsFontUnderline',
        'KDEYLabelsFontStrikethrough',
        'KDEYLabelsFontColor'
    ];
    ChartModel.chartPropertiesList = [
        'id',
        'title',
        'dirty',
        'dataAvailable'
    ];
    ChartModel.dataList = [
        // Values and uncertainties
        'values',
        'uncertainties',

        // Weighted mean
        'weightedMean',
        'weightedUncertainty',
        'mswd',
        'rejected',
        'total',
        'ratio',

        // Kernel Density Estimation
        'variables',
        'kde',

        // Skewness
        'skewness'
    ];
    ChartModel.allLists = ChartModel.preferencesList.concat(
        ChartModel.chartPropertiesList).concat(
        ChartModel.dataList);
    ChartModel.DEFAULT_AXIS_SCALES = {
        WMXAxisLowDefault     : 1,
        WMXAxisUnitDefault    : 1,

        WMYAxisDivisorDefault : 16,
        WMYAxisLowCoeffDefault : 0.9,
        WMYAxisHighCoeffDefault: 1.1,

        KDEXAxisLowDefault    : 0.0,
        KDEXAxisDivisorDefault: 16,
    };

    var self = this;
    id    = (typeof id    !== 'undefined') ? id: null;
    title = (typeof title !== 'undefined') ? title: null;
    dirty = (typeof dirty !== 'undefined') ? dirty: false;
    dataAvailable = (typeof dataAvailable !== 'undefined') ? dataAvailable: false;

    // Chart
    self.id = id;
    self.title = title;
    self.dirty = dirty;
    self.dataAvailable = dataAvailable;
    self.chartBeenDrawn = false;

    self.init = function(options) {
        self.initData();
        self.loadDefaults();
    };

    /**
     * This function initialize two lists: preferencesList and dataList.
     * Note that we do not initialize chartPropertiesList because chartPropertiesList is set when it is declared
     */
    self.initData = function () {
        self.initializer(ChartModel.preferencesList);
        self.initializer(ChartModel.dataList);
    };

    self.initializer = function(list) {
        var key = null;
        for (var i = 0; i < list.length; ++i) {
            key = list[i];
            self[key] = null;
        }//for
    };

    self.loadDefaults = function() {
        for (var key in ChartModel.defaultValues) {
            var value = ChartModel.defaultValues[key];
            self[key] = value;
        }//for
    };

    self.setData = function (name, data) {
        if (!(name in ChartModel.allLists)) {
            throw name + ' is not part of model';
        }//if

        self[name] = data;
    };

    self.getData = function (name) {
        if (!(name in ChartModel.allLists)) {
            throw name + ' is not part of model';
        }//if

        return self[name];
    };

    self.getList = function (list) {
        var result = {};
        for (var key in list)
            result[key] = self[key];

        return result;
    };

    self.getPreferences = function () {
        return self.getList(ChartModel.preferencesList);
    };

    self.precompute = function() {
        var uncertainties = [];
        for (var i = 0; i < self.uncertainties.length; ++i) {
            uncertainties.push(self.uncertainties[i] / self.uncertaintyInterpret);
        }//for

        var bandwidthRange = KernelDensityEstimation.bandwidthRange(self.values, uncertainties);
        if (self.bandwidth == null ||
            self.bandwidth == ""   ||
            self.bandwidth <  bandwidthRange.min ||
            self.bandwidth >  bandwidthRange.max) {
            //set bandwidth to a default value
            self.bandwidth = bandwidthRange.from;
        }//if

        return uncertainties;
    };

    self.computeWMAxisScales = function() {
        self.WMXAxisLow = (self.WMXAxisLow  == null) ?
            ChartModel.DEFAULT_AXIS_SCALES.WMXAxisLowDefault : self.WMXAxisLow;
        self.WMXAxisHigh = (self.WMXAxisHigh == null) ?
            Math.max(self.values.length, self.WMXAxisLow + 1): self.WMXAxisHigh;
        self.WMXAxisUnit = (self.WMXAxisUnit == null) ?
            ChartModel.DEFAULT_AXIS_SCALES.WMXAxisUnitDefault : self.WMXAxisUnit;
        self.WMXAxisDivisor = Math.ceil((self.WMXAxisHigh - self.WMXAxisLow) / self.WMXAxisUnit);

        // Weighted Mean Chart - Axis Y
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;
        for (var i = 0; i < self.values.length; ++i) {
            minY = Math.min(minY, self.values[i] - 2 * self.uncertainties[i]);
            maxY = Math.max(maxY, self.values[i] + 2 * self.uncertainties[i]);

            // We extend the range of the weighted-mean y-axis by +/-10%
            minY = Math.min(minY, self.values[i] * ChartModel.DEFAULT_AXIS_SCALES.WMYAxisLowCoeffDefault);
            maxY = Math.max(maxY, self.values[i] * ChartModel.DEFAULT_AXIS_SCALES.WMYAxisHighCoeffDefault);
        }//for

        minY = Math.floor(minY);
        maxY = Math.ceil (maxY);

        self.WMYAxisLow  = (self.WMYAxisLow  == null) ? minY : self.WMYAxisLow;
        self.WMYAxisHigh = (self.WMYAxisHigh == null) ? maxY : self.WMYAxisHigh;
        self.WMYAxisUnit = (self.WMYAxisUnit == null) ?
            Math.ceil((self.WMYAxisHigh - self.WMYAxisLow) / ChartModel.DEFAULT_AXIS_SCALES.WMYAxisDivisorDefault):
            self.WMYAxisUnit;
        self.WMYAxisDivisor = Math.ceil((self.WMYAxisHigh - self.WMYAxisLow) / self.WMYAxisUnit);
    };

    self.computeKDEAxisScales = function() {
        // Kernel Density Estimation - Axis Y
        self.KDEYAxisLow     = self.WMYAxisLow;
        self.KDEYAxisHigh    = self.WMYAxisHigh;
        self.KDEYAxisUnit    = self.WMYAxisUnit;
        self.KDEYAxisDivisor = self.WMYAxisDivisor;

        // Kernel Density Estimation - Axis X
        self.KDEXAxisLow = (self.KDEXAxisLow  == null) ?
            ChartModel.DEFAULT_AXIS_SCALES.KDEXAxisLowDefault : self.KDEXAxisLow;
        self.KDEXAxisHigh = (self.KDEXAxisHigh == null) ?
            Util.max(self.kde): self.KDEXAxisHigh;
        self.KDEXAxisUnit = (self.KDEXAxisUnit == null) ?
        (self.KDEXAxisHigh - self.KDEXAxisLow) / ChartModel.DEFAULT_AXIS_SCALES.KDEXAxisDivisorDefault:
            self.KDEXAxisUnit;
        self.KDEXAxisDivisor = Math.ceil((self.KDEXAxisHigh - self.KDEXAxisLow) / self.KDEXAxisUnit);
    };

    self.calculate = function() {
        var uncertainties = self.precompute();

        // Weighted Mean
        var aWm = WeightedMean.calculate(self.values, uncertainties, Number(self.rejectionRange));
        for (var key in aWm) {
            self[key] = aWm[key];
        }//for
        self.ratio = self.weightedUncertainty / self.weightedMean * 100;
        self.total = self.values.length;

        // Skewness
        var aSkewness = Skewness.calculate(self.values);
        for (var key in aSkewness) {
            self[key] = aSkewness[key];
        }//for

        // WM Axis scales
        self.computeWMAxisScales();

        // Compute variables
        // Note that we need Y Axis scales to compute the KDEs
        self.variables = KernelDensityEstimation.variables(
            self.values, uncertainties, self.variablesCount.from,
            self.WMYAxisLow, self.WMYAxisHigh);

        // Kernel Density Estimation
        var aKde = KernelDensityEstimation.calculate(self.variables, self.values, self.bandwidth, self.kernelFunction);
        for (var key in aKde) {
            self[key] = aKde[key];
        }//for

        // KDE Axis scales
        self.computeKDEAxisScales();
    };

    self.getStatistics = function() {
        self.calculate();
        return {
            weightedMean: {
                values: self.values,
                uncertainties: uncertainties,
                weightedMean: self.weightedMean,
                weightedUncertainty: self.weightedUncertainty,
                rejected: self.rejected,
                total: self.values.length,
                ratio: self.weightedUncertainty / self.weightedMean * 100
            },
            kernelDensityEstimation: {
                variables: self.variables,
                values   : self.values,
                kde      : self.kde
            },
            skewness: {
                skewness: self.skewness
            }
        };
    };
}