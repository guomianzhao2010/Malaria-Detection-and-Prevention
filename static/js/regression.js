var svgArea = d3.select("body").select("#regression-plot");

/**********************/ 
/* DEFAULT CHART*/ 
/**********************/ 
var url="/data/reg/GDP/linear";
d3.json(url).then(function(data) {
  
var svgHeight = 400;
var svgWidth = 800;
    
var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
};

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;
  
var svg = d3.select("body").select("#regression-plot").append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var xScale = d3.scaleLinear()
    .domain([0, Math.max(...Object.values(data["scatter"]["Feature"]))  ])
    .range([0, chartWidth]);

var xAxis = d3.axisBottom(xScale)

svg.append("text")             
      .attr("transform",
            "translate(" + (chartWidth/2 +30) + " ," + 
                           (chartHeight + margin.top + 40) + ")")
      .attr("font-size", "14px")
      .attr("fill", "#18ABB8")
      .style("text-anchor", "middle")
      .text("GDP by Capita");

var yScale = d3.scaleLinear()
          .domain([0, Math.max(...Object.values(data["scatter"]["Malaria_Num_Death"])) ])
          .range([chartHeight, 0]);
  
var yAxis = d3.axisLeft(yScale)

svg.append("text")
    .attr("transform", `translate(${chartWidth /5}, ${chartHeight + margin.top -320 })`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#18ABB8")
    .text("Reported Death by Malaria in 2017");  

chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

chartGroup.append("g")
        .call(yAxis);


var data_by_feature = []
Object.keys(data.scatter.Malaria_Num_Death).map(key => {
    var value = data.scatter.Malaria_Num_Death[key]
    data_by_feature.push({
        Country_Name: data.scatter["Country Name"][key],
        Malaria_Num_Death: data.scatter.Malaria_Num_Death[key],
        Feature: data.scatter.Feature[key],
    })
})

var toolTip = d3.select("body").append("div")
.attr("class", "tooltip");

chartGroup.selectAll('circle')
    .data(data_by_feature)
    .enter().append('circle')
    .attr('cx', d => xScale(d.Feature))
    .attr('cy', d => yScale(d.Malaria_Num_Death))
    .attr('r', 8)
    .style("fill", "#18ABB8") 
    .style("opacity", 0.8)
    .style("stroke", "#18BDBE6") 
    
    .on("mouseover", function(d) {
    toolTip.style("display", "block")
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
    toolTip.html(`<strong>Country Name: ${d.Country_Name}</strong>`);
  })
    // Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function() {
      toolTip.style("display", "none")
    });


chartGroup.append("line")
    .style("stroke", "4156A0")  // colour the line
    .attr("stroke-width", 3)
    .attr("x1", xScale(0))     // x position of the first end of the line
    .attr("y1", yScale(data.line.intercept+ 0*data.line.coef) )     // y position of the first end of the line
    .attr("x2", xScale(  Math.max(...Object.values(data["scatter"]["Feature"]))))     // x position of the second end of the line
    .attr("y2", yScale(data.line.intercept+ Math.max(...Object.values(data["scatter"]["Feature"]))*data.line.coef));



});

/**********************/ 
/* SELECTING FEATURES*/ 
/**********************/ 
let selected_feature = d3.select("#feature-select")

selected_feature.on('change', function() {
          svgArea.selectAll("*").remove();
          onselection(this.value)
        });

