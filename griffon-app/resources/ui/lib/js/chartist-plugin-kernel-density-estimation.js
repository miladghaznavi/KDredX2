(function(window, document, Chartist) {
    'use strict';

    var STYLES = {
        labels: {
            vertical:
            'align-items: flex-end; ' +
            'text-align: right; ' +
            'display: flex; ' +
            'line-height: 1; ' +
            'justify-content: flex-end;',
            horizontal:
            'align-items: flex-start; ' +
            'text-align: left; ' +
            'display: flex; ' +
            'line-height: 1; ' +
            'justify-content: flex-start;'
        },
        points: 'stroke-linecap: round;'
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.kernelDensityEstimation = function(options) {
        return function errorBar(chart) {
            if(chart instanceof Chartist.Line) {
                chart.on('draw', function(data) {
                    if(data.type == 'point') {
                        data.element.remove();
                    }//if
                    else if (data.type == 'line') {
                        lineStyling(data.element, options);
                    }//else if
                    else if (data.type == 'grid') {
                        gridStyling(data.element, options, (data.x1 == data.x2) ? 'horizontal' : 'vertical');
                    }//else if
                    else if (data.type == 'label') {
                        labelStyling(data.element, options, data.axis.units.dir);
                    }//else if
                });
            }

            function lineStyling(element, options) {
                var linesPrefs = options.lines;
                element._node.setAttribute(
                    'style',
                    Util.preferencesToCssStyles(linesPrefs, 'lines')
                );
            }

            function gridStyling(element, options, dir) {
                var gridPref = (dir == 'vertical') ? options.yAxis.gridLines : options.xAxis.gridLines;
                var style = element._node.getAttribute('style') + ';';

                if (gridPref.show == true) {
                    element._node.setAttribute('style',
                        style + Util.preferencesToCssStyles(gridPref, 'lines')
                    );
                }//if
                else {
                    element._node.setAttribute('style', style + 'display: none;');
                }//else
                element._node.setAttribute('class',
                    gridPref.class);
            }

            function labelStyling(element, options, dir) {
                var labelsPref = (dir == 'vertical') ? options.yAxis : options.xAxis;
                var style = element.querySelector('span')._node.getAttribute('style') + ';' + STYLES.labels[dir];

                if (labelsPref.labels.show == true) {
                    element.querySelector('span')._node.setAttribute('style',
                        style + Util.preferencesToCssStyles(labelsPref.labels.font, 'fonts')
                    );
                }//if
                else {
                    element.querySelector('span')._node.setAttribute('style',
                        style + 'display: none;'
                    );
                }//else
                element.querySelector('span')._node.setAttribute('class',
                    labelsPref.labels.class
                );
            }
        };
    };

}(window, document, Chartist));
