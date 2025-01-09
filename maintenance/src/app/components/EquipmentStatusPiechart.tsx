'use client'

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Equipment } from '../interfaces/equipmentInterface';

interface EquipmentStatusPiechartProps {
  equipmentData: Equipment[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EquipmentStatusPiechart: React.FC<EquipmentStatusPiechartProps> = ({ equipmentData }) => {
  const statusCounts = equipmentData.reduce((acc, equipment) => {
    acc[equipment.status] = (acc[equipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="60%"
            cy="50%"
            labelLine={true}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            paddingAngle={5} // Add padding between sectors

          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquipmentStatusPiechart;