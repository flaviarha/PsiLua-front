import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { requestService } from "../services/apiService";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Users, Mail, Phone, FileText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export const Pacientes = () => {
  const { user } = useAuth(); // Psicólogo logado
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // === CARREGA SOLICITAÇÕES RECEBIDAS ===
  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestService.getRequests("pendente");

      // Filtra apenas as solicitações destinadas ao psicólogo logado
      const myRequests = data.filter(
        (req) => req.preferred_psychologist === user.id
      );

      setRequests(myRequests);
    } catch (error) {
      toast.error("Erro ao carregar solicitações");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Recarrega ao voltar para a aba
  useEffect(() => {
    const handleFocus = () => loadRequests();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // === ACEITAR OU RECUSAR SOLICITAÇÃO ===
  const handleStatusChange = async (id, status) => {
    setProcessingId(id);
    try {
      await requestService.updateRequestStatus(id, status);
      toast.success(
        status === "aceito"
          ? "Paciente aceito com sucesso!"
          : "Solicitação recusada."
      );
      loadRequests(); // recarrega lista
    } catch  {
      toast.error("Erro ao atualizar status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6 bg-gradient-to-r min-h-screen space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-black" />
        <h1 className="text-3xl font-bold text-black">Solicitações de Pacientes</h1>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">
              Nenhuma solicitação pendente
            </h3>
            <p className="text-dark/70">
              Quando um paciente solicitar atendimento, aparecerá aqui.
            </p>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark">
                    {req.patient_name}
                  </h3>
                  <p className="text-sm text-dark/60">
                    Urgência:{" "}
                    <span
                      className={
                        req.urgency === "alta"
                          ? "text-red-600 font-medium"
                          : req.urgency === "media"
                          ? "text-yellow-600 font-medium"
                          : "text-green-600 font-medium"
                      }
                    >
                      {req.urgency}
                    </span>
                  </p>
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {req.patient_email}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {req.patient_phone}
                </p>
                <p className="flex items-center gap-1 md:col-span-2">
                  <FileText className="w-4 h-4" /> {req.description}
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-2">
                <Button
                  variant="secondary"
                  disabled={processingId === req.id}
                  className="flex-1"
                  onClick={() => handleStatusChange(req.id, "recusado")}
                >
                  Recusar
                </Button>

                <Button
                  loading={processingId === req.id}
                  disabled={processingId === req.id}
                  className="flex-1"
                  onClick={() => handleStatusChange(req.id, "aceito")}
                >
                  Aceitar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
