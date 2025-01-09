'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Equipment } from '../interfaces/equipmentInterface';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';

interface HoursSpentByDeptProps {
  equipmentData: Equipment[];
  maintenanceData: MaintenanceRecord[];
}

const HoursSpentByDept: React.FC<HoursSpentByDeptProps> = ({ equipmentData, maintenanceData }) => {
  const departmentHours = equipmentData.reduce((acc, equipment) => {
    const equipmentMaintenance = maintenanceData.filter(record => record.equipmentId === equipment.id);
    const totalHours = equipmentMaintenance.reduce((sum, record) => sum + record.hoursSpent, 0);
    acc[equipment.department] = (acc[equipment.department] || 0) + totalHours;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(departmentHours).map(([name, hours]) => ({ name, hours }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export default HoursSpentByDept;