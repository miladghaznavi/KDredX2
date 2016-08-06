function DataController() {
    var self = this;
    self.id    = null;
    self.model = null;
    self.view  = null;

    self.mvcInit = function (args) {
        self.id = args.id;
        self.model = new DataModel(args.id, args.path, args.dirty, args.data);
        self.view  = new DataView(args.id);
        self.model.spreadsheet = self.view.getSpreadsheet();
    };

    self.openEvent = function () {
        if (typeof JavaJSBridge == typeof undefined) {
            // Run in a browser
            self.view.openDialog();
        }//if
        else {
            // Run as part of a java application
            self.loadCsvFromJava(JSON.parse(JavaJSBridge.openCSVFile("MTV")));
        }//else
    };

    self.saveEvent = function () {
        // var result = null;
        // if (self.model.dirty != false && JavaJSBridge != undefined) {
        //     Util.notifySuccess("Before!");
        //     var json = {
        //         path: self.model.path,
        //         data: self.model.data
        //     };
        //     var str = JSON.stringify(json);
        //     result = JavaJSBridge.saveCSVFile(str);
        //     Util.notifySuccess(result);
        // }//if
    };

    self.loadCsvFromHtml = function (fevent) {
        var file = fevent.target.files[0];

        // Parse local CSV file
        Papa.parse(file, {
            complete: function(results) {
                if (results.errors.length > 0) {
                    Util.notifyError("Error in loading the data!");
                }//if
                else {
                    console.log(results.data);
                    self.model.data = results.data;
                    self.model.title = file.name;
                    self.model.dirty = false;
                    self.model.spreadsheet = self.view.getSpreadsheet();
                    self.view.update();
                }//else
                Util.notifyInfo("Data have been loaded!");
            },
            error: function(error, file) {
                Util.notifyError(error.message);
            }
        });
    };

    self.loadCsvFromJava = function(jsonData) {
        if (jsonData.selected) {
            try {
                var errors = JSON.parse(jsonData.errors[0]);
                if (errors.length > 0) {
                    Util.notifyError("Error in loading the data!");
                }//if
                else {
                    var fileData = JSON.parse(jsonData.file[0].split("=").join(":"));

                    self.model.data = JSON.parse(jsonData.data[0]);
                    self.model.title = fileData.name;
                    self.model.path = fileData.path;
                    self.model.dirty = false;
                    self.model.spreadsheet = self.view.getSpreadsheet();
                    self.view.update();

                    Util.notifyInfo(self.model.path);
                }//else
            }//try
            catch(exc) {
                Util.notifyError(exc);
            }//catch
        }//if
    };

    self.cellChanged = function (changes, source) {
        //console.log('Changes: ');
        //console.log(changes);
        //console.log('Source: ');
        //console.log(source);

        //// Weighted mean
        //if (self.model.colAnalyses == this.value) {
        //    self.model.colAnalyses = DataModel.INVALID_COLUMN;
        //}//if
        //if (self.model.colUncertainties == this.value) {
        //    self.model.colUncertainties = DataModel.INVALID_COLUMN;
        //}//if
        //
        //// Reduced Chi-Squared
        //if (self.model.colObserved == this.value) {
        //    self.model.colObserved = DataModel.INVALID_COLUMN;
        //}//if
        //
        //if (self.model.colExpected == this.value) {
        //    self.model.colExpected = DataModel.INVALID_COLUMN;
        //}//if
        //
        //// Kernel Density Estimation
        //if (self.model.colX == this.value) {
        //    self.model.colX = DataModel.INVALID_COLUMN;
        //}//if
        //
        //if (self.model.colXi == this.value) {
        //    self.model.colXi = DataModel.INVALID_COLUMN;
        //}//if
        //
        //self.view.reloadSelectsFromData();
    };

    self.selectChanged = function(e) {
        if (self.validateColumn(this.value)) {
            self.model[this.id] = parseInt(this.value);
        }//if
        else {
            Util.notifyError("The selected column is not valid");
            this.value = DataModel.INVALID_COLUMN;
            self.model[this.id] = DataModel.INVALID_COLUMN;
        }//else
    };

    self.kernelFunctionChanged = function(e) {
        self.model[this.id] = this.value;
    };

    self.validateColumn = function(col) {
        var colData = self.model.getDataAtCol(col);

        var valid = true;
        for (var i = 1; i < colData.length && valid; ++i)
            valid = (colData[i] == null || !isNaN(colData[i]));

        return valid;
    };

    self.areValuesValid = function() {
        return self.model.valuesSelect != DataModel.INVALID_COLUMN;
    };

    self.areUncertaintiesValid = function() {
        return self.model.uncertaintiesSelect != DataModel.INVALID_COLUMN;
    };

    self.areSelectsValid = function() {
        return self.areValuesValid() &&
                self.areUncertaintiesValid();
    };

    self.loadDefaults = function () {
        
    };
}

app.registerClass(DataController);
app.register(
    0,
    {
        id   : 0,
        path : null,
        dirty: false,
        data : null
    },
    DataController
);
