$(document).ready(function () {
    function getPricingData() {
        var data = [
            {
                xVar: 1,
                yVar: 2984,
                existingPrice: 1440

            },
            {
                xVar: 2,
                yVar: 1571,
                existingPrice: 799
            },
            {
                xVar: 3,
                yVar: 1100,
                existingPrice: 585
            },
            {
                xVar: 4,
                yVar: 864,
                existingPrice: 479

            },
            {
                xVar: 5,
                yVar: 723,
                existingPrice: 415

            },
            {
                xVar: 6,
                yVar: 629,
                existingPrice: 372

            },
            {
                xVar: 7,
                yVar: 562,
                existingPrice: 341

            },
            {
                xVar: 10,
                yVar: 441,
                existingPrice: 286

            },
            {
                xVar: 20,
                yVar: 299,
                existingPrice: 220

            },
            {
                xVar: 30,
                yVar: 260,
                existingPrice: 209

            },
            {
                xVar: 50,
                yVar: 224,
                existingPrice: 193

            },
            {
                xVar: 60,
                yVar: 214,
                existingPrice: 189

            },
            {
                xVar: 70,
                yVar: 210,
                existingPrice: 479

            },
            {
                xVar: 100,
                yVar: 197,
                existingPrice: 188

            },
            {
                xVar: 200,
                yVar: 180,
                existingPrice: 172

            },
            {
                xVar: 300,
                yVar: 175,
                existingPrice: 170

            },
            {
                xVar: 400,
                yVar: 175,
                existingPrice: 168

            },

            {
                xVar: 500,
                yVar: 172,
                existingPrice: 167

            },
            {
                xVar: 700,
                yVar: 172,
                existingPrice: 166

            },
            {
                xVar: 900,
                yVar: 171,
                existingPrice: 166

            },
            {
                xVar: 1000,
                yVar: 170,
                existingPrice: 165

            },
            {
                xVar: 2000,
                yVar: 169,
                existingPrice: 165

            },
            {
                xVar: 3000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 4000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 5000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 6000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 7000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 9000,
                yVar: 169,
                existingPrice: 164

            },
            {
                xVar: 10000,
                yVar: 169,
                existingPrice: 165

            }
        ];

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
        svg.attr('width', 950).attr('height', 650);
        var margin = {
            top: 50,
            right: 40,
            bottom: 40,
            left: 70
        };
        var graphHeight = svg.attr("height");

        var width = +svg.attr("width") - margin.left - margin.right;
        var yAxisWidth = +svg.attr("width") - margin.left;

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
            .call(d3.axisBottom(xBandScale)
                .ticks(20)
                .tickFormat(d3.format(".0s")));
        g.append("text") //add x-axis label
            .attr("class", "axisLabel xAxisLabel")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .text(xAxisLabel);
        var yAxis = d3.axisLeft(yAxisScale).ticks(yTicks, yAxisFormat);
        var gY = g.append("g") //add y-axis
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + 0 + ", 0)")
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

        //DRAW BARS
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
            .attr("class", function (d) {
                if (middle.xVar == d.xVar) {
                    return "barSelected";
                } else {
                    return "bar";
                }
            }).attr("height", 0)
            .transition()
            .duration(600)
            .delay(function (d, i) {
                return i * 50;
            }).attr("height", function (d) {
                return height - yAxisScale(d.yVar);
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
            if (h <= xAxisMin || h > xAxisMax) {
                return;
            }
            chartEl.attr('data-value', dragEvent.x);
            handlePath.attr("transform", "translate(" + xAxisScale(h) + ",-6)"); //TODO: handle should move when dragged

            gY.call(yAxis);
            //TODO: add y-value tooltip

            yAxisScale.domain([0, dragEvent.x * 5]);

            //REMOVE ALL BARS
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


            //REDRAW NEW BARS ON DRAG
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
                    var xBandStart = xBandScale(d.xVar);
                    var xBandEnd = xBandStart + 27;
                    console.log("X "+dragEvent.x);

                    if( dragEvent.x >= xBandStart &&  dragEvent.x <= xBandEnd){
                        text.text("$ " + Math.round(d.yVar));
                        updateSizingPrice(d);
                        return "barSelected";
                    }else{
                        return "bar";
                    }
                });

            var barsel = g.selectAll(".barSelected").attr("y");
            barsel = parseFloat(barsel) + 40;


            var barX = g.selectAll(".barSelected").attr("x");
            barX = 22 + parseFloat(barX);

            toolTip.attr("style", "margin-left: 0px; margin-bottom: 0px; left: " + barX + "px; bottom: " + -(barsel) + "px;");

        };

        //SLIDER
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


        //HANDLE FOR SLIDER
        var handle = slider.append("g").attr("class", "g-parameter-value handle");
        var selectedBar = d3.selectAll(".barSelected");
        var initialXPos = selectedBar.attr("x");
        var width = selectedBar.attr("width");
        initialXPos = parseFloat(initialXPos) + (width / 2);

        var handlePath = handle.append("path").attr("d", "M-5.5,-2.5v10l6,5.5l6,-5.5v-10z")
            .attr("transform", "translate(" + initialXPos + "," + -6 + ")");
        handle.append("text").style("text-anchor", "middle").attr("y", 20).attr("dy", ".71em");

        //TOOLTIP ON BARS

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
        barsel =  parseFloat(graphHeight) - parseFloat(barsel) - 5;
        text.text("$ " + Math.round(middle.yVar));
        updateSizingPrice(middle);
        var barX = g.selectAll(".barSelected").attr("x");
        toolTip.attr("style", "margin-left: 20px; margin-bottom: 39px; left: " + barX + "px; bottom: " + (-barsel) + "px;");
    }


    function drawEverything() {
        $(".d3Chart").empty();
        var data = getPricingData();
        drawChart(".d3Chart", data);
    }

    function unhighLightSizingDiv(){
        $("#row-1-header-1").css({"background": ""});
        $("#row-2-header-1").css({"background": ""});
        $("#row-1-header-2").css({"background": ""});
        $("#row-2-header-2").css({"background": ""});
        $("#row-1-header-3").css({"background": ""});
        $("#row-2-header-3").css({"background": ""});
    }

    function highLightSizingDiv(div){
        div.css({"top": ""});
    }

    function updateSizingPrice(d){
        var currency = "US $";


        $("#row-1-header-1").text(currency+" "+Math.round(d.yVar));
        $("#row-2-header-1").text(currency+" "+Math.round(d.existingPrice));
        // $("#row-1-header-2").text(currency+" "+amount * 1 * initial);
        // $("#row-2-header-2").text(currency+" "+amount * 1 * following);
        // $("#row-1-header-3").text(currency+" "+amount * large * initial);
        // $("#row-2-header-3").text(currency+" "+amount * large * following);
    }

    drawEverything();

});
