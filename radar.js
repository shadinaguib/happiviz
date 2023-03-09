/*
  Radar graph component.
*/

// Name and corresponding data of all currently selected countries.
let radar_selected = [];
let radar_selectedData = [];
let radar_firstRun = true;

// Name and corresponding data of country currently being hovered upon.
let radar_hovered = null;
let radar_hoveredData = [];
// let radar_firstRun = true;

// Flag to indicate a clearing of all selected countries.
let radar_reset = false;

// Initialize default year.
let radar_currentYear = 2019;

// Set the color scale.
let radar_colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([7.8, 2]).clamp(true);

// Populate the select element with options, based on the currently selected year.
const radar_buildOptions = () => {
    d3.csv('./Preprocessing/finaldfCoordinatesStdev_percent.csv', function (originalData) {
        let radar_dropdown = document.getElementById("mselect");

        // Delete all old children of dropdown.
        while (radar_dropdown.firstChild) {
            radar_dropdown.removeChild(radar_dropdown.firstChild);
        }

        // Filter incoming data by year.
        let radar_options = originalData.filter(el => el.year === String(radar_currentYear))
            .map(el => el.country)
            .sort();

        // Dynamically build option elements based on countries with available data.
        for (let radar_option of radar_options) {
            let element = document.createElement("option");
            element.textContent = radar_option;
            element.value = radar_option;
            element.selected = radar_selected.includes(radar_option) ? true : false;
            radar_dropdown.appendChild(element);
        }
        $("#mselect").trigger("chosen:updated");
    });
}

// Update the radar based on the currently selected data.
const radar_update = () => {
    d3.csv('./Preprocessing/finaldfCoordinatesStdev_percent.csv', function (originalData) {

        // Reset the selected countries list, then populate it via the select element.
        radar_selected = [];

        // If reset flag is up, do no repopulate, and unselect all elements.
        if (radar_reset) {
            radar_reset = false;
            for (let radar_option of document.getElementById('mselect').options) {
                radar_option.selected = false;
            }
            $("#mselect").trigger("chosen:updated");
        } else {
            for (let radar_option of document.getElementById('mselect').options) {
                if (radar_option.selected) {
                    radar_selected.push(radar_option.value);
                }
            }
        }

        // Retrieve the relevant hovered data based on the hovered country name.
        radar_hoveredData = originalData.find(d => d.country === radar_hovered && +d.year === radar_currentYear);

        // Retrieve the relevant selected data based on the selected country names.
        radar_selectedData = [];
        for (let selected of radar_selected) {
            let data = originalData.filter(d => {
                return d.country === selected && +d.year === radar_currentYear;
            });
            radar_selectedData.push(...data);
        }

        // Modify the hovered data into the correct format to plot the radar.
        radar_hoveredData = radar_hoveredData === undefined || radar_hoveredData === null ? null : {
            name: radar_hoveredData.country,
            axes: [
                {axis: 'GDP', value: +radar_hoveredData.gdp_per_capita},
                {axis: 'Societal Trust', value: +radar_hoveredData.corruption_perceptions},
                {axis: 'Generosity', value: +radar_hoveredData.generosity},
                {axis: 'Freedom', value: +radar_hoveredData.freedom_to_life_choice},
                {axis: 'Healthy Life Expectancy', value: +radar_hoveredData.healthy_life_expectancy},
                {axis: 'Social support', value: +radar_hoveredData.social_support}
            ],
            color: radar_colorScale(+radar_hoveredData.score),
        };

        // Modify the selected data into the correct format to plot the radar.
        radar_selectedData = radar_selectedData.map(d => {
            return {
                name: d.country,
                axes: [
                    {axis: 'GDP', value: +d.gdp_per_capita},
                    {axis: 'Societal Trust', value: +d.corruption_perceptions},
                    {axis: 'Generosity', value: +d.generosity},
                    {axis: 'Freedom', value: +d.freedom_to_life_choice},
                    {axis: 'Healthy Life Expectancy', value: +d.healthy_life_expectancy},
                    {axis: 'Social support', value: +d.social_support}
                ],
                color: radar_colorScale(+d.score),
            };
        });

        // Sort the data based on GDP.
        if (radar_selectedData.length > 0)
            radar_selectedData.sort((a, b) => (a.axes[0].value < b.axes[0].value) ? 1 : -1);

        // If there is no current data (selected or hovered), then create a placeholder
        // so that the graph will still be rendered.
        if (radar_selectedData.length === 0 && radar_hoveredData === null) {
            radar_selectedData = [{
                name: 'average',
                axes: [
                    {axis: 'GDP', value: 50},
                    {axis: 'Societal Trust', value: 50},
                    {axis: 'Generosity', value: 50},
                    {axis: 'Freedom', value: 50},
                    {axis: 'Healthy Life Expectancy', value: 50},
                    {axis: 'Social support', value: 50}
                ],
                color: radar_colorScale(4.9),
            }];

            radar_firstRun = false;
        } else if (radar_selectedData.length === 0 && radar_hoveredData === null) {
            radar_selectedData = [{
                name: '',
                axes: [
                    {axis: 'GDP'},
                    {axis: 'Societal Trust'},
                    {axis: 'Generosity'},
                    {axis: 'Freedom'},
                    {axis: 'Healthy Life Expectancy'},
                    {axis: 'Social support'}
                ],
                color: radar_colorScale(4.9),
            }];
        }

        // Set the styling options.
        let radar_options = {
            w: 350,
            h: 350,
            margin: {top: 40, right: 40, bottom: 40, left: 40},  // TODO problem here
            maxValue: 6,
            levels: 10,
            roundStrokes: true,
            color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]),
            format: '.0f',
            legend: {title: 'Radar chart', translateX: -420, translateY: 40},
            unit: '%'
        };

        // Draw the radar.
        radar_draw(".radar", radar_selectedData.concat(radar_hoveredData === null
        || radar_selectedData.filter(el => {
            if (radar_hoveredData === null) {
                return false;
            } else {
                return el.name === radar_hoveredData.name;
            }
        }).length !== 0
            ? [] : radar_hoveredData), radar_options);
    });
}

