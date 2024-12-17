import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { buscaAlunos } from '../Service/buscaAlunos';
import { addAluno } from '../Service/addAluno';
import { updateAluno } from '../Service/updateAluno';
import ModalDeleteAluno from '../Components/modalDeleteAluno';

async function getRows(turmaId) {
  const promise = await buscaAlunos(turmaId);

  if (!Array.isArray(promise.results) || promise.results.length === 0) {
    console.error('Nenhum dado encontrado ou a estrutura é inesperada');
    return [];
  }

  return promise.results.map((item) => ({
    id: item.id,
    nome_aluno: item.nome_aluno,
    telefone_aluno: item.telefone_aluno,
    nome_responsavel: item.nome_responsavel,
    telefone_responsavel: item.telefone_responsavel,
    qtd_faltas: item.qtd_faltas,
  }));
}

const NewTabela = ({ turmaId }) => {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false); // Modal de Adicionar/Editar
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false); // Modal de Exclusão
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [formData, setFormData] = React.useState({
    id: null,
    nome_aluno: '',
    telefone_aluno: '',
    nome_responsavel: '',
    telefone_responsavel: '',
    qtd_faltas: 0,
  });

  React.useEffect(() => {
    async function fetchData() {
      const fetchedRows = await getRows(turmaId);
      setRows(fetchedRows);
    }

    if (turmaId) {
      fetchData();
    }
  }, [turmaId]);

  const handleAddAluno = () => {
    setFormData({
      id: null,
      nome_aluno: '',
      telefone_aluno: '',
      nome_responsavel: '',
      telefone_responsavel: '',
      qtd_faltas: 0,
    });
    setOpen(true);
  };

  const handleEditClick = (row) => {
    setFormData(row);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedRowId(id);
    setOpenDeleteModal(true);
  };

  const handleSaveClick = () => {
    if (formData.id) {
      updateAluno({ ...formData, turmaId });
      setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
    } else {
      addAluno({ ...formData, turmaId });
      setRows([...rows, { ...formData, id: new Date().getTime() }]);
    }
    setOpen(false);
  };

  const handleCancelClick = () => {
    setOpen(false);
  };

  const handleDeleteSuccess = () => {
    setRows(rows.filter((row) => row.id !== selectedRowId));
    setOpenDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddAluno}>
          Adicionar Aluno
        </Button>
        {rows.map((row) => (
          <Accordion key={row.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{row.nome_aluno}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography><strong>Telefone do Aluno:</strong> {row.telefone_aluno}</Typography>
              <Typography><strong>Nome do Responsável:</strong> {row.nome_responsavel}</Typography>
              <Typography><strong>Telefone do Responsável:</strong> {row.telefone_responsavel}</Typography>
              <Typography><strong>Quantidade de Faltas:</strong> {row.qtd_faltas}</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClick(row)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(row.id)}
                >
                  Excluir
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialog para Adicionar/Editar Aluno */}
      <Dialog open={open} onClose={handleCancelClick}>
        <DialogTitle>{formData.id ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Aluno"
            name="nome_aluno"
            value={formData.nome_aluno}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Telefone do Aluno"
            name="telefone_aluno"
            type="number"
            value={formData.telefone_aluno}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nome do Responsável"
            name="nome_responsavel"
            value={formData.nome_responsavel}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Telefone do Responsável"
            name="telefone_responsavel"
            type="number"
            value={formData.telefone_responsavel}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantidade de Faltas"
            name="qtd_faltas"
            type="number"
            value={formData.qtd_faltas}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} color="primary">
            {formData.id ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Excluir */}
      <ModalDeleteAluno
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        selectedRowID={selectedRowId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
};

NewTabela.propTypes = {
  turmaId: PropTypes.string.isRequired,
};

export default NewTabela;
