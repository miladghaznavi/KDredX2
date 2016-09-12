function MainView(id) {
    MainView.PLOT = '#plotButton';
    MainView.VIEW = '#view';
    MainView.VIEW_ICON = '#viewIcon';
    MainView.VIEW_ICON_TOGGLE_CLASS = 'fa-rotate-90';
    MainView.SPREADSHEET_CONTAINER = '#spreadsheet-container';
    MainView.CHART_CONTAINER = '#chart-container';
    MainView.ROW_VIEW_CLASS = 'col-sm-12';
    MainView.SPREADSHEET_COLUMN_VIEW_CLASS = 'col-sm-4 no-padding-right';
    MainView.CHART_COLUMN_VIEW_CLASS = 'col-sm-8 no-padding-left';

    var self = this;
    id = typeof id !== 'undefined' ? id : null;

    self.id = id;

    self.init = function (args) {
        self.update();
        self.registerEvents();
    };

    self.update = function () {

    };

    self.registerEvents = function() {
        var controller = app.getController(self.id);
        $(MainView.PLOT).click(controller.plot);
        $(MainView.VIEW).click(controller.toggleViewEvent);
    };

    self.toggleView = function() {
        $(MainView.VIEW_ICON).toggleClass(MainView.VIEW_ICON_TOGGLE_CLASS);
        if ($(MainView.SPREADSHEET_CONTAINER).hasClass(MainView.ROW_VIEW_CLASS)) {
            $(MainView.SPREADSHEET_CONTAINER).removeClass(MainView.ROW_VIEW_CLASS);
            $(MainView.SPREADSHEET_CONTAINER).addClass(MainView.SPREADSHEET_COLUMN_VIEW_CLASS);

            $(MainView.CHART_CONTAINER).removeClass(MainView.ROW_VIEW_CLASS);
            $(MainView.CHART_CONTAINER).addClass(MainView.CHART_COLUMN_VIEW_CLASS);
        }//if
        else {
            $(MainView.SPREADSHEET_CONTAINER).removeClass(MainView.SPREADSHEET_COLUMN_VIEW_CLASS);
            $(MainView.SPREADSHEET_CONTAINER).addClass(MainView.ROW_VIEW_CLASS);

            $(MainView.CHART_CONTAINER).removeClass(MainView.CHART_COLUMN_VIEW_CLASS);
            $(MainView.CHART_CONTAINER).addClass(MainView.ROW_VIEW_CLASS);
        }//if
    };
    
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}