import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Box,
  Button,
  Modal,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { buscaAlunos } from '../../Service/buscaAlunos';
import insertNotas from '../../Service/insertNotas';
import { buscaNotas } from '../../Service/buscaNotas';

const actions = [
  'Busca ativa',
  'Falta de respeito com o professor',
  'Falta de respeito com os colegas',
  'Falta de respeito com os funcionários',
  'Comportamente inadequado',
  'Uso de palavras de baixo calão',
  'Uso indevido do celular',
  'Uso constante do celular',
  'Uso do celular na prova',
  'Não trouxe material',
  'Se nega a fazer a atividade',
  'Conversa excessiva',
  'Realizou Bulling com o colega',
  'Sofreu Bulling de um colega',
  'Conflito com os colegas',
  'Preconceito com os colegas',
  'Sofreu preconceito',
  'Uso de bebida alcoólica',
  'Uso de drogas',
  'Uso de cigarro',
  'Trouxe armas',
  'Trouxe material prejudicial',
  'Outro',
];

async function insertNotasDiario(turmaId, notas) {
  const insert = await insertNotas(turmaId, notas);
  return insert;
}
async function getBoard(alunoId) {
    const promise = await buscaNotas(alunoId);
    if (!Array.isArray(promise.results) || promise.results.length === 0) {
        console.error('Nenhum dado encontrado ou a estrutura é inesperada');
        return [];
    }
    
    return promise.results.map((item) => ({
        id: item.id,
        data: item.data_nota,
        tipoDemanda: item.demanda,
        profissional: item.profissional,
        descricao: item.nota,
    }));
}

async function getAlunos(turmaId) {
  const promise = await buscaAlunos(turmaId);

  if (!Array.isArray(promise.results) || promise.results.length === 0) {
    console.error('Nenhum dado encontrado ou a estrutura é inesperada');
    return [];
  }

  return promise.results.map((item) => ({
    id: item.id,
    nome_aluno: item.nome_aluno,
  }));
}

const DiarioDeBordo = ({ turmaId }) => {
  const [rows, setRows] = useState([]);
  const [notas, setNotas] = useState({ registro: {} });
  const [board, setBoard] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para armazenar erros

  useEffect(() => {
    async function fetchData() {
      const fetchedRows = await getAlunos(turmaId);
      const fetchedDoard = await getBoard(fetchedRows[0].id);
      setBoard(fetchedDoard);
      setRows(fetchedRows);
      
    }
    if (turmaId) {
      fetchData();
    }
  }, [turmaId]);

  const updateNota = (field, value) => {
    setNotas((prevNotas) => ({
      ...prevNotas,
      registro: {
        ...prevNotas.registro,
        [field]: value,
      },
    }));
  };

  // Função para validar os campos obrigatórios
  const validateFields = () => {
    const currentErrors = {};
    const { data, tipoDemanda, profissional, descricao } = notas.registro;

    // Verifica cada campo e adiciona erro se estiver vazio
    if (!data) currentErrors.data = 'A data é obrigatória.';
    if (!tipoDemanda) currentErrors.tipoDemanda = 'O tipo de demanda é obrigatório.';
    if (!profissional) currentErrors.profissional = 'O profissional é obrigatório.';
    if (!descricao) currentErrors.descricao = 'A descrição é obrigatória.';

    setErrors(currentErrors); // Atualiza o estado de erros
    return Object.keys(currentErrors).length === 0; // Retorna true se não houver erros
  };

  const handleSaveNota = async () => {
    if (!validateFields()) return; // Impede o salvamento se houver erros

    await insertNotasDiario(turmaId, notas.registro);
   
    setModalOpen(false);
  };

  const openModal = (aluno) => {
    setSelectedAluno(aluno);
    setNotas((prevNotas) => ({
      ...prevNotas,
      registro: {
        ...prevNotas.registro,
        id: aluno.id,
      },
    }));
    setErrors({}); // Limpa os erros ao abrir o modal
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAluno(null);
    setModalOpen(false);
  };

  return (
    <>
     


      {rows.map((row) => (
        <Accordion key={row.id} sx={{ marginBottom: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{row.nome_aluno}</Typography>
          </AccordionSummary>
          {<Box sx={{ marginBottom: 2 }}>
                {board.map((item) =>(
                    <Box key={item.id} sx={{ m: 2, bgcolor: '#cbf6f573' }}>
                    <Typography >{`Data: ${dayjs(item.data).format('DD/MM/YYYY')} `}</Typography>
                    <Typography >{`Demanda: ${item.tipoDemanda} `}</Typography>
                    <Typography >{`Profissional: ${item.profissional} `}</Typography>
                    <Typography >{`Descrição: ${item.descricao} `}</Typography>
                    </Box>
                ))}   
          </Box>}   
          <AccordionDetails>
            <Box>
              <Button variant="outlined" onClick={() => openModal(row)}>
                Adicionar nota
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedAluno && (
            <>
              <Typography variant="h6" marginBottom={2}>
                Nota para {selectedAluno.nome_aluno}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data"
                  value={dayjs(notas.registro.data, 'DD/MM/YYYY') || dayjs()}
                  onChange={(newValue) =>
                    updateNota('data', newValue ? dayjs(newValue).format('DD/MM/YYYY') : '')
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.data} // Exibe erro se necessário
                      helperText={errors.data} // Mensagem de erro
                    />
                  )}
                />
              </LocalizationProvider>
              <Autocomplete
                sx={{ marginTop: 1 }}
                options={actions}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de Demanda"
                    variant="outlined"
                    error={!!errors.tipoDemanda}
                    helperText={errors.tipoDemanda}
                  />
                )}
                onChange={(e, newValue) => updateNota('tipoDemanda', newValue)}
                value={notas.registro.tipoDemanda || ''}
              />
              <TextField
                label="Profissional"
                multiline
                rows={1}
                variant="outlined"
                fullWidth
                margin="normal"
                value={notas.registro.profissional || ''}
                onChange={(e) => updateNota('profissional', e.target.value)}
                error={!!errors.profissional}
                helperText={errors.profissional}
              />
              <TextField
                label="Descrição"
                multiline
                rows={3}
                variant="outlined"
                fullWidth
                margin="normal"
                value={notas.registro.descricao || ''}
                onChange={(e) => updateNota('descricao', e.target.value)}
                error={!!errors.descricao}
                helperText={errors.descricao}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveNota}
                fullWidth
              >
                Salvar Nota
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

DiarioDeBordo.propTypes = {
  turmaId: PropTypes.number.isRequired,
};

export default DiarioDeBordo;
