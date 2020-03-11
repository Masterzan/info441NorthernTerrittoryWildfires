const m = {
    width: 1000,
    height: 800
};

const mt = {
    width: 500,
    height: 400
}

const proj = d3.geoMercator().scale(5000).center([ 132.5, -13 ]).translate([m.width/2, m.height/2]);
const geoPath = d3.geoPath().projection(proj);

const yelRedGrad = ["#ffffcc","#fffecb","#fffec9","#fffdc8","#fffdc6","#fffcc5","#fffcc4","#fffbc2","#fffac1","#fffac0","#fff9be","#fff9bd","#fff8bb","#fff8ba","#fff7b9","#fff6b7","#fff6b6","#fff5b5","#fff5b3","#fff4b2","#fff4b0","#fff3af","#fff2ae","#fff2ac","#fff1ab","#fff1aa","#fff0a8","#fff0a7","#ffefa6","#ffeea4","#ffeea3","#ffeda2","#ffeda0","#ffec9f","#ffeb9d","#ffeb9c","#ffea9b","#ffea99","#ffe998","#ffe897","#ffe895","#ffe794","#ffe693","#ffe691","#ffe590","#ffe48f","#ffe48d","#ffe38c","#fee28b","#fee289","#fee188","#fee087","#fee085","#fedf84","#fede83","#fedd82","#fedc80","#fedc7f","#fedb7e","#feda7c","#fed97b","#fed87a","#fed778","#fed777","#fed676","#fed574","#fed473","#fed372","#fed270","#fed16f","#fed06e","#fecf6c","#fece6b","#fecd6a","#fecb69","#feca67","#fec966","#fec865","#fec764","#fec662","#fec561","#fec460","#fec25f","#fec15e","#fec05c","#febf5b","#febe5a","#febd59","#febb58","#feba57","#feb956","#feb855","#feb754","#feb553","#feb452","#feb351","#feb250","#feb14f","#feb04e","#feae4d","#fead4d","#feac4c","#feab4b","#feaa4a","#fea84a","#fea749","#fea648","#fea547","#fea347","#fea246","#fea145","#fda045","#fd9e44","#fd9d44","#fd9c43","#fd9b42","#fd9942","#fd9841","#fd9741","#fd9540","#fd9440","#fd923f","#fd913f","#fd8f3e","#fd8e3e","#fd8d3d","#fd8b3c","#fd893c","#fd883b","#fd863b","#fd853a","#fd833a","#fd8139","#fd8039","#fd7e38","#fd7c38","#fd7b37","#fd7937","#fd7736","#fc7535","#fc7335","#fc7234","#fc7034","#fc6e33","#fc6c33","#fc6a32","#fc6832","#fb6731","#fb6531","#fb6330","#fb6130","#fb5f2f","#fa5d2e","#fa5c2e","#fa5a2d","#fa582d","#f9562c","#f9542c","#f9522b","#f8512b","#f84f2a","#f74d2a","#f74b29","#f64929","#f64828","#f54628","#f54427","#f44227","#f44127","#f33f26","#f23d26","#f23c25","#f13a25","#f03824","#f03724","#ef3524","#ee3423","#ed3223","#ed3123","#ec2f22","#eb2e22","#ea2c22","#e92b22","#e92921","#e82821","#e72621","#e62521","#e52420","#e42220","#e32120","#e22020","#e11f20","#e01d20","#df1c20","#de1b20","#dd1a20","#dc1920","#db1820","#da1720","#d91620","#d81520","#d71420","#d51320","#d41221","#d31121","#d21021","#d10f21","#cf0e21","#ce0d21","#cd0d22","#cc0c22","#ca0b22","#c90a22","#c80a22","#c60923","#c50823","#c40823","#c20723","#c10723","#bf0624","#be0624","#bc0524","#bb0524","#b90424","#b80424","#b60425","#b50325","#b30325","#b10325","#b00225","#ae0225","#ac0225","#ab0225","#a90125","#a70126","#a50126","#a40126","#a20126","#a00126","#9e0126","#9c0026","#9a0026","#990026","#970026","#950026","#930026","#910026","#8f0026","#8d0026","#8b0026","#8a0026","#880026","#860026","#840026","#820026","#800026"];

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height);

const g = svg.append('g');

let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

