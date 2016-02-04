/**
 * Chartist.js plugin to display error bars in a line chart.
 *
 */
/* global Chartist */
(function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
        errorBarHLineMinWidth: 5,
        errorBarHLineWidthFactor: 0.1,
        meanLineGroupId: 'weightedMean-line',
        showMeanLine: true
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.errorBar = function(options) {
        options = Chartist.extend({ }, defaultOptions, options);

        return function errorBar(chart) {
            if(chart instanceof Chartist.Line) {
                chart.on('draw', function(data) {
                    if(data.type === 'point' &&
                        data.series.name == 'analyses') {
                        data.group.append(
                            bar(data, data.series.uncertainties[data.index])
                        );
                    }//if
                    else if (data.type === 'line' &&
                                data.series.name == 'weightedMean') {
                        if (options.showMeanLine) {
                            var toPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                            data.element._node.setAttribute('style',
                                "stroke-width:" + 2 * toPixelFactor * data.series.weightedUncertainty + ";");
                        }//if
                        else {
                            data.element.remove();
                        }//else
                    }//else if
                });
            }

            function bar(data, error) {
                var toYPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                var toXPixelFactor = null;
                try {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.range.max - data.axisX.range.min);
                }//try
                catch(err) {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.ticks.length);
                }//catch

                var group = Chartist.Svg('g', { }, 'error-bar');

                console.log(data);

                // Vertical line
                group.append(new Chartist.Svg('line', {
                    x1: data.x,
                    x2: data.x,
                    y1: data.y - error * toYPixelFactor,
                    y2: data.y + error * toYPixelFactor,
                }));

                var halfHLineWidth = Math.max(
                    options.errorBarHLineMinWidth,
                    options.errorBarHLineWidthFactor * toXPixelFactor
                );

                // Top horizontal line
                group.append(new Chartist.Svg('line', {
                    x1: data.x - halfHLineWidth ,
                    x2: data.x + halfHLineWidth ,
                    y1: data.y + error * toYPixelFactor,
                    y2: data.y + error * toYPixelFactor
                }));

                // Bottom horizontal line
                group.append(new Chartist.Svg('line', {
                    x1: data.x - halfHLineWidth,
                    x2: data.x + halfHLineWidth,
                    y1: data.y - error * toYPixelFactor,
                    y2: data.y - error * toYPixelFactor,
                }));

                return group;
            }
        };
    };

}(window, document, Chartist));

