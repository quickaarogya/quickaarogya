import { initialMedicines } from '@/lib/mockData';
import MedicineDetailView from '../../medicines/[id]/MedicineDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PharmacyProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id || '';
  const medicineId = typeof rawId === 'string' ? decodeURIComponent(rawId) : Array.isArray(rawId) ? decodeURIComponent(rawId[0]) : '';
  const initialMed = initialMedicines.find(m => m.id.toLowerCase() === medicineId.toLowerCase()) || null;

  return <MedicineDetailView initialMedicine={initialMed} medicineId={medicineId} />;
}
