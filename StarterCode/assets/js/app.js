var svgWidth = getWindowWidth();
var svgHeight = svgWidth / 2;

var margin = { 
  top: 20, 
  right: 40, 
  bottom: 60, 
  left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Import Data
d3.csv("assets/data/data.csv").then(function(data){
  // console.log(data);
  // Step 1: Parse Data/Cast as numbers
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // Step 2: Create scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(data, d => d.poverty)])
        .range([0, width]);      

      var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(data, d => d.obesity)])
        .range([height, 0]);

// Step 3: Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

//Step 4: Append Axes to the chart
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
      
      chartGroup.append("g")
        .call(leftAxis);

// Step 5:Create Circles
      var circlesGroup = chartGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (data, i) {
        return "translate(" + xLinearScale(data.poverty) + " ," + yLinearScale(data.obesity) + ")"
        });
      circlesGroup.append("circle")
        .attr("r", "10")
        .attr("fill", "purple")
        .attr("opacity", ".5")

// Step 5a: adding text
      circlesGroup.append("text")
        .attr("dy", function(data, index){return 5;})
        .attr("text-anchor", "middle")
        .text(function(data, index){return data.abbr;})     
        .attr("font-size", 10)  
        .attr('fill', 'white');

// Step 6: Initialize tool tip
  var toolTip = d3.tip()
    toolTip.style("display", "block") 
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.abbr}</strong><hr> Poverty (%): ${d.poverty}<br><hr>Obesity (%): ${d.obesity}`);
    });

//Step 7: Create tooltip in the chart
  chartGroup.call(toolTip);

// Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data, i) {
        toolTip.show(data, this);
      })

// // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  // Create axes labels
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obese (%)");

// Append x-axis labels
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2 - 20}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

  

    });


function getWindowWidth() {
    var chartDiv = document.getElementById("scatter");    
    var w = chartDiv.clientWidth;
    // console.log(w)
    return w;
  }