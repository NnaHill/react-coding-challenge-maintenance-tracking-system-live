'use client'

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { ColumnSort } from '@tanstack/react-table';
import { Equipment } from '../interfaces/equipmentInterface';

// Define the columns for the table
const columns: ColumnDef<Equipment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'model',
    header: 'Model',
  },
  {
    accessorKey: 'serialNumber',
    header: 'Serial Number',
  },
  {
    accessorKey: 'installDate',
    header: 'Install Date',
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

interface EquipmentTableProps {
  data: Equipment[];
  onUpdateEquipment: (updatedEquipment: Equipment[]) => void;
}


const EquipmentTable: React.FC<EquipmentTableProps> = ({ data, onUpdateEquipment }) => {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [filtering, setFiltering] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });


  const handleStatusUpdate = (newStatus: Equipment['status']) => {
    const updatedData = data.map(item => 
      selectedRows.includes(item.id) ? { ...item, status: newStatus } : item
    );
    onUpdateEquipment(updatedData);
    setSelectedRows([]);
  };


  const getRowColor = (status: Equipment['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100';
      case 'Down':
        return 'bg-red-100';
      case 'Maintenance':
        return 'bg-yellow-100';
      case 'Retired':
        return 'bg-gray-100';
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Search all columns..."
          className="p-2 border rounded"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="p-2">Select</th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-2 text-left cursor-pointer"
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={getRowColor(row.original.status)}>
              <td className="p-2">
                <label className="sr-only" htmlFor={`select-row-${row.id}`}>Select row</label>
                <input
                  type="checkbox"
                  id={`select-row-${row.id}`}
                  checked={selectedRows.includes(row.original.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows([...selectedRows, row.original.id]);
                    } else {
                      setSelectedRows(selectedRows.filter((id) => id !== row.original.id));
                    }
                  }}
                />
              </td>

              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <label htmlFor="status-update" className="sr-only">Update Status</label>
        <select
          id="status-update"
          onChange={(e) => handleStatusUpdate(e.target.value as Equipment['status'])}
          disabled={selectedRows.length === 0}
          className="p-2 border rounded"
        >
          <option value="">Update Status</option>
          <option value="Operational">Operational</option>
          <option value="Down">Down</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

    </div>
  );
};

export default EquipmentTable;