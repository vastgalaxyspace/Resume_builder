import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ResultsScreen } from "@/components/ResultsScreen";

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsScreen />
    </ProtectedRoute>
  );
}
