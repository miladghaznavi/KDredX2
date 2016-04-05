function ChartModel(id, title, dirty, dataAvailable) {
    ChartModel.defaultValues = {
        /* Data Preferences */
        // Interpreting Data
        uncertaintyInterpret: 1,
        rejectionRange      : 0,

        // Kernel Density Estimation
        variablesCount      : {'min': 3, 'max': 300, 'from': 150},
        kernelFunction      : 'gaussian',

        /* Data Preferences */
        // Text Data
        showErrorBarTextData : true,
        showMeanTextData     : true,
        showRejectionTextData: true,
        showSkewnessTextData : true,

        // Weighted Mean Chart
        // -- Options
        WMShowTitle : true,
        WMShowBorder: true,
        WMShowLegend: true,
        WMShowLabel : true,
        // -- Size
        WMChartWidth : 600,
        WMChartHeight: 400,
        // -- Data Points & bars
        WMShowPoints   : true,
        WMPointsWidth  : 2,
        WMPointsColor  : '#FB110B',
        WMShowCaps     : true,
        WMBarWidth     : 2,
        WMBarColor     : '#FB110B',
        // -- Mean Line
        WMMeanLineColor: '#118002',

        // Kernel Density Estimation Chart
        // -- Options
        KDEShowTitle : true,
        KDEShowBorder: false,
        // -- Size
        KDEChartWidth: 300,
        // -- Line
        KDELineStyle: 'solid line',
        KDELineWidth: 1,
        KDELineColor: '#929292',

        // Font
        fontBold         : false,
        fontItalic       : false,
        fontUnderline    : false,
        fontStrikethrough: false,
        fontFamily       : 'Times',
        fontSize         : 11,
        fontColor        : '#8D8D8D',

        /* Axis Preferences */
        // X Axis
        //-- Grid Lines
        XGridLinesShow : false,
        XGridLineStroke: 'dashed',
        XGridLineWidth : 1,
        XGridLineColor : '#8D8D8D',

        // Y Axis
        //-- Axis Scale
        //-- Grid Lines
        YGridLinesShow : true,
        YGridLineStroke: 'dashed',
        YGridLineWidth : 1,
        YGridLineColor : '#8D8D8D'
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

        /* Data Preferences */
        // Text Data
        'showErrorBarTextData',
        'showMeanTextData',
        'showRejectionTextData',
        'showSkewnessTextData',

        // Weighted Mean Chart
        // -- Options
        'WMShowTitle',
        'WMShowBorder',
        'WMShowLegend',
        'WMShowLabel',
        // -- Size
        'WMChartWidth',
        'WMChartHeight',
        // -- Data Points & bars
        'WMShowPoints',
        'WMPointsWidth',
        'WMPointsColor',
        'WMShowCaps',
        'WMBarWidth',
        'WMBarColor',
        // -- Mean Line
        'WMMeanLineColor',
        // Kernel Density Estimation Chart
        // -- Options
        'KDEShowTitle',
        'KDEShowBorder',
        // -- Size
        'KDEChartWidth',
        // -- Line
        'KDELineStyle',
        'KDELineWidth',
        'KDELineColor',

        // Font
        'fontBold',
        'fontItalic',
        'fontUnderline',
        'fontStrikethrough',
        'fontFamily',
        'fontSize',
        'fontColor',

        /* Axis Preferences */
        // X Axis
        //-- Axis Scale
        'xAxisLow',
        'xAxisHigh',
        'xAxisDivisor',
        //-- Grid Lines
        'XGridLinesShow',
        'XGridLineStroke',
        'XGridLineWidth',
        'XGridLineColor',

        // Y Axis
        //-- Axis Scale
        'YAxisLow',
        'YAxisHigh',
        'YAxisDivisor',
        //-- Grid Lines
        'YGridLinesShow',
        'YGridLineStroke',
        'YGridLineWidth',
        'YGridLineColor'
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

    self.calculate = function() {
        var uncertainties = [];
        for (var i = 0; i < self.uncertainties.length; ++i) {
            uncertainties.push(self.uncertainties[i] / self.uncertaintyInterpret);
        }//for

        // Weighted weightedMean
        var aWm = WeightedMean.calculate(self.values, uncertainties, Number(self.rejectionRange));
        console.log('Weighted Mean:');
        console.log(aWm);
        for (var key in aWm) {
            self[key] = aWm[key];
        }//for
        self.ratio = self.weightedUncertainty / self.weightedMean * 100;
        self.total = self.values.length;

        // Kernel Density Estimation
        var aKde = KernelDensityEstimation.calculate(self.variables, self.values, self.bandwidth, self.kernelFunction);
        for (var key in aKde) {
            self[key] = aKde[key];
        }//for
        console.log('KDE:');
        console.log(aKde);

        //Skewness
        var aSkewness = Skewness.calculate(self.values);
        for (var key in aSkewness) {
            self[key] = aSkewness[key];
        }//for
        console.log('Skewness:');
        console.log(aSkewness);
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