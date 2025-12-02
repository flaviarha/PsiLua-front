// ===== IMPORTS =====
// MOTIVO: Importamos apenas o que precisamos para manter o bundle pequeno e organizado
// Hooks do React para gerenciamento de estado e efeitos colaterais
// PORQUE: useState permite controlar dados que mudam (psicólogo selecionado, texto digitado)
// PORQUE: useEffect executa código quando o componente é criado (carregar lista de psicólogos)
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { psychologistService, requestService } from '../services/apiService';
import {Card} from '../components/Card';
import {Button} from '../components/Button';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

export const Agendamento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPsychologist, setSelectedPsychologist] = useState('');
  const [psychologists, setPsychologists] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    description: '',
    urgency: 'media'
  });
  useEffect(() => {
    loadPsychologists();
  }, []);
 
  const loadPsychologists = async () => {
    try {
      const data = await psychologistService.getPsychologists();
      setPsychologists(data);
    } catch {
      toast.error('Erro ao carregar psicólogos:');
    }
  };
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPsychologist || !requestData.description) {
      toast.error('Selecione um psicólogo e descreva sua necessidade');
      return; 
    }
    setSubmitting(true);
    try {
      await requestService.createRequest({
        patient_id: user.id,     
        patient_name: user.name,
        patient_email: user.email,
        patient_phone: user.phone,
        preferred_psychologist: parseInt(selectedPsychologist),
        description: requestData.description,
        urgency: requestData.urgency,
        preferred_dates: [],// Pode ser expandido futuramente
        preferred_times: []
      });
      toast.success('Solicitação enviada! O psicólogo avaliará e entrará em contato se aceitar você como paciente.');
      navigate('/dashboard');
    } catch {
      toast.error('Erro ao enviar solicitação');
    } finally {
      setSubmitting(false);
    }
  };
 
  // ===== RENDERIZAÇÃO (JSX) =====
  // CONCEITO: JSX = JavaScript + XML, permite escrever HTML dentro do JavaScript
  // PROCESSO: React converte JSX em elementos DOM reais
  return (
    // ===== CONTAINER PRINCIPAL =====
    // LAYOUT: Centraliza conteúdo e limita largura para melhor legibilidade
    // max-w-2xl: largura máxima de 672px (responsivo)
    // mx-auto: margin horizontal automática (centraliza)
    // space-y-6: espaçamento vertical de 1.5rem entre filhos diretos
    // PORQUE: Design responsivo que funciona bem em desktop e mobile
    <div className="max-w-2xl mx-auto space-y-6">
 
      {/* ===== CABEÇALHO DA PÁGINA ===== */}
      {/* HIERARQUIA VISUAL: Título grande + subtítulo menor */}
      {/* CENTRALIZAÇÃO: text-center alinha todo o conteúdo ao centro */}
      <div className="text-left h-full">
        {/* TÍTULO PRINCIPAL */}
        {/* SEMÂNTICA: h1 indica o título mais importante da página */}
        {/* ESTILO: text-3xl (30px), font-bold (700), text-dark (cor customizada) */}
        {/* ESPAÇAMENTO: mb-2 (margin-bottom 0.5rem) */}
        <h1 className="text-4xl font-bold text-dark mb-1">Solicitar ser Paciente</h1>
 
        {/* SUBTÍTULO EXPLICATIVO */}
        {/* CONTRASTE: text-dark/70 = cor escura com 70% de opacidade */}
        {/* PORQUE: Hierarquia visual - menos importante que o título */}
        <p className="text-x1 text-dark/70">Escolha um psicólogo e descreva sua necessidade de atendimento</p>
      </div>
 
      {/* ===== CARD PRINCIPAL COM FORMULÁRIO ===== */}
      {/* COMPONENTE REUTILIZÁVEL: Card aplica estilos consistentes */}
      {/* GLASSMORPHISM: Efeito visual moderno com transparência e blur */}
      {/* PORQUE: Agrupa visualmente o formulário e melhora a hierarquia */}
      <Card>
        {/* ===== FORMULÁRIO HTML ===== */}
        {/* EVENT BINDING: onSubmit conecta evento HTML com função JavaScript */}
        {/* LAYOUT: space-y-6 = espaçamento vertical de 1.5rem entre campos */}
        {/* PORQUE: Organização visual clara entre diferentes seções */}
        <form onSubmit={handleRequestSubmit} className="space-y-6">
 
          {/* ===== CAMPO 1: SELETOR DE PSICÓLOGO ===== */}
          {/* ===== CAMPO 1: SELETOR DE PSICÓLOGO ===== */}
          <SeletorDePsicologos
            psychologists={psychologists}
            value={selectedPsychologist}
            onChange={(e) => setSelectedPsychologist(e.target.value)}
          />
 
 
          {/* ===== CAMPO 2: DESCRIÇÃO DA NECESSIDADE ===== */}
          <CampoDeDescricao
            valor={requestData.description}
            onChange={(novoValor) => setRequestData({ ...requestData, description: novoValor })}
          />
 
          {/* ===== CAMPO 3: NÍVEL DE URGÊNCIA ===== */}
          <div>
            {/* LABEL SIMPLES */}
            {/* SEM ASTERISCO: Campo opcional, tem valor padrão */}
            <label className="block text-lg font-medium text-dark mb-3">
              Nível de Urgência
            </label>
 
            {/* SELECT COM OPÇÕES PRÉ-DEFINIDAS */}
            {/* VALORES CONTROLADOS: baixa/media/alta para padronização */}
            {/* PADRÃO: 'media' definido no estado inicial */}
            {/* PORQUE: Ajuda psicólogo a priorizar solicitações */}
            <select
              value={requestData.urgency}  // Valor atual (padrão: 'media')
              onChange={(e) => setRequestData({ ...requestData, urgency: e.target.value })}  // Atualiza só urgency
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-light"
            >
              {/* OPÇÕES COM DESCRIÇÕES CLARAS */}
              {/* PORQUE: Usuário entende exatamente o que cada nível significa */}
              <option value="baixa">Baixa - Posso aguardar</option>
              <option value="media">Média - Prefiro em breve</option>
              <option value="alta">Alta - Preciso urgentemente</option>
            </select>
          </div>
 
          {/* ===== CARD INFORMATIVO CONDICIONAL ===== */}
          <CardDeInformacao
            psicologo={psychologists.find(p => p.id === parseInt(selectedPsychologist))}
          />
 
          {/* ===== ÁREA DE BOTÕES ===== */}
          {/* LAYOUT FLEXÍVEL: Botões lado a lado com espaçamento igual */}
          {/* gap-4: espaçamento de 1rem entre botões */}
          <div className="flex gap-4">
 
            {/* BOTÃO CANCELAR */}
            {/* type="button": previne submit do formulário */}
            {/* variant="secondary": estilo visual menos destacado */}
            {/* onClick: navegação programática sem submit */}
            {/* flex-1: ocupa metade do espaço disponível */}
            {/* PORQUE: Sempre dar opção de sair sem salvar */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}  // Volta para dashboard
              className="flex-1"
            >
              Cancelar
            </Button>
 
            {/* BOTÃO ENVIAR */}
            {/* type="submit": dispara evento onSubmit do form */}
            {/* loading: mostra spinner e desabilita durante envio */}
            {/* disabled: desabilita se campos obrigatórios estão vazios */}
            {/* LÓGICA: !selectedPsychologist OR !description = botão desabilitado */}
            {/* PORQUE: Previne envio de dados incompletos */}
            <Button
              type="submit"
              loading={submitting}  // Estado de carregamento
              className="flex-1"
              disabled={!selectedPsychologist || !requestData.description}  // Validação visual
            >
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
 