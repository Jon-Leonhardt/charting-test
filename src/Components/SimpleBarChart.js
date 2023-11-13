import React, {useEffect,useRef } from 'react';
import * as d3 from 'd3';
import Styled from 'styled-components';
import './SimpleBarChart.css';

  
const SimpleBarChartContainer = Styled.div`
    display:inline-block;
`;

function SimpleBarChart({ width, height, data, yAxisTitle, callBack, selected }) {
    const margin = {top: 30, right: 40, bottom: 70, left: 40};
    const ref = useRef(null);
    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        svg.attr('width', width)
        .attr('height', height);

        const selection = svg.selectAll('rect').data(data);
        
        // Adding X scale and axis
        const x = d3.scaleBand()
        .range([ 0, width-margin.left ])
        .domain(data.map(function(d) { return d.month; }))
        .padding(0.2);
        svg.append('g')
        .attr('transform', `translate(${margin.left},${height-margin.top})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

        // Adding Y scale and axis
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d=> d.count)])
        .range([ height-margin.top-margin.bottom, 0]);
        svg.append('g')
        .call(d3.axisLeft(y)).attr('transform', `translate(${margin.left},${margin.bottom})`);

        // Adding bars to chart
        selection.enter()
        .append('rect')
        .on('click', (e,d)=>{
            if(callBack)callBack(e,selected!==d.index?d.index:-1);
        })
        .attr('x', (d) =>x(d.month))
        .attr('y', (d)=> y(d.count))
        .attr('width', x.bandwidth())
        .attr('transform', `translate(${margin.left},${margin.bottom})`)
        .attr('height', (d)=>height-margin.top-margin.bottom - y(d.count))
        .attr('class',(d)=>{
            if(selected === d.index) return 'simple-bar-chart-bar selected'
            return 'simple-bar-chart-bar';
        });
    },[selected,data]);

    return (
        <SimpleBarChartContainer width={width}  >
            <svg  ref={ref}  />
        </SimpleBarChartContainer>
    );
}
export default SimpleBarChart;