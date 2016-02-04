var weightedMeanData = null;
var KDEData = null;
var RCSData = null;
var skwenessData = null;

(function() {
    randomData();
    draw(weightedMeanData, KDEData);
    setInfo(weightedMeanData, RCSData, skewnessData);
})();

function randomData() {
    // Weighted mean data
    var labels = [];
    var analyses = [];
    var uncertainties = [];
    var weightedMean = 0;
    var weightedUncertainty = 10;

    var COUNT = 20;
    for (var i = 0; i < COUNT; ++i) {
        var label = i;
        var newVal = Math.random() * 100;
        var error = Math.random() * 10;

        labels.push(label);
        analyses.push(newVal);
        uncertainties.push(error);

        weightedMean += newVal;
    }//for

    weightedMean /= analyses.length;

    weightedMeanData = {
        labels: labels,
        analyses: analyses,
        uncertainties: uncertainties,
        weightedMean: weightedMean,
        weightedUncertainty: weightedUncertainty,
        ratio: weightedMean / weightedUncertainty,
        rejected: Math.round(Math.random() * COUNT),
        total: analyses.length
    };

    // Kernel Density Estimation
    var X = [];
    var Y = [];
    for (i = 0; i < COUNT; ++i) {
        X.push(i);
        Y.push(Math.random() * 100);
    }//for

    KDEData = {
        X: X,
        Y: Y
    };

    RCSData = {
        mswd: 20
    };

    skewnessData = 3.3;
}

/**
 * Draw all the info
 * @param weightedMeanData this dictionary contains all the information for drawing weighted mean chart
 * @param KDEData this dictionary contains all the information for drawing Kernel Density Estimation chart
 * @param RCSData this dictionary contains all the information for Reduced Chi-Squared;
 */
function draw(weightedMeanData, KDEData) {
    drawWeightedMeanChart(
        weightedMeanData.labels,
        weightedMeanData.analyses,
        weightedMeanData.uncertainties,
        weightedMeanData.weightedMean,
        weightedMeanData.weightedUncertainty,
        weightedMeanData.options
    );

    drawKDEChart(
        KDEData.X,
        KDEData.Y,
        KDEData.options
    );
}

/**
 * Draw the weighted mean chart
 * @param labels
 * @param analyses
 * @param uncertainties
 * @param weightedMean
 * @param weightedUncertainty
 * @param options containing styling options for weighted mean chart
 * @returns {*} weighted-mean chart object
 */
function drawWeightedMeanChart(labels, analyses, uncertainties, weightedMean, weightedUncertainty, options) {
    var means = [];
    for (var i = 0; i < analyses.length; ++i) {
        means.push(weightedMean);
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
            Chartist.plugins.errorBar()
        ],
        chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        fullWidth: true,
        axisX: {
            showLabel: false,
            showGrid: false
        },
        axisY: {
            high: 110,
            low: -10,
            type: Chartist.FixedScaleAxis,
            divisor: 12
        }
    };
    options = Chartist.extend({ }, defaultOptions, options);

    return new Chartist.Line('#weighted-mean-chart-box', {
            labels: labels,
            series: [{
                    name: 'weightedMean',
                    data: means,
                    weightedMean: weightedMean,
                    weightedUncertainty: weightedUncertainty
                }, {
                    name: 'analyses',
                    data: analyses,
                    uncertainties: uncertainties
                }
            ]},
        options
    );
}

/**
 * Draw the DKE chart
 * @param X
 * @param Y
 * @param options
 * @returns {*} The KDE chart
 */
function drawKDEChart(X, Y, options) {
    var data = [];
    for (var i = 0; i < X.length; ++i) {
        // We reflect and reverse the data.
        // new X is the reflected of Y's elements
        // new Y is the reversed of X's elements
        data.push({
            x: Y[i],
            y: X[X.length - (i + 1)]
        });
    }//for

    var defaultOptions = {
        axisX: {
            type: Chartist.AutoScaleAxis,
            onlyInteger: true,
            showGrid: false,
            showLabel: false
        },
        axisY: {
            showGrid: false,
            showLabel: false
        },
        showLine: true,
        showPoint: false,
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
            labels: Y,
            series: [
                data
            ]
        },
        options
    );
}

function setInfo(weightedMeanData, RCSData, skewnessData) {
    setWeightedMeanInfo(weightedMeanData, 2);
    setRCSInfo(RCSData);
    setSkewnessInfo(skewnessData);
}

function setWeightedMeanInfo(weightedMeanData, precision) {
    $('#weighted-mean').text(weightedMeanData.weightedMean.toFixed(precision));
    $('#weighted-uncertainty').text(weightedMeanData.weightedUncertainty.toFixed(precision));
    $('#rejected').text(weightedMeanData.rejected);
    $('#total').text(weightedMeanData.total);
    $('#ratio').text(weightedMeanData.ratio.toFixed(precision));
}

function setRCSInfo(RCSData) {
    $('#mswd').text(RCSData.mswd);
}

function setSkewnessInfo(skewnessData) {
    $('#skewness').text(skewnessData);
}
