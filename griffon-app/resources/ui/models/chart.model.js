function ChartModel(id, title, dirty, dataAvailable) {
    var self = this;

    id    = (typeof id    !== 'undefined') ? id: null;
    title = (typeof title !== 'undefined') ? title: null;
    dirty = (typeof dirty !== 'undefined') ? dirty: false;
    dataAvailable = (typeof dataAvailable !== 'undefined') ? dataAvailable: false;

    // Chart
    self.id = id;
    self.title = title;
    self.dirty = dirty;
    self.dataAvailable = dataAvailable;

    // Values and uncertainties
    self.values = null;
    self.uncertainties = null;
    self.sigma = null;

    // Weighted mean
    self.weightedMean = null;
    self.weightedUncertainty = null;
    self.mswd = null;
    self.rejected = null;
    self.total = null;
    self.ratio = null;

    // Kernel Density Estimation
    self.X = null;
    self.kernelFunction = null;
    self.bandwidth = null;
    self.kde = null;

    // Skewness
    self.skewness = null;

    ChartModel.DataNames = {
        values:        'values',
        uncertainties: 'uncertainties',
        KernelFunction:'kernelFunction',
        X:             'X',
        bandwidth:     'bandwidth',
        sigma:         'sigma'
    };

    self.init = function(options) {

    };

    self.setData = function (name, data) {
        switch (name) {
            case ChartModel.DataNames.values:
                self.values = data;
                break;

            case ChartModel.DataNames.uncertainties:
                self.uncertainties = data;
                break;

            case ChartModel.DataNames.X:
                self.X = data;
                break;

            case ChartModel.DataNames.bandwidth:
                self.bandwidth = data;
                break;

            case ChartModel.DataNames.sigma:
                self.sigma = data;
                break;

            case ChartModel.DataNames.KernelFunction:
                self.kernelFunction = data;
                break;

            default:
                break;
        }//switch
    };

    self.getData = function (name) {
        var data = null;
        switch (name) {
            case ChartModel.DataNames.values:
                data = self.values;
                break;

            case ChartModel.DataNames.uncertainties:
                data = self.uncertainties;
                break;

            case ChartModel.DataNames.X:
                data = self.X;
                break;

            case ChartModel.DataNames.bandwidth:
                data = self.bandwidth;
                break;

            case ChartModel.DataNames.sigma:
                data = self.sigma;
                break;

            case ChartModel.DataNames.KernelFunction:
                data = self.kernelFunction;
                break;

            default:
                break;
        }//switch
        return data;
    };

    self.calculate = function() {
        // Weighted weightedMean
        var aWm = WeightedMean.calculate(self.values, self.uncertainties, self.s);
        for (var key in aWm) {
            self[key] = aWm[key];
        }//for
        self.ratio = self.weightedUncertainty / self.weightedMean * 100;
        self.total = self.values.length;

        // Kernel Density Estimation
        var aKde = KernelDensityEstimation.calculate(self.X, self.values, self.h, self.kernelFunction);
        for (var key in aKde) {
            self[key] = aKde[key];
        }//for

        //Skewness
        var aSkewness = Skewness.calculate(self.X, self.values);
        for (var key in aSkewness) {
            self[key] = aSkewness[key];
        }//for
    };

    self.getStatistics = function() {
        self.calculate();
        return {
            weightedMean: {
                analyses: self.values,
                uncertainties: self.uncertainties,
                weightedMean: self.weightedMean,
                weightedUncertainty: self.weightedUncertainty,
                rejected: self.rejected,
                total: self.values.length,
                ratio: self.weightedUncertainty / self.weightedMean * 100
            },
            kernelDensityEstimation: {
                X  : self.X,
                Xi : self.Xi,
                kde: self.kde
            },
            skewness: {
                skewness: self.skewness
            }
        };
    };
}