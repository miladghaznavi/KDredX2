function ChartView(id) {
    var self = this;
    id = typeof id !== 'undefined' ? id : null;
    self.id = id;
    self.weightedMeanChart = null;
    self.KDEChart = null;
    self.chartingControls = {
        // Chart options
        titleCheckBox: '#titleCheckBox',
        borderCheckBox: '#borderCheckBox',
        legendCheckBox: '#legendCheckBox',
        // Chart font
        fontFamilySelect: '#fontFamilySelect',
        fontWeightSelect: '#fontWeightSelect',
        fontSizeNumber: '#fontSizeNumber',
        boldButton: '#boldButton',
        italicButton: '#italicButton',
        underlineButton: '#underlineButton',
        lineThroughButton: '#lineThroughButton'
    };

    self.init = function(options) {
        self.update(options);
        self.registerEvents();
    };

    self.update = function(options) {
        var model = app.getModel(id);
        var controller = app.getController(self.id);
        
        if (model.dataAvailable) {
            $('#chart-shown').show();
            $('#chart-not-shown').hide();

            self.weightedMeanChart = self.drawWeightedMeanChart(options);
            self.KDEChart = self.drawKDEChart(options);
            self.setInfo(options);
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

        // Color pickers
        $('.color').colorPicker({
            flat: true
        });
    };

    self.drawWeightedMeanChart = function(options) {
        var labels = [];
        var means = [];
        var analysesData = [];
        var model = app.getModel(self.id);
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;

        for (var i = 0; i < model.analyses.length; ++i) {
            minY = Math.min(minY, model.analyses[i] - model.uncertainties[i]);
            maxY = Math.max(maxY, model.analyses[i] + model.uncertainties[i]);
            means.push({
                x: i + 1,
                y: model.weightedMean
            });
            analysesData.push({
                x: i + 1,
                y: model.analyses[i]
            });
            labels.push(i + 1);
        }//for

        var defaultOptions = {
            series: {
                'weightedMean': {
                    showLine: true
                },
                'analyses': {
                    showLine: false
                }
            },
            plugins: [
                Chartist.plugins.errorBar({
                    showPoint: false,
                    showHLine: true,
                    precision: options.precision
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
                high: analysesData.length,
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
        options = Chartist.extend({ }, defaultOptions, options);

        return new Chartist.Line('#weighted-mean-chart-box', {
                labels: labels,
                series: [{
                    name: 'weightedMean',
                    data: means,
                    weightedMean: model.weightedMean,
                    weightedUncertainty: model.weightedUncertainty
                },
                    {
                    name: 'analyses',
                    data: analysesData,
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
        for (var i = 0; i < model.X.length; ++i) {
            // We reflect and reverse the data.
            // new X is the reflected of Y's elements
            // new Y is the reversed of X's elements
            data.push({
                //TODO
                x: model.kde[i],
                //x: Math.random() * 1000,
                y: model.X[model.X.length - (i + 1)]
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
            $('#weighted-mean').text(model.weightedMean.toFixed(precision));
            $('#weighted-uncertainty').text(model.weightedUncertainty.toFixed(precision));
            $('#mswd').text(model.mswd.toFixed(precision));
            $('#ratio').text(model.ratio.toFixed(precision));
            $('#skewness').text(model.skewness.toFixed(precision));
        }//if
        else {
            $('#weighted-mean').text(model.weightedMean);
            $('#weighted-uncertainty').text(model.weightedUncertainty);
            $('#mswd').text(model.mswd);
            $('#ratio').text(model.ratio);
            $('#skewness').text(model.skewness);
        }//else

        $('#rejected').text(model.rejected);
        $('#total').text(model.total);
    };

    self.getChartVis = function () {
        //todo:
    };
}