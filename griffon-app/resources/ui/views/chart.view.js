function ChartView(id) {
    ChartView.OLD_VALUE_DATA = 'oldValue';
    ChartView.SLIDER_CONTROL_TYPE = 'slider';
    ChartView.CHECKBOX_CONTROL_TYPE = 'checkbox';
    ChartView.VALIDATE_NUMBER_INPUT = /^[0-9]+$/;
    ChartView.DEFAULT_NUMBER_PRECISION = 2;
    ChartView.SHOW_HIDE_ANIMATION = "slow";
    ChartView.chartingControls = {
        // Chart options
        titleCheckBox: '#titleCheckBox',
        borderCheckBox: '#borderCheckBox'
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
        showMSWDTextData     : '#showMSWDTextData',

        // Weighted Mean Chart
        // -- Options
        WMShowTitle : '#wmTitleCheckBox',
        WMShowBorder: '#wmBorderCheckBox',
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
        // KDEShowBorder: '#kdeBorderCheckBox',
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
        XAxisLow    : '#xAxisLow',
        XAxisHigh   : '#xAxisHigh',
        XAxisDivisor: '#xAxisDivisor',
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
        showSkewnessTextData : '#skewness-info',
        showMSWDTextData     : '#mswd-info',

        // Weighted mean chart title
        WMShowTitle: '#weighted-mean-title',

        // kde chart title
        KDEShowTitle: '#kde-title'
    };

    var self = this;
    id = typeof id !== 'undefined' ? id : null;
    self.id = id;
    self.weightedMeanChart = null;
    self.KDEChart = null;

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
                elm.css('color', elm.css('background-color'));

                // If selected color changes
                if (toggled === undefined) {
                    elm.change();
                }//if
            }
        });

        // Number inputs
        $('input[control-type="number"]').TouchSpin({ verticalbuttons: true});

        // Sliders
        $('input[control-type="slider"]').ionRangeSlider({
            grid: true
        });

        // Float values
        $('input[control-type="real-number"]').numericInput({
            allowFloat   : true,
            allowNegative: false
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

            var preferences = self.preferences();

            self.weightedMeanChart = self.drawWeightedMeanChart(preferences);
            self.KDEChart = self.drawKDEChart(preferences);
            self.setInfo({precision: ChartView.DEFAULT_NUMBER_PRECISION});
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

    self.updateKDEChart = function(preferences) {
        self.updateChart(self.KDEChart, options);
    };

    self.updateCharts = function(preferences) {
        self.updateWeightedMeanChart(preferences);
        self.updateKDEChart(preferences);
    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $('#saveChartAsPng').click({type:'png'}, controller.saveAs);
        $('#saveChartAsJpg').click({type:'jpg'}, controller.saveAs);
        $('#saveChartAsSvg').click({type:'svg'}, controller.saveAs);
        $('#saveChartAsPdf').click({type:'pdf'}, controller.saveAs);

        $('#control-sidebar input, #control-sidebar select').change(self.onChangeInput);
    };

    self.preferences = function() {
        var model = app.getModel(self.id);
        return {
            wm: {
                // border: model.WMShowBorder,
                width : model.WMChartWidth,
                height: model.WMChartHeight,
                label : model.WMShowLabel,
                points: {
                    show : model.WMShowPoints,
                    width: model.WMPointsWidth,
                    color: model.WMPointsColor
                },
                bars: {
                    showCaps: model.WMShowCaps,
                    width   : model.WMBarWidth,
                    color   : model.WMBarColor
                },
                meanLineColor: model.WMMeanLineColor,
                xAxis: {
                    low: model.XAxisLow,
                    high: model.XAxisHigh,
                    divisor: model.XAxisDivisor,
                    gridLines: {
                        show : model.XGridLinesShow,
                        style: model.XGridLineStroke,
                        size : model.XGridLineWidth,
                        color: model.XGridLineColor
                    }
                },
                yAxis: {
                    low:     model.YAxisLow,
                    high:    model.YAxisHigh,
                    divisor: model.YAxisDivisor,
                    gridLines: {
                        show : model.YGridLinesShow,
                        style: model.YGridLineStroke,
                        size : model.YGridLineWidth,
                        color: model.YGridLineColor
                    }
                }
            },
            kde: {
                // border: model.KDEShowBorder,
                width : model.KDEChartWidth,
                line  : {
                    style: model.KDELineStyle,
                    width: model.KDELineWidth,
                    color: model.KDELineColor
                }
            },
            fonts: {
                bold  : model.fontBold,
                italic: model.fontItalic,
                underline: model.fontUnderline,
                strikethrough: model.fontStrikethrough,
                color: model.fontColor,
                family: model.fontFamily,
                size: model.fontSize
            }
        };
    };

    self.drawWeightedMeanChart = function(preferences) {
        var labels = [];
        var means = [];
        var valuesData = [];
        var model = app.getModel(self.id);
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;

        for (var i = 0; i < model.values.length; ++i) {
            minY = Math.min(minY, model.values[i] - 2 * model.uncertainties[i]);
            maxY = Math.max(maxY, model.values[i] + 2 * model.uncertainties[i]);
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

        console.log('preferences');
        console.log(preferences);

        var options = {
            series: {
                'weightedMean': {
                    showLine: true
                },
                'values': {
                    showLine : true,
                    showPoint: true,
                    showHLine: true
                }
            },
            axisX: {
                showLabel: preferences.wm.label,
                showGrid: false,
                low: 1,
                high: model.values.length,
                onlyInteger: true
            },
            axisY: {
                type: Chartist.AutoScaleAxis,
                low: minY,
                high: maxY
            },
            plugins: [
                Chartist.plugins.errorBar(
                    // {
                    //     points: preferences.wm.points,
                    //     bars  : preferences.wm.bars,
                    //     meanLineColor: preferences.wm.meanLineColor
                    // }
                    preferences.wm
                )
            ],
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            fullWidth: true,
            chartPadding: {
                right: 5
            }
        };

        console.log('Check here:');
        console.log(model);

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
            options
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

            case 'real-number':
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
                result = document.getElementById(element.attr('id')).checked;
                break;

            case 'slider':
                result = element.prop("value");
                break;

            case 'number':
                result = $(element).val();
                break;

            case 'real-number':
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
        var controlType = $(this).attr('control-type');
        for (var key in ChartView.inputs) {
            if (ChartView.inputs[key] === id) {
                input = key;
                break;
            }//if
        }//for
        if (input !== null) {
            var value = null;
            if (controlType == ChartView.SLIDER_CONTROL_TYPE)
                value = {
                    min: $(this).data('ionRangeSlider').result.min,
                    max: $(this).data('ionRangeSlider').result.max,
                    from: $(this).data('ionRangeSlider').result.from
                };
            else
                value = self.getInputValue(key);

            controller.inputChanged(input, value);
        }//if
    };

    self.hideTextData = function(whichTextInfo) {
        $(ChartView.textInput2InfoViewMap[whichTextInfo]).hide(ChartView.SHOW_HIDE_ANIMATION);
    };

    self.showTextData = function(whichTextInfo) {
        $(ChartView.textInput2InfoViewMap[whichTextInfo]).show(ChartView.SHOW_HIDE_ANIMATION);
    };
}