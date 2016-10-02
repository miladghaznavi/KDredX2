function Skewness() {
    Skewness.SKEWNESS_LEAST_DATA_POINTS = 1;

    Skewness.skewness = function(values) {
        var n = values.length;

        if (n < Skewness.SKEWNESS_LEAST_DATA_POINTS) {
            throw "Number of values must be equal or greater than " + Skewness.SKEWNESS_LEAST_DATA_POINTS;
        }//if

        var mean = ss.mean(values);

        var skewness = 0;
        for (var i = 0; i < values.length; ++i) {
            skewness += Math.pow((values[i] - mean), 2.0);
        }//for
        skewness /= (n - 1);
        skewness = Math.sqrt(skewness);

        return skewness;
    };

    Skewness.calculate = function(values) {
        return {
            skewness: Skewness.skewness(values)
        };
    };
}

Skewness();