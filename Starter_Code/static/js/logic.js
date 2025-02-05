// API endpoint
// Storing the API endpoint as query_Url.
let query_Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// DATA LOADING for EARTHQUAKE GeoJSON
// Performing a GET request to the query URL
d3.json(query_Url).then(function(data) {
    console.log("data loaded successfully", data);
    // Once a response is received, sending the data.features object to the createFeatures function
    createFeatures(data.features);
});


// Creating a Map data object.
let myMap = L.map("map", {
    center: [37.09, -122.71],
    zoom: 3
});

// Adding a TILE Layer to the Map object (background map image)
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);


// Function to determine circle size
function circleSize(magnitude) {
    return getRadius(magnitude);
}

function getRadius(magnitude) {
    return Math.sqrt(Math.abs(magnitude)) * 90000;
}
// Function to determine color
function getcolor(depth) {
    if (depth <= 10) return "#F8B195";
    else if (depth <= 30) return "#F67280";
    else if (depth <= 50) return "#C06C84";
    else if (depth <= 70) return "#6C5B7B";
    else if (depth <= 90) return "#4B3B59";
    else return "black";
}
// Function to create features
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr />
                         <h3>Time and date: ${new Date(feature.properties.time)}</h3><hr />
                         <h3>Magnitude: ${feature.properties.mag}</h3><hr />
                         <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`);
    }

    // Create GeoJSON layer group
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var markers = {
                radius: circleSize(feature.properties.mag),
                fillColor: getcolor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circle(latlng, markers);
        }
    });

    earthquakes.addTo(myMap);
}
//Create a legend that will provide context for map data
 // Set up the legend.
 var legend = L.control({ position: "bottomleft" });
 legend.onAdd = function (map) {
     var div = L.DomUtil.create("div", "info legend");
     var grades = [0, 10, 30, 50, 70, 90];
     var colors = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#4B3B59", "black"];

     for (var i = 0; i < grades.length; i++) {
         div.innerHTML +=
             '<i style="background:' + colors[i] + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     }
     return div;
 };
 legend.addTo(myMap);

//  Old Code
// Donot Run

// // Initialize the map
// let myMap = L.map("map", { center: [20, 0], zoom: 2 });

// // Add a tile layer (background map image) to the map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// // Store our API endpoint as queryUrl.
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL
// d3.json(queryUrl).then(function (data) {
//     // Once we get a response, send the data.features object to the createFeatures function
//     createFeatures(data.features);
// });

// // Function to determine marker color based on earthquake depth
// function markerColor(depth) {
//     if (depth > 90) return "#CC0000";
//     else if (depth > 70) return "#FF3333";
//     else if (depth > 50) return "#FF6200";
//     else if (depth > 30) return "#00F3FF";
//     else if (depth > 10) return "#1BFB00";
//     else return "#00CC00";
// }

// // Function to define the radius of the earthquake marker
// function getRadius(magnitude) {
//     return magnitude * 4;
// }

// // Function to create features and add them to the map
// function createFeatures(earthquakeData) {
//     // Parse JSON data to create map features
//     L.geoJSON(earthquakeData, {
//         pointToLayer: function (feature, latlng) {
//             return L.circleMarker(latlng, {
//                 radius: getRadius(feature.properties.mag),
//                 fillColor: markerColor(feature.geometry.coordinates[2]),
//                 color: "#000000",
//                 weight: 1,
//                 stroke: true,
//                 fillOpacity: 0.5
//             });
//         },
//         onEachFeature: function (feature, layer) {
//             layer.bindPopup(<h3>Place: ${feature.properties.place}</h3><hr />
//             <h3>Time and Date: ${new Date(feature.properties.time)}</h3><hr />
//             <h3>Magnitude: ${feature.properties.mag}</h3><hr />
//             <h3>Depth: ${feature.geometry.coordinates[2]}</h3>;
//         }
//     }).addTo(myMap);

//     // Create a legend
//     const legend = L.control({ position: "bottomright" });

//     legend.onAdd = function () {
//         const div = L.DomUtil.create("div", "legend");
//         const grades = [0, 10, 30, 50, 70, 90];
//         const colors = ["#00CC00", "#1BFB00", "#00F3FF", "#FF6200", "#FF3333", "#CC0000"];

//         div.innerHTML = "<h4>Depth (km)</h4>";

//         for (let i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + colors[i] + '"></i> ' +
//                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }

//         return div;
//     };

//     legend.addTo(myMap);
// }
