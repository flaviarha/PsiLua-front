import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CheckCircle } from "lucide-react";

export const Solicitacoes = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [user.id]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getRequests(user.id);
      setRequests(data);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  // Separar solicitações
  const pendentes = requests.filter((r) => r.status === "pendente");
  const historico = requests.filter((r) => r.status !== "pendente");

  return (
    <div className="min-h-screen bg-gradient-to-r p-8 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Solicitações de atendimento
      </h1>

      {/* Pendentes */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-gray-600">⏺ Pendentes ({pendentes.length})</span>
        </h2>

        {pendentes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-gray-700">Nenhuma solicitação pendente</p>
          </div>
        ) : (
          pendentes.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-medium text-gray-900">{req.patientName}</p>
                <p className="text-sm text-gray-600">{req.patientEmail}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                Pendente
              </span>
            </div>
          ))
        )}
      </div>

      {/* Histórico */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-3">
          Histórico ({historico.length})
        </h2>

        {historico.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center mb-3"
          >
            <div>
              <p className="font-medium text-gray-900">{req.patientName}</p>
              <p className="text-sm text-gray-600">{req.patientEmail}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {req.status === "aceito" ? "Aceito" : "Rejeitado"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