// Draw the radar given an element, data, and options.
const radar_draw = (parent_selector, data, options) => {

    //Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
    const wrap = (text, width) => {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap

    const cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 40, right: 40, bottom: 40, left: 40}, //The margins of the SVG
        levels: 6,				//How many levels or inner circles should there be drawn
        maxValue: 6, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
        format: '.2%',
        unit: '%',
        legend: false
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
            }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    // var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    let maxValue = 0;
    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[j].axes.length; i++) {
            data[j].axes[i]['id'] = data[j].name;
            if (data[j].axes[i]['value'] > maxValue) {
                maxValue = data[j].axes[i]['value'];
            }
        }
    }
    maxValue = Math.max(cfg.maxValue, maxValue);
    maxValue = 100;


    const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
        Format = d3.format(cfg.format),			 	//Formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////
    //const parent = d3.select(parent_selector);

    //Remove whatever chart with the same id/class was present before
    //parent.select("svg").remove();

    //Initiate the radar chart SVG
    //let svg = parent.append("svg")
    //		.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right + 100)
    //		.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom + 100)
    //		.attr("class", "radar");

    let svg = d3.select("#radarContent");
    svg.selectAll('*').remove();
    svg.attr("class", "radar");

    //Append a g element
    let g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left + 50) + "," + (cfg.h / 2 + cfg.margin.top + 50) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    let filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    let axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / cfg.levels * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * radius / cfg.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    const radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed)
    }

    if (data[0].name === '') {
        return svg;
    }

    //Create a wrapper for the blobs
    const blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", d => radarLine(d.axes))
        .style("fill", (d, i) => d.color)
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d, i) {
            //Dim all blobs
            svg.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', () => {
            //Bring back all blobs
            svg.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d, i) {
            return radarLine(d.axes);
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", (d, i) => d.color)
        .style("fill", "none")
        .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(d => d.axes)
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", (d) => d.color)
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(d => d.axes)
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d, i) {
            tooltip
                .attr('x', this.cx.baseVal.value - 10)
                .attr('y', this.cy.baseVal.value - 10)
                .transition()
                .style('display', 'block')
                .text(Format(d.value) + cfg.unit);
        })
        .on("mouseout", function () {
            tooltip.transition()
                .style('display', 'none').text('');
        });

    const tooltip = g.append("text")
        .attr("class", "tooltip")
        .attr('x', 0)
        .attr('y', 0)
        .style("font-size", "12px")
        .style('display', 'none')
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em");

    if (cfg.legend !== false && typeof cfg.legend === "object" && data[0].name !== 'average') {
        let legendZone = svg.append('g');
        let names = data.map(el => el.name);
        if (cfg.legend.title) {
            let title = legendZone.append("text")
                .attr("class", "title")
                .attr('transform', `translate(${cfg.legend.translateX + 200},${cfg.legend.translateY})`)
                .attr("x", cfg.w - 70)
                .attr("y", 10)
                .attr("font-size", "12px")
                .attr("fill", "#404040")
                .text(cfg.legend.title);
        }
        let legend = legendZone.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
        // Create rectangles markers
        legend.selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .attr("x", cfg.w + 137)
            .attr("y", (d, i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d, i) => d.color);
        // Create labels
        legend.selectAll('text')
            .data(names)
            .enter()
            .append("text")
            .attr("x", cfg.w + 150)
            .attr("y", (d, i) => i * 20 + 9)
            .attr("font-size", "11px")
            .attr("fill", "#737373")
            .text(d => d);
    }
    return svg;
}

// Set currently hovered country.
const radar_onMapMouseover = (map_country) => {
    if (radar_selected.length < 3) {
        radar_hovered = map_country;
        radar_update();
    }
}

// Add clicked country to radar graph.
const radar_onMapClick = (map_country) => {
    if (radar_selected.length < 3) {
        document.querySelector(`#mselect option[value='${map_country}']`).selected = true;
        $("#mselect").trigger("chosen:updated");
        radar_selected.push(map_country);
        radar_update();
    }

}

// Remove currently hovered country.
const radar_onMapMouseout = (map_country) => {
    radar_hovered = null;
    radar_update();
}

// Remove all selected countries.
const radar_clear = () => {
    radar_reset = true;
    radar_update();
}

// Update year.
const radar_changeYear = (year) => {
    radar_currentYear = Number(year);
    radar_buildOptions();
    radar_update();
}

// First update radar upon initial page load.
radar_buildOptions();
radar_update();
