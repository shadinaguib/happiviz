/*
  Chloropleth map component.
*/

// Map storing country name/country code pairs.
map_codes = new Map([
    ['Antigua and Barbuda', 'ATG'],
    ['Algeria', 'DZA'],
    ['Azerbaijan', 'AZE'],
    ['Albania', 'ALB'],
    ['Armenia', 'ARM'],
    ['Angola', 'AGO'],
    ['American Samoa', 'ASM'],
    ['Argentina', 'ARG'],
    ['Australia', 'AUS'],
    ['Bahrain', 'BHR'],
    ['Barbados', 'BRB'],
    ['Bermuda', 'BMU'],
    ['Bahamas', 'BHS'],
    ['Bangladesh', 'BGD'],
    ['Belize', 'BLZ'],
    ['Bosnia and Herzegovina', 'BIH'],
    ['Bolivia', 'BOL'],
    ['Myanmar', 'MMR'],
    ['Benin', 'BEN'],
    ['Solomon Islands', 'SLB'],
    ['Brazil', 'BRA'],
    ['Bulgaria', 'BGR'],
    ['Brunei Darussalam', 'BRN'],
    ['Canada', 'CAN'],
    ['Cambodia', 'KHM'],
    ['Sri Lanka', 'LKA'],
    ['Congo (Brazzaville)', 'COG'],
    ['Congo (Kinshasa)', 'COD'],
    ['Burundi', 'BDI'],
    ['China', 'CHN'],
    ['Afghanistan', 'AFG'],
    ['Bhutan', 'BTN'],
    ['Chile', 'CHL'],
    ['Cayman Islands', 'CYM'],
    ['Cameroon', 'CMR'],
    ['Chad', 'TCD'],
    ['Comoros', 'COM'],
    ['Colombia', 'COL'],
    ['Costa Rica', 'CRI'],
    ['Central African Republic', 'CAF'],
    ['Cuba', ' CUB'],
    ['Cape Verde', 'CPV'],
    ['Cook Islands', 'COK'],
    ['Cyprus', 'CYP'],
    ['Denmark', 'DNK'],
    ['Djibouti', 'DJI'],
    ['Dominica', 'DMA'],
    ['Dominican Republic', 'DOM'],
    ['Ecuador', 'ECU'],
    ['Egypt', 'EGY'],
    ['Ireland', 'IRL'],
    ['Equatorial Guinea', 'GNQ'],
    ['Estonia', 'EST'],
    ['Eritrea', 'ERI'],
    ['El Salvador', 'SLV'],
    ['Ethiopia', 'ETH'],
    ['Austria', 'AUT'],
    ['Czech Republic', 'CZE'],
    ['French Guiana', 'GUF'],
    ['Finland', 'FIN'],
    ['Fiji', 'FJI'],
    ['France', 'FRA'],
    ['Gambia', 'GMB'],
    ['Gabon', 'GAB'],
    ['Georgia', 'GEO'],
    ['Ghana', 'GHA'],
    ['Grenada', 'GRD'],
    ['Greenland', 'GRL'],
    ['Germany', 'DEU'],
    ['Guam', 'GUM'],
    ['Greece', 'GRC'],
    ['Guatemala', 'GTM'],
    ['Guinea', 'GIN'],
    ['Guyana', 'GUY'],
    ['Haiti', 'HTI'],
    ['Honduras', 'HND'],
    ['Croatia', 'HRV'],
    ['Hungary', 'HUN'],
    ['Iceland', 'ISL'],
    ['India', 'IND'],
    ['Iran', 'IRN'],
    ['Israel', 'ISR'],
    ['Italy', 'ITA'],
    ["Ivory Coast", 'CIV'],
    ['Iraq', 'IRQ'],
    ['Japan', 'JPN'],
    ['Jamaica', 'JAM'],
    ['Jordan', 'JOR'],
    ['Kenya', 'KEN'],
    ['Kyrgyzstan', 'KGZ'],
    ['North Korea', 'PRK'],
    ['Kiribati', 'KIR'],
    ['South Korea', 'KOR'],
    ['South Sudan', 'SDS'],
    ['Kuwait', 'KWT'],
    ['Kazakhstan', 'KAZ'],
    ['Laos', 'LAO'],
    ['Lebanon', 'LBN'],
    ['Latvia', 'LVA'],
    ['Belarus', 'BLR'],
    ['Lithuania', 'LTU'],
    ['Liberia', 'LBR'],
    ['Slovakia', 'SVK'],
    ['Liechtenstein', 'LIE'],
    ['Libya', 'LBY'],
    ['Madagascar', 'MDG'],
    ['Martinique', 'MTQ'],
    ['Mongolia', 'MNG'],
    ['Montserrat', 'MSR'],
    ['Macedonia', 'MKD'],
    ['Mali', 'MLI'],
    ['Morocco', 'MAR'],
    ['Mauritius', 'MUS'],
    ['Mauritania', 'MRT'],
    ['Malta', 'MLT'],
    ['Oman', 'OMN'],
    ['Maldives', 'MDV'],
    ['Mexico', 'MEX'],
    ['Malaysia', 'MYS'],
    ['Mozambique', 'MOZ'],
    ['Malawi', 'MWI'],
    ['New Caledonia', 'NCL'],
    ['Niue', 'NIU'],
    ['Niger', 'NER'],
    ['Aruba', 'ABW'],
    ['Anguilla', 'AIA'],
    ['Belgium', 'BEL'],
    ['Hong Kong', 'HKG'],
    ['Faroe Islands', 'FRO'],
    ['Andorra', 'AND'],
    ['Gibraltar', 'GIB'],
    ['Isle of Man', 'IMN'],
    ['Luxembourg', 'LUX'],
    ['Macau', 'MAC'],
    ['Monaco', 'MCO'],
    ['Palestinian Territories', 'PSE'],
    ['Montenegro', 'MNE'],
    ['Vanuatu', 'VUT'],
    ['Nigeria', 'NGA'],
    ['Netherlands', 'NLD'],
    ['Norway', 'NOR'],
    ['Nepal', 'NPL'],
    ['Nauru', 'NRU'],
    ['Suriname', 'SUR'],
    ['Nicaragua', 'NIC'],
    ['New Zealand', 'NZL'],
    ['Paraguay', 'PRY'],
    ['Peru', 'PER'],
    ['Pakistan', 'PAK'],
    ['Poland', 'POL'],
    ['Panama', 'PAN'],
    ['Portugal', 'PRT'],
    ['Papua New Guinea', 'PNG'],
    ['Guinea-Bissau', 'GNB'],
    ['Qatar', 'QAT'],
    ['Reunion', 'REU'],
    ['Romania', 'ROU'],
    ['Moldova', 'MDA'],
    ['Philippines', 'PHL'],
    ['Puerto Rico', 'PRI'],
    ['Russia', 'RUS'],
    ['Rwanda', 'RWA'],
    ['Saudi Arabia', 'SAU'],
    ['Saint Kitts and Nevis', 'KNA'],
    ['Seychelles', 'SYC'],
    ['South Africa', 'ZAF'],
    ['Lesotho', 'LSO'],
    ['Botswana', 'BWA'],
    ['Senegal', 'SEN'],
    ['Slovenia', 'SVN'],
    ['Sierra Leone', 'SLE'],
    ['Singapore', 'SGP'],
    ['Somalia', 'SOM'],
    ['Spain', 'ESP'],
    ['Saint Lucia', 'LCA'],
    ['Sudan', 'SDN'],
    ['Sweden', 'SWE'],
    ['Syria', 'SYR'],
    ['Switzerland', 'CHE'],
    ['Trinidad and Tobago', 'TTO'],
    ['Thailand', 'THA'],
    ['Tajikistan', 'TJK'],
    ['Tokelau', 'TKL'],
    ['Tonga', 'TON'],
    ['Togo', 'TGO'],
    ['Sao Tome and Principe', 'STP'],
    ['Tunisia', 'TUN'],
    ['Turkey', 'TUR'],
    ['Tuvalu', 'TUV'],
    ['Turkmenistan', 'TKM'],
    ['Tanzania', 'TZA'],
    ['Uganda', 'UGA'],
    ['United Kingdom', 'GBR'],
    ['Ukraine', 'UKR'],
    ['United States', 'USA'],
    ['Burkina Faso', 'BFA'],
    ['Uruguay', 'URY'],
    ['Uzbekistan', 'UZB'],
    ['Saint Vincent and the Grenadines', 'VCT'],
    ['Venezuela', 'VEN'],
    ['British Virgin Islands', 'VGB'],
    ['Vietnam', 'VNM'],
    ['United States Virgin Islands', 'VIR'],
    ['Namibia', 'NAM'],
    ['Samoa', 'WSM'],
    ['Swaziland', 'SWZ'],
    ['Yemen', 'YEM'],
    ['Zambia', 'ZMB'],
    ['Zimbabwe', 'ZWE'],
    ['Indonesia', 'IDN'],
    ['United Arab Emirates', 'ARE'],
    ['San Marino', 'SMR'],
    ['Serbia', 'SRB'],
    ['Taiwan', 'TWN']
]);

