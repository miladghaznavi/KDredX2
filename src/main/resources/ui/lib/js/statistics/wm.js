function WeightedMean() {
    WeightedMean.DEFAULT_REJECTION_RANGE = 0;
    WeightedMean.DISPERSION = {
        UNDER_DISPERSION : "Under Dispersion",
        OVER_DISPERSION  : "Over Dispersion",
        SINGLE_POPULATION: "Single Population"
    };

    WeightedMean.weightedMean = function(values, uncertainties) {
        if (values.length != uncertainties.length)
            throw "The length of values and uncertainties must be equal!";
        if (values.length == 0)
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
        if (uncertainties.length == 0)
            throw "The length of uncertainties cannot be zero for weighted uncertainty calculation!";

        var result = 0;
        for (var i = 0; i < uncertainties.length; ++i)
            result += 1 / Math.pow(uncertainties[i], 2);

        result = Math.sqrt(1 / result);
        return result;
    };

    WeightedMean.meanSquareWeightedDeviation = function(values, uncertainties) {
        if (values.length != uncertainties.length)
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

        var result = (b0 <= upper) && (lower <= b1);

        return result;
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
        var result = WeightedMean.SINGLE_POPULATION;
        if (mswd < (1 - 2 * Math.sqrt(2 / (n - 1)))) {
            result = WeightedMean.DISPERSION.UNDER_DISPERSION;
        }//if
        else if (mswd > (1 + 2 * Math.sqrt(2 / (n - 1)))) {
            result = WeightedMean.DISPERSION.OVER_DISPERSION;
        }//else
        return result;
    };

    WeightedMean.calculate = function(values, uncertainties, rejectionRange) {
        rejectionRange = (isNaN(rejectionRange)) ? WeightedMean.DEFAULT_REJECTION_RANGE : rejectionRange;

        var weightedMean, weightedUncr, mswd;
        if (rejectionRange > 0) {
            var pValues = values.slice();
            var pUncertainties = uncertainties.slice();

            WeightedMean.removeRejected(
                pValues,
                pUncertainties,
                WeightedMean.weightedMean(values, uncertainties),
                WeightedMean.weightedUncertainty(uncertainties),
                rejectionRange
            );
            weightedMean = WeightedMean.weightedMean               (pValues, pUncertainties);
            weightedUncr = WeightedMean.weightedUncertainty        (pUncertainties);
            mswd         = WeightedMean.meanSquareWeightedDeviation(pValues, pUncertainties);
        }//if
        else {
            weightedMean = WeightedMean.weightedMean               (values, uncertainties);
            weightedUncr = WeightedMean.weightedUncertainty        (uncertainties);
            mswd         = WeightedMean.meanSquareWeightedDeviation(values, uncertainties);
        }//else

        var result = {
            weightedMean:        weightedMean,
            weightedUncertainty: weightedUncr,
            mswd:                mswd,
            rejected:        (rejectionRange > 0) ?
                WeightedMean.rejected(values, uncertainties, weightedMean, weightedUncr) : 0,
            rejectedIndices: (rejectionRange > 0) ?
                WeightedMean.rejectedIndices(values, uncertainties, weightedMean, weightedUncr) : [],
            dispersion: WeightedMean.dispersion(pValues.length, mswd)
        };

        return result;
    };
}

WeightedMean();