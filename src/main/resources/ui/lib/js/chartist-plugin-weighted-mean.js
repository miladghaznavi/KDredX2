(function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
        bars: {
            errorBarHLineMinWidth: 1,
            errorBarHLineWidthFactor: 0.1,
        },
        rejectedBars: {
            errorBarHLineMinWidth: 1,
            errorBarHLineWidthFactor: 0.1,
        },
        meanLineGroupId: 'weightedMean-line',
    };
    var STYLES = {
        labels: {
            vertical:
                '',
            horizontal:
                ''
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

                            var rejected = false;
                            for (var i = 0; i < data.series.rejectedIndices.length && !rejected; ++i) {
                                rejected = (data.series.rejectedIndices[i] == data.index);
                            }//for

                            data.group.append(
                                bar(data,
                                    data.series.uncertainties[data.index],
                                    data.series.dataUncertainty,
                                    options,
                                    rejected
                                )
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

                        // Mean box
                        // options.meanBox['width'] = 4 * toPixelFactor * data.series.weightedUncertainty;
                        options.meanBox['width'] = 2 * toPixelFactor * data.series.weightedAvgUncertainty * data.series.weightedUncertainty;
                        var yPos = (data.axisY.range.max - data.values[0].y) * toPixelFactor + data.chartRect.padding.top;
                        var box = new Chartist.Svg('line', {
                            x1: data.axisX.chartRect.x1,
                            x2: data.axisX.chartRect.x2,
                            y1: yPos,
                            y2: yPos
                        });
                        meanBoxStyling(box, options);
                        data.group.append(box);

                        // Mean Line
                        var line = new Chartist.Svg('line', {
                            x1: data.axisX.chartRect.x1,
                            x2: data.axisX.chartRect.x2,
                            y1: yPos,
                            y2: yPos
                        });
                        meanLineStyling(line, options);
                        data.group.append(line);

                        data.element.remove();
                    }//else if
                    else if (data.type == 'grid') {
                        gridStyling(data.element, options, (data.x1 == data.x2) ? 'horizontal' : 'vertical');
                    }//else if
                    else if (data.type == 'label') {
                        // labelStyling(data.element, options, data.axis.units.dir);
                        // data.group.append(
                        //     label(data)
                        // );

                        addLabel(data, options);
                        data.element.remove();
                    }//else if
                });
            }

            function pointStyling(element, options, rejected) {
                var pointPref = (rejected) ? options.rejectedPoints : options.points;

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

            function meanLineStyling(element, options) {
                var meanLinePref = options.meanLine;
                element._node.setAttribute(
                    'style',
                    Util.preferencesToCssStyles(meanLinePref, 'lines')
                );
                element._node.setAttribute(
                    'class',
                    options.meanLine.class
                )
            }

            function gridStyling(element, options, dir) {
                var gridPref = (dir == 'vertical') ? options.yAxis.gridLines : options.xAxis.gridLines;
                var style = "";
                if (element._node.getAttribute('style') != null)
                    style += element._node.getAttribute('style') + ';';

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

            function bar(data, uncertainty, dataUncertainty, options, rejected) {
                var barOptions = (rejected) ? options.rejectedBars : options.bars;
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
                // var yScale = 2 * uncertainty * toYPixelFactor;
                var yScale = dataUncertainty * uncertainty * toYPixelFactor;

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

                pointStyling(point, options, rejected);
                group.append(point);
                return group;
            }

            function addLabel(data, options) {
                var dir = data.axis.units.dir;
                var labelsPref = (dir == 'vertical') ? options.yAxis : options.xAxis;
                var labelId = 'wm-label-' + dir + '-' + data.index.toString();
                var style = Util.preferencesToCssStyles(labelsPref.labels.font, 'svgFonts');

                var labelTag = Chartist.Svg('text', {
                    x: (dir == 'vertical') ? data.x + data.width : data.x,
                    y: data.y + data.height,
                    width: data.width,
                    height: data.height,
                    id: labelId,
                    style: style,
                    'dominant-baseline': 'alphabetical',
                    'text-anchor': (dir == 'vertical') ? 'end' : 'middle'
                });

                data.group.append(labelTag);
                document.getElementById(labelId).textContent = data.text;
            }
        };
    };

}(window, document, Chartist));

