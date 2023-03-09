const getXposition = () => {
    let map_url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    let result = Object;
    fetch(map_url).then(function (response) {
        response.json().then(function (map_data) {
            let countryFeatures = map_data;
            let names = countryFeatures.features.map((d) => d.properties.name);
            let xs = countryFeatures.features.map((d) => {
                let g = d.geometry;
                return (g.type === "Polygon") ?
                    g.coordinates[0][0][0] : g.coordinates[0][0][0][0];
            });

            result.country = names;
            result.coord = xs;
            // console.log(result.country, result.coord)

        });
    });
    return result;
};
