import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Users, Mail, Phone, Calendar, Activity } from 'lucide-react';

export const Pacientes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getPatients(user.id);
      console.log('Pacientes carregados:', data); // Debug
      setPatients(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [user.id]);

  // Recarrega quando a página volta a ficar visível
  useEffect(() => {
    const handleFocus = () => loadPatients();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6 bg-gradient-to-r min-h-screen space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-black" />
        <h1 className="text-3xl font-bold text-black">Meus Pacientes</h1>
      </div>

      <div className="grid gap-6">
        {patients.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Nenhum paciente encontrado</h3>
            <p className="text-dark/70">Seus pacientes aparecerão aqui conforme os agendamentos.</p>
          </Card>
        ) : (
          patients.map(patient => (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-lg transition-shadow p-6"
              onClick={() => navigate(`/pacientes/${patient.id}`)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark">{patient.name}</h3>
                    <p className="text-sm text-dark/60">Paciente #{patient.id}</p>
                  </div>
                </div>

                {/* Informações detalhadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><strong>Idade:</strong> {patient.age || "Não informado"}</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {patient.birthDate || "00/00/0000"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {patient.phone || "Não informado"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {patient.email || "Não informado"}
                  </p>
                  <p><strong>Total de sessões:</strong> {patient.totalSessions || 0} sessões</p>
                  <p className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    <span
                      className={
                        patient.status === "Em tratamento"
                          ? "text-green-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      {patient.status || "Não definido"}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
