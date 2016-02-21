function DataView(id) {
    var self = this;
    id = typeof id !== 'undefined' ? id : null;
    self.id = id;

    self.init = function(args) {
        self.update();
        self.registerEvents();
    };

    self.update = function () {
        if (app.getModel(self.id) != null) {
            var controller = app.getController(self.id);
            $('#data-title').text(app.getModel(self.id).title);

            $('#data-panel').lobiPanel({
                unpin: false,
                customControls: [
                    {
                        id: 'dataOpenDialog',
                        func: 'open',
                        tooltip: 'Open data file',
                        icon: 'fa fa-folder-open',
                        click: controller.openEvent
                    },
                    {
                        id: 'dataSaveDialog',
                        func: 'save',
                        tooltip: 'Save data file',
                        icon: 'fa fa-save',
                        click: controller.saveEvent
                    }
                ]
            });

            self.loadSpreadsheet(app.getModel(self.id).data);
            var headers = $("#spreadsheet").handsontable("getColHeader");

            // Weighted mean
            self.renewSelect('#analysesSelect', headers);
            $('<option>', {value: '-1'}).text('Select analyses column').prependTo('#analysesSelect');
            self.renewSelect('#uncertaintiesSelect', headers);
            $('<option>', {value: '-1'}).text('Select uncertainties column').prependTo('#uncertaintiesSelect');

            // Reduced Chi-Squared
            self.renewSelect('#observedSelect', headers);
            $('<option>', {value: '-1'}).text('Select observed column').prependTo('#observedSelect');
            self.renewSelect('#expectedSelect', headers);
            $('<option>', {value: '-1'}).text('Select expected column').prependTo('#expectedSelect');

            // Kernel Density Estimation
            //$("#kernelFunctionSelect").val($("#kernelFunctionSelect option:first").val());
            self.renewSelect('#XSelect', headers);
            $('<option>', {value: '-1'}).text('Select X column').prependTo('#XSelect');
            self.renewSelect('#XiSelect', headers);
            $('<option>', {value: '-1'}).text('Select Xi column').prependTo('#XiSelect');
        }//if
    };

    self.renewSelect = function (selectId, newList) {
        var $el = $(selectId);
        $el.empty(); // remove old options
        $.each(newList, function(key, value) {
            $el.append($("<option></option>")
                .attr("value", key).text(value));
        });
    };

    self.loadSpreadsheet = function (data) {
        var availableWidth, availableHeight;
        availableHeight = availableWidth = null;
        var spreadsheet = $('#spreadsheet');

        var calculateSize = function () {
            availableWidth  = $('#spreadsheet-panel-body').width();
            availableHeight = $('#spreadsheet-panel-body').height();
        };
        spreadsheet.on('resize', calculateSize);
        $(window).on('resize', calculateSize());

        spreadsheet.handsontable({
            data: data,
            rowHeaders: true,
            colHeaders: true,
            minSpareRows: 1,
            stretchH: 'all',
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
        //$('#dataOpenDialog'  ).click (controller.openEvent);
        $('#inputSpreadsheet').change(controller.loadCsv);

        // Weighted mean
        $('#analysesSelect').on('change', controller.selectChanged);
        $('#uncertaintiesSelect').on('change', controller.selectChanged);

        // Reduced Chi-Squared
        $('#observedSelect').on('change', controller.selectChanged);
        $('#expectedSelect').on('change', controller.selectChanged);

        // Kernel Density Estimation
        $('#XSelect').on('change', controller.selectChanged);
        $('#XiSelect').on('change', controller.selectChanged);
        $('#kernelFunctionSelect').on('change', controller.kernelFunctionChanged);
    };

    self.reloadSelectsFromData = function () {
        //TODO
    };
}