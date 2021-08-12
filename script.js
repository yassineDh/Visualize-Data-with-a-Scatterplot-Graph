//Good
let w = 1100;
let h = 700;

//Good
let svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

//Good
svg
  .append("text")
  .attr("x", w / 5)
  .attr("y", 40)
  .attr("id", "title")
  .style("font-size", 40)
  .text("Doping in Professional Bicycle Racing");

//Good
svg
  .append("text")
  .attr("x", w / 3)
  .attr("y", 65)
  .attr("id", "legend")
  .style("font-size", 22)
  .text("35 Fastest times up Alpe d'Huez");

//Good
let Tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

function secondsToms(d) {
  let arr = new String(d).split(" ");

  let m = Math.floor(new Number(arr[3]) / 60);
  let s = Math.floor(new Number(arr[3]) % 60);

  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;

  return m + ":" + s;
}

var timeFormat = d3.timeFormat("%M:%S");

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((vals) => {
      vals.forEach(function (d) {
        d.Place = +d.Place;
        var parsedTime = d.Time.split(":");
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });

      let xScale = d3
        .scaleLinear()
        .domain([
          d3.min(vals, (d) => d["Year"] - 1),
          d3.max(vals, (d) => d["Year"] + 1),
        ])
        .range([50, w - 50]);

      let yScale = d3
        .scaleTime()
        .domain([
          d3.min(vals, (d) => d["Time"]),
          d3.max(vals, (d) => d["Time"]),
        ])
        .range([50, h - 50]);

      let x_axis = d3
        .axisBottom()
        .scale(xScale)
        .ticks(10)
        .tickFormat(d3.format("d"));
      let y_axis = d3.axisLeft().scale(yScale).ticks(10).tickFormat(timeFormat);
      svg
        .append("g")
        .attr("transform", "translate(0," + (h - 50) + ")")
        .attr("id", "x-axis")
        .call(x_axis);

      svg
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 0 + ")")
        .attr("id", "y-axis")
        .call(y_axis);

      let mo = (d) => {
        Tooltip.style("opacity", 1);
      };

      let mm = (d) => {
        Tooltip.attr("data-year", d.path[0].dataset.xvalue);
        Tooltip.html(
          "Year : " +
            d.path[0].dataset.xvalue +
            "<br/>" +
            "Minute : " +
            d.path[0].dataset.yvalue
        )
          .style("left", d.pageX + 20 + "px")
          .style("top", d.pageY + 20 + "px");
      };

      let ml = (d) => {
        Tooltip.style("opacity", 0);
      };

      svg
        .selectAll("circle")
        .data(vals)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 6)
        .attr("cx", (d) => xScale(d["Year"]))
        .attr("cy", (d) => yScale(d["Time"]))
        .attr("data-xvalue", (d) => d["Year"] + "")
        .attr("data-yvalue", (d) => d.Time.toISOString())
        .on("mouseover", mo)
        .on("mousemove", mm)
        .on("mouseleave", ml);
    });
});
