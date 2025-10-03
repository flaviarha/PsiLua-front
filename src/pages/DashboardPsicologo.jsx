import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Calendar, Users, CheckCheck, Bell } from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const DashboardPsicologo = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [appointmentsData, patientsData, requestsData] = await Promise.all([
        mockApi.getAppointments(user.id, "psicologo"),
        mockApi.getPatients(user.id),
        mockApi.getRequests(user.id),
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // KPIs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return (
      appointmentDate.getTime() === today.getTime() &&
      apt.psychologistId === user.id &&
      apt.status === "agendado"
    );
  });

  const totalPatients = patients.length;
  const completedSessions = appointments.filter(
    (apt) => apt.status === "concluido" && apt.psychologistId === user.id
  ).length;
  const pendingSessions = appointments.filter(
    (apt) => apt.status === "agendado" && new Date(apt.date) >= new Date()
  ).length;
  const canceledSessions = appointments.filter(
    (apt) => apt.status === "cancelado" && apt.psychologistId === user.id
  ).length;

  const lastSession = appointments
    .filter((apt) => apt.status === "concluido" && apt.psychologistId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.date) >= new Date() &&
      apt.status === "agendado" &&
      apt.psychologistId === user.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br p-8 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

      {/* Cards KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-700" />
          <p className="text-2xl font-bold">{totalPatients}</p>
          <p className="text-gray-700">Pacientes ativos</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-700" />
          <p className="text-2xl font-bold">{todayAppointments.length}</p>
          <p className="text-gray-700">Sessões hoje</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <CheckCheck className="w-8 h-8 mx-auto mb-2 text-gray-700" />
          <p className="text-2xl font-bold">{completedSessions}</p>
          <p className="text-gray-700">Sessões concluídas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-700" />
          <p className="text-2xl font-bold">{pendingSessions}</p>
          <p className="text-gray-700">Sessões pendentes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <Bell className="w-8 h-8 mx-auto mb-2 text-red-500 rotate-45" />
          <p className="text-2xl font-bold">{canceledSessions}</p>
          <p className="text-gray-700">Sessões canceladas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold">
            {lastSession
              ? new Date(lastSession.date).toLocaleDateString("pt-BR")
              : "Nenhuma"}
          </p>
          <p className="text-gray-700">Última sessão</p>
        </div>
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <h2 className="text-lg font-medium text-gray-600 mb-5">
          Próximos agendamentos
        </h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-700">
            Nenhum agendamento futuro encontrado.
          </p>
        ) : (
          <ul className="space-y-2">
            {upcomingAppointments.map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId);
              return (
                <li
                  key={apt.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-800 font-medium">
                    {patient?.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(apt.date).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pacientes mais recentes */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-medium text-gray-600 mb-5">
          Pacientes recentes
        </h2>
        {patients.length === 0 ? (
          <p className="text-gray-700">Nenhum paciente encontrado.</p>
        ) : (
          <ul className="space-y-2">
            {patients
              .slice()
              .reverse()
              .slice(0, 5)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-800 font-medium">{p.name}</span>
                  <span className="text-sm text-gray-600">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("pt-BR")
                      : ""}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
