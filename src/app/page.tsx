import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UploadScreen } from '@/components/UploadScreen';

export default function Home() {
  return (
    <ProtectedRoute>
      <UploadScreen />
    </ProtectedRoute>
  );
}
