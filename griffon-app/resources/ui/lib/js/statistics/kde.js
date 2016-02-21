function KernelDensityEstimation () {
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

    KernelDensityEstimation.scaledKernel = function(x, xi, h, kernelFunction) {
        var result = 0;
        switch (kernelFunction) {
            case KernelDensityEstimation.KernelFunction.gaussian:
                result = KernelDensityEstimation.gaussianKernelFunction((x - xi) / h);
                break;

            case KernelDensityEstimation.KernelFunction.epanechnikov:
                result = KernelDensityEstimation.epanechnikovKernelFunction((x - xi) / h);
                break;
        }//switch
        return result;
    };

    KernelDensityEstimation.kernelDensityEstimation = function(x, Xi, h, kernelFunction) {
        var B = Xi.length * h;
        var A = 0;
        for (var i = 0; i < Xi.length; ++i)
            A += KernelDensityEstimation.scaledKernel(x, Xi[i], h, kernelFunction);

        return A / B;
    };

    KernelDensityEstimation.kernelDensityEstimations = function (X, Xi, h, kernelFunction) {
        var result = [];
        for (var i = 0; i < X.length; ++i) {
            result.push(
                KernelDensityEstimation.kernelDensityEstimation(
                X[i], Xi, h, kernelFunction)
            );
        }//for

        return result;
    };

    KernelDensityEstimation.calculate = function (X, Xi, h, kernelFunction) {
        return {
            kde: KernelDensityEstimation.kernelDensityEstimations(X, Xi, h, kernelFunction)
        };
    };
}

KernelDensityEstimation();