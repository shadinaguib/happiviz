let keys;
let data_year = '2019';
let data_region = "region";
let vizScale = "world";

let svg = d3.select("#bar"),
    margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = 1000 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('id', 'barG');

let scaleX = d3.scaleBand()
    .rangeRound([0, width])
    .paddingOuter(0.01)
    .align(0.1);

let scaleY = d3.scaleLinear()
    .rangeRound([0, height*0.80])
    .domain([0, 8]);

let z = d3.scaleOrdinal()
    .range(["RGB(243,202,34)", "RGB(237,233,37)", "RGB(52,161,153)", "RGB(70,180,12)",
        "RGB(153,148,194)", "RGB(211,102,153)", "RGB(194,63,118)"]);

let color_seq = d3.scaleSequential()
    .interpolator(d3.interpolateCool);

let color_seq2 = d3.scaleSequential()
    .interpolator(d3.interpolatePlasma);


const bar_draw = () => {
    g.selectAll().remove()

    d3.csv(`./Preprocessing/df2.csv`, function (data) {
        let dataBig = data.filter(obj => obj.year === data_year);
        data.map((d, i) => d.idx2 = i);
        dataBig.map((d, i) => d.idx0 = i);

        keys = data.columns.slice(4, 11);
        let key_data = d3.stack().keys(keys)(data);
        z.domain(keys);

        data = prepareData(data);

        // Sort row on basis of Happiness Score
        data.sort(function (a, b) {
            return a.posx - b.posx;
        });
        data.map((d, i) => d.idx1 = i);
        // Change the x axis
        scaleX.domain(data.map((d) => {
            return d.country;
        }));

        // Drawing
        g.selectAll("g")
            .data(data)
            .enter().append("g")
            .append('rect')
            .attr('class', 'gbarrect')
            .attr("x", function (d) {
                return scaleX(d.country);
            })
            .attr("y", function (d) {
                return scaleY(0);
            })
             .transition()
             .ease(d3.easeSin)
             .duration(400)
                .delay(function (d, i) {
                return i * 5;
            })
            .attr("height", function (d) {
                return scaleY(d.score);
            })
            .attr("width", 0.60 * scaleX.bandwidth())
            .attr("fill", (d, i) => {
                return color_seq(d.idx0);
            });

        g.selectAll('.gbarrect')
            .on("mouseover", onMouseOver) // Add listener for the mouseover event
            .on("mouseout", onMouseOut)   // Add listener for the mouseout event
            .on("click", onClick);

        function onMouseOver(d, i) {
            if (vizScale === "region")  {
                d3.select(this).attr('class', 'highlight');
                d3.select(this)
                    .transition()     // adds animation
                    .duration(300)
                    .attr('width', scaleX.bandwidth() * 1)
                    .attr("x", function (d) {
                        return scaleX(d.country) - scaleX.bandwidth() * 0.1;
                    })
                    .attr('fill', '#D4AF37');//#D4AF37
            } else {
                d3.select(this).attr('class', 'highlight');
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('width', scaleX.bandwidth() * 1)
                    .attr("x", function (d) {
                        return scaleX(d.country) - scaleX.bandwidth() * 0.2;
                    })
                    .attr('fill', '#D4AF37');//#D4AF37
            }
            radar_onMapMouseover(d.country);
            display_onMouseover(d.country, map_codes.get(d.country), d.score)
        }

        function onMouseOut(d, i) {
            d3.select(this).attr('class', 'bar');
            d3.select(this)
                .transition()     // adds animation
                .duration(400)
                .attr('width', (vizScale === "region")? scaleX.bandwidth()* 0.8:scaleX.bandwidth()* 0.6)
                .attr("x", function (d) {
                    return scaleX(d.country);
                })
                .attr('fill', color_seq2(d.idx1))
                .transition()     // adds animation
                .duration(200)
                .delay(200)
                .attr('fill', color_seq(d.idx0));
            display_onMouseout();
            radar_onMapMouseout(d.country);
        }

        function onClick(d, i){
            radar_onMapClick(d.country);
        }
    });
};


bar_draw();

