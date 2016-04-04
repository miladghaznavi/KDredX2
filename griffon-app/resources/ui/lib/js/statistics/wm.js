function WeightedMean() {
    WeightedMean.DEFAULT_REJECTION_RANGE = 0;

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
            throw "The length of values and uncertainties must be equal!";
        if (values.length < 2)
            throw "The length of values must be greater than 1!";

        var mean = WeightedMean.weightedMean(values, uncertainties);
        var A = 0;
        var B = values.length - 1;

        for (var i = 0; i < values.length; ++i) {
            A += Math.pow(values[i] - mean, 2) / Math.pow(uncertainties[i], 2);
        }//for

        return A / B;
    };

    WeightedMean.intersect = function(values, uncertainty, weightedMean, weightedUncertainty, rejectionRange) {
        rejectionRange = (isNaN(rejectionRange)) ? WeightedMean.DEFAULT_REJECTION_RANGE : rejectionRange;

        var b0 = Math.min(
            values - rejectionRange * uncertainty,
            values + rejectionRange * uncertainty);

        var b1 = Math.max(
            values - rejectionRange * uncertainty,
            values + rejectionRange * uncertainty);

        var lower = Math.min(
            weightedMean - weightedUncertainty,
            weightedMean + weightedUncertainty);

        var upper = Math.max(
            weightedMean - weightedUncertainty,
            weightedMean + weightedUncertainty);

        var result;
        if (b0 <= lower) {
            result = (b1 > lower);
        }//if
        else {
            result = (b0 < upper && b1 >= b0);
        }//else

        return result;
    };

    WeightedMean.rejectedIndices = function(values, uncertainties, weightedMean, weightedUncertainty, rejectionRange) {
        var indices = [];

        for (var i = 0; i < values.length && rejectionRange > 0; ++i) {
            if (!WeightedMean.intersect(values[i], uncertainties[i], weightedMean, weightedUncertainty, rejectionRange)) {
                indices.push(i);
            }//if
        }//for

        return indices;
    };

    WeightedMean.rejected = function(values, uncertainties, weightedMean, weightedUncertainty, rejectionRange) {
        var rejected = 0;

        for (var i = 0; i < values.length && rejectionRange > 0; ++i) {
            if (!WeightedMean.intersect(values[i], uncertainties[i], weightedMean, weightedUncertainty, rejectionRange)) {
                ++rejected;
            }//if
        }//for

        return rejected;
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

        return {
            weightedMean:        weightedMean,
            weightedUncertainty: weightedUncr,
            mswd:                mswd,
            // TODO: check rejected and rejectedIndices
            rejected:        WeightedMean.rejected       (values, uncertainties, weightedMean, weightedUncr, rejectionRange),
            rejectedIndices: WeightedMean.rejectedIndices(values, uncertainties, weightedMean, weightedUncr, rejectionRange)
        };
    };
}

WeightedMean();