'use client'

import React, { useState, useEffect } from 'react';
import MaintenanceRecordsTable from '../components/MaintenanceRecordsTable';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';
import { Equipment } from '../interfaces/equipmentInterface';


// This is a mock data function. In a real application, you would fetch this data from an API or database.
const getMockData = () => {
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: 'MR001',
      equipmentId: '1',
      date: new Date('2023-01-15'),
      type: 'Preventive',
      technician: 'John Doe',
      hoursSpent: 2.5,
      description: 'Routine check and lubrication.',
      partsReplaced: ['Filter'],
      priority: 'Low',
      completionStatus: 'Complete',
    },
    {
      id: 'MR002',
      equipmentId: '2',
      date: new Date('2023-02-20'),
      type: 'Repair',
      technician: 'Jane Smith',
      hoursSpent: 4,
      description: 'Replaced broken belt and adjusted tension.',
      partsReplaced: ['Belt'],
      priority: 'High',
      completionStatus: 'Complete',
    },
    {
      id: 'MR003',
      equipmentId: '3',
      date: new Date('2023-03-05'),
      type: 'Emergency',
      technician: 'Mike Johnson',
      hoursSpent: 3.5,
      description: 'Emergency repair due to unexpected breakdown.',
      partsReplaced: ['Motor'],
      priority: 'High',
      completionStatus: 'Complete',
    },
    {
      id: 'MR004',
      equipmentId: '4',
      date: new Date('2023-04-18'),
      type: 'Preventive',
      technician: 'Alice Brown',
      hoursSpent: 2,
      description: 'Regular maintenance and cleaning.',
      priority: 'Medium',
      completionStatus: 'Complete',
    },
    {
      id: 'MR005',
      equipmentId: '5',
      date: new Date('2023-05-22'),
      type: 'Repair',
      technician: 'Emily Davis',
      hoursSpent: 5,
      description: 'Fixed electrical issue and replaced fuse.',
      partsReplaced: ['Fuse'],
      priority: 'High',
      completionStatus: 'Incomplete',
    },
    {
      id: 'MR006',
      equipmentId: '6',
      date: new Date('2023-06-10'),
      type: 'Preventive',
      technician: 'Oliver Turner',
      hoursSpent: 1.5,
      description: 'Checked hydraulic system and replaced fluid.',
      partsReplaced: ['Hydraulic Fluid'],
      priority: 'Medium',
      completionStatus: 'Complete',
    },
    {
      id: 'MR007',
      equipmentId: '7',
      date: new Date('2023-07-25'),
      type: 'Emergency',
      technician: 'Sophia Wilson',
      hoursSpent: 6,
      description: 'Addressed urgent overheating issue.',
      partsReplaced: ['Cooling Fan'],
      priority: 'High',
      completionStatus: 'Pending Parts',
    },
  ];

  const equipmentData: Equipment[] = [
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
  const combinedData = maintenanceRecords.map(record => {
    const equipment = equipmentData.find(eq => eq.id === record.equipmentId);
    return {
      ...record,
      equipmentName: equipment ? equipment.name : 'Unknown',
      location: equipment ? equipment.location : 'Unknown',
      department: equipment ? equipment.department : 'Unknown',
    };
  });

  return { maintenanceRecords: combinedData, equipmentData };
};

export default function MaintenanceRecordsPage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);

  useEffect(() => {
    // In a real application, you would fetch data here
    // For now, we'll use the mock data
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const { maintenanceRecords, equipmentData } = getMockData();
      setMaintenanceRecords(maintenanceRecords);
      setEquipmentData(equipmentData);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Maintenance Records</h1>
      <MaintenanceRecordsTable
        maintenanceRecords={maintenanceRecords}
        equipmentData={equipmentData}
      />
    </div>
  );
}