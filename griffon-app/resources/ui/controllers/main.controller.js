function MainController() {
    var self = this;
    self.id = null;
    self.model = null;
    self.view = null;

    self.mvcInit = function(args){
        self.id = args.id;
        self.model = new MainModel(args.id);
        self.view  = new MainView(args.id);
    };

    self.isFirstRowValid = function(dataModel) {
        var valid =
            !isNaN(
                dataModel.getDataAtCell(0,
                    dataModel.valuesSelect)
            ) &&
            !isNaN(
                dataModel.getDataAtCell(0,
                    dataModel.uncertaintiesSelect)
            );

        return valid;
    };

    self.setChartDataModel = function(dataModel, chartModel) {
        var excludeFirstRow = !self.isFirstRowValid(dataModel);

        chartModel.values        = dataModel.getDataAtCol(dataModel.valuesSelect, excludeFirstRow, parseFloat);
        chartModel.uncertainties = dataModel.getDataAtCol(dataModel.uncertaintiesSelect, excludeFirstRow, parseFloat);
        var minSize = Math.min(chartModel.values.length, chartModel.uncertainties.length);

        for (var i = 0; i < minSize; ++i) {
            if (isNaN(chartModel.values[i]) || isNaN(chartModel.uncertainties[i])) {
                minSize = i;
                break;
            }//if
        }//for
        chartModel.values        = chartModel.values.slice(0, minSize);
        chartModel.uncertainties = chartModel.uncertainties.slice(0, minSize);

        if (minSize > 0) {
            // set data availability flag in chart model
            chartModel.dataAvailable = true;
        }//if

        return minSize;
    };

    self.plot = function() {
        var dataModel  = app.getModel(self.model.dataId);
        var chartModel = app.getModel(self.model.chartId);
        var dataController  = app.getController(self.model.dataId);
        var chartController = app.getController(self.model.chartId);

        if (dataController.areSelectsValid()) {
            if (self.setChartDataModel(dataModel, chartModel) > 0) {
                chartController.plot();
            }//if
            else {
                Util.notifyWarning("The data for the chart is empty!<br/>" +
                    "Please select uncertainty and analyses columns which at least have one valid data!");
            }//else
        }//if
        else {
            Util.notifyError("Please select two columns as values and uncertainties!");
        }//else
    };
}

app.registerClass(MainController);
app.register(
    2,
    {
        id: 2,
        chartControllerId: 1,
        dataControllerId: 0
    },
    MainController
);