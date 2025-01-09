'use client'

import React, { useState, useMemo, } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  ColumnDef,
  flexRender,
  Row,
} from '@tanstack/react-table';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';
import { Equipment } from '../interfaces/equipmentInterface';

interface MaintenanceRecordWithEquipment extends MaintenanceRecord {
  equipmentName: string;
}

interface MaintenanceRecordsTableProps {
  maintenanceRecords: MaintenanceRecord[];
  equipmentData: Equipment[];
}

const MaintenanceRecordsTable: React.FC<MaintenanceRecordsTableProps> = ({
  maintenanceRecords,
  equipmentData,
}) => {
  const [grouping, setGrouping] = useState<string[]>([]);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [filtering, setFiltering] = useState('');
const [isGrouped, setIsGrouped] = useState(false);
const [startDate, setStartDate] = useState<string>('');
const [endDate, setEndDate] = useState<string>('');

  const [data, setData] = useState<MaintenanceRecordWithEquipment[]>([]);

  type ProcessedDataItem = MaintenanceRecordWithEquipment | { isGroupHeader: true; equipmentName: string };
  const processedData = useMemo(() => {
    let filteredRecords = maintenanceRecords;

    // Apply date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }
    if (!isGrouped) {
      return filteredRecords.map(record => ({
        ...record,
        equipmentName: equipmentData.find(eq => eq.id === record.equipmentId)?.name || 'Unknown'
      }));
    }

    const groupedData = filteredRecords.reduce((acc, record) => {
      const equipment = equipmentData.find(eq => eq.id === record.equipmentId);
      const equipmentName = equipment?.name || 'Unknown';
      if (!acc[equipmentName]) {
        acc[equipmentName] = [];
      }
      acc[equipmentName].push({
        ...record,
        equipmentName
      });
      return acc;
    }, {} as Record<string, MaintenanceRecordWithEquipment[]>);

    return Object.entries(groupedData).flatMap(([equipmentName, records]) => [
      { isGroupHeader: true, equipmentName },
      ...records
    ]);
  }, [maintenanceRecords, equipmentData, isGrouped, startDate, endDate]);

  const columns = useMemo<ColumnDef<MaintenanceRecordWithEquipment>[]>(
    () => [
      {
        accessorFn: (row) => row.equipmentName,
        id: 'equipmentName',
        header: 'Equipment Name',
        cell: ({ getValue }) => getValue() || 'Unknown',
      },
      {
        accessorFn: (row) => row.date,
        id: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const value = getValue();
          return value instanceof Date ? value.toLocaleDateString() : 'Invalid Date';
        },
      },
      {
        accessorFn: (row) => row.type,
        id: 'type',
        header: 'Type',
      },
      {
        accessorFn: (row) => row.technician,
        id: 'technician',
        header: 'Technician',
      },
      {
        accessorFn: (row) => row.hoursSpent,
        id: 'hoursSpent',
        header: 'Hours Spent',
      },
      {
        accessorFn: (row) => row.description,
        id: 'description',
        header: 'Description',
      },
      {
        accessorFn: (row) => row.priority,
        id: 'priority',
        header: 'Priority',
      },
      {
        accessorFn: (row) => row.completionStatus,
        id: 'completionStatus',
        header: 'Status',
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      grouping,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-4">
<button onClick={() => setIsGrouped(!isGrouped)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
  {isGrouped ? 'Ungroup' : 'Group by Equipment'}
</button>
<div className="flex space-x-2">
  <div>
    <label htmlFor="start-date" className="sr-only">Start Date</label>
    <input
      id="start-date"
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="p-2 border rounded"
      aria-label="Start Date"
    />
  </div>
  <div>
    <label htmlFor="end-date" className="sr-only">End Date</label>
    <input
      id="end-date"
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="p-2 border rounded"
      aria-label="End Date"
    />
  </div>
</div>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Search all columns..."
          className="p-2 border rounded"
        />
        <label htmlFor="grouping-select" className="sr-only">Group by</label>
        <select
          id="grouping-select"
          value={grouping[0] || ''}
          onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
          className="p-2 border rounded"
        >
          <option value="">Group by...</option>
          <option value="equipmentName">Equipment Name</option>
          <option value="type">Type</option>
          <option value="priority">Priority</option>
          <option value="completionStatus">Status</option>
        </select>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-2 text-left cursor-pointer border"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
        {processedData.map((item, index) => (
  'isGroupHeader' in item ? (
    <tr key={`group-${index}`} className="bg-gray-200">
      <td colSpan={columns.length} className="p-2 font-bold">
        Equipment Name: {item.equipmentName}
      </td>
    </tr>
  ) : (
    <tr key={item.id || index} className="border-b">
      {columns.map(column => (
        <td key={column.id} className="p-2">
          {column.cell 
            ? flexRender(column.cell, { 
                row: { original: item } as Row<MaintenanceRecordWithEquipment>, 
                getValue: () => item[column.id as keyof MaintenanceRecordWithEquipment] 
              })
            : item[column.id as keyof MaintenanceRecordWithEquipment]}
        </td>
      ))}
    </tr>
  )
))}


        </tbody>


      </table>
    </div>
  );
};

export default MaintenanceRecordsTable;