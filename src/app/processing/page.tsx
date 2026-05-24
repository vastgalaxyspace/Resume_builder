import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProcessingScreen } from "@/components/ProcessingScreen";

export default function ProcessingPage() {
  return (
    <ProtectedRoute>
      <ProcessingScreen />
    </ProtectedRoute>
  );
}
