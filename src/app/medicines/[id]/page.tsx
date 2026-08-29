import { initialMedicines } from '@/lib/mockData';
import MedicineDetailView from './MedicineDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicineDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  console.log('[DEBUG] Resolved Params:', resolvedParams);
  const rawId = resolvedParams?.id || '';
  const medicineId = typeof rawId === 'string' ? decodeURIComponent(rawId) : Array.isArray(rawId) ? decodeURIComponent(rawId[0]) : '';
  const initialMed = initialMedicines.find(m => m.id.toLowerCase() === medicineId.toLowerCase()) || null;
  console.log('[DEBUG] Matched Med:', medicineId, initialMed?.brandName);

  return <MedicineDetailView initialMedicine={initialMed} medicineId={medicineId} />;
}