const tooltipSvg = div.append("svg")
    .attr('width', mt.width + 100)
    .attr('height', mt.height + 100)
    .append("g")
        .attr("transform", "translate(50,50)")

document.getElementById("startDate").addEventListener("change", checkDateStart);
document.getElementById("endDate").addEventListener("change", checkDateEnd);

d3.json('custom.geo.json').then(function(map) { 
    g.selectAll('path')
        .data(map.features)
        .enter()
        .append('path')
            .attr('fill', 'black')
            .attr('d', geoPath)
            .attr('stroke', 'black')
});

plotFire();

function checkDateStart() {
    let start = document.getElementById("startDate")
    let end = document.getElementById("endDate")
    let startDate = new Date(start.value)
    let endDate = new Date(end.value)
    if (startDate > endDate) {
        end.value = start.value
    }
    plotFire();
}

function checkDateEnd() {
    let start = document.getElementById("startDate")
    let end = document.getElementById("endDate")
    let startDate = new Date(start.value)
    let endDate = new Date(end.value)
    if (startDate > endDate) {
        start.value = end.value
    }
    plotFire();
}

function plotFire() {
    let start = document.getElementById("startDate")
    let end = document.getElementById("endDate")
    let startDate = new Date(start.value)
    let endDate = new Date(end.value)
    if (startDate > endDate) {
        end.value > start.value
    }
    
    d3.csv('fire_archive_M6_96619.csv').then(function(data){
        d3.select("g").selectAll("circle").remove();
        data = data.filter(function(d) {
            let date = new Date(d['acq_date'])
            let startDate = new Date(document.getElementById("startDate").value)
            let endDate = new Date(document.getElementById("endDate").value)
            return startDate <= date && date <= endDate
        })

        g.selectAll('.circle')
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', function(d) {
                    let scaledPoints = proj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                    })
                .attr('cy', function(d) {
                    let scaledPoints = proj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', '10')
                .attr('fill', function(d) {
                    let heat = Math.round(d['bright_t31'])
                    if (heat > 331) {
                        return yelRedGrad[255]
                    }
                    return yelRedGrad[(heat - 267) * 4]
                })
                .attr("opacity", function(d) {
                    let one_day = 1000 * 60 * 60 * 24 ;
                    let date = new Date(d['acq_date']);
                    let startDate = new Date(document.getElementById("startDate").value);
                    let endDate = new Date(document.getElementById("endDate").value);
                    let range = (endDate - startDate) / one_day;
                    let fromStart = (date - startDate) / one_day;
                    return 0.25 + fromStart / range / 2
                })
                .on("mouseover", function(d) {	
                    createHistogram(d, data)	
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div.style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");
                    })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
    })
}

function getDistance(p1, p2) {
    let distLat = Math.abs(p1['latitude'] - p2['latitude']) * 69
    let distLong = Math.abs(Math.cos(p1['longitude']) - Math.cos(p2['longitude'])) * 69.172
    return Math.sqrt(Math.pow(2, distLat) + Math.pow(2, distLong))
}

function createHistogram(point, data) {
    tooltipSvg.selectAll("*").remove();
    let histData = data.filter(function(d) { return getDistance(point, d) < 100 })
    let xLimitTool = d3.extent(histData, d => d['bright_t31'])
    var x = d3.scaleLinear()
        .domain([xLimitTool[0], xLimitTool[1]])
        .range([0, mt.width]);
    tooltipSvg.append("g")
        .attr("transform", "translate(0," + mt.height + ")")
        .call(d3.axisBottom(x));

    var histogram = d3.histogram()
        .value(function(d) { return d['bright_t31'] })
        .domain(x.domain())
        .thresholds(x.ticks(20));

    var bins = histogram(data);

    var y = d3.scaleLinear()
        .range([mt.height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);
    tooltipSvg.append("g")
        .call(d3.axisLeft(y));

    tooltipSvg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return Math.abs(x(d.x1) - x(d.x0) -1); })
            .attr("height", function(d) { return mt.height - y(d.length); })
            .style("fill", 'teal')

    tooltipSvg.append("text")
        .attr("x", (mt.width / 2))             
        .attr("y", 0 - (50 / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Temperature Histogram for Fires within 100 Miles");

    tooltipSvg.append("text")             
        .attr("transform", "translate(250,435)")
        .style("text-anchor", "middle")
        .text("Degrees Kelvin");

    tooltipSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count"); 
}