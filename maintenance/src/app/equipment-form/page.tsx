import EquipmentForm from '../components/EquipmentForm';
import EquipmentTable from '../equipment-table/page';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment Management</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Equipment</h2>
        <EquipmentForm />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Equipment List</h2>
        <EquipmentTable />
      </section>
    </main>
  );
}
