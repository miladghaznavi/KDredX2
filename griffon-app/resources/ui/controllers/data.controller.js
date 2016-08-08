function DataController() {
    DataController.ERRORS = 'errors';

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
        if (self.model.dirty) {
            self.saveEvent();
        }//if

        if (typeof JavaJSBridge == typeof undefined) {
            // Run in a browser
            self.view.openDialog();
        }//if
        else {
            // Run as part of a java application
            self.loadCsvJava(JavaJSBridge.openCSVFile("MTV"));
        }//else
    };

    self.saveEvent = function () {
        var jsonData = null;
        if (self.model.dirty && (typeof JavaJSBridge != typeof undefined)) {
            var json = {
                path : self.model.path,
                title: self.model.title,
                data : self.model.data
            };

            jsonData = JSON.parse(JavaJSBridge.saveCSVFile('MTV', JSON.stringify(json)));
        }//if

        if (jsonData != null) {
            if (DataController.ERRORS in jsonData) {
                Util.notifyError("Error in saving!");
            }//if
            else if (jsonData.selected) {
                self.model.title = jsonData.file.title;
                self.model.path = jsonData.file.path;
                self.model.dirty = false;
                self.view.update();
            }//else
        }//if
    };

    self.loadCsvJS = function (fevent) {
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
            },
            error: function(error, file) {
                Util.notifyError(error.message);
            }
        });
    };

    self.loadCsvJava = function(jsonData) {
        jsonData = JSON.parse(jsonData);

        if (DataController.ERRORS in jsonData) {
            Util.notifyError("Error in loading!");
        }//if

        if (jsonData.selected && !(DataController.ERRORS in jsonData)) {
            try {
                self.model.data = self.toArray(jsonData.data);
                self.model.title = jsonData.file.title;
                self.model.path = jsonData.file.path;
                self.model.dirty = false;
                self.model.spreadsheet = self.view.getSpreadsheet();
                self.view.update();
            }//try
            catch(exc) {
                Util.notifyError(exc);
            }//catch
        }//if
    };

    self.toArray = function(data) {
        var array = [];

        for (var i = 0; i < data.length; ++i)
            array.push(JSON.parse(data[i]));

        return array;
    };

    self.cellChanged = function (changes, source) {
        console.log("In cell change!");
        console.log(changes);
        console.log(source);

        if (changes != null)
            self.model.dirty = true;

        console.log(self.model.dirty);
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
