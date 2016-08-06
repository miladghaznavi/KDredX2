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
        var result = null;
        if (self.model.dirty && typeof JavaJSBridge != typeof undefined) {
            var json = {
                path : self.model.path,
                title: self.model.title,
                data : self.model.data
            };
            result = JavaJSBridge.saveCSVFile('MTV', JSON.stringify(json));
        }//if

        if (result != null) {
            var errors = JSON.parse(result.errors[0]);
            if (errors.length > 0) {
                Util.notifyError("Error in saving!");
            }//if
        }//if
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
                    Util.notifyError("Error in loading!");
                }//if
                else {
                    var fileData = JSON.parse(jsonData.file[0].split("=").join(":"));

                    self.model.data = JSON.parse(jsonData.data[0]);
                    self.model.title = fileData.title;
                    self.model.path = fileData.path;
                    self.model.dirty = false;
                    self.model.spreadsheet = self.view.getSpreadsheet();
                    self.view.update();
                }//else
            }//try
            catch(exc) {
                // Util.notifyError(exc);
            }//catch

        }//if
    };

    self.cellChanged = function (changes, source) {
        self.model.dirty = true;
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
