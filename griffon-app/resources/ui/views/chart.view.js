function ChartView(id) {
    ChartView.OLD_VALUE_DATA           = 'oldValue';
    ChartView.SLIDER_CONTROL_TYPE      = 'slider';
    ChartView.CHECKBOX_CONTROL_TYPE    = 'checkbox';
    ChartView.NUMBER_CONTROL_TYPE      = 'number';
    ChartView.VALIDATE_NUMBER_INPUT    = /^[0-9]+$/;
    ChartView.DEFAULT_NUMBER_PRECISION = 2;
    ChartView.SHOW_HIDE_ANIMATION      = "slow";
    ChartView.CHART_BOX                = "#chart-box";
    ChartView.WM_CHART_BOX             = '#weighted-mean-chart-box';
    ChartView.KDE_CHART_BOX            = '#kde-chart-box';
    ChartView.TITLE_BOX                = '#title-box';
    ChartView.WM_TITLE_TEXT            = "#wm-title-text";
    ChartView.KDE_TITLE_TEXT           = "#kde-title-text";
    ChartView.TEXT_BOX                 = '#text-box';
    ChartView.WM_TEXT_BOX              = '#wm-text-info';
    ChartView.KDE_TEXT_BOX             = '#skewness-info';
    ChartView.WM_CHART_PADDING_DEFAULT = {
        top   : 0,
        bottom: 0,
        right : 10,
        left  : 10
    };
    ChartView.KDE_CHART_PADDING_DEFAULT= {
        top   : 0,
        bottom: 0,
        right : 10,
        left  : 10
    };
    ChartView.DEFAULT_CLASSES          = {
        wm: {
            points  : 'wmPoints',
            bars    : 'wmBars',
            rejectedPoints: 'wmRejectedPoints',
            rejectedBars  : 'wmRejectedBars',
            meanBox : 'wmBox',
            meanLine: 'wmLine',
            xAxis: {
                gridLines: 'wmXGridLines',
                labels   : 'wmXLabels'
            },
            yAxis: {
                gridLines: 'wmYGridLines',
                labels   : 'wmYLabels'
            }
        },
        kde: {
            points: 'kdePoints',
            bars: 'kdeBars',
            xAxis: {
                gridLines: 'kdeXGridLines',
                labels   : 'kdeXLabels'
            },
            yAxis: {
                gridLines: 'kdeYGridLines',
                labels   : 'kdeYLabels'
            }
        }
    };
    ChartView.DEFAULT_TITLES           = {
        WMTitle         : 'Weighted Mean',
        KDETitle        : 'Kernel Density Estimation'
    };
    ChartView.DEFAULT_TEXT_INFO        = {
        weightedMeanInfo: 'Mean = {weightedMean} ± {weightedUncertainty} [{ratio}%]',
        rejectionInfo   : 'Wtd by data-pt errs {rejected} of {total} rej.',
        mswdInfo        : 'MSWD = {mswd}',
        errorBarInfo    : "(error bars are 2 σ)",
        skewnessInfo    : 'Skewness = {skewness}'
    };
    ChartView.SCALE_TEXT_HEIGHT        = 1.095;
    ChartView.chartingControls         = {
        // Chart options
        titleCheckBox: '#titleCheckBox',
        borderCheckBox: '#borderCheckBox'
    };
    ChartView.inputs                   = {
        /* Data Preferences */

        // Interpreting Data
        uncertaintyInterpret: '#uncertaintyInterpret',
        rejectionRange      : '#rejectionRange',

        // Kernel Density Estimation
        variablesCount      : '#variablesCount',
        kernelFunction      : '#kernelFunction',
        bandwidth           : '#bandwidth',

        /* Chart Preferences */
        // Weighted Mean
        //-- Title
        WMShowTitle             : '#wmTitleCheckBox',
        WMTitleText             : '#wmTitleTextBox',
        WMTitleFontFamily       : '#wmTitleFontFamilySelect',
        WMTitleFontSize         : '#wmTitleFontSizeNumber',
        WMTitleFontBold         : '#wmTitleFontBoldCheckBox',
        WMTitleFontItalic       : '#wmTitleFontItalicCheckBox',
        WMTitleFontUnderline    : '#wmTitleFontUnderlineCheckBox',
        WMTitleFontStrikethrough: '#wmTitleFontStrikethroughCheckBox',
        WMTitleFontColor        : '#wmTitleFontColor',

        //-- Text
        showErrorBarTextData : '#showErrorBarTextData',
        showMeanTextData     : '#showMeanTextData',
        showRejectionTextData: '#showRejectionTextData',
        showMSWDTextData     : '#showMSWDTextData',
        WMTextFontFamily       : '#wmTextFontFamilySelect',
        WMTextFontSize         : '#wmTextFontSizeNumber',
        WMTextFontBold         : '#wmTextFontBoldCheckBox',
        WMTextFontItalic       : '#wmTextFontItalicCheckBox',
        WMTextFontUnderline    : '#wmTextFontUnderlineCheckBox',
        WMTextFontStrikethrough: '#wmTextFontStrikethroughCheckBox',
        WMTextFontColor        : '#wmTextFontColor',

        //-- Size
        WMChartWidth : '#wmChartWidthNumber',
        WMChartHeight: '#wmChartHeightNumber',

        //-- Data Points & bars
        WMShowPoints   : '#wmPointsCheckBox',
        WMPointsWidth  : '#wmPointsWidth',
        WMPointsColor  : '#wmPointsColor',
        WMShowCaps     : '#wmCapsCheckBox',
        WMBarWidth     : '#wmBarWidth',
        WMBarColor     : '#wmBarColor',

        //-- Rejected Data Points & bars
        WMShowRejectedPoints   : '#wmRejectedPointsCheckBox',
        WMRejectedPointsWidth  : '#wmRejectedPointsWidth',
        WMRejectedPointsColor  : '#wmRejectedPointsColor',
        WMShowRejectedCaps     : '#wmRejectedCapsCheckBox',
        WMRejectedBarWidth     : '#wmRejectedBarWidth',
        WMRejectedBarColor     : '#wmRejectedBarColor',

        //-- Mean
        WMBoxColor : '#wmBoxColor',
        WMLineStyle: '#wmLineStyle',
        WMLineWidth: '#wmLineWidth',
        WMLineColor: '#wmLineColor',

        // Kernel Density Estimation Chart
        //-- Title
        KDEShowTitle             : '#kdeTitleCheckBox',
        KDETitleText             : '#kdeTitleTextBox',
        KDETitleFontFamily       : '#kdeTitleFontFamilySelect',
        KDETitleFontSize         : '#kdeTitleFontSizeNumber',
        KDETitleFontBold         : '#kdeTitleFontBoldCheckBox',
        KDETitleFontItalic       : '#kdeTitleFontItalicCheckBox',
        KDETitleFontUnderline    : '#kdeTitleFontUnderlineCheckBox',
        KDETitleFontStrikethrough: '#kdeTitleFontStrikethroughCheckBox',
        KDETitleFontColor        : '#kdeTitleFontColor',
        // -- Text
        showSkewnessTextData    : '#showSkewnessTextData',
        KDETextFontFamily       : '#kdeTextFontFamilySelect',
        KDETextFontSize         : '#kdeTextFontSizeNumber',
        KDETextFontBold         : '#kdeTextFontBoldCheckBox',
        KDETextFontItalic       : '#kdeTextFontItalicCheckBox',
        KDETextFontUnderline    : '#kdeTextFontUnderlineCheckBox',
        KDETextFontStrikethrough: '#kdeTextFontStrikethroughCheckBox',
        KDETextFontColor        : '#kdeTextFontColor',

        // Size
        KDEChartWidth: '#kdeChartWidth',
        // Line
        KDELineStyle: '#kdeLineStyle',
        KDELineWidth: '#kdeLineWidth',
        KDELineColor: '#kdeLineColor',

        /* Axis Preferences */
        // WM X Axis
        //-- Axis Scale
        WMXAxisLow : '#wmXAxisLow',
        WMXAxisHigh: '#wmXAxisHigh',
        WMXAxisUnit: '#wmXAxisUnit',
        //-- Grid Lines
        WMXGridLinesShow : '#wmXGridCheckBox',
        WMXGridLineStroke: '#wmXGridLineStroke',
        WMXGridLineWidth : '#wmXGridLineWidth',
        WMXGridLineColor : '#wmXGridLineColor',
        //-- Labels
        WMXLabelsShow: '#wmXLabelsCheckBox',
        WMXLabelsFontFamily       : '#wmXLabelsFontFamilySelect',
        WMXLabelsFontSize         : '#wmXLabelsFontSizeNumber',
        WMXLabelsFontBold         : '#wmXLabelsFontBoldCheckBox',
        WMXLabelsFontItalic       : '#wmXLabelsFontItalicCheckBox',
        WMXLabelsFontUnderline    : '#wmXLabelsFontUnderlineCheckBox',
        WMXLabelsFontStrikethrough: '#wmXLabelsFontStrikethroughCheckBox',
        WMXLabelsFontColor        : '#wmXLabelsFontColor',

        // WM Y Axis
        //-- Axis Scale
        WMYAxisLow : '#wmYAxisLow',
        WMYAxisHigh: '#wmYAxisHigh',
        WMYAxisUnit: '#wmYAxisUnit',
        //-- Grid Lines
        WMYGridLinesShow : '#wmYGridCheckBox',
        WMYGridLineStroke: '#wmYGridLineStroke',
        WMYGridLineWidth : '#wmYGridLineWidth',
        WMYGridLineColor : '#wmYGridLineColor',
        //-- Labels
        WMYLabelsShow: '#wmYLabelsCheckBox',
        WMYLabelsFontFamily       : '#wmYLabelsFontFamilySelect',
        WMYLabelsFontSize         : '#wmYLabelsFontSizeNumber',
        WMYLabelsFontBold         : '#wmYLabelsFontBoldCheckBox',
        WMYLabelsFontItalic       : '#wmYLabelsFontItalicCheckBox',
        WMYLabelsFontUnderline    : '#wmYLabelsFontUnderlineCheckBox',
        WMYLabelsFontStrikethrough: '#wmYLabelsFontStrikethroughCheckBox',
        WMYLabelsFontColor        : '#wmYLabelsFontColor',

        // KDE X Axis
        //-- Axis Scale
        KDEXAxisLow : '#kdeXAxisLow',
        KDEXAxisHigh: '#kdeXAxisHigh',
        KDEXAxisUnit: '#kdeXAxisUnit',
        //-- Grid Lines
        KDEXGridLinesShow : '#kdeXGridCheckBox',
        KDEXGridLineStroke: '#kdeXGridLineStroke',
        KDEXGridLineWidth : '#kdeXGridLineWidth',
        KDEXGridLineColor : '#kdeXGridLineColor',
        //-- Labels
        KDEXLabelsShow: '#kdeXLabelsCheckBox',
        KDEXLabelsFontFamily       : '#kdeXLabelsFontFamilySelect',
        KDEXLabelsFontSize         : '#kdeXLabelsFontSizeNumber',
        KDEXLabelsFontBold         : '#kdeXLabelsFontBoldCheckBox',
        KDEXLabelsFontItalic       : '#kdeXLabelsFontItalicCheckBox',
        KDEXLabelsFontUnderline    : '#kdeXLabelsFontUnderlineCheckBox',
        KDEXLabelsFontStrikethrough: '#kdeXLabelsFontStrikethroughCheckBox',
        KDEXLabelsFontColor        : '#kdeXLabelsFontColor',

        // KDE Y Axis
        //-- Axis Scale
        // KDEYAxisLow : '#kdeYAxisLow',
        // KDEYAxisHigh: '#kdeYAxisHigh',
        // KDEYAxisUnit: '#kdeYAxisUnit',
        //-- Grid Lines
        KDEYGridLinesShow : '#kdeYGridCheckBox',
        KDEYGridLineStroke: '#kdeYGridLineStroke',
        KDEYGridLineWidth : '#kdeYGridLineWidth',
        KDEYGridLineColor : '#kdeYGridLineColor',
        //-- Labels
        KDEYLabelsShow: '#kdeYLabelsCheckBox',
        KDEYLabelsFontFamily       : '#kdeYLabelsFontFamilySelect',
        KDEYLabelsFontSize         : '#kdeYLabelsFontSizeNumber',
        KDEYLabelsFontBold         : '#kdeYLabelsFontBoldCheckBox',
        KDEYLabelsFontItalic       : '#kdeYLabelsFontItalicCheckBox',
        KDEYLabelsFontUnderline    : '#kdeYLabelsFontUnderlineCheckBox',
        KDEYLabelsFontStrikethrough: '#kdeYLabelsFontStrikethroughCheckBox',
        KDEYLabelsFontColor        : '#kdeYLabelsFontColor',
    };
    ChartView.textInfoViews            = {
        weightedMeanInfo: '#mean-info',
        rejectionInfo   : '#rejected-info',
        mswdInfo        : '#mswd-info',
        errorBarInfo    : '#error-bar-info',
        skewnessInfo    : '#skewness-info'
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
            $('.font-families').append(
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

            // Draw titles
            self.drawTitle(preferences);

            // // Draw text
            self.drawText(preferences);

            // Correct plot
            self.correctPlot(preferences);
        }//if
        else {
            $('#chart-shown').hide();
            $('#chart-not-shown').show();
        }//else
    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $('#saveChartAsPng').click({type:'png'}, controller.saveAs);
        $('#saveChartAsSvg').click({type:'svg'}, controller.saveAs);
        $('#saveChartAsPdf').click({type:'pdf'}, controller.saveAs);
        $('#saveChartAsEps').click({type:'eps'}, controller.saveAs);

        $('#control-sidebar input, #control-sidebar select').change(self.onChangeInput);

        $('#resetAll').click({}, controller.resetAndPlot);
    };

    self.preferences = function() {
        var model = app.getModel(self.id);
        return {
            wm: {
                // border: model.WMShowBorder,
                size: {
                    width: model.WMChartWidth,
                    height: model.WMChartHeight
                },
                points: {
                    show : model.WMShowPoints,
                    width: model.WMPointsWidth,
                    color: model.WMPointsColor,
                    class: ChartView.DEFAULT_CLASSES.wm.points
                },
                bars: {
                    showCaps: model.WMShowCaps,
                    width   : model.WMBarWidth,
                    color   : model.WMBarColor,
                    class: ChartView.DEFAULT_CLASSES.wm.bars
                },
                rejectedPoints: {
                    show : model.WMShowRejectedPoints,
                    width: model.WMRejectedPointsWidth,
                    color: model.WMRejectedPointsColor,
                    class: ChartView.DEFAULT_CLASSES.wm.rejectedPoints
                },
                rejectedBars: {
                    showCaps: model.WMShowRejectedCaps,
                    width   : model.WMRejectedBarWidth,
                    color   : model.WMRejectedBarColor,
                    class: ChartView.DEFAULT_CLASSES.wm.rejectedBars
                },
                meanBox: {
                    show : true,
                    color: model.WMBoxColor,
                    class: ChartView.DEFAULT_CLASSES.wm.meanBox
                },
                meanLine: {
                    style: model.WMLineStyle,
                    width: model.WMLineWidth,
                    color: model.WMLineColor,
                    class: ChartView.DEFAULT_CLASSES.wm.meanLine
                },
                xAxis: {
                    scales: {
                        low: model.WMXAxisLow,
                        high: model.WMXAxisHigh,
                        unit: model.WMXAxisUnit,
                        divisor: model.WMXAxisDivisor
                    },
                    gridLines: {
                        show : model.WMXGridLinesShow,
                        style: model.WMXGridLineStroke,
                        width: model.WMXGridLineWidth,
                        color: model.WMXGridLineColor,
                        class: ChartView.DEFAULT_CLASSES.wm.xAxis.gridLines
                    },
                    labels: {
                        show : model.WMXLabelsShow,
                        font : {
                            fontFamily: model.WMXLabelsFontFamily,
                            fontSize  : model.WMXLabelsFontSize,
                            fontItalic: model.WMXLabelsFontItalic,
                            fontBold  : model.WMXLabelsFontBold,
                            fontUnderline    : model.WMXLabelsFontUnderline,
                            fontStrikethrough: model.WMXLabelsFontStrikethrough,
                            fontColor        : model.WMXLabelsFontColor
                        },
                        class: ChartView.DEFAULT_CLASSES.wm.xAxis.labels
                    }
                },
                yAxis: {
                    scales: {
                        low: model.WMYAxisLow,
                        high: model.WMYAxisHigh,
                        unit: model.WMYAxisUnit,
                        divisor: model.WMYAxisDivisor,
                    },
                    gridLines: {
                        show : model.WMYGridLinesShow,
                        style: model.WMYGridLineStroke,
                        width: model.WMYGridLineWidth,
                        color: model.WMYGridLineColor,
                        class: ChartView.DEFAULT_CLASSES.wm.yAxis.gridLines
                    },
                    labels: {
                        show : model.WMYLabelsShow,
                        font : {
                            fontFamily: model.WMYLabelsFontFamily,
                            fontSize  : model.WMYLabelsFontSize,
                            fontItalic: model.WMYLabelsFontItalic,
                            fontBold  : model.WMYLabelsFontBold,
                            fontUnderline    : model.WMYLabelsFontUnderline,
                            fontStrikethrough: model.WMYLabelsFontStrikethrough,
                            fontColor        : model.WMYLabelsFontColor
                        },
                        class: ChartView.DEFAULT_CLASSES.wm.yAxis.labels
                    }
                },
                title: {
                    text: model.WMTitleText,
                    show: model.WMShowTitle,
                    value: 0,
                    font : {
                        fontFamily: model.WMTitleFontFamily,
                        fontSize  : model.WMTitleFontSize,
                        fontItalic: model.WMTitleFontItalic,
                        fontBold  : model.WMTitleFontBold,
                        fontUnderline    : model.WMTitleFontUnderline,
                        fontStrikethrough: model.WMTitleFontStrikethrough,
                        fontColor        : model.WMTitleFontColor
                    }
                }
            },
            kde: {
                // border: model.KDEShowBorder,
                size : {
                    width : model.KDEChartWidth,
                    height: model.WMChartHeight
                },
                lines: {
                    style: model.KDELineStyle,
                    width: model.KDELineWidth,
                    color: model.KDELineColor,
                    class: ChartView.DEFAULT_CLASSES.kde.lines
                },
                xAxis: {
                    scales: {
                        low: model.KDEXAxisLow,
                        high: model.KDEXAxisHigh,
                        unit: model.KDEXAxisUnit,
                        divisor: model.KDEXAxisDivisor
                    },
                    gridLines: {
                        show : model.KDEXGridLinesShow,
                        style: model.KDEXGridLineStroke,
                        width: model.KDEXGridLineWidth,
                        color: model.KDEXGridLineColor,
                        class: ChartView.DEFAULT_CLASSES.kde.xAxis.gridLines
                    },
                    labels: {
                        show : model.KDEXLabelsShow,
                        font : {
                            fontFamily: model.KDEXLabelsFontFamily,
                            fontSize  : model.KDEXLabelsFontSize,
                            fontItalic: model.KDEXLabelsFontItalic,
                            fontBold  : model.KDEXLabelsFontBold,
                            fontUnderline    : model.KDEXLabelsFontUnderline,
                            fontStrikethrough: model.KDEXLabelsFontStrikethrough,
                            fontColor        : model.KDEXLabelsFontColor
                        },
                        class: ChartView.DEFAULT_CLASSES.kde.xAxis.labels
                    }
                },
                yAxis: {
                    // The scale is same as the weighted mean chart
                    scales: {
                        low : model.WMYAxisLow,
                        high: model.WMYAxisHigh,
                        unit: model.WMYAxisUnit,
                        divisor: model.WMYAxisDivisor,
                    },
                    gridLines: {
                        show : model.KDEYGridLinesShow,
                        style: model.KDEYGridLineStroke,
                        width: model.KDEYGridLineWidth,
                        color: model.KDEYGridLineColor,
                        class: ChartView.DEFAULT_CLASSES.kde.yAxis.gridLines
                    },
                    labels: {
                        show : model.KDEYLabelsShow,
                        font : {
                            fontFamily: model.KDEYLabelsFontFamily,
                            fontSize  : model.KDEYLabelsFontSize,
                            fontItalic: model.KDEYLabelsFontItalic,
                            fontBold  : model.KDEYLabelsFontBold,
                            fontUnderline    : model.KDEYLabelsFontUnderline,
                            fontStrikethrough: model.KDEYLabelsFontStrikethrough,
                            fontColor        : model.KDEYLabelsFontColor
                        },
                        class: ChartView.DEFAULT_CLASSES.kde.yAxis.labels
                    }
                },
                title: {
                    text: model.KDETitleText,
                    show: model.KDEShowTitle,
                    value: 0,
                    font : {
                        fontFamily: model.KDETitleFontFamily,
                        fontSize  : model.KDETitleFontSize,
                        fontItalic: model.KDETitleFontItalic,
                        fontBold  : model.KDETitleFontBold,
                        fontUnderline    : model.KDETitleFontUnderline,
                        fontStrikethrough: model.KDETitleFontStrikethrough,
                        fontColor        : model.KDETitleFontColor
                    }
                }
            },
            WMText: {
                errorBar: {
                    show: model.showErrorBarTextData
                },
                weightedMean: {
                    show: model.showMeanTextData
                },
                rejection: {
                    show: model.showRejectionTextData
                },
                mswd: {
                    show: model.showMSWDTextData
                },
                font : {
                    fontFamily: model.WMTextFontFamily,
                    fontSize  : model.WMTextFontSize,
                    fontItalic: model.WMTextFontItalic,
                    fontBold  : model.WMTextFontBold,
                    fontUnderline    : model.WMTextFontUnderline,
                    fontStrikethrough: model.WMTextFontStrikethrough,
                    fontColor        : model.WMTextFontColor
                }
            },
            KDEText: {
                skewness: {
                    show: model.showSkewnessTextData
                },
                font : {
                    fontFamily: model.KDETextFontFamily,
                    fontSize  : model.KDETextFontSize,
                    fontItalic: model.KDETextFontItalic,
                    fontBold  : model.KDETextFontBold,
                    fontUnderline    : model.KDETextFontUnderline,
                    fontStrikethrough: model.KDETextFontStrikethrough,
                    fontColor        : model.KDETextFontColor
                }
            },
            precision: 2
        };
    };

    self.stretch = function(query, plusWidth, plusHeight, fromZero) {
        fromZero = (fromZero == undefined) ? false : fromZero;
        var width  = (fromZero == true) ? 0 : $(query).attr('width');
        var height = (fromZero == true) ? 0 : $(query).attr('height');
        width  = (width  == undefined) ? 0 : parseFloat(width);
        height = (height == undefined) ? 0 : parseFloat(height);
        $(query).attr({
            width : width  + plusWidth,
            height: height + plusHeight
        });
    };

    self.shift = function(query, right, down, fromZero) {
        fromZero = (fromZero == undefined) ? false : fromZero;
        var x = (fromZero == true) ? 0 : $(query).attr('x');
        var y = (fromZero == true) ? 0 : $(query).attr('y');
        x = (x == undefined) ? 0 : parseFloat(x);
        y = (y == undefined) ? 0 : parseFloat(y);
        $(query).attr({
            x: x + right,
            y: y + down
        });
    };

    self.correctPlot = function(preferences) {
        var wmTitleHeight  = $(ChartView.WM_TITLE_TEXT ).height();
        var kdeTitleHeight = $(ChartView.KDE_TITLE_TEXT).height();
        var titleHeight    = Math.max(wmTitleHeight, kdeTitleHeight) * ChartView.SCALE_TEXT_HEIGHT;
        var textHeight     = Math.max($(ChartView.WM_TEXT_BOX).height(), $(ChartView.KDE_TEXT_BOX).height()) * ChartView.SCALE_TEXT_HEIGHT;

        // Title
        self.stretch(ChartView.TITLE_BOX, preferences.wm.size.width + preferences.kde.size.width, titleHeight, true);

        // WM Chart
        self.stretch(ChartView.WM_CHART_BOX, preferences.wm.size.width, preferences.wm.size.height, true);
        self.shift  (ChartView.WM_CHART_BOX, 0, titleHeight, true);

        // KDE Chart
        self.stretch(ChartView.KDE_CHART_BOX, preferences.kde.size.width, preferences.kde.size.height, true);
        self.shift  (ChartView.KDE_CHART_BOX, preferences.wm.size.width , titleHeight, true);

        // Text
        self.stretch(ChartView.TEXT_BOX, preferences.wm.size.width + preferences.kde.size.width, textHeight, true);
        self.shift  (ChartView.TEXT_BOX, 0, titleHeight + preferences.wm.size.height, true);
        // // If the text box height is greater than the current calculated value, the text box height is updated
        // textHeight = Math.max(textHeight, $(ChartView.TEXT_BOX).height());
        // self.stretch(ChartView.TEXT_BOX, preferences.wm.size.width + preferences.kde.size.width, textHeight, true);

        // Chart Box
        self.stretch(ChartView.CHART_BOX,
            preferences.wm.size.width  + preferences.kde.size.width,
            titleHeight + preferences.wm.size.height + textHeight,
            true
        );
    };

    self.drawWeightedMeanChart = function(preferences) {
        // Stretch chart boxes
        self.stretch(ChartView.WM_CHART_BOX, preferences.wm.size.width, preferences.wm.size.height, true);

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
        var options = {
            series: {
                "weightedMean": {
                    showLine: true
                },
                'values': {
                    showLine : true,
                    showPoint: true,
                    showHLine: true
                }
            },
            axisX: {
                showLabel: preferences.wm.xAxis.labels.show,
                showGrid : preferences.wm.xAxis.gridLines.show,
                type:      Chartist.FixedScaleAxis,
                unit:      preferences.wm.xAxis.scales.unit,
                divisor:   preferences.wm.xAxis.scales.divisor,
                low :      preferences.wm.xAxis.scales.low,
                high:      preferences.wm.xAxis.scales.low + preferences.wm.xAxis.scales.unit * preferences.wm.xAxis.scales.divisor,
            },
            axisY: {
                showLabel: preferences.wm.yAxis.labels.show,
                showGrid : preferences.wm.yAxis.gridLines.show,
                type:      Chartist.FixedScaleAxis,
                unit:      preferences.wm.yAxis.scales.unit,
                divisor:   preferences.wm.yAxis.scales.divisor,
                low :      preferences.wm.yAxis.scales.low,
                high:      preferences.wm.yAxis.scales.low + preferences.wm.yAxis.scales.unit * preferences.wm.yAxis.scales.divisor,
            },
            plugins: [
                Chartist.plugins.weightedMean(
                    preferences.wm
                )
            ],
            chartPadding: ChartView.WM_CHART_PADDING_DEFAULT,
            width : preferences.wm.size.width,
            height: preferences.wm.size.height,
            fullWidth: true
        };

        // Fix axis ranges
        if (options.axisX.high < preferences.wm.xAxis.scales.high)
            options.axisX.high += preferences.wm.xAxis.scales.unit;

        if (options.axisY.high < preferences.wm.yAxis.scales.high)
            options.axisY.high += preferences.wm.yAxis.scales.unit;

        var uncertainties = [];
        for (var i = 0; i < model.uncertainties.length; ++i) {
            uncertainties.push(model.uncertainties[i] / model.uncertaintyInterpret);
        }//for

        return new Chartist.Line(ChartView.WM_CHART_BOX, {
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
                        uncertainties: uncertainties,
                        rejectedIndices: model.rejectedIndices,
                    }
                ]
            },
            options
        );
    };

    self.drawKDEChart = function(preferences) {
        // Stretch chart box
        self.stretch(ChartView.KDE_CHART_BOX  , preferences.kde.size.width, preferences.kde.size.height);

        var model = app.getModel(self.id);
        var data = [];
        for (var i = 0; i < model.variables.length; ++i) {
            // We reflect and reverse the data.
            // new X is the reflected of Y's elements
            // new Y is the reversed of X's elements
            data.push({
                //TODO
                x: model.kde[i],
                y: model.variables[i]
            });
        }//for

        var options = {
            axisX: {
                showLabel: preferences.kde.xAxis.labels.show,
                showGrid : preferences.kde.xAxis.gridLines.show,
                type:      Chartist.FixedScaleAxis,
                divisor:   preferences.kde.xAxis.scales.divisor,
                low :      preferences.kde.xAxis.scales.low,
                high:      preferences.kde.xAxis.scales.low + preferences.kde.xAxis.scales.unit * preferences.kde.xAxis.scales.divisor,
            },
            axisY: {
                showLabel: preferences.kde.yAxis.labels.show,
                showGrid : preferences.kde.yAxis.gridLines.show,
                type:      Chartist.FixedScaleAxis,
                low :      preferences.kde.yAxis.scales.low,
                high:      preferences.kde.yAxis.scales.low + preferences.kde.yAxis.scales.unit * preferences.kde.yAxis.scales.divisor,
                divisor:   preferences.kde.yAxis.scales.divisor
            },
            plugins: [
                Chartist.plugins.kernelDensityEstimation(
                    preferences.kde
                )
            ],
            chartPadding: ChartView.KDE_CHART_PADDING_DEFAULT,
            width : preferences.kde.size.width,
            height: preferences.kde.size.height,
            fullWidth: true
        };

        // Fix axis ranges
        if (options.axisX.high < preferences.kde.xAxis.scales.high)
            options.axisX.high += preferences.kde.xAxis.scales.unit;

        if (options.axisY.high < preferences.kde.yAxis.scales.high)
            options.axisY.high += preferences.kde.yAxis.scales.unit;

        return new Chartist.Line('#kde-chart-box', {
                labels: model.kde,
                series: [
                    data
                ]
            },
            options
        );
    };

    self.drawTitle = function(preferences) {
        // Draw WM chart title
        var wmTitle = document.getElementById(ChartView.WM_TITLE_TEXT.substring(1, ChartView.WM_TITLE_TEXT.length));
        if (preferences.wm.title.show == true) {
            wmTitle.textContent = preferences.wm.title.text;
            $(ChartView.WM_TITLE_TEXT).attr({
                style: Util.preferencesToCssStyles(preferences.wm.title.font, 'svgFonts'),
                x: preferences.wm.size.width / 2
            });
        }//if
        else {
            wmTitle.textContent = null;
        }//else

        // Draw KDE-chart title
        var kdeTitle = document.getElementById(ChartView.KDE_TITLE_TEXT.substring(1, ChartView.KDE_TITLE_TEXT.length));
        if (preferences.kde.title.show == true) {
            kdeTitle.textContent = preferences.kde.title.text;
            $(ChartView.KDE_TITLE_TEXT).attr({
                style: Util.preferencesToCssStyles(preferences.kde.title.font, 'svgFonts'),
                x: preferences.wm.size.width + (preferences.kde.size.width / 2)
            });
        }//if
        else {
            kdeTitle.textContent = null;
        }//else
    };

    self.drawText = function(preferences) {
        self.setInfo(preferences);

        $(ChartView.textInfoViews.weightedMeanInfo + ',' +
          ChartView.textInfoViews.mswdInfo         + ',' +
          ChartView.textInfoViews.rejectionInfo    + ',' +
          ChartView.textInfoViews.errorBarInfo).attr({
            x    : preferences.wm.size.width / 2,
            style: Util.preferencesToCssStyles(preferences.WMText.font, 'svgFonts')
        });

        $(ChartView.textInfoViews.skewnessInfo).attr({
            x    : preferences.wm.size.width + (preferences.kde.size.width / 2),
            y    : 0,
            style: Util.preferencesToCssStyles(preferences.KDEText.font, 'svgFonts')
        });
    };

    self.setInfo = function(preferences) {
        var model = app.getModel(id);
        var precision = (preferences != null && preferences.precision != undefined) ? preferences.precision : null;

        var weightedMeanInfo = document.getElementById(
            ChartView.textInfoViews.weightedMeanInfo.substring(1, ChartView.textInfoViews.weightedMeanInfo.length));
        var mswdInfo = document.getElementById(
            ChartView.textInfoViews.mswdInfo.substring(1, ChartView.textInfoViews.mswdInfo.length));
        var skewnessInfo = document.getElementById(
            ChartView.textInfoViews.skewnessInfo.substring(1, ChartView.textInfoViews.skewnessInfo.length));

        if (precision != null) {
            weightedMeanInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.weightedMeanInfo, {
                weightedMean       : model.weightedMean.toFixed(precision),
                weightedUncertainty: (model.weightedUncertainty * 2).toFixed(precision),
                ratio              : model.ratio.toFixed(precision)
            });
            mswdInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.mswdInfo, {
                mswd: model.mswd.toFixed(precision)
            });
            skewnessInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.skewnessInfo, {
                skewness: model.skewness.toFixed(precision)
            });

        }//if
        else {
            weightedMeanInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.weightedMeanInfo, {
                weightedMean       : model.weightedMean,
                weightedUncertainty: (model.weightedUncertainty * 2),
                ratio              : model.ratio
            });
            mswdInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.mswdInfo, {
                mswd: model.mswd
            });
            skewnessInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.skewnessInfo, {
                skewness: model.skewness
            });

        }//else

        if (preferences.WMText.weightedMean.show == false)
            weightedMeanInfo.textContent = null;

        if (preferences.WMText.mswd.show == false)
            mswdInfo.textContent = null;

        if (preferences.KDEText.skewness.show == false)
            skewnessInfo.textContent = null;

        var rejectionInfo = document.getElementById(
            ChartView.textInfoViews.rejectionInfo.substring(1, ChartView.textInfoViews.rejectionInfo.length));
        if (preferences.WMText.rejection.show == true) {
            rejectionInfo.textContent = format(ChartView.DEFAULT_TEXT_INFO.rejectionInfo, {
                rejected: model.rejected,
                total: model.total
            });
        }//if
        else {
            rejectionInfo.textContent = null;
        }//else

        var errorBarInfo = document.getElementById(
            ChartView.textInfoViews.errorBarInfo.substring(1, ChartView.textInfoViews.errorBarInfo.length));
        if (preferences.WMText.errorBar.show == true) {
            errorBarInfo.textContent = ChartView.DEFAULT_TEXT_INFO.errorBarInfo;
        }//if
        else {
            errorBarInfo.textContent = null;
        }//else
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

            case 'text':
                $(element).val(value);
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

            case 'text':
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
            if (controlType == ChartView.SLIDER_CONTROL_TYPE) {
                value = {
                    min: $(this).data('ionRangeSlider').result.min,
                    max: $(this).data('ionRangeSlider').result.max,
                    from: $(this).data('ionRangeSlider').result.from
                };
            }//if
            else if(controlType == ChartView.NUMBER_CONTROL_TYPE){
                value = self.getInputValue(key);
                if (value != null)
                    value = parseFloat(value);
            }//else if
            else {
                value = self.getInputValue(key);
            }//else

            controller.inputChanged(input, value);
        }//if
    };
}