function onselection(value){
   var selectedmodel=d3.select("#model-select").node().value
   var url="/data/reg/" + value+ "/" +selectedmodel; 

   if(selectedmodel==="quadratic") {

    d3.json(url).then(function(data) {
  
      var svgHeight = 400;
      var svgWidth = 800;
          
      var margin = {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
      };
      
      var chartHeight = svgHeight - margin.top - margin.bottom;
      var chartWidth = svgWidth - margin.left - margin.right;
        
      var svg = d3.select("body").select("#regression-plot").append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);
      
      var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      
      var xScale = d3.scaleLinear()
          .domain([0, Math.max(...Object.values(data["scatter"]["Feature"]))  ])
          .range([0, chartWidth]);
      
      var xAxis = d3.axisBottom(xScale)
      
      svg.append("text")             
            .attr("transform",
                  "translate(" + (chartWidth/2 +30) + " ," + 
                                 (chartHeight + margin.top + 40) + ")")
            .attr("font-size", "14px")
            .attr("fill", "#18ABB8")
            .style("text-anchor", "middle")
            .text(value);
      
      var yScale = d3.scaleLinear()
                .domain([0, Math.max(...Object.values(data["scatter"]["Malaria_Num_Death"])) ])
                .range([chartHeight, 0]);
        
      var yAxis = d3.axisLeft(yScale)
      
      svg.append("text")
          .attr("transform", `translate(${chartWidth /5}, ${chartHeight + margin.top -320 })`)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#18ABB8")
          .text("Reported Death by Malaria in 2017");  
      
      chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(xAxis);
      
      chartGroup.append("g")
              .call(yAxis);
      
      
      var data_by_feature = []
      Object.keys(data.scatter.Malaria_Num_Death).map(key => {
          var value = data.scatter.Malaria_Num_Death[key]
          data_by_feature.push({
              Country_Name: data.scatter["Country Name"][key],
              Malaria_Num_Death: data.scatter.Malaria_Num_Death[key],
              Feature: data.scatter.Feature[key],
          })
      })
      
      var toolTip = d3.select("body").append("div")
      .attr("class", "tooltip");
      
      chartGroup.selectAll('circle')
          .data(data_by_feature)
          .enter().append('circle')
          .attr('cx', d => xScale(d.Feature))
          .attr('cy', d => yScale(d.Malaria_Num_Death))
          .attr('r', 8)
          .style("fill", "#18ABB8") 
          .style("opacity", 0.8)
          .style("stroke", "#18BDBE6") 
          
          .on("mouseover", function(d) {
          toolTip.style("display", "block")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
          toolTip.html(`<strong>Country Name: ${d.Country_Name}</strong>`);
        })
          // Add an onmouseout event to make the tooltip invisible
          .on("mouseout", function() {
            toolTip.style("display", "none")
          });
    
      
      var linedata = []
      Object.keys(data.line.xdata).map(key => {
              linedata.push({
                  xdata: data.line.xdata[key],
                  ydata: data.line.ydata[key],
              })
          })
      
      console.log(linedata);
      
      var lineGenerator = d3.line()
          .x(d => xScale(d.xdata))
          .y(d => yScale(d.ydata))
          .curve(d3.curveMonotoneX);

      chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "#4156A0")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator(linedata))
      .classed("line", true);
      
      });   
  }

  else if (selectedmodel==="linear"){
    d3.json(url).then(function(data) {
  
      var svgHeight = 400;
      var svgWidth = 800;
          
      var margin = {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
      };
      
      var chartHeight = svgHeight - margin.top - margin.bottom;
      var chartWidth = svgWidth - margin.left - margin.right;
        
      var svg = d3.select("body").select("#regression-plot").append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);
      
      var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      
      var xScale = d3.scaleLinear()
          .domain([0, Math.max(...Object.values(data["scatter"]["Feature"]))  ])
          .range([0, chartWidth]);
      
      var xAxis = d3.axisBottom(xScale)
      
      svg.append("text")             
            .attr("transform",
                  "translate(" + (chartWidth/2 +30) + " ," + 
                                 (chartHeight + margin.top + 40) + ")")
            .attr("font-size", "14px")
            .attr("fill", "#18ABB8")
            .style("text-anchor", "middle")
            .text(value);
      
      var yScale = d3.scaleLinear()
                .domain([0, Math.max(...Object.values(data["scatter"]["Malaria_Num_Death"])) ])
                .range([chartHeight, 0]);
        
      var yAxis = d3.axisLeft(yScale)
      
      svg.append("text")
          .attr("transform", `translate(${chartWidth /5}, ${chartHeight + margin.top -320 })`)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#18ABB8")
          .text("Reported Death by Malaria in 2017");  
      
      chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(xAxis);
      
      chartGroup.append("g")
              .call(yAxis);
      
      
      var data_by_feature = []
      Object.keys(data.scatter.Malaria_Num_Death).map(key => {
          var value = data.scatter.Malaria_Num_Death[key]
          data_by_feature.push({
              Country_Name: data.scatter["Country Name"][key],
              Malaria_Num_Death: data.scatter.Malaria_Num_Death[key],
              Feature: data.scatter.Feature[key],
          })
      })
      
      var toolTip = d3.select("body").append("div")
      .attr("class", "tooltip");
      
      chartGroup.selectAll('circle')
          .data(data_by_feature)
          .enter().append('circle')
          .attr('cx', d => xScale(d.Feature))
          .attr('cy', d => yScale(d.Malaria_Num_Death))
          .attr('r', 8)
          .style("fill", "#18ABB8") 
          .style("opacity", 0.8)
          .style("stroke", "#18BDBE6") 
          
          .on("mouseover", function(d) {
          toolTip.style("display", "block")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
          toolTip.html(`<strong>Country Name: ${d.Country_Name}</strong>`);
        })
          // Add an onmouseout event to make the tooltip invisible
          .on("mouseout", function() {
            toolTip.style("display", "none")
          });
      
      
      chartGroup.append("line")
          .style("stroke", "4156A0")  // colour the line
          .attr("stroke-width", 3)
          .attr("x1", xScale(0))     // x position of the first end of the line
          .attr("y1", yScale(data.line.intercept+ 0*data.line.coef) )     // y position of the first end of the line
          .attr("x2", xScale(  Math.max(...Object.values(data["scatter"]["Feature"]))))     // x position of the second end of the line
          .attr("y2", yScale(data.line.intercept+ Math.max(...Object.values(data["scatter"]["Feature"]))*data.line.coef));
      
      
      });


  }

  
}
/**********************/ 
/* SELECTING THE MODEL*/ 
/**********************/ 
let selected_model=d3.select("#model-select")

