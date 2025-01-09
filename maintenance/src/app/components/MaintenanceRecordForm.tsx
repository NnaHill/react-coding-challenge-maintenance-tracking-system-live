"use client";

import React, { useState, useEffect } from 'react';
import { Equipment } from '../interfaces/equipmentInterface';
import { z } from 'zod';

//import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';


// Zod schema for form validation
const maintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, "Equipment selection is required"),
  date: z.date().max(new Date(), "Date cannot be in the future"),
  type: z.enum(['Preventive', 'Repair', 'Emergency']),
  technician: z.string().min(2, "Technician name must be at least 2 characters"),
  hoursSpent: z.number().positive().max(24, "Hours spent cannot exceed 24"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  partsReplaced: z.array(z.string()).optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  completionStatus: z.enum(['Complete', 'Incomplete', 'Pending Parts']),
});

type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

const MaintenanceRecordForm: React.FC = () => {
  const [formData, setFormData] = useState<MaintenanceRecordFormData>({
    equipmentId: '',
    date: new Date(),
    type: 'Preventive',
    technician: '',
    hoursSpent: 0,
    description: '',
    partsReplaced: [],
    priority: 'Low',
    completionStatus: 'Incomplete',
  });

  const [errors, setErrors] = useState<Partial<MaintenanceRecordFormData>>({});
  const [newPart, setNewPart] = useState<string>('');

  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);

  useEffect(() => {
    // This is where you'd typically fetch data from an API
    // For now, we'll use dummy data similar to what's in your page.tsx file
    const dummyEquipmentData: Equipment[] = [
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
      // ... add more equipment as needed
    ];

    setEquipmentOptions(dummyEquipmentData);
    console.log('Equipment options updated:', dummyEquipmentData); // Add this log
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'hoursSpent') {
      const hours = parseFloat(value);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        setErrors(prev => ({ ...prev, hoursSpent: "Invalid hours. Please enter a number between 0 and 24." }));
      } else {
        setErrors(prev => ({ ...prev, hoursSpent: undefined }));
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date' ? new Date(value) : name === 'hoursSpent' ? parseFloat(value) : value,
    }));
  };

  const handleAddPart = () => {
    if (newPart.trim()) {
      setFormData(prev => ({
        ...prev,
        partsReplaced: [...(prev.partsReplaced || []), newPart.trim()],
      }));
      setNewPart('');
    }
  };

  const handleRemovePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partsReplaced: prev.partsReplaced?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = maintenanceRecordSchema.parse(formData);
      console.log('Form submitted:', validatedData);
      // Here you would typically send the data to your backend
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<MaintenanceRecordFormData>);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="equipmentId" className="block">Equipment</label>
        <select
          id="equipmentId"
          name="equipmentId"
          value={formData.equipmentId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select Equipment</option>
          {equipmentOptions.map(equipment => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.name} - {equipment.serialNumber}
            </option>
          ))}
        </select>


        {errors.equipmentId && <p className="text-red-500">{errors.equipmentId}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.date && <p className="text-red-500">{errors.date.toString()}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Preventive">Preventive</option>
          <option value="Repair">Repair</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div>
        <label htmlFor="technician" className="block">Technician</label>
        <input
          type="text"
          id="technician"
          name="technician"
          value={formData.technician}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.technician && <p className="text-red-500">{errors.technician}</p>}
      </div>

      <div>
        <label htmlFor="hoursSpent" className="block">Hours Spent</label>
        <input
          type="number"
          id="hoursSpent"
          name="hoursSpent"
          value={formData.hoursSpent}
          onChange={handleChange}
          min="0"
          max="24"
          step="0.5"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.hoursSpent && <p className="text-red-500">{errors.hoursSpent}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
        ></textarea>
        {errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="partsReplaced" className="block">Parts Replaced</label>
        <div className="flex">
          <input
            type="text"
            id="partsReplaced"
            value={newPart}
            onChange={(e) => setNewPart(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={handleAddPart}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 list-disc list-inside">
          {formData.partsReplaced?.map((part, index) => (
            <li key={index} className="flex items-center">
              {part}
              <button
                type="button"
                onClick={() => handleRemovePart(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="priority" className="block">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="completionStatus" className="block">Completion Status</label>
        <select
          id="completionStatus"
          name="completionStatus"
          value={formData.completionStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Pending Parts">Pending Parts</option>
        </select>
      </div>

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
        Submit
      </button>
    </form>
  );
};

export default MaintenanceRecordForm;