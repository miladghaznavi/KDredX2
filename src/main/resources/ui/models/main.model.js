function MainModel(id) {
    var self = this;
    id = (typeof id !== 'undefined') ? id: null;

    MainModel.INVALID_VALUE = -1;

    self.id = id;
    self.dataId = null;
    self.chartId = null;
    self.view = MainModel.DEFAULT_VIEW;

    self.init = function (args) {
        self.dataId  = args.dataControllerId;
        self.chartId = args.chartControllerId;
    };
}