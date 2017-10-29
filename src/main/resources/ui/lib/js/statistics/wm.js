function WeightedMean() {
    WeightedMean.DEFAULT_REJECTION_RANGE = 0;
    WeightedMean.MAX_CONV_ATTEMPS = 100;
    WeightedMean.DISPERSION = {
        UNDER_DISPERSION : "under dispersion",
        OVER_DISPERSION  : "over dispersion",
        SINGLE_POPULATION: "single population"
    };

    WeightedMean.weightedMean = function(values, uncertainties) {
        if (values.length !== uncertainties.length)
            throw "The length of values and uncertainties must be equal!";
        if (values.length === 0)
            throw "The length of values cannot be zero for weighted uncertainty calculation!";

        var A, B;
        A = B = 0;

        for (var i = 0; i < values.length; ++i) {
            var p = Math.pow(uncertainties[i], 2);
            A += values[i] / p;
            B += 1 / p;
        }//for

        return A / B;
    };

    WeightedMean.weightedUncertainty = function(uncertainties) {
        if (uncertainties.length === 0)
            throw "The length of uncertainties cannot be zero for weighted uncertainty calculation!";

        var result = 0;
        for (var i = 0; i < uncertainties.length; ++i)
            result += 1 / Math.pow(uncertainties[i], 2);

        result = Math.sqrt(1 / result);
        return result;
    };

    WeightedMean.meanSquareWeightedDeviation = function(values, uncertainties) {
        if (values.length !== uncertainties.length)
            throw "The number of values and uncertainties must be equal!";
        if (values.length < 2)
            throw "The number of not rejected values must be greater than 1. " +
            "The weighted mean value cannot be calculated!";

        var mean = WeightedMean.weightedMean(values, uncertainties);
        var A = 0;
        var B = values.length - 1;

        for (var i = 0; i < values.length; ++i) {
            A += Math.pow(values[i] - mean, 2) / Math.pow(uncertainties[i], 2);
        }//for

        return A / B;
    };

    WeightedMean.intersect = function(value, uncertainty, weightedMean, weightedUncertainty, rejectionRange) {
        rejectionRange = (isNaN(rejectionRange)) ? WeightedMean.DEFAULT_REJECTION_RANGE : rejectionRange;

        var b0 = Math.min(
            value - rejectionRange * uncertainty,
            value + rejectionRange * uncertainty);

        var b1 = Math.max(
            value - rejectionRange * uncertainty,
            value + rejectionRange * uncertainty);

        var lower = Math.min(
            weightedMean - 2 * weightedUncertainty,
            weightedMean + 2 * weightedUncertainty);

        var upper = Math.max(
            weightedMean - 2 * weightedUncertainty,
            weightedMean + 2 * weightedUncertainty);

        return (b0 <= upper) && (lower <= b1);
    };

    WeightedMean.rejectedIndices = function(values, uncertainties, weightedMean, weightedUncertainty) {
        var indices = [];

        for (var i = 0; i < values.length; ++i) {
            if (!WeightedMean.intersect(values[i], uncertainties[i], weightedMean, weightedUncertainty, 2)) {
                indices.push(i);
            }//if
        }//for

        return indices;
    };

    WeightedMean.rejected = function(values, uncertainties, weightedMean, weightedUncertainty) {
        return WeightedMean.rejectedIndices(values, uncertainties, weightedMean, weightedUncertainty).length;
    };

    WeightedMean.removeRejected = function(values, uncertainties, weightedMean, weightedUncertainty, rejectionRange) {
        for (var i = 0; i < values.length; ++i) {
            if (!WeightedMean.intersect(values[i], uncertainties[i], weightedMean, weightedUncertainty, rejectionRange)) {
                values.splice(i, 1);
                uncertainties.splice(i, 1);
                --i;
            }//if
        }//for
    };

    WeightedMean.dispersion = function(n, mswd) {
        var result = WeightedMean.DISPERSION.SINGLE_POPULATION;

        if (mswd < (1 - 2 * Math.sqrt(2 / (n - 1)))) {
            result = WeightedMean.DISPERSION.UNDER_DISPERSION;
        }//if
        else if (mswd > (1 + 2 * Math.sqrt(2 / (n - 1)))) {
            result = WeightedMean.DISPERSION.OVER_DISPERSION;
        }//else if

        return result;
    };

    WeightedMean.converge = function(values, uncertainties, rejectionRange, wm, wu, attempts, converged) {
        if (converged || attempts === 0) {
            var vls = values.slice();
            var unc = uncertainties.slice();
            WeightedMean.removeRejected(vls, unc, wm, wu, rejectionRange);
            var mswd = WeightedMean.meanSquareWeightedDeviation(vls, unc);

            return {
                converged: converged,
                weightedMean: wm,
                weightedUncertainty: wu,
                mswd: mswd,
                rejected: WeightedMean.rejected(values, uncertainties, wm, wu),
                rejectedIndices: WeightedMean.rejectedIndices(values, uncertainties, wm, wu),
                dispersion: WeightedMean.dispersion(values.length, mswd)
            };
        }//if

        var vl2 = values.slice();
        var un2 = uncertainties.slice();
        WeightedMean.removeRejected(vl2, un2, wm, wu, rejectionRange);
        var wm2 = WeightedMean.weightedMean(vl2, un2);
        var wu2 = WeightedMean.weightedUncertainty(un2);

        var ri1 = WeightedMean.rejectedIndices(values, uncertainties, wm, wu);
        var ri2 = WeightedMean.rejectedIndices(values, uncertainties, wm2, wu2);

        converged = Util.areArraysSame(ri1, ri2);

        return WeightedMean.converge(values, uncertainties, rejectionRange, wm2, wu2, attempts - 1, converged);
    };

    WeightedMean.calculate = function(values, uncertainties, rejectionRange) {
        rejectionRange = (isNaN(rejectionRange)) ? WeightedMean.DEFAULT_REJECTION_RANGE : rejectionRange;

        var result = {};
        if(rejectionRange === 0) {
            var mswd = WeightedMean.meanSquareWeightedDeviation(values, uncertainties);
            result = {
                converged: true,
                weightedMean: WeightedMean.weightedMean(values, uncertainties),
                weightedUncertainty: WeightedMean.weightedUncertainty(uncertainties),
                mswd: mswd,
                rejected: 0,
                rejectedIndices: [],
                dispersion: WeightedMean.dispersion(values.length, mswd)
            }
        }//if
        else {
            var wm = WeightedMean.weightedMean(values, uncertainties);
            var wu = WeightedMean.weightedUncertainty(uncertainties);

            result = WeightedMean.converge(
                values, uncertainties, rejectionRange,
                wm,
                wu,
                WeightedMean.MAX_CONV_ATTEMPS, false);
        }//else

        return result;
    };
}

WeightedMean();