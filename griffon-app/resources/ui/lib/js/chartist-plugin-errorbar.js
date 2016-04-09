(function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
        points:{

        },
        bars: {
            errorBarHLineMinWidth: 1,
            errorBarHLineWidthFactor: 0.1,
        },
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

                    if(data.type == 'point' &&
                        data.series.name == 'values') {

                        data.group.append(
                            bar(data,
                                data.series.uncertainties[data.index],
                                options.bars)
                        );

                        data.element.addClass('weighted-mean-point');

                        if (options.points.show) {
                            data.element._node.setAttribute('style',
                                "stroke-linecap: round;" +
                                "stroke:" + options.points.color + ";" +
                                "stroke-width:" + options.points.width + "px;"
                            );
                        }//if
                        else {
                            data.element._node.setAttribute('style',
                                "stroke-linecap: round;" +
                                'stroke-width: 0;');
                        }//if
                        data.group.append(new Chartist.Svg(data.element._node));
                    }//if
                    else if (data.type == 'line' &&
                        data.series.name == 'values') {
                        // Remove values lines
                        data.element.remove();
                    }//else if
                    else if (data.type == 'point' &&
                        data.series.name == 'weightedMean') {
                        // Remove weighted mean points
                        data.element.remove();
                    }//else if
                    else if (data.type == 'line' &&
                        data.series.name == 'weightedMean') {
                        if (options.showMeanLine) {
                            var toPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                            data.element._node.setAttribute(
                                'style',
                                "stroke:" + options.meanLineColor + ";" +
                                "stroke-width:" + 4 * toPixelFactor * data.series.weightedUncertainty + ";"
                            );
                        }//if
                        else {
                            data.element.remove();
                        }//else
                    }//else if
                    else if (data.type == 'grid') {

                    }//else if
                    else if (data.type == 'label') {

                    }//else if
                });
            }

            function bar(data, uncertainty, options) {
                var toYPixelFactor = data.axisY.axisLength / (data.axisY.range.max - data.axisY.range.min);
                var toXPixelFactor = null;
                try {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.range.max - data.axisX.range.min);
                }//try
                catch(err) {
                    toXPixelFactor = data.axisX.axisLength / (data.axisX.ticks.length);
                }//catch

                var group = Chartist.Svg('g', { }, 'uncertainty-bar');
                var yScale = uncertainty * toYPixelFactor * 2;
                // Vertical line
                var object = new Chartist.Svg('line', {
                    x1: data.x,
                    x2: data.x,
                    y1: data.y - yScale,
                    y2: data.y + yScale,
                    stroke: options.color,
                    'stroke-width': options.width
                });
                group.append(object);

                if (options.showCaps) {
                    var halfHLineWidth = Math.max(
                        options.errorBarHLineMinWidth    * options.width,
                        options.errorBarHLineWidthFactor * options.width * toXPixelFactor
                    );

                    // Top horizontal line
                    group.append(new Chartist.Svg('line', {
                        x1: data.x - halfHLineWidth,
                        x2: data.x + halfHLineWidth,
                        y1: data.y + yScale,
                        y2: data.y + yScale,
                        stroke: options.color,
                        'stroke-width': options.width
                    }));

                    // Bottom horizontal line
                    group.append(new Chartist.Svg('line', {
                        x1: data.x - halfHLineWidth,
                        x2: data.x + halfHLineWidth,
                        y1: data.y - yScale,
                        y2: data.y - yScale,
                        stroke: options.color,
                        'stroke-width': options.width
                    }));
                }//if

                return group;
            }
        };
    };

}(window, document, Chartist));

