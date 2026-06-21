'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Planet, Zap, Target } from 'lucide-react';
import { CompetitorNode, MarketGap } from '@/lib/types';

interface GravityMapProps {
  data: {
    gap: MarketGap;
    competitors: CompetitorNode[];
  };
  onPlanetDrop?: (attraction: number, repulsion: number) => void;
}

export default function GravityMap({ data, onPlanetDrop }: GravityMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [droppedPlanet, setDroppedPlanet] = useState<{ x: number; y: number; attraction: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    // Layers
    const gCraters = svg.append('g').attr('class', 'craters');
    const gLinks = svg.append('g').attr('class', 'links');
    const gNodes = svg.append('g').attr('class', 'nodes');

    // Simulation Setup
    // attraction (0-100) -> distance (closer to 0 is higher attraction)
    const nodes = data.competitors.map(d => ({ 
      ...d, 
      x: centerX + (Math.random() - 0.5) * 400,
      y: centerY + (Math.random() - 0.5) * 400,
      radius: 12 + (d.attraction / 10) 
    }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 20))
      .force('radial', d3.forceRadial((d: any) => {
        // High attraction = closer to center (inner orbit: 80, outer orbit: 250)
        return d3.scaleLinear().domain([100, 0]).range([100, 280])(d.attraction);
      }, centerX, centerY).strength(0.8));

    // Draw Center Star (JTBD)
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 20)
      .attr('fill', '#f59e0b')
      .attr('class', 'animate-pulse');
    
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#92400e')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text(data.gap.jtbd);

    // Simulation Tick
    simulation.on('tick', () => {
      // Draw Craters (Repulsion waves)
      const craters = gCraters.selectAll('.crater').data(nodes);
      craters.enter()
        .append('circle')
        .attr('class', 'crater')
        .merge(craters as any)
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
        .attr('r', (d: any) => 30 + (d.repulsion / 2))
        .attr('fill', 'url(#craterGradient)')
        .attr('opacity', 0.15);

      // Draw Nodes (Competitors)
      const nodeGroups = gNodes.selectAll('.node').data(nodes);
      const nodeEnter = nodeGroups.enter()
        .append('g')
        .attr('class', 'node cursor-pointer');

      nodeEnter.append('circle')
        .attr('r', (d: any) => d.radius)
        .attr('fill', '#1e293b');
      
      nodeEnter.append('text')
        .attr('dy', (d: any) => d.radius + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#64748b')
        .text((d: any) => d.name);

      nodeGroups.merge(nodeEnter as any)
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Handle Click to drop Planet
    svg.on('click', (event) => {
      const [x, y] = d3.pointer(event);
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate attraction from distance (closer = higher)
      const attraction = Math.round(d3.scaleLinear().domain([100, 300]).range([100, 0]).clamp(true)(dist));
      
      setDroppedPlanet({ x, y, attraction });
      if (onPlanetDrop) onPlanetDrop(attraction, 50); // Default repulsion
    });

    // Gradients
    const defs = svg.append('defs');
    const grad = defs.append('radialGradient').attr('id', 'craterGradient');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6');
    grad.append('stop').attr('offset', '100%').attr('stop-color', 'transparent');

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Target Marker for Dropped Planet */}
      <AnimatePresence>
        {droppedPlanet && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute pointer-events-none"
            style={{ left: `${(droppedPlanet.x / 800) * 100}%`, top: `${(droppedPlanet.y / 600) * 100}%` }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-indigo-200">
                <Target className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold">
                TARGET ATT: {droppedPlanet.attraction}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
          <div className="w-2 h-2 rounded-full bg-amber-500" /> JTBD (Center)
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
          <div className="w-2 h-2 rounded-full bg-slate-800" /> Competitors
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
          <div className="w-3 h-3 bg-blue-500/20 rounded-full" /> Repulsion (Crater)
        </div>
      </div>
    </div>
  );
}
