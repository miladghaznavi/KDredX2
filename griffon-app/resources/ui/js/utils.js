function Util(){
    Util.fileName = function (path) {
        return path.replace(/^.*[\\\/]/, '')
    };

    Util.notify = function(type, msg, title){
        Lobibox.notify(type, {
            msg: msg,
            title: title
        });
    };

    Util.notifyError = function(msg, title){
        title = typeof title !== 'undefined' ? title : 'Error';
        Util.notify('error', msg, title);
    };

    Util.notifyWarning = function(msg, title){
        title = typeof title !== 'undefined' ? title : 'Warning';
        Util.notify('warning', msg, title);
    };

    Util.notifyInfo = function(msg, title){
        title = typeof title !== 'undefined' ? title : 'Info';
        Util.notify('info', msg, title);
    };

    Util.notifySuccess = function(msg, title){
        title = typeof title !== 'undefined' ? title : 'Success';
        Util.notify('success', msg, title);
    };
    
    Util.log = function() {

    };

    Util.webSafeFonts = function() {
        return [
            // Serif Fonts
            "Georgia",
            "Palatino Linotype",
            "Book Antiqua",
            "Palatino",
            "Times New Roman",
            "Times",

            // Sans-Serif Fonts
            "Arial",
            "Helvetica",
            "Arial Black",
            "Gadge",
            "Comic Sans MS",
            "cursive",
            "sans-serif",
            "Impact",
            "Charcoal",
            "Lucida Sans Unicode",
            "Lucida Grande",
            "Tahoma",
            "Geneva",
            "Trebuchet MS",
            "Verdana",

            // Monospace Fonts
            "Courier New",
            "Courier",
            "Lucida Console",
            "Monaco",

            //
            "MS Serif",
            "New York",
        ].sort();
    };
}
Util();