selected_model.on('change', function(){
  svgArea.selectAll("*").remove();
  onselectionmodel(this.value)
}); 

function onselectionmodel(value){
  var selectedfeature=d3.select("#feature-select").node().value
  var url="/data/reg/" + selectedfeature+ "/" +value; 
  
  if(value==="quadratic") {

    d3.json(url).then(function(data) {
  
      var svgHeight = 400;
      var svgWidth = 800;
          
      var margin = {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
      };
      
      var chartHeight = svgHeight - margin.top - margin.bottom;
      var chartWidth = svgWidth - margin.left - margin.right;
        
      var svg = d3.select("body").select("#regression-plot").append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);
      
      var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      
      var xScale = d3.scaleLinear()
          .domain([0, Math.max(...Object.values(data["scatter"]["Feature"]))  ])
          .range([0, chartWidth]);
      
      var xAxis = d3.axisBottom(xScale)
      
      svg.append("text")             
            .attr("transform",
                  "translate(" + (chartWidth/2 +30) + " ," + 
                                 (chartHeight + margin.top + 40) + ")")
            .attr("font-size", "14px")
            .attr("fill", "#18ABB8")
            .style("text-anchor", "middle")
            .text(value);
      
      var yScale = d3.scaleLinear()
                .domain([0, Math.max(...Object.values(data["scatter"]["Malaria_Num_Death"])) ])
                .range([chartHeight, 0]);
        
      var yAxis = d3.axisLeft(yScale)
      
      svg.append("text")
          .attr("transform", `translate(${chartWidth /5}, ${chartHeight + margin.top -320 })`)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#18ABB8")
          .text("Reported Death by Malaria in 2017");  
      
      chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(xAxis);
      
      chartGroup.append("g")
              .call(yAxis);
      
      
      var data_by_feature = []
      Object.keys(data.scatter.Malaria_Num_Death).map(key => {
          var value = data.scatter.Malaria_Num_Death[key]
          data_by_feature.push({
              Country_Name: data.scatter["Country Name"][key],
              Malaria_Num_Death: data.scatter.Malaria_Num_Death[key],
              Feature: data.scatter.Feature[key],
          })
      })
      
      var toolTip = d3.select("body").append("div")
      .attr("class", "tooltip");
      
      chartGroup.selectAll('circle')
          .data(data_by_feature)
          .enter().append('circle')
          .attr('cx', d => xScale(d.Feature))
          .attr('cy', d => yScale(d.Malaria_Num_Death))
          .attr('r', 8)
          .style("fill", "#18ABB8") 
          .style("opacity", 0.8)
          .style("stroke", "#18BDBE6") 
          
          .on("mouseover", function(d) {
          toolTip.style("display", "block")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
          toolTip.html(`<strong>Country Name: ${d.Country_Name}</strong>`);
        })
          // Add an onmouseout event to make the tooltip invisible
          .on("mouseout", function() {
            toolTip.style("display", "none")
          });
    
      
      var linedata = []
      Object.keys(data.line.xdata).map(key => {
              linedata.push({
                  xdata: data.line.xdata[key],
                  ydata: data.line.ydata[key],
              })
          })
      
      console.log(linedata);
      
      var lineGenerator = d3.line()
          .x(d => xScale(d.xdata))
          .y(d => yScale(d.ydata))
          .curve(d3.curveMonotoneX);

      chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "#4156A0")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator(linedata))
      .classed("line", true);
      
      });   
  }

  else if (value==="linear"){
    d3.json(url).then(function(data) {
  
      var svgHeight = 400;
      var svgWidth = 800;
          
      var margin = {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
      };
      
      var chartHeight = svgHeight - margin.top - margin.bottom;
      var chartWidth = svgWidth - margin.left - margin.right;
        
      var svg = d3.select("body").select("#regression-plot").append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);
      
      var chartGroup = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
      
      var xScale = d3.scaleLinear()
          .domain([0, Math.max(...Object.values(data["scatter"]["Feature"]))  ])
          .range([0, chartWidth]);
      
      var xAxis = d3.axisBottom(xScale)
      
      svg.append("text")             
            .attr("transform",
                  "translate(" + (chartWidth/2 +30) + " ," + 
                                 (chartHeight + margin.top + 40) + ")")
            .attr("font-size", "14px")
            .attr("fill", "#18ABB8")
            .style("text-anchor", "middle")
            .text(value);
      
      var yScale = d3.scaleLinear()
                .domain([0, Math.max(...Object.values(data["scatter"]["Malaria_Num_Death"])) ])
                .range([chartHeight, 0]);
        
      var yAxis = d3.axisLeft(yScale)
      
      svg.append("text")
          .attr("transform", `translate(${chartWidth /5}, ${chartHeight + margin.top -320 })`)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "#18ABB8")
          .text("Reported Death by Malaria in 2017");  
      
      chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(xAxis);
      
      chartGroup.append("g")
              .call(yAxis);
      
      
      var data_by_feature = []
      Object.keys(data.scatter.Malaria_Num_Death).map(key => {
          var value = data.scatter.Malaria_Num_Death[key]
          data_by_feature.push({
              Country_Name: data.scatter["Country Name"][key],
              Malaria_Num_Death: data.scatter.Malaria_Num_Death[key],
              Feature: data.scatter.Feature[key],
          })
      })
      
      var toolTip = d3.select("body").append("div")
      .attr("class", "tooltip");
      
      chartGroup.selectAll('circle')
          .data(data_by_feature)
          .enter().append('circle')
          .attr('cx', d => xScale(d.Feature))
          .attr('cy', d => yScale(d.Malaria_Num_Death))
          .attr('r', 8)
          .style("fill", "#18ABB8") 
          .style("opacity", 0.8)
          .style("stroke", "#18BDBE6") 
          
          .on("mouseover", function(d) {
          toolTip.style("display", "block")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
          toolTip.html(`<strong>Country Name: ${d.Country_Name}</strong>`);
        })
          // Add an onmouseout event to make the tooltip invisible
          .on("mouseout", function() {
            toolTip.style("display", "none")
          });
      
      
      chartGroup.append("line")
          .style("stroke", "4156A0")  // colour the line
          .attr("stroke-width", 3)
          .attr("x1", xScale(0))     // x position of the first end of the line
          .attr("y1", yScale(data.line.intercept+ 0*data.line.coef) )     // y position of the first end of the line
          .attr("x2", xScale(  Math.max(...Object.values(data["scatter"]["Feature"]))))     // x position of the second end of the line
          .attr("y2", yScale(data.line.intercept+ Math.max(...Object.values(data["scatter"]["Feature"]))*data.line.coef));
      
      
      });


  }
  
}