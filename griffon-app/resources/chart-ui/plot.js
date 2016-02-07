var weightedMeanData = null;
var KDEData = null;
var RCSData = null;
var skewnessData = null;

/**
 * Draw the page
 * @param jsonPack The string of json object containing all information
 */
function drawPageByJson(jsonPack) {
    // Unpacking
    var unpacked = JSON.parse(jsonPack);
    refineByPresicion(unpacked);
    drawPage(
        unpacked.weightedMeanData,
        unpacked.KDEData,
        unpacked.RCSData,
        unpacked.skewnessData
    );
}

function refineByPresicion(unpacked) {
    var precision = unpacked.weightedMeanData.precision;
    for (var i = 0; i < unpacked.weightedMeanData.analyses.length; ++i)
        unpacked.weightedMeanData.analyses[i] = unpacked.weightedMeanData.analyses[i].toFixed(precision);

    for (var i = 0; i < unpacked.weightedMeanData.uncertainties.length; ++i)
        unpacked.weightedMeanData.uncertainties[i] = unpacked.weightedMeanData.uncertainties[i].toFixed(precision);

    unpacked.weightedMeanData.weightedMean = unpacked.weightedMeanData.weightedMean.toFixed(precision);
    unpacked.weightedMeanData.weightedUncertainty = unpacked.weightedMeanData.weightedUncertainty.toFixed(precision);
    unpacked.weightedMeanData.ratio = unpacked.weightedMeanData.ratio.toFixed(precision);

    for (var i = 0; i < unpacked.KDEData.X.length; ++i)
        unpacked.KDEData.X[i] = unpacked.KDEData.X[i].toFixed(precision);
    for (var i = 0; i < unpacked.KDEData.Y.length; ++i)
        unpacked.KDEData.Y[i] = unpacked.KDEData.Y[i].toFixed(precision);

    unpacked.RCSData.mswd = unpacked.RCSData.mswd.toFixed(precision);
}

/**
 * Draw the charts and set the information in the page
 * @param wmd Weighted Mean Data
 * @param kded Kernel Density Estimation Data
 * @param rcsd Reduced Chi-Squared Data
 * @param sd Skewness Data
 */
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
            //TODO
            x: Y[i],
            //x: Math.random() * 1000,
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
 */;
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
    $('#weighted-mean').text(weightedMeanData.weightedMean);
    $('#weighted-uncertainty').text(weightedMeanData.weightedUncertainty);
    $('#rejected').text(weightedMeanData.rejected);
    $('#total').text(weightedMeanData.total);
    $('#ratio').text(weightedMeanData.ratio);
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
