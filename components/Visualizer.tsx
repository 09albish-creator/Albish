
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export type VisualizerTheme = 'miku-cyan' | 'luka-pink' | 'matrix-green' | 'diva-gold';
export type VisualizerStyle = 'bars' | 'dots' | 'mirrored';

interface VisualizerProps {
  isPlaying: boolean;
  theme: VisualizerTheme;
  style: VisualizerStyle;
}

const THEME_COLORS: Record<VisualizerTheme, { primary: string; secondary: string }> = {
  'miku-cyan': { primary: '#39C5BB', secondary: '#FF5E8E' },
  'luka-pink': { primary: '#FF5E8E', secondary: '#39C5BB' },
  'matrix-green': { primary: '#00FF41', secondary: '#003B00' },
  'diva-gold': { primary: '#FFD700', secondary: '#B8860B' }
};

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, theme, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastStateRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 150;
    const barsCount = style === 'mirrored' ? 40 : 60;
    const initialData = Array.from({ length: barsCount }, () => 5);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'none');

    svg.selectAll('*').remove();

    const x = d3.scaleBand()
      .domain(d3.range(barsCount).map(String))
      .range([0, width])
      .padding(style === 'dots' ? 0.6 : 0.2);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const colors = THEME_COLORS[theme];

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'viz-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', colors.primary).attr('stop-opacity', 0.05);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', colors.primary).attr('stop-opacity', 0.8);

    if (style === 'dots') {
      svg.selectAll('circle')
        .data(initialData)
        .join('circle')
        .attr('cx', (d, i) => (x(String(i)) || 0) + x.bandwidth() / 2)
        .attr('cy', d => y(d))
        .attr('r', Math.max(1, x.bandwidth() / 2))
        .attr('fill', colors.primary)
        .style('filter', `drop-shadow(0 0 3px ${colors.primary})`);
    } else if (style === 'mirrored') {
      const bars = svg.selectAll('g')
        .data(initialData)
        .join('g')
        .attr('transform', (d, i) => `translate(${x(String(i)) || 0}, ${height / 2})`);
      
      bars.append('rect')
        .attr('class', 'top-rect')
        .attr('width', x.bandwidth())
        .attr('height', d => (height - y(d)) / 2)
        .attr('y', d => -(height - y(d)) / 2)
        .attr('fill', colors.primary)
        .attr('rx', 1);

      bars.append('rect')
        .attr('class', 'bottom-rect')
        .attr('width', x.bandwidth())
        .attr('height', d => (height - y(d)) / 2)
        .attr('y', 0)
        .attr('fill', colors.primary)
        .attr('opacity', 0.4)
        .attr('rx', 1);
    } else {
      svg.selectAll('rect')
        .data(initialData)
        .join('rect')
        .attr('x', (d, i) => x(String(i)) || 0)
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', 'url(#viz-gradient)')
        .attr('rx', 2);
    }

    let animationId: number;
    let frame = 0;

    const update = () => {
      frame++;
      if (isPlaying) {
        // More structured random data for better visual feel
        const newData = initialData.map((v, i) => {
          const sine = Math.sin(frame * 0.1 + i * 0.3) * 30 + 50;
          return Math.max(10, sine + Math.random() * 20);
        });
        
        if (style === 'dots') {
          svg.selectAll('circle')
            .data(newData)
            .attr('cy', d => y(d));
        } else if (style === 'mirrored') {
          svg.selectAll('g')
            .data(newData)
            .each(function(d: any) {
              const g = d3.select(this);
              const h = (height - y(d)) / 2;
              g.select('.top-rect').attr('height', h).attr('y', -h);
              g.select('.bottom-rect').attr('height', h);
            });
        } else {
          svg.selectAll('rect')
            .data(newData)
            .attr('y', d => y(d))
            .attr('height', d => height - y(d));
        }
      } else {
        // Smoothly settle down when paused
        if (style === 'dots') {
          svg.selectAll('circle').attr('cy', height - 10);
        } else if (style === 'mirrored') {
          svg.selectAll('g').each(function() {
            const g = d3.select(this);
            g.select('.top-rect').attr('height', 1).attr('y', -1);
            g.select('.bottom-rect').attr('height', 1);
          });
        } else {
          svg.selectAll('rect').attr('y', height - 2).attr('height', 2);
        }
      }
      animationId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, theme, style]);

  return (
    <div ref={containerRef} className="w-full h-[150px] relative">
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-5">
        <div className="h-full w-px bg-white/20"></div>
        <div className="h-full w-px bg-white/20"></div>
        <div className="h-full w-px bg-white/20"></div>
      </div>
      <svg ref={svgRef} className="w-full h-full pointer-events-none"></svg>
    </div>
  );
};

export default Visualizer;
