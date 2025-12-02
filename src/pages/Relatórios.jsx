import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { reportService } from "../services/apiService";
import { Card } from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Gráficos
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Ícones
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export const Relatorios = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);

  useEffect(() => {
    if (!user?.id) return; // Evita chamadas antes da autenticação

    const loadReportsData = async () => {
      try {
        const data = await reportService.getPsychologistReport(user.id);
        setReportsData(data);
      } catch (error) {
        console.error("Erro ao carregar dados dos relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, [user?.id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!reportsData) return <div>Erro ao carregar dados</div>;

  const {
    stats = {},
    frequencyData = [],
    statusData = []
  } = reportsData;

  const COLORS = ["#9d7cc1", "#bca8db", "#7d5aa7", "#6a4c8a"];

  return (
    <div className="space-y-8">

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-dark">Relatórios e Analytics</h1>
        <p className="text-dark/60 text-lg mt-1">
          Estatísticas de atendimentos, pacientes e desempenho
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="text-center shadow-md rounded-xl p-6 bg-white">
          <Users className="w-8 h-8 text-[#9d7cc1] mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.activePatients ?? 0}
          </h3>
          <p className="text-gray-600 text-sm">Pacientes ativos</p>
        </Card>

        <Card className="text-center shadow-md rounded-xl p-6 bg-white">
          <Calendar className="w-8 h-8 text-[#9d7cc1] mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.totalSessions ?? 0}
          </h3>
          <p className="text-gray-600 text-sm">Sessões hoje</p>
        </Card>

        <Card className="text-center shadow-md rounded-xl p-6 bg-white">
          <TrendingUp className="w-8 h-8 text-[#9d7cc1] mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.attendanceRate ?? 0}%
          </h3>
          <p className="text-gray-600 text-sm">Taxa de conclusão</p>
        </Card>

        <Card className="text-center shadow-md rounded-xl p-6 bg-white">
          <AlertTriangle className="w-8 h-8 text-[#9d7cc1] mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.riskAlerts ?? 0}
          </h3>
          <p className="text-gray-600 text-sm">Alertas de risco</p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Frequência de Sessões */}
        <Card className="p-6 shadow-md rounded-xl bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Frequência de sessões
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#9d7cc1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status das Sessões */}
        <Card className="p-6 shadow-md rounded-xl bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Status das sessões
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
};
