import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ animate, tags }) => {
  useEffect(() => {
    if (!animate || !tags || tags.length === 0) return;

    d3.select('#pie-chart').selectAll('*').remove(); 
    d3.select('#legend').selectAll('*').remove();

    const width = window.innerWidth * 0.4;
    const height = window.innerHeight * 0.4;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Updated color palette for 5 segments
    const color = d3.scaleOrdinal()
      .domain(tags.map(tag => tag.TAG_NAME))
      .range([
        '#FF6F61',  // Coral Red
        '#6B8E23',  // Olive Green
        '#1E90FF',  // Dodger Blue
        '#FFD700',  // Gold
        '#8A2BE2'   // Blue Violet
      ]);

    const pie = d3.pie()
      .value(d => d["COUNT(F.TAG_ID)"])
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const tooltip = d3.select('#pie-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', '#555555') 
      .style('padding', '5px')
      .style('border', '1px solid #444444')
      .style('border-radius', '4px')
      .style('visibility', 'hidden')
      .style('font-family', 'PoppinsBold')
      .style('z-index', '10');

    const arcs = svg.selectAll('arc')
      .data(pie(tags))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', d => color(d.data.TAG_NAME))
      .attr('stroke', d => {
        const fillColor = d3.rgb(color(d.data.TAG_NAME));
        return fillColor.darker(2);
      })
      .style('stroke-width', '2px')
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          { startAngle: d.startAngle, endAngle: d.startAngle },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        );
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Hover tooltip interaction
    arcs.on('mouseover', function (event, d) {
      const userLabel = d.value === 1 ? 'entry' : 'entries'; 
        tooltip.style('visibility', 'visible')
          .html(`<strong>${d.data["COUNT(F.TAG_ID)"]}</strong> ${userLabel} for <strong>${d.data.TAG_NAME}</strong>`)
          .style('color', '#FFFFFF')
          .style('font-size', '0.9em')
          .style('font-family', 'Poppins');
        d3.select(this).style('opacity', 0.6);
      d3.select(this).select('path').style('opacity', 0.6);
    })
    .on('mousemove', function (event) {
      tooltip.style('top', (event.pageY - 100) + 'px')
          .style('left', (event.pageX - 20) + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('visibility', 'hidden');
      d3.select(this).select('path').style('opacity', 1);
    });

    const legendWidth = 150;
    const legendHeight = tags.length * 30;
    const legendSvg = d3.select('#legend')
      .append('svg')
      .attr('width', legendWidth)
      .attr('height', legendHeight);

    const legend = legendSvg.selectAll('.legend')
      .data(tags)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 30})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => color(d.TAG_NAME))
      .style('stroke', '#000');

    legend.append('text')
      .attr('x', 40)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(d => d.TAG_NAME)
      .style('font-size', '1.5em')
      .style('font-family', 'PoppinsBold')
      .style('fill', 'white');

  }, [animate, tags]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10%', marginTop: '3%'}} >
      <div id="pie-chart">
        {/* Pie Chart */}
      </div>
      <div id="legend" style={{ marginLeft: '40%', display: 'inline-block', position: 'absolute' }}>
        {/* Legend */}
      </div>
    </div>
  );
};

export default PieChart;
