function KernelDensityEstimation () {
    KernelDensityEstimation.STEPS_MIN_DEFAULT = 100;
    KernelDensityEstimation.STEPS_MAX_DEFAULT = 200;
    KernelDensityEstimation.SKEWNESS_LEAST_DATA_POINTS = 1;

    KernelDensityEstimation.KernelFunction = {
        epanechnikov: 'epanechnikov',
        gaussian: 'gaussian'
    };

    KernelDensityEstimation.gaussianKernelFunction = function(t) {
        return 1.0 / Math.sqrt(2 * Math.PI) *
             Math.pow(Math.E, -Math.pow(t, 2.0) / 2.0);
    };

    KernelDensityEstimation.epanechnikovKernelFunction = function(t) {
        return Math.max(
            0.0,
            3.0 / 4.0 *
            (1.0 - (1.0 / 5.0 * Math.pow(t, 2.0)))
            / Math.sqrt(5)
        );
    };

    KernelDensityEstimation.scaledKernel = function(x, xi, bandwidth, kernelFunction) {
        var result = 0;
        switch (kernelFunction) {
            case KernelDensityEstimation.KernelFunction.gaussian:
                result = KernelDensityEstimation.gaussianKernelFunction((x - xi) / bandwidth);
                break;

            case KernelDensityEstimation.KernelFunction.epanechnikov:
                result = KernelDensityEstimation.epanechnikovKernelFunction((x - xi) / bandwidth);
                break;
        }//switch
        return result;
    };

    KernelDensityEstimation.kernelDensityEstimation = function(x, Xi, bandwidth, kernelFunction) {
        var B = Xi.length * bandwidth;
        var A = 0;
        for (var i = 0; i < Xi.length; ++i)
            A += KernelDensityEstimation.scaledKernel(x, Xi[i], bandwidth, kernelFunction);

        return A / B;
    };

    KernelDensityEstimation.kernelDensityEstimations = function (X, Xi, bandwidth, kernelFunction) {
        var result = [];
        for (var i = 0; i < X.length; ++i) {
            result.push(
                KernelDensityEstimation.kernelDensityEstimation(
                X[i], Xi, bandwidth, kernelFunction)
            );
        }//for

        return result;
    };

    KernelDensityEstimation.calculate = function (X, Xi, bandwidth, kernelFunction) {
        return {
            kde: KernelDensityEstimation.kernelDensityEstimations(X, Xi, bandwidth, kernelFunction)
        };
    };

    KernelDensityEstimation.bandwidthRange = function(values, uncertainties) {
        var max = Number.MIN_VALUE;
        var sum = 0;
        for (var i = 0; i < values.length; ++i) {
            max = Math.max(max, values[i] + Math.abs(uncertainties[i]));
            sum += uncertainties[i];
        }//for

        var from = sum / values.length;

        return {
            'min' : 0,
            'max' : max,
            'from': from
        };
    };

    KernelDensityEstimation.variables = function(values, uncertainties, count) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        for (var i = 0; i < values.length; ++i) {
            min = Math.min(min, values[i] - Math.abs(uncertainties[i]));
            max = Math.max(max, values[i] + Math.abs(uncertainties[i]));
        }//for

        var step = (max - min) / count;
        var variables = [];
        for (var i = 0; i < count; ++i) {
            variables.push(min + i * step);
        }//for

        return variables;
    };
}

KernelDensityEstimation();