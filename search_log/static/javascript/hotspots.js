var magnify = 1
var width = 960*magnify,
    height = 600*magnify;

var rateById = d3.map();

var quantize = d3.scale.threshold()
    .domain([0,10,20,30,40,50,60,70,80,90,100,
      120,140,160,180,200,220,240,280,300,350,
      400,450,500,600,700,800,900,1000,1500,3500])
    .range(d3.range(30).map(function(i) { return "lcyan2g-"+i; }));


var projection = d3.geo.albersUsa()
    .scale(1280*magnify)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "./static/json/zips_us_topo.json")
    .defer(d3.csv, "./data/ss.csv", function(d) { rateById.set(d.Zip, +d.Count); })
    .await(ready);

function ready(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "zip_codes_for_the_usa")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.zip_codes_for_the_usa).features)
    .enter().append("path")
      .attr("class", function(d) { return quantize(rateById.get(d.properties.zip)); })
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.zip_codes_for_the_usa, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");