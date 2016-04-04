function ChartView(id) {
    ChartView.OLD_VALUE_DATA = 'oldValue';
    ChartView.VALIDATE_NUMBER_INPUT = /^[0-9]+$/;
    ChartView.DEFAULT_NUMBER_PRECISION = 2;

    var self = this;
    id = typeof id !== 'undefined' ? id : null;
    self.id = id;
    self.weightedMeanChart = null;
    self.KDEChart = null;

    ChartView.chartingControls = {
        // Chart options
        titleCheckBox: '#titleCheckBox',
        borderCheckBox: '#borderCheckBox',
        legendCheckBox: '#legendCheckBox'
    };

    ChartView.inputs = {
        /* Data Preferences */
        // Interpreting Data
        uncertaintyInterpret: '#uncertaintyInterpret',
        rejectionRange      : '#rejectionRange',

        // Kernel Density Estimation
        variablesCount      : '#variablesCount',
        kernelFunction      : '#kernelFunction',
        bandwidth           : '#bandwidth',

        /* Data Preferences */
        // Text Data
        showErrorBarTextData : '#showErrorBarTextData',
        showMeanTextData     : '#showMeanTextData',
        showRejectionTextData: '#showRejectionTextData',
        showSkewnessTextData : '#showSkewnessTextData',

        // Weighted Mean Chart
        // -- Options
        WMShowTitle : '#wmTitleCheckBox',
        WMShowBorder: '#wmBorderCheckBox',
        WMShowLegend: '#wmLegendCheckBox',
        WMShowLabel : '#wmLabelCheckBox',
        // -- Size
        WMChartWidth : '#wmChartWidthNumber',
        WMChartHeight: '#wmChartHeightNumber',
        // -- Data Points & bars
        WMShowPoints   : '#wmPointsCheckBox',
        WMPointsWidth  : '#wmPointsWidth',
        WMPointsColor  : '#wmPointsColor',
        WMShowCaps     : '#wmCapsCheckBox',
        WMBarWidth     : '#wmBarWidth',
        WMBarColor     : '#wmBarColor',
        // -- Mean Line
        WMMeanLineColor: '#wmMeanLineColor',
        // Kernel Density Estimation Chart
        // -- Options
        KDEShowTitle : '#kdeTitleCheckBox',
        KDEShowBorder: '#kdeBorderCheckBox',
        // -- Size
        KDEChartWidth: '#kdeChartWidth',
        // -- Line
        KDELineStyle: '#kdeLineStyle',
        KDELineWidth: '#kdeLineWidth',
        KDELineColor: '#kdeLineColor',

        // Font
        fontBold         : '#fontBoldCheckBox',
        fontItalic       : '#fontItalicCheckBox',
        fontUnderline    : '#fontUnderlineCheckBox',
        fontStrikethrough: '#fontStrikethroughCheckBox',
        fontFamily       : '#fontFamilySelect',
        fontSize         : '#fontSizeNumber',
        fontColor        : '#fontColor',

        /* Axis Preferences */
        // X Axis
        //-- Axis Scale
        xAxisLow    : '#xAxisLow',
        xAxisHigh   : '#xAxisHigh',
        xAxisDivisor: '#xAxisDivisor',
        //-- Grid Lines
        XGridLinesShow : '#xGridCheckBox',
        XGridLineStroke: '#xGridLineStroke',
        XGridLineWidth : '#xGridLineWidth',
        XGridLineColor : '#xGridLineColor',

        // Y Axis
        //-- Axis Scale
        YAxisLow    : '#yAxisLow',
        YAxisHigh   : '#yAxisHigh',
        YAxisDivisor: '#yAxisDivisor',
        //-- Grid Lines
        YGridLinesShow : '#yGridCheckBox',
        YGridLineStroke: '#yGridLineStroke',
        YGridLineWidth : '#yGridLineWidth',
        YGridLineColor : '#yGridLineColor'
    };

    ChartView.textInfoViews = {
        weightedMean            : '#weighted-mean',
        weightedUncertainty     : '#weighted-uncertainty',
        mswd                    : '#mswd',
        ratio                   : '#ratio',
        skewness                : '#skewness',
        rejected                : '#rejected',
        total                   : '#total'
    };

    ChartView.textInput2InfoViewMap = {
        showErrorBarTextData : '#weighted-mean-top-info',
        showMeanTextData     : '#mean-info',
        showRejectionTextData: '#rejected-info',
        showSkewnessTextData : '#skewness-info'
    };

    self.init = function(options) {
        self.initUI();
        self.update();
        self.registerEvents();
    };

    self.initUI = function() {
        // Selects
        $('input[control-type="select"]').selectpicker();

        // Color pickers
        $('input[control-type="color"]').colorPicker({
            flat: true,
            renderCallback: function(elm, toggled) {
                elm.css('color',
                    elm.css('background-color'));
            }
        });

        // Number inputs
        $('input[control-type="number"]').TouchSpin({ verticalbuttons: true});

        // Sliders
        $('input[control-type="slider"]').ionRangeSlider({
            grid: true
        });

        // font family select
        $.each(Util.webSafeFonts(), function(key, value) {
            $(ChartView.inputs.fontFamily).append(
                $('<option>', { value: value }).text(value).css('font-family', value)
            );
        });
    };

    self.update = function() {
        var model = app.getModel(id);

        if (model.dataAvailable) {
            $('#chart-shown').show();
            $('#chart-not-shown').hide();

            self.weightedMeanChart = self.drawWeightedMeanChart();
            self.KDEChart = self.drawKDEChart();
            self.setInfo({precision: ChartView.DEFAULT_NUMBER_PRECISION});
            self.updateCharts({
                axisX: {
                    low: 0,
                    high: 19,
                },
                plugins: [
                    Chartist.plugins.errorBar({
                        showPoint: false,
                        showHLine: false
                    })
                ]
            });
        }//if
        else {
            $('#chart-shown').hide();
            $('#chart-not-shown').show();
        }//else
    };

    self.updateChart = function(chart, newOptions) {
        var options = chart.options;
        options = Chartist.extend({ }, options, newOptions);
        chart.options = options;
        chart.update();
    };

    self.updateWeightedMeanChart = function(options) {
        self.updateChart(self.weightedMeanChart, options);
    };

    self.updateKDEChart = function(options) {
        self.updateChart(self.KDEChart, options);
    };

    self.updateCharts = function(options) {
        self.updateWeightedMeanChart(options);
        self.updateKDEChart(options);
    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $('#saveChartAsPng').click({type:'png'}, controller.saveAs);
        $('#saveChartAsJpg').click({type:'jpg'}, controller.saveAs);
        $('#saveChartAsSvg').click({type:'svg'}, controller.saveAs);
        $('#saveChartAsPdf').click({type:'pdf'}, controller.saveAs);

        $('#control-sidebar input, #control-sidebar select').change(self.onChangeInput);
    };

    self.drawWeightedMeanChart = function() {
        var labels = [];
        var means = [];
        var valuesData = [];
        var model = app.getModel(self.id);
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;

        for (var i = 0; i < model.values.length; ++i) {
            minY = Math.min(minY, model.values[i] - model.uncertainties[i]);
            maxY = Math.max(maxY, model.values[i] + model.uncertainties[i]);
            means.push({
                x: i + 1,
                y: model.weightedMean
            });
            valuesData.push({
                x: i + 1,
                y: model.values[i]
            });
            labels.push(i + 1);
        }//for

        // ChartModel.preferencesList = [
        //     // Weighted Mean Chart
        //     // -- Options
        //     'WMShowTitle',
        //     'WMShowBorder',
        //     'WMShowLegend',
        //     'WMShowLabel',
        //     // -- Size
        //     'WMChartWidth',
        //     'WMChartHeight',
        //     // -- Data Points & bars
        //     'WMShowPoints',
        //     'WMPointsWidth',
        //     'WMPointsColor',
        //     'WMShowCaps',
        //     'WMBarWidth',
        //     'WMBarColor',
        //     // -- Mean Line
        //     'WMMeanLineColor',
        //
        //     /* Axis Preferences */
        //     // X Axis
        //     //-- Axis Scale
        //     'xAxisLow',
        //     'xAxisHigh',
        //     'xAxisDivisor',
        //     //-- Grid Lines
        //     'XGridLinesShow',
        //     'XGridLineStroke',
        //     'XGridLineWidth',
        //     'XGridLineColor',
        //
        //     // Y Axis
        //     //-- Axis Scale
        //     'YAxisLow',
        //     'YAxisHigh',
        //     'YAxisDivisor',
        //     //-- Grid Lines
        //     'YGridLinesShow',
        //     'YGridLineStroke',
        //     'YGridLineWidth',
        //     'YGridLineColor'
        // ];

        console.log('Check here:');
        console.log(model);

        var preferences =  {
            series: {
                'weightedMean': {
                    showLine: true
                },
                'values': {
                    showLine: false
                }
            },
            plugins: [
                Chartist.plugins.errorBar({
                    showPoint: false,
                    showHLine: true,
                    precision: ChartView.DEFAULT_NUMBER_PRECISION
                })
            ],
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            fullWidth: true,
            axisX: {
                //showLabel: false,
                //showGrid: false,
                type: Chartist.AutoScaleAxis,
                low: 1,
                high: model.values.length,
                onlyInteger: true
            },
            axisY: {
                type: Chartist.AutoScaleAxis,
                low: minY,
                high: maxY
            },
            chartPadding: {
                right: 5
            }
        };

        return new Chartist.Line('#weighted-mean-chart-box', {
                labels: labels,
                series: [
                    {
                        name: 'weightedMean',
                        data: means,
                        weightedMean: model.weightedMean,
                        weightedUncertainty: model.weightedUncertainty
                    },
                    {
                        name: 'values',
                        data: model.values,
                        uncertainties: model.uncertainties
                    }
                ]
            },
            preferences
        );
    };

    self.drawKDEChart = function(options) {
        var model = app.getModel(self.id);
        var data = [];
        for (var i = 0; i < model.variables.length; ++i) {
            // We reflect and reverse the data.
            // new X is the reflected of Y's elements
            // new Y is the reversed of X's elements
            data.push({
                //TODO
                x: model.kde[i],
                //x: Math.random() * 1000,
                y: model.variables[model.variables.length - (i + 1)]
            });
        }//for

        var defaultOptions = {
            axisX: {
                type: Chartist.AutoScaleAxis,
                onlyInteger: true,
                //showGrid: false,
                //showLabel: false
            },
            axisY: {
                //showGrid: false,
                //showLabel: false
            },
            showLine: true,
            //showPoint: false,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            fullWidth: true
        };

        options = Chartist.extend({ }, defaultOptions, options);

        return new Chartist.Line('#kde-chart-box', {
                labels: model.kde,
                series: [
                    data
                ]
            },
            options
        );
    };

    self.setInfo = function(options) {
        var model = app.getModel(id);
        var precision = (options != null && options.precision != undefined) ? options.precision : null;
        if (precision != null) {
            $(ChartView.textInfoViews.weightedMean).text(model.weightedMean.toFixed(precision));
            $(ChartView.textInfoViews.weightedUncertainty).text(model.weightedUncertainty.toFixed(precision));
            $(ChartView.textInfoViews.mswd).text(model.mswd.toFixed(precision));
            $(ChartView.textInfoViews.ratio).text(model.ratio.toFixed(precision));
            $(ChartView.textInfoViews.skewness).text(model.skewness.toFixed(precision));
        }//if
        else {
            $(ChartView.textInfoViews.weightedMean).text(model.weightedMean);
            $(ChartView.textInfoViews.weightedUncertainty).text(model.weightedUncertainty);
            $(ChartView.textInfoViews.mswd).text(model.mswd);
            $(ChartView.textInfoViews.ratio).text(model.ratio);
            $(ChartView.textInfoViews.skewness).text(model.skewness);
        }//else

        $(ChartView.textInfoViews.rejected).text(model.rejected);
        $(ChartView.textInfoViews.total).text(model.total);
    };

    self.setInputValue = function(key, value, disableEvent) {
        disableEvent = (disableEvent == undefined) ? false : disableEvent;
        var inputId = ChartView.inputs[key];
        var element = $(inputId);
        var elementType = element.attr('control-type');
        if (disableEvent && elementType !== 'select') {
            element.off('change');
        }//if

        switch (elementType) {
            case 'checkbox':
                element.attr('checked', value);
                break;

            case 'slider':
                var control = element.data("ionRangeSlider");
                control.update(value);
                break;

            case 'number':
                $(element).val(value);
                break;

            case 'color':
                $(element).val(value);
                $(element).css('background-color', value);
                $(element).css('color', value);
                break;

            case 'select':
                console.log($(inputId).selectpicker('val'));
                $(inputId).selectpicker('val', value);
                break;

            default:
                break;
        }//switch

        if (disableEvent && elementType !== 'select') {
            element.change(self.onChangeInput);
        }//if
    };

    self.getInputValue = function(key) {
        var inputId = ChartView.inputs[key];
        var element = $(inputId);
        var elementType = element.attr('control-type');

        var result = null;
        switch (elementType) {
            case 'checkbox':
                result = element.attr('checked');
                break;

            case 'slider':
                result = element.prop("value");
                break;

            case 'number':
                result = $(element).val();
                break;

            case 'color':
                result = $(element).val();
                break;

            case 'select':
                result = $(element).val();
                break;

            default:
                break;
        }//switch

        return result;
    };

    self.onChangeInput = function () {
        // Interpret data
        var controller = app.getController(self.id);

        var input = null;
        var id = '#' + this.id;
        for (var key in ChartView.inputs) {
            if (ChartView.inputs[key] == id) {
                input = key;
                break;
            }//if
        }//for

        var value = self.getInputValue(key);
        controller.inputChanged(input, value);
    };
}