let w = 1100;
let h = 700;

let svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

svg
  .append("text")
  .attr("x", w / 5)
  .attr("y", 40)
  .attr("id", "title")
  .style("font-size", 40)
  .text("Doping in Professional Bicycle Racing");

svg
  .append("text")
  .attr("x", w / 3)
  .attr("y", 65)
  .attr("id", "subtitle")
  .style("font-size", 22)
  .text("35 Fastest times up Alpe d'Huez");

function secondsToms(d) {
  let arr = new String(d).split(" ");

  let m = Math.floor(new Number(arr[3]) / 60);
  let s = Math.floor(new Number(arr[3]) % 60);

  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;

  console.log(m + ":" + s);
  return m + ":" + s;
}

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((vals) => {
      let xScale = d3
        .scaleTime()
        .domain([
          new Date(d3.min(vals, (d) => d["Year"] - 1 + "")),
          new Date(d3.max(vals, (d) => d["Year"] + 1 + "")),
        ])
        .range([50, w - 50]);

      let yScale = d3
        .scaleTime()
        .domain([
          new Date(d3.max(vals, (d) => d["Seconds"] + "")),
          new Date(d3.min(vals, (d) => d["Seconds"] + "")),
        ])
        .range([h - 50, 50]);

      let x_axis = d3.axisBottom().scale(xScale).ticks(10);
      let y_axis = d3
        .axisLeft()
        .scale(yScale)
        .ticks(10)
        .tickFormat((d) => secondsToms(d));
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

      svg
        .selectAll("circle")
        .data(vals)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 6)
        .attr("cx", (d) => xScale(new Date(d["Year"] + "")))
        .attr("cy", (d) => yScale(new Date(d["Seconds"] + "")))
        .attr("data-xvalue", (d) => d["Year"])
        .attr("data-yvalue", (d) => d["Time"]);
    });
});
