function DataView(id) {
    var self = this;
    id = typeof id !== 'undefined' ? id : null;
    self.id = id;

    DataView.MaxHeight = 700;
    DataView.MinHeight = 600;
    DataView.MaxWidth  = 1280;
    DataView.MinWidth  = 600;

    DataView.controls = {
        kernelFunction: '#kernelFunction',
        uncertainty: '#uncertainty',
        rejectionRange: '#rejectionRange',
        bandwidth: '#bandwidth'
    };

    self.init = function(args) {
        self.update();
        self.registerEvents();
    };

    self.update = function () {
        if (app.getModel(self.id) != null) {
            $('#data-title').text(app.getModel(self.id).title);
            
            self.loadSpreadsheet(app.getModel(self.id).data);
            var headers = $("#spreadsheet").handsontable("getColHeader");

            // Weighted mean
            self.renewSelect('#valuesSelect', headers);
            self.renewSelect('#uncertaintiesSelect', headers);
        }//if
    };

    self.renewSelect = function (selectId, newList) {
        var $el = $(selectId);
        $el.empty(); // remove old options
        $.each(newList, function(key, value) {
            $el.append($("<option></option>")
                .attr("value", key).text(value));
        });

        try {
            $(selectId).selectpicker('refresh');
        }//try
        catch(e){
            Util.log(e);
        }//catch
    };

    self.loadSpreadsheet = function (data) {
        var availableWidth, availableHeight;
        availableHeight = availableWidth = null;
        var spreadsheet = $('#spreadsheet');

        var calculateSize = function () {
            availableWidth  = $('#spreadsheet-panel-body').width();
            availableHeight = $('#spreadsheet-panel-body').height();
            availableWidth  = Math.min(Math.max(availableWidth , DataView.MinWidth ), DataView.MaxWidth );
            availableHeight = Math.min(Math.max(availableHeight, DataView.MinHeight), DataView.MaxHeight);
        };
        spreadsheet.on('resize', calculateSize);
        $(window).on('resize', calculateSize);

        spreadsheet.handsontable({
            data: data,
            rowHeaders: true,
            colHeaders: true,
            minSpareRows: 1,
            // stretchH: 'all',
            contextMenu: true,
            afterChange: app.getController(self.id).cellChanged,
            width: function () {
                if (availableWidth == null) {
                    calculateSize();
                }
                return availableWidth;
            },
            height: function () {
                if (availableHeight == null) {
                    calculateSize();
                }
                return availableHeight;
            }
        });
    };

    self.openDialog = function() {
        $('#inputSpreadsheet').click();
    };

    self.getSpreadsheet = function () {
        return $('#spreadsheet').handsontable();
    };

    self.registerEvents = function() {
        var controller = app.getController(id);
        $('#dataOpenDialog').click (controller.openEvent);
        $('#dataSaveDialog').click (controller.saveEvent);
        $('#inputSpreadsheet').change(controller.loadCsv);

        // Weighted mean
        $('#valuesSelect').on('change', controller.selectChanged);
        $('#uncertaintiesSelect').on('change', controller.selectChanged);
    };

    self.reloadSelectsFromData = function () {
        //TODO
    };
}