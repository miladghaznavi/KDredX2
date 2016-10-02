function KernelDensityEstimation () {
    KernelDensityEstimation.STEPS_MIN_DEFAULT = 100;
    KernelDensityEstimation.STEPS_MAX_DEFAULT = 200;
    
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

    KernelDensityEstimation.scaledKernel = function(variable, value, bandwidth, kernelFunction) {
        var result = 0;
        switch (kernelFunction) {
            case KernelDensityEstimation.KernelFunction.gaussian:
                result = KernelDensityEstimation.gaussianKernelFunction((variable - value) / bandwidth);
                break;

            case KernelDensityEstimation.KernelFunction.epanechnikov:
                result = KernelDensityEstimation.epanechnikovKernelFunction((variable - value) / bandwidth);
                break;
        }//switch
        return result;
    };

    KernelDensityEstimation.kernelDensityEstimation = function(variable, values, bandwidth, kernelFunction) {
        var B = values.length * bandwidth;
        var A = 0;
        for (var i = 0; i < values.length; ++i)
            A += KernelDensityEstimation.scaledKernel(variable, values[i], bandwidth, kernelFunction);

        return A / B;
    };

    KernelDensityEstimation.kernelDensityEstimations = function (variables, values, bandwidth, kernelFunction) {
        var result = [];
        for (var i = 0; i < variables.length; ++i) {
            result.push(
                KernelDensityEstimation.kernelDensityEstimation(
                variables[i], values, bandwidth, kernelFunction)
            );
        }//for

        return result;
    };

    KernelDensityEstimation.calculate = function (variables, values, bandwidth, kernelFunction) {
        return {
            kde: KernelDensityEstimation.kernelDensityEstimations(variables, values, bandwidth, kernelFunction)
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

    KernelDensityEstimation.variables = function(values, uncertainties, count, min, max) {
        if (arguments.length == 3) {
            min = Number.MAX_VALUE;
            max = Number.MIN_VALUE;
            for (var i = 0; i < values.length; ++i) {
                min = Math.min(min, values[i] - Math.abs(uncertainties[i]));
                max = Math.max(max, values[i] + Math.abs(uncertainties[i]));
            }//for
        }//if

        var step = (max - min) / count;
        var variables = [];
        for (var i = 0; i < count; ++i) {
            variables.push(min + i * step);
        }//for

        return variables;
    };
}

KernelDensityEstimation();