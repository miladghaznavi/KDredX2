var weightedMeanData = null;
var KDEData = null;
var RCSData = null;
var skewnessData = null;

//(function() {
//    randomData();
//    draw(weightedMeanData, KDEData);
//    setInfo(weightedMeanData, RCSData, skewnessData);
//})();
//
//function randomData() {
//    // Weighted mean data
//    var labels = [];
//    var analyses = [];
//    var uncertainties = [];
//    var weightedMean = 0;
//    var weightedUncertainty = 10;
//
//    var COUNT = 20;
//    for (var i = 0; i < COUNT; ++i) {
//        var label = i;
//        var newVal = Math.random() * 100;
//        var error = Math.random() * 10;
//
//        labels.push(label);
//        analyses.push(newVal);
//        uncertainties.push(error);
//
//        weightedMean += newVal;
//    }//for
//
//    weightedMean /= analyses.length;
//
//    weightedMeanData = {
//        labels: labels,
//        analyses: analyses,
//        uncertainties: uncertainties,
//        weightedMean: weightedMean,
//        weightedUncertainty: weightedUncertainty,
//        ratio: weightedMean / weightedUncertainty,
//        rejected: Math.round(Math.random() * COUNT),
//        total: analyses.length
//    };
//
//    // Kernel Density Estimation
//    var X = [];
//    var Y = [];
//    for (i = 0; i < COUNT; ++i) {
//        X.push(i);
//        Y.push(Math.random() * 100);
//    }//for
//
//    KDEData = {
//        X: X,
//        Y: Y
//    };
//
//    RCSData = {
//        mswd: 20
//    };
//
//    skewnessData = 3.3;
//}

function drawPageByJson(jsonPack) {
    // Unpacking
    var unpacked = JSON.parse(jsonPack);
    drawPage(
        unpacked.weightedMeanData,
        unpacked.KDEData,
        unpacked.RCSData,
        unpacked.skewnessData
    );
}

function drawPage(wmd, kded, rcsd, sd) {
    draw(wmd, kded);
    setInfo(wmd, rcsd, sd);
}

/**
 * Draw all the info
 * @param weightedMeanData this dictionary contains all the information for drawing weighted mean chart
 * @param KDEData this dictionary contains all the information for drawing Kernel Density Estimation chart
 * @param RCSData this dictionary contains all the information for Reduced Chi-Squared;
 */
function draw(weightedMeanData, KDEData) {
    drawWeightedMeanChart(
        weightedMeanData.analyses,           /* This data comes from model */
        weightedMeanData.uncertainties,      /* This data comes from model */
        weightedMeanData.weightedMean,       /* This data comes from model */
        weightedMeanData.weightedUncertainty,/* This data comes from model */
        weightedMeanData.options             /* This data comes from ? */
    );

    drawKDEChart(
        KDEData.X,      /* This data comes from model */
        KDEData.Y,      /* This data comes from model */
        KDEData.options /* This data comes from ? */
    );
}

/**
 * Draw the weighted mean chart
 * @param analyses
 * @param uncertainties
 * @param weightedMean
 * @param weightedUncertainty
 * @param options containing styling options for weighted mean chart
 * @returns {*} weighted-mean chart object
 */
function drawWeightedMeanChart(analyses, uncertainties, weightedMean, weightedUncertainty, options) {
    var labels = [];
    var means = [];
    var analysesData = [];
    for (var i = 0; i < analyses.length; ++i) {
        //means.push(weightedMean);
        means.push({
            x: i,
            y: weightedMean,
        });
        analysesData.push({
            x: i,
            y: analyses[i]
        });
        labels.push(i);
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
            showGrid: false,
            type: Chartist.AutoScaleAxis
        },
        axisY: {
            type: Chartist.AutoScaleAxis
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
                data: analysesData,
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

/**
 * Set the additional information given in the text
 * @param weightedMeanData
 * @param RCSData
 * @param skewnessData
 */
function setInfo(weightedMeanData, RCSData, skewnessData) {
    setWeightedMeanInfo(weightedMeanData, weightedMeanData.precision);
    setRCSInfo(RCSData);
    setSkewnessInfo(skewnessData);
}

/**
 * Set the additional information given in the text for the weighted mean
 * @param weightedMeanData
 * @param precision
 */
function setWeightedMeanInfo(weightedMeanData, precision) {
    $('#weighted-mean').text(weightedMeanData.weightedMean.toFixed(precision));
    $('#weighted-uncertainty').text(weightedMeanData.weightedUncertainty.toFixed(precision));
    $('#rejected').text(weightedMeanData.rejected);
    $('#total').text(weightedMeanData.total);
    $('#ratio').text(weightedMeanData.ratio.toFixed(precision));
}

/**
 * Set the additional information given in the text for the Reduced Chi-Squared
 * @param RCSData
 */
function setRCSInfo(RCSData) {
    $('#mswd').text(RCSData.mswd);
}

/**
 * Set the additional information given in the text for the skewness
 * @param skewnessData
 */
function setSkewnessInfo(skewnessData) {
    $('#skewness').text(skewnessData);
}
