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
                    console.log(data);
                    if(data.type === 'point' &&
                        data.series.name == 'analyses') {
                        console.log(data);
                        data.group.append(
                            bar(data, data.series.uncertainties[data.index],
                                options.showPoint, options.showHLine)
                        );

                        if (!options.showPoint) {
                            data.element._node.setAttribute('style',
                                'stroke-width: 0;');
                        }//if
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

                    else if (data.type == 'grid') {

                    }//else if
                });
            }

            function bar(data, error, showPoint, showHLine) {
                var toYPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                var toXPixelFactor = null;
                try {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.range.max - data.axisX.range.min);
                }//try
                catch(err) {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.ticks.length);
                }//catch

                var group = Chartist.Svg('g', { }, 'error-bar');

                // Vertical line
                group.append(new Chartist.Svg('line', {
                    x1: data.x,
                    x2: data.x,
                    y1: data.y - error * toYPixelFactor,
                    y2: data.y + error * toYPixelFactor
                }));

                if (showHLine) {
                    var halfHLineWidth = Math.max(
                        options.errorBarHLineMinWidth,
                        options.errorBarHLineWidthFactor * toXPixelFactor
                    );

                    // Top horizontal line
                    group.append(new Chartist.Svg('line', {
                        x1: data.x - halfHLineWidth,
                        x2: data.x + halfHLineWidth,
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
                }//if

                return group;
            }
        };
    };

}(window, document, Chartist));

