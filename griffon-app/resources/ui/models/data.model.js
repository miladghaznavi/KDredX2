function DataModel(id, path, dirty, data) {
    var self = this;

    DataModel.DEFAULT_ROWS_COUNT = 50;
    DataModel.DEFAULT_COLUMNS_COUNT = 20;
    DataModel.INVALID_COLUMN = -1;
    DataModel.INVALID_VALUE = -1;
    
    id    = (typeof id    !== 'undefined') ? id: null;
    path  = (typeof path  !== 'undefined') ? path : '';
    dirty = (typeof dirty !== 'undefined') ? dirty: false;

    self.defaultData = function () {
        var D = [];
        for (var i = 0; i < DataModel.DEFAULT_ROWS_COUNT; ++i) {
            D.push([]);
            for (var j = 0; j < DataModel.DEFAULT_COLUMNS_COUNT; ++j) {
                D[i].push(null);
            }//for
        }//for

        return D;
    };

    data  = (typeof data  !== 'undefined' && data != null) ? data : self.defaultData();

    self.id    = id;
    self.path  = path;
    self.title = (self.path != null) ? Util.fileName(self.path) : null;
    self.dirty = dirty;
    self.data  = data;
    self.spreadsheet = null;

    // Weighted mean
    self.valuesSelect = DataModel.INVALID_COLUMN;
    self.uncertaintiesSelect = DataModel.INVALID_COLUMN;

    self.init = function (args) {

    };

    self.getDataAtCol = function(col, excludeFirstRow, modifyFunc) {
        var data = $(self.spreadsheet).handsontable("getDataAtCol", col);

        if (excludeFirstRow && excludeFirstRow != undefined) {
            data.shift();
        }//if

        var result = [];
        if (modifyFunc != undefined) {
            for (var i = 0; i < data.length; ++i)
                result.push(modifyFunc(data[i]));
        }//if
        else {
            for (var i = 0; i < data.length; ++i)
                result.push(data[i]);
        }//if

        return result;
    };

    self.getDataAtCell = function(row, col) {
        return $(self.spreadsheet).handsontable("getDataAtCell", row, col);
    };
}