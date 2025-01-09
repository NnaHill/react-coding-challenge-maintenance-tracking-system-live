'use client'

import React, { useState } from 'react';
import EquipmentTable from '../components/EquipmentTable';
import { Equipment } from '../interfaces/equipmentInterface';

// This is a mock data array. In a real application, you would fetch this data from an API or database.
const mockData: Equipment[] = [
  {
    id: '1',
    name: 'Machine A',
    location: 'Floor 1',
    department: 'Machining',
    model: 'Model X',
    serialNumber: 'SN001',
    installDate: new Date('2022-01-01'),
    status: 'Operational',
  },
  {
    id: '2',
    name: 'Machine B',
    location: 'Floor 2',
    department: 'Assembly',
    model: 'Model Y',
    serialNumber: 'SN002',
    installDate: new Date('2022-02-15'),
    status: 'Maintenance',
  },
  {
    id: '3',
    name: 'Machine C',
    location: 'Floor 1',
    department: 'Packaging',
    model: 'Model Z',
    serialNumber: 'SN003',
    installDate: new Date('2022-03-20'),
    status: 'Down',
  },
  {
    id: '4',
    name: 'Machine D',
    location: 'Floor 3',
    department: 'Shipping',
    model: 'Model W',
    serialNumber: 'SN004',
    installDate: new Date('2022-04-10'),
    status: 'Operational',
  },
  {
    id: '5',
    name: 'Machine E',
    location: 'Floor 2',
    department: 'Assembly',
    model: 'Model V',
    serialNumber: 'SN005',
    installDate: new Date('2022-05-05'),
    status: 'Maintenance',
  },
  {
    id: '6',
    name: 'Machine F',
    location: 'Floor 1',
    department: 'Machining',
    model: 'Model U',
    serialNumber: 'SN006',
    installDate: new Date('2022-06-15'),
    status: 'Retired',
  },
  {
    id: '7',
    name: 'Machine G',
    location: 'Floor 3',
    department: 'Shipping',
    model: 'Model T',
    serialNumber: 'SN007',
    installDate: new Date('2022-07-01'),
    status: 'Operational',
  },
];

const EquipmentTablePage: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>(mockData);

  const handleUpdateEquipment = (updatedEquipment: Equipment[]) => {
    setEquipmentData(updatedEquipment);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Equipment Table</h1>
      <EquipmentTable data={equipmentData} onUpdateEquipment={handleUpdateEquipment} />
    </div>
  );
};

export default EquipmentTablePage;

