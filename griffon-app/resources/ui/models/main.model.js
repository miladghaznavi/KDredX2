function MainModel(id) {
    var self = this;
    id = (typeof id !== 'undefined') ? id: null;

    self.id = id;
    self.dataId = null;
    self.chartId = null;

    MainModel.dataModelToChartModelMap = {
        // Data
        valuesSelect        : 'values',
        uncertaintiesSelect : 'uncertainties',

        // Weighted Mean
        //TODO: find a good name
        s                   : 's',

        // Kernel Function
        kernelFunctionSelect: 'kernelFunction',
        //TODO: find good names
        X                   : 'X',
        Bandwidth           : 'h'
    };

    self.init = function (args) {
        self.dataId  = args.dataControllerId;
        self.chartId = args.chartControllerId;
    };
}