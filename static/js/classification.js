// url
var threshold = 5000;

// url
var url = `/data/class/incident/${threshold}`;

// dims
var margin = {top: 40, right: 0, bottom: 30, left: 85},
svg_dx = 600, 
svg_dy = 450,
plot_dx = svg_dx - margin.right - margin.left,
plot_dy = svg_dy - margin.top - margin.bottom;

// scales
var xPos = d3.scaleLinear()
         .range([margin.left, plot_dx]),
yPos = d3.scaleLinear()
         .range([plot_dy, margin.top]);

var class_svg = d3.select("#classification-chart")
        .append("svg")
        .attr("width", svg_dx)
        .attr("height", svg_dy);
// labels
var xLabelsGroup = class_svg.append("g")
.attr("transform",`translate(${svg_dx/2-margin.left},${svg_dy-10})`);

xLabelsGroup.append("text").text("Precipitation (* 100)");

var yLabelsGroup = class_svg.append("g")
.attr("transform",`translate(${margin.left-60},${15})`);

yLabelsGroup.append("text").text("Temperature");

// tooltip
var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([20,-20])
        .html(d => {
        let content = `<div class="country_text">${d.Country}</div>`;
        return content;
    });


d3.json(url).then(d => {

xPos.domain(d3.extent(d, d => +d.x));
yPos.domain(d3.extent(d, d => +d.y));

plotAxes(d3.axisBottom(xPos), d3.axisLeft(yPos));
plotPts(d);
runGradientDescent(0.5);        // initial beta = 0.5

});

function runGradientDescent(beta) {

removeDecBnds();

displayBeta(beta);

var d = d3.selectAll(".pts").data();

var d_extent_x = d3.extent(d, pt => +pt.x);

var X = d.map(pt => [1, +pt.x, +pt.y]),
    y = d.map(pt => +pt.group);

X = math.matrix(X);
y = math.matrix(y);

var iteration = 0,
    iterationNumber = 400,
    m = math.subset(math.size(X), math.index(0)),
    alpha = 0.0004,
    velocity = math.matrix([0.0, 0.0, 0.0]),
    theta = math.matrix([-24, 0.5, 0.2]),
    theta_m = math.matrix([-24, 0.5, 0.2]);


// // decision boundary w/o momentum
// var dec_bnd = class_svg.append("line")
//                  .attr("class", "dec_boundary")
//                  .attr("id", "dec_boundary");

// decision boundary w/ momentum
var dec_bnd_m = class_svg.append("line")
                 .attr("class", "dec_boundary")
                 .attr("id", "dec_boundary_m");

var iterate = d3.timer(() => {

    // update theta w/o momentum and plot decision boundary
    var h = math.multiply(X, theta).map(z => sigmoid(z)),
        grad = computeGradient(m, y, h, X);

    theta = theta.map((t, i) => t - (alpha * math.subset(grad, math.index(i))))

    // updateDecisionBoundary(dec_bnd, theta, d_extent_x);

    // update theta w/ momemtum and plot decision boundary
    var h_m = math.multiply(X, theta_m).map(z => sigmoid(z)),
        grad_m = computeGradient(m, y, h_m, X);

    // velocity = beta * velocity + grad_m
    velocity = math.add(math.multiply(beta, velocity), grad_m);
    theta_m = theta_m.map((t, i) => t - (alpha * math.subset(velocity, math.index(i))))

    updateDecisionBoundary(dec_bnd_m, theta_m, d_extent_x);

    if (iteration++ > iterationNumber) {
        iterate.stop();
    }
}, 200)
}

function updateDecisionBoundary(dec_bnd, theta, d_extent_x) {

var theta0 = math.subset(theta, math.index(0)),
    theta1 = math.subset(theta, math.index(1)),
    theta2 = math.subset(theta, math.index(2));

dec_bnd.attr("x1",xPos(d_extent_x[0]))
       .attr("y1",yPos((-1 / theta2) * (theta1 * d_extent_x[0] + theta0)))
       .attr("x2",xPos(d_extent_x[1]))
       .attr("y2",yPos((-1 / theta2) * (theta1 * (d_extent_x[1] * .95) + theta0)));
}

function sigmoid(z) {
var s = 1 / (1 + Math.pow(Math.E, -z));
return s; 
}

function computeGradient(m, y, h, X) {

// conversion from octave of grad = (1 / m) * (h - y)' * X;
var grad = math.multiply(h.map((h, i) => h - math.subset(y, math.index(i))), X)
               .map(d => (1 / m) * d);

return grad;
}

function removeDecBnds() {
d3.selectAll(".dec_boundary").remove();
}

function displayBeta(beta) {

d3.select("#beta_val")
  .text("Momentum Coefficient: " + beta);
}

function plotPts(d) {

var pts_group = class_svg.append("g")
   .selectAll("path")
   .data(d)
   .enter()
   .append("path")
   .attr("class", d => d.group == "1" ? "pts group1" : "pts group2")
   .attr("d", d3.symbol().type((d,i) => d.group == "1" ? d3.symbolCircle : d3.symbolCross))
   .attr("transform", d => "translate(" + xPos(d.x) + "," + yPos(d.y) + ")");

   pts_group.call(toolTip);
   pts_group.on("click",toolTip.show).on("mouseout",toolTip.hide);

};

function plotAxes(x, y) {

class_svg.append("g")
   .attr("id", "axis_x")
   .attr("transform", "translate(0," + (plot_dy + margin.bottom / 2) + ")")
   .call(x);

class_svg.append("g")
   .attr("id", "axis_y")
   .attr("transform", "translate(" + (margin.left / 2) + ", 0)")
   .call(y);
}
