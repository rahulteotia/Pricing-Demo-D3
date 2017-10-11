$(document).ready(function () {
    function getData() {
        var a = 0.04;
        var data = [];
        var data2  = [
            /////////////////////////////////////////////
            {
                xVar: 0,
                yVar: 0

            },
            /////////////////////////////////////////////
            {
                xVar: 1,
                yVar: 3248
            },
            {
                xVar: 2,
                yVar: 3599
            },
            /////////////////////////////////////////////
            {
                xVar: 9,
                yVar: 6113

            },
            {
                xVar: 10,
                yVar: 6475

            },
            /////////////////////////////////////////////
            {
                xVar: 49,
                yVar: 21249

            },
            {
                xVar: 50,
                yVar: 21614

            },
            /////////////////////////////////////////////
            {
                xVar: 99,
                yVar: 41231

            },
            {
                xVar: 100,
                yVar: 41595

            },
            /////////////////////////////////////////////
            {
                xVar: 199,
                yVar: 80310

            },
            {
                xVar: 200,
                yVar: 80674

            },
            /////////////////////////////////////////////
            {
                xVar: 499,
                yVar: 197550

            },
            {
                xVar: 500,
                yVar: 197914

            },
            /////////////////////////////////////////////
            {
                xVar: 999,
                yVar: 392950

            },
            {
                xVar: 1000,
                yVar: 393315

            },
            /////////////////////////////////////////////
            {
                xVar: 4999,
                yVar: 1955468

            },
            {
                xVar: 5000,
                yVar: 1955833

            },
            /////////////////////////////////////////////
            {
                xVar: 10000,
                yVar: 3909153

            }
        ];


        for (var b = 8; b <= 50; b = b + 1) {
            data.push({
                xVar: b,
                yVar: b / a
            });
        }
        return data;
    }

    function drawChart(selector, data) {


        var chartEl = d3.select(selector);
        var xAxisLabel = chartEl.attr("data-xAxisLabel");
        var xAxisFormat = chartEl.attr("data-xAxisFormat");
        var yAxisLabel = chartEl.attr("data-yAxisLabel");
        var yAxisFormat = chartEl.attr("data-yAxisFormat");
        chartEl.selectAll("*").remove();
        var chartDiv = chartEl.append("div");
        chartDiv.attr("class", "g-parameter-chart");

        var svg = chartDiv.append("svg");
        svg.attr('width', 950).attr('height', 650).attr('viewBox', '0 0 950 650');
        var margin = {
            top: 50,
            right: 20,
            bottom: 40,
            left: 70
        };
        var width = +svg.attr("width") - margin.left - margin.right;
        var yAxisWidth = +svg.attr("width") + 10 - margin.left;

        var height = +svg.attr("height") - margin.top - margin.bottom;
        var sliderTop = 0 + height + margin.top;
        var xBandScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        var xAxisScale = d3.scaleLinear().rangeRound([0, width]); //TODO: allow log scale via attr
        var yAxisScale = d3.scaleLinear().rangeRound([height, 0]);
        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var xAxisMax = d3.max(data, function (d) {
            return d.xVar;
        });

        var xAxisMin = d3.min(data, function (d) {
            return d.xVar;
        });


        xBandScale.domain(data.map(function (d) {
            return d.xVar;
        }));
        xAxisScale.domain([xAxisMin, xAxisMax]);
        yAxisScale.domain([0, d3.max(data, function (d) {
            return d.yVar;
        })]);
        var yTicks = 6;
        var gX = g.append("g") //add x-axis
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxisScale).ticks(data.length, xAxisFormat));
        g.append("text") //add x-axis label
            .attr("class", "axisLabel xAxisLabel")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .text(xAxisLabel);
        var yAxis = d3.axisLeft(yAxisScale).ticks(yTicks, yAxisFormat);
        var gY = g.append("g") //add y-axis
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + yAxisWidth + ", 0)")
            .call(yAxis);
        svg.append("text") //add y-axis label
            .attr("class", "axisLabel yAxisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0 - (height / 2))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(yAxisLabel);

        var middle = data[Math.round((data.length + 1) / 2)];

        var bars = g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xBandScale(d.xVar);
            })
            .attr("y", function (d) {
                return yAxisScale(d.yVar);
            })
            .attr("width", xBandScale.bandwidth())
            .attr("height", function (d) {
                return height - yAxisScale(d.yVar);
            }).attr("class", function (d) {
                if (middle.xVar == d.xVar) {
                    return "barSelected";
                } else {
                    return "bar";
                }
            });

        function make_y_gridlines() {
            return d3.axisLeft(yAxisScale).ticks(yTicks);
        }


        g.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines().tickSize(-width).tickFormat("")); // add the Y gridlines layered on top of the bars

        var dragging = function () {
            var dragEvent = d3.event;
            //console.log('dragEvent', dragEvent);
            var h = xAxisScale.invert(dragEvent.x);
            var w = yAxisScale.invert(dragEvent.y);
            console.log('h', h);
            if (h <= xAxisMin || h > xAxisMax) {
                return;
            }
            chartEl.attr('data-value', dragEvent.x);
            text.text("$ " + Math.round(h));
            handlePath.attr("transform", "translate(" + xAxisScale(h) + ",-6)"); //TODO: handle should move when dragged

            gY.call(yAxis);
            //TODO: add y-value tooltip

            //Bars
            yAxisScale.domain([0, dragEvent.x * 2]);
            var bars = d3.selectAll(".bar")
                .remove()
                .exit()
                .data(data);

            d3.selectAll(".barSelected")
                .remove()
                .exit()
                .data(data);
            // d3.selectAll(".g-parameter-tip")
            //     .remove()
            //     .exit()
            //     .data(data);


            var newBars = g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("x", function (d) {
                    return xBandScale(d.xVar);
                })
                .attr("y", function (d) {
                    if (yAxisScale(d.yVar) <= 0) {
                        return 0;
                    }
                    return yAxisScale(d.yVar);
                })
                .attr("width", xBandScale.bandwidth())
                .attr("height", function (d) {
                    if (yAxisScale(d.yVar) <= 0) {
                        return height;
                    }
                    return height - yAxisScale(d.yVar);
                }).attr("class", function (d) {
                    if (Math.round(h) != d.xVar) {
                        return "bar";
                    } else {
                        return "barSelected";
                    }
                });

            var barsel = g.selectAll(".barSelected").attr("height");
            barsel = parseFloat(barsel);

            var barX = g.selectAll(".barSelected").attr("x");

            toolTip.attr("style", "margin-left: 20px; margin-bottom: 39px; left: " + barX + "px; bottom: " + -(barsel) + "px;");

        };
        var slider = svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + margin.left + "," + sliderTop + ")");

        slider.append("line")
            .attr("class", "track")
            .attr("x1", xAxisScale.range()[0])
            .attr("x2", xAxisScale.range()[1])
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "track-inset")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "track-overlay")
            .call(d3.drag().on("start.interrupt", function () {
                slider.interrupt();
            }).on("start drag", dragging)); //https://github.com/d3/d3-drag

        var handle = slider.append("g").attr("class", "g-parameter-value handle");
        var initialXPos = xAxisScale(chartEl.attr("data-value"));
        var handlePath = handle.append("path").attr("d", "M-5.5,-2.5v10l6,5.5l6,-5.5v-10z")
            .attr("transform", "translate(" + initialXPos + "," + -6 + ")");
        handle.append("text").style("text-anchor", "middle").attr("y", 20).attr("dy", ".71em");

        var toolTip = chartEl.append("svg");

        toolTip.attr("class", "g-parameter-tip");
        toolTip.attr("width", "120");
        toolTip.attr("height", "25");
        var toolTipG = toolTip.append("g");
        toolTipG.attr("transform", "translate(60,20)");
        toolTipG.append("path").attr("d", "M5,0h13.809989929199219a5,5 0 0,0 5,-5v-10a5,5 0 0,0 -5,-5h-37.61997985839844a5,5 0 0,0 -5,5v10a5,5 0 0,0 5,5h13.809989929199219l5,5z");
        var text = toolTipG.append("text");
        text.attr("y", "-6");

        var barsel = g.selectAll(".barSelected").attr("height");
        barsel = parseFloat(barsel) - 50;
        text.text("$ " + Math.round(middle.xVar));

        var barX = g.selectAll(".barSelected").attr("x");

        console.log(barsel);
        toolTip.attr("style", "margin-left: 20px; margin-bottom: 39px; left: " + barX + "px; bottom: " + -(barsel) + "px;");

        // var tooltip = svg.append("g")
        //     .attr("class", "tooltip");
        // slider.insert("g", ".track-overlay")
        //     .attr("class", "ticks")
        //     .attr("transform", "translate(0," + 18 + ")")
        //     .selectAll("text")
        //     .data(xAxisScale.ticks(10))
        //     .enter().append("text")
        //     .attr("xAxisScale", xAxisScale)
        //     .attr("text-anchor", "middle");
        //
        // tooltip.append("rect")
        //     .attr("width", 60)
        //     .attr("height", 20)
        //     .attr("fill", "white")
        //     .style("opacity", 0.5);
        //
        // tooltip.append("text")
        //     .attr("x", 30)
        //     .attr("dy", "1.2em")
        //     .style("text-anchor", "middle")
        //     .attr("font-size", "12px")
        //     .attr("font-weight", "bold");

    }


    function drawEverything() {
        $(".d3Chart").empty();
        var data = getData();
        console.log(data);
        var sliderParamSize = d3old.slider().min(0).max(2).ticks(1).showRange(true).value(1);
// Render the slider in the div
        d3old.select('#pricing-param-size').call(sliderParamSize);

        var sliderParamOrder = d3old.slider().min(0).max(2).ticks(1).showRange(true).value(2);
// Render the slider in the div
        d3old.select('#pricing-param-order').call(sliderParamOrder);

        drawChart(".d3Chart", data);
    }

    drawEverything();


});
