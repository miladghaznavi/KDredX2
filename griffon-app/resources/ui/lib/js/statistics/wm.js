function WeightedMean() {
    WeightedMean.DEFAULT_S = 0;

    WeightedMean.weightedMean = function(analyses, uncertainties) {
        if (analyses.length != uncertainties.length)
            throw "The length of analyses and uncertainties must be equal!";
        if (analyses.length == 0)
            throw "The length of analyses cannot be zero for weighted uncertainty calculation!";

        var A, B;
        A = B = 0;

        for (var i = 0; i < analyses.length; ++i) {
            var p = Math.pow(uncertainties[i], 2);
            A += analyses[i] / p;
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

    WeightedMean.meanSquareWeightedDeviation = function(analyses, uncertainties) {
        if (analyses.length != uncertainties.length)
            throw "The length of analyses and uncertainties must be equal!";
        if (analyses.length < 2)
            throw "The length of analyses must be greater than 1!";

        var mean = WeightedMean.weightedMean(analyses, uncertainties);
        var A = 0;
        var B = analyses.length - 1;

        for (var i = 0; i < analyses.length; ++i) {
            A += Math.pow(analyses[i] - mean, 2) / Math.pow(uncertainties[i], 2);
        }//for

        return A / B;
    };

    WeightedMean.intersect = function(analysis, uncertainty, weightedMean, weightedUncertainty, s) {
        s = (isNaN(s)) ? WeightedMean.DEFAULT_S : s;

        var b0 = Math.min(
            analysis - s * uncertainty,
            analysis + s * uncertainty);

        var b1 = Math.max(
            analysis - s * uncertainty,
            analysis + s * uncertainty);

        var lower = Math.min(
            weightedMean - weightedUncertainty,
            weightedMean + weightedUncertainty);

        var upper = Math.max(
            weightedMean - weightedUncertainty,
            weightedMean + weightedUncertainty);

        if (b0 <= lower) {
            return (b1 > lower);
        }//if
        else {
            return (b0 < upper && b1 >= b0);
        }//else
    };

    WeightedMean.rejectedIndices = function(analyses, uncertainties, weightedMean, weightedUncertainty, s) {
        var indices = [];

        for (var i = 0; i < analyses.length && s > 0; ++i) {
            if (!WeightedMean.intersect(analyses[i], uncertainties[i], weightedMean, weightedUncertainty, s)) {
                indices.push(i);
            }//if
        }//for

        return indices;
    };

    WeightedMean.rejected = function(analyses, uncertainties, weightedMean, weightedUncertainty, s) {
        var rejected = 0;

        for (var i = 0; i < analyses.length && s > 0; ++i) {
            if (!WeightedMean.intersect(analyses[i], uncertainties[i], weightedMean, weightedUncertainty, s)) {
                ++rejected;
            }//if
        }//for

        return rejected;
    };

    WeightedMean.removeRejected = function(analyses, uncertainties, weightedMean, weightedUncertainty, s) {
        for (var i = 0; i < analyses.length; ++i) {
            if (!WeightedMean.intersect(analyses[i], uncertainties[i], weightedMean, weightedUncertainty, s)) {
                analyses.splice(i, 1);
                uncertainties.splice(i, 1);
                --i;
            }//if
        }//for
    };

    WeightedMean.calculate = function(analyses, uncertainties, s) {
        s = (isNaN(s)) ? WeightedMean.DEFAULT_S : s;
        var pAnalyses = analyses;
        var pUncertainties = uncertainties;

        if (s > 0) {
            WeightedMean.removeRejected(
                pAnalyses,
                pUncertainties,
                WeightedMean.weightedMean(analyses, uncertainties),
                WeightedMean.weightedUncertainty(uncertainties),
                s
            );
        }//if
        var weightedMean = WeightedMean.weightedMean(pAnalyses, pUncertainties);
        var weightedUncr = WeightedMean.weightedUncertainty(pAnalyses, pUncertainties);
        return {
            weightedMean:        weightedMean,
            weightedUncertainty: weightedUncr,
            mswd:                WeightedMean.meanSquareWeightedDeviation(pAnalyses, pUncertainties),
            rejected:            WeightedMean.rejected(pAnalyses, pUncertainties, weightedMean, weightedUncr, s),
            rejectedIndices:     WeightedMean.rejectedIndices(pAnalyses, pUncertainties, weightedMean, weightedUncr, s)
        };
    };
}

WeightedMean();