// Map storing country code/country names pairs.
let map_names = new Map();
for (let [name, code] of map_codes.entries()) {
    map_names.set(code, name);
}

// Helper function to lighten color tones upon mouseover.
const map_lighten = (color, factor) => {
    return `rgba${color.slice(3, -1)}, ${factor})`;
}

// Initialize the default year.
let map_selectedYear = '2019';

// Bind the svg to the html element.
let map_svg = d3.select("#map"),
    map_width = 1300;
map_height = 950;

// Set the map dimensions.
let map_projection = d3.geoNaturalEarth()
    .scale(map_width / 2 / Math.PI)
    .translate([map_width / 2, map_height / 2])
let map_path = d3.geoPath()
    .projection(map_projection);

// Set the color scale.
let map_data = d3.map();
let map_colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([7.8, 2]).clamp(true);

// Set the tooltip.
let map_tooltip = d3.select(".map_tooltip");

// Update the map based on the currently selected data.
const map_update = () => {

    // Load geojson and csv data.
    d3.queue()
        .defer(d3.json, "world.geojson")
        .defer(d3.csv, `./Preprocessing/finaldf.csv`, function (d) {
            if (d.year === map_selectedYear) {
                map_data.set(map_codes.get(d.country), Number(d.score));
            }
        })
        .await(ready);

    function ready(error, topo) {
        if (error) throw error;

        // Draw the map.
        map_svg.append("g")
            .attr("class", "countries")
            .attr('transform', `translate(-88,0)`)
            .selectAll("path")
            .data(topo.features)
            .enter().append("path")
            .attr("fill", function (d) {

                // Set the color based on the country data.
                return map_colorScale(map_data.get(d.id) || 0);
            })
            .on("mouseover", function (d) {

                // Lighten color and change cursor to pointer upon mouseover of a country with data.
                if (map_data.get(d.id)) {
                    d3.select(this).attr("fill", map_lighten(map_colorScale(map_data.get(d.id)), 0.8))
                        .style("cursor", "pointer");

                    // Update radar graph with country.
                    radar_onMapMouseover(map_names.get(d.id)); // TODO commented line
                    //document.querySelector('.project-text').innerHTML = map_names.get(d.id) + '<br>' + 'Happiness score: ' + map_data.get(d.id);
                    display_onMouseover(map_names.get(d.id), d.id, map_data.get(d.id));


                    bar_update("mapHover", map_names.get(d.id));
                }
            })
            .on("mouseout", function (d) {
                // Reset color to original tone.
                d3.select(this).attr("fill", map_colorScale(map_data.get(d.id) || 0))
                // TODO commented line
                // document.querySelector('.project-text').innerHTML = 'Mouse over a country on the map.';

                // Update radar graph by removing country.
                radar_onMapMouseout(map_names.get(d.id));

                display_onMouseout();

                bar_update("mapOut", map_names.get(d.id));

            })
            .on("click", function (d) {
                if (map_data.get(d.id)) {

                    bar_update('mapClick', map_names.get(d.id))
                    // Update radar graph with country.
                    radar_onMapClick(map_names.get(d.id));
                }
            })
            .attr("d", map_path);
    }
}

// First update map upon initial page load.
map_update();

// Subsequently update map whenever year is changed.
const map_changeYear = () => {
    map_selectedYear = document.getElementById('year').value;
    map_update();
    scatter_changeYear();
    bar_changeYear(map_selectedYear);
    radar_changeYear(map_selectedYear);
};

// Hide the scatter and show the map.
const map_show = () => {
    document.getElementById('scatterContainer').classList.add('project-hide');
    //document.getElementById('submetric').classList.add('project-hide');
    document.getElementById('mapContainer').classList.remove('project-hide');
    let icon_elements = document.getElementsByClassName('submetric');
    for (let i = 0; i < icon_elements.length; i++) {
        icon_elements[i].classList.add('project-hide');
    }
};
