(function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
        bars: {
            errorBarHLineMinWidth: 1,
            errorBarHLineWidthFactor: 0.1,
        },
        meanLineGroupId: 'weightedMean-line',
    };
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
                'justify-content: flex-start;',
        },
        points: 'stroke-linecap: round;'
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.weightedMean = function(options) {
        options = Chartist.extend({ }, defaultOptions, options);
        return function errorBar(chart) {
            if(chart instanceof Chartist.Line) {
                chart.on('draw', function(data) {
                    if(data.type == 'point' && data.series.name == 'values') {
                        if (data.index + 1 >= data.axisX.range.min &&
                            data.index + 1 <= data.axisX.range.max) {
                            data.group.append(
                                bar(data,
                                    data.series.uncertainties[data.index],
                                    options)
                            );
                        }//if

                        data.element.remove();
                    }//if
                    else if (data.type == 'line'  && data.series.name == 'values') {
                        // Remove values lines
                        data.element.remove();
                    }//else if
                    else if (data.type == 'point' && data.series.name == 'weightedMean') {
                        // Remove weighted mean points
                        data.element.remove();
                    }//else if
                    else if (data.type == 'line'  && data.series.name == 'weightedMean') {
                        var toPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                        options.meanBox['width'] = 4 * toPixelFactor * data.series.weightedUncertainty;

                        var yPos = (data.axisY.range.max - data.values[0].y) * toPixelFactor
                                    + data.chartRect.padding.top;
                        var line = new Chartist.Svg('line', {
                            x1: data.axisX.chartRect.x1,
                            x2: data.axisX.chartRect.x2,
                            y1: yPos,
                            y2: yPos
                        });
                        meanBoxStyling(line, options);
                        data.group.append(line);
                        data.element.remove();
                    }//else if
                    else if (data.type == 'grid') {
                        gridStyling(data.element, options, (data.x1 == data.x2) ? 'horizontal' : 'vertical');
                    }//else if
                    else if (data.type == 'label') {
                        labelStyling(data.element, options, data.axis.units.dir);
                    }//else if
                });
            }

            function pointStyling(element, options) {
                var pointPref = options.points;

                if (pointPref.show) {
                    element._node.setAttribute('style',
                        STYLES.points +
                        Util.preferencesToCssStyles(pointPref, 'lines')
                    );
                }//if
                else {
                    element._node.setAttribute('style',
                        STYLES.points +
                        'display: none;');
                }//if
                element.addClass(options.points.class);
            }

            function meanBoxStyling(element, options) {
                var meanBoxPref = options.meanBox;
                if (meanBoxPref.show) {
                    element._node.setAttribute(
                        'style',
                        Util.preferencesToCssStyles(meanBoxPref, 'lines')
                    );
                    element._node.setAttribute(
                        'class',
                        options.meanBox.class
                    );
                }//if
                else {
                    var style = element._node.getAttribute('style') + ';';
                    element._node.setAttribute('style',
                        style + 'display: none;'
                    );
                }//else
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

            function bar(data, uncertainty, options) {
                var barOptions = options.bars;
                var toYPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                var toXPixelFactor = null;
                try {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.range.max - data.axisX.range.min);
                }//try
                catch(err) {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.ticks.length);
                }//catch

                data.x = (data.index + 1) * toXPixelFactor + data.x;

                var group = Chartist.Svg('g', { }, 'uncertainty-bar');
                var yScale = 2 * uncertainty * toYPixelFactor;

                // Vertical line
                var barWithoutCap = new Chartist.Svg('line', {
                    x1: data.x,
                    x2: data.x,
                    y1: data.y - yScale,
                    y2: data.y + yScale,
                    stroke: barOptions.color,
                    'stroke-width': barOptions.width
                });
                group.append(barWithoutCap);

                if (barOptions.showCaps) {
                    var halfHLineWidth = Math.max(
                        barOptions.errorBarHLineMinWidth    * barOptions.width,
                        barOptions.errorBarHLineWidthFactor * barOptions.width * toXPixelFactor
                    );

                    // Top horizontal line
                    group.append(new Chartist.Svg('line', {
                        x1: data.x - halfHLineWidth,
                        x2: data.x + halfHLineWidth,
                        y1: data.y + yScale,
                        y2: data.y + yScale,
                        stroke: barOptions.color,
                        'stroke-width': barOptions.width
                    }));

                    // Bottom horizontal line
                    group.append(new Chartist.Svg('line', {
                        x1: data.x - halfHLineWidth,
                        x2: data.x + halfHLineWidth,
                        y1: data.y - yScale,
                        y2: data.y - yScale,
                        stroke: barOptions.color,
                        'stroke-width': barOptions.width
                    }));
                }//if

                var point = new Chartist.Svg('line', {
                    x1: data.x,
                    x2: data.x,
                    y1: data.y,
                    y2: data.y
                });

                pointStyling(point, options);
                group.append(point);
                return group;
            }
        };
    };

}(window, document, Chartist));

