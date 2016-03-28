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
        
        // Kernel Function
        kernelFunctionSelect: 'kernelFunction'
    };

    MainModel.chartModelToDataModelMao = {
        //
    };

    self.init = function (args) {
        self.dataId  = args.dataControllerId;
        self.chartId = args.chartControllerId;
    };
}