function Skewness() {
    Skewness.skewness = function(X, Xi) {
        var n = Xi.length;

        if (n < KernelDensityEstimation.SKEWNESS_LEAST_DATA_POINTS) {
            throw "Number of Xi values must be equal or greater than " +
            KernelDensityEstimation.SKEWNESS_LEAST_DATA_POINTS;
        }//if

        var mean = ss.mean(X);

        var skewness = 0;
        for (var i = 0; i < Xi.length; ++i) {
            skewness += Math.pow((Xi[i] - mean), 2.0);
        }//for
        skewness /= (n - 1);
        skewness = Math.sqrt(skewness);

        return skewness;
    };

    Skewness.calculate = function(X, Xi) {
        return {
            skewness: Skewness.skewness(X, Xi)
        };
    };
}

Skewness();