const bar_update = (updateType, countryName) => {

    // Removed in the last version, very slow in browser
    if (updateType === 'mapHover') {
        return;
    } else if (updateType === 'mapOut') {
        return;
    }

    d3.csv(`./Preprocessing/df2.csv`, function (data) {
        let dataBig = data.filter(obj => obj.year === data_year)
        dataBig.map((d, i) => d.idx0 = i);

        keys = data.columns.slice(4, 11);
        let key_data = d3.stack().keys(keys)(data);
        z.domain(keys);

        data = prepareData(data);
        // Sort row on basis of Happiness Score
        data.sort(function (a, b) {
            return a.posx - b.posx;
        });
        data.map((d, i) => d.idx1 = i);
        dataBig.map((d, i) => d.idx1 = i);

        // Call backs

        if (updateType === 'mapClick') {
            onMapClick(d_from_country(countryName));
        }

        //dataBig.forEach((d,i) => onMapOver(d))

        function d_from_country(countryName) {
            let d = dataBig.find(obj => obj.country === countryName);
            return d;
        }

        function onMapOver(d) {
            // if (d.region != data_region && vizScale == "region")
            //     return;
            //
            // g.append('rect')
            //     .attr('class', 'cover')
            //     .attr("x", function () {
            //         return scaleX(d.country);
            //     })
            //     .attr("y", function () {
            //         return scaleY(0);
            //     })
            //     .transition()
            //     .ease(d3.easeSin)
            //     .duration(400)
            //     .attr("height", function () {
            //         return scaleY(10);
            //     })
            //     .attr("width", 0.85 * scaleX.bandwidth())
            //     .attr("fill", "rgb(241,241,241)");
            //
            // let elem_idx = d.idx0;  // index when ordered by score
            // key_data.forEach((item, key_idx) => {
            //     g.append('rect')
            //         .attr("class", "brushed")
            //         .attr("x", function () {
            //             return scaleX(d.country);
            //         })
            //         .attr("y", () => scaleY(item[elem_idx][0]))
            //         .attr("height", function () {
            //             if (key_idx == 6)
            //                 return scaleY(d.score - item[elem_idx][0]);
            //             return scaleY(item[elem_idx][1] - item[elem_idx][0] + 0.1);
            //         })
            //         .attr("width", 0.80 * scaleX.bandwidth())
            //         .attr('fill', z(key_idx))
            // })
        }

        function onMapOut(d) {

            // destroy cover rectangle
            // d3.transition()
            //     .delay(200)
            //     .duration(400)
            //     .ease(d3.easeSin)
            //     .select('#barG').selectAll('.cover')
            //     .attr("height", 0)
            //     .remove();
            //
            // // destory rectangles
            // d3.transition()
            //     .delay(300)
            //     .duration(100)
            //     .ease(d3.easeSin)
            //     .attr("height", 0)
            //     .select('#barG').selectAll('.brushed').remove()
            //
        }

        function onMapClick(d){
                data_region = d.region;
                vizScale = "region";

                data = dataBig.filter(obj => obj.year === data_year)

                data.map((d, i) => d.idx0 = i);
                data = data.filter(obj => obj.region === data_region);

                data.sort(function (a, b) {
                    return a.posx - b.posx;
                });

                // Change the x axis
                scaleX = scaleX.domain(data.map((d) => {
                    return d.country;
                }));
                //console.log(data)
                //console.log(scaleX.bandwidth())

                d3.select('#barG').selectAll('.cover').remove();

                d3.select('#barG').selectAll('.brushed').remove()

                d3.selectAll(".label").transition()     // adds animation
                    .duration(10).remove()

                g.selectAll("g").select("rect")
                .attr("x", (d) => (d.region === data_region) ? scaleX(d.country) : 0)
                .attr("y", (d) => (d.region === data_region) ? scaleY(0) : 0)
                .attr("height", (d) => (d.region === data_region) ? scaleY(d.score) : 0)
                .attr("width", (d) => (d.region === data_region) ? 0.80 * scaleX.bandwidth() : 0)


                // Add new labels
                g.selectAll("g").append("text")
                     .attr('class', 'label')
                     .attr("color", "#414141")
                     .attr("x", (d) => scaleX(d.country)+ scaleX.bandwidth()*0.425)
                     .attr("y", (d) => scaleY(d.score)+15) //+ i%2 * 5
                     .transition()     // adds animation
                     .duration(10)
                     .text((d) => {
                         if (d.region === data_region)
                             return map_codes.get(d.country)

                     }).style("text-anchor", "middle")
                     .style("font-size", (d)=>{
                        if (d.region==="Sub-Saharan Africa")
                            return "9.6px"})
                 }
        });
};


function prepareData(data){
    data = data.filter(obj => obj.year === data_year);
    // adding index
    data.map((d, i) => d.idx0 = i);

    // Defining color sequences
    color_seq.domain([0, data.length]);
    color_seq2.domain([-150, data.length]);

    // Return filtered data
    return data;
}

function bar_changeYear(map_selectedYear){
    //console.log(g)
    g.selectAll("*").remove()
    //console.log(g)
    data_year = map_selectedYear;
    bar_draw();
}
