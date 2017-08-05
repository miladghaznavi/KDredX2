function Util(){
    Util.STYLES = {
        fonts: {
            fontFamily: {
                prop: 'font-family',
                unit: ''
            },
            fontSize: {
                prop: 'font-size',
                unit: 'px'
            },
            fontColor: {
                prop: 'color',
                unit: ''
            },
            fontBold: {
                prop: 'font-weight',
                unit: '',
                boolean: true,
                value: 'bold'
            },
            fontItalic: {
                prop: 'font-style',
                unit: '',
                boolean: true,
                value: 'italic'
            },
            fontUnderline: {
                prop: 'text-decoration',
                unit: '',
                boolean: true,
                value: 'underline'
            },
            fontStrikethrough: {
                prop: 'text-decoration',
                unit: '',
                boolean: true,
                value: 'line-through'
            }
        },
        svgFonts: {
            fontFamily: {
                prop: 'font-family',
                unit: ''
            },
            fontSize: {
                prop: 'font-size',
                unit: 'px'
            },
            fontColor: {
                prop: 'fill',
                unit: ''
            },
            fontBold: {
                prop: 'font-weight',
                unit: '',
                boolean: true,
                value: 'bold'
            },
            fontItalic: {
                prop: 'font-style',
                unit: '',
                boolean: true,
                value: 'italic'
            },
            fontUnderline: {
                prop: 'text-decoration',
                unit: '',
                boolean: true,
                value: 'underline'
            },
            fontStrikethrough: {
                prop: 'text-decoration',
                unit: '',
                boolean: true,
                value: 'line-through'
            }
        },
        size: {
            width: {
                prop: 'width',
                unit: 'px'
            },
            height: {
                prop: 'height',
                unit: 'px'
            }
        },
        lines: {
            style: {
                prop: 'stroke-dasharray',
                dict: true,
                value: {
                    dashed: '4',
                    points: '1'
                },
                unit: 'px'
            },
            width: {
                prop: 'stroke-width',
                unit: 'px'
            },
            color: {
                prop: 'stroke',
                unit: ''
            }
        },
        rects: {
            color: {
                prop: 'fill',
                unit: ''
            }
        },
        // TODO
        scale: {}
    };

    Util.fileName = function (path) {
        return path.replace(/^.*[\\\/]/, '')
    };

    Util.areArraysSame = function(arr1, arr2) {
        var same = (arr1.length == arr2.length);
        for (var i = 0; i < arr1.length && same; ++i) {
            same = (arr1[i] == arr2[i]);
        }//for

        return same;
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
    
    Util.log = function(e) {
        console.log(e);
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

    Util.computePreferencesToCssStyles = function(preferences, cssMap) {
        var styles = {};
        for (var key in preferences) {
            if (key in cssMap) {
                var prop = cssMap[key].prop;
                var unit = cssMap[key].unit;
                var bool = cssMap[key].boolean;
                var dict = cssMap[key].dict;
                var val  = cssMap[key].value;

                if (bool == undefined && dict == undefined) {
                    if (styles[prop] == undefined)
                        styles[prop] = [];
                    styles[prop].push(preferences[key].toString() + unit);
                }//if
                else if (bool == true && preferences[key] == true) {
                    if (styles[prop] == undefined)
                        styles[prop] = [];
                    styles[prop].push(val + unit);
                }//else if
                else if (dict == true) {
                    if (styles[prop] == undefined)
                        styles[prop] = [];

                    for (var styleKey in val) {
                        if (preferences[key] == styleKey) {
                            styles[prop].push(val[styleKey] + unit);
                            break;
                        }//if
                    }//for
                }//else
            }//if
        }//for

        var stringResult = "";

        for (var prop in styles) {
            var style = prop + ':';
            for (var i = 0; i < styles[prop].length; ++i) {
                style += ' ' + styles[prop][i];
            }//for
            style += ';';
            stringResult += style;
        }//for

        return stringResult;
    };

    Util.preferencesToCssStyles = function(pref, which) {
        var result = null;
        for (var key in Util.STYLES){
            if(key == which){
                result = Util.computePreferencesToCssStyles(pref, Util.STYLES[key]);
                break;
            }//if
        }//for
        return result;
    };

    Util.checkScale = function(low, high, kwargs) {
        if (kwargs != undefined && kwargs.swap != undefined) {
            var tmp = low;
            low = high;
            high = tmp;
        }//if
        return (low == null || high == null) ||
                (parseFloat(low) < parseFloat(high));
    };

    Util.checkUnit = function(unit, other, kwargs) {
        return (unit == null) ||
            (parseFloat(unit) > 0.0);
    };

    Util.max = function(array) {
        var max = (array.length > 0) ? array[0] : NaN;

        for (var i = 1; i < array.length; ++i)
            max = Math.max(array[i], max);

        return max;
    };

    Util.min = function(array) {
        var min = (array.length > 0) ? array[0] : NaN;

        for (var i = 1; i < array.length; ++i)
            min = Math.min(array[i], min);

        return min;
    };

    Util.extractSVGs = function(query) {
        var result = [];
        $(query).each(function(index, element){
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(element);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            // //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

            //save the url
            result.push(url);
        });

        return result;
    };

    Util.saveAsPNG = function(query) {
        var result = [];
        $(query).each(function(index, svg){
            var svgData = new XMLSerializer().serializeToString( svg );

            var canvas = document.createElement( "canvas" );
            var ctx = canvas.getContext( "2d" );

            var img = document.createElement( "img" );
            img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );

            img.onload = function() {
                ctx.drawImage( img, 0, 0 );

                // Now is done
                // console.log( canvas.toDataURL( "image/png" ) );
            };

        });
        return result;
    };

    Util.saveAsSVG = function(query) {
        var result = [];
        $(query).each(function(index, element){
            svgAsDataUri(element, {}, function(uri) {
                result.push(uri);
            });
        });

        return result;
    };

    Util.saveAsPDF = function(query) {
        var svg = $(query).get(0);
        var pdf = new jsPDF('p', 'pt', 'a4');
        svgElementToPdf(svg, pdf, {
            scale: 72/96, // this is the ratio of px to pt units
            removeInvalid: true // this removes elements that could not be translated to pdf from the source svg
        });
        pdf.output('datauri'); // use output() to get the jsPDF buffer
    };

    Util.saveAsEPS = function(query) {
        Util.notifyInfo("Currently saving in eps format is not supported in the web version. For saving in this format please use the application.");
    };

    Util.createSVGElement = function(tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };
}
Util();
