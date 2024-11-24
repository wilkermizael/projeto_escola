import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import TypebotBubble from "../../Components/TypebotBubble";

const Painel = () => {
  const [turmas, setTurmas] = useState({
    601: { nome: "Turma 601", alunos: [] },
    701: { nome: "Turma 701", alunos: [] },
    801: { nome: "Turma 801", alunos: [] },
    901: { nome: "Turma 901", alunos: [] },
  });

  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [nomeTurma, setNomeTurma] = useState("");
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    telefone: "",
    nomeResponsavel: "",
    telefoneResponsavel: "",
  });
  const [alunoEdicao, setAlunoEdicao] = useState(null);

  const [menuTurmaAnchorEl, setMenuTurmaAnchorEl] = useState(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [menuAlunoAnchorEl, setMenuAlunoAnchorEl] = useState(null);

  // Função para adicionar nova turma
  const adicionarTurma = () => {
    if (nomeTurma) {
      const novaTurma = {
        nome: nomeTurma,
        alunos: [],
      };
      const idTurma = Date.now(); // Gerar um ID único para a nova turma
      setTurmas({ ...turmas, [idTurma]: novaTurma });
      setNomeTurma(""); // Limpar o campo após adicionar
    }
  };

  const handleOpenTurmaMenu = (event, turmaId) => {
    setTurmaSelecionada(turmaId);
    setMenuTurmaAnchorEl(event.currentTarget);
  };

  const handleCloseTurmaMenu = () => {
    setMenuTurmaAnchorEl(null);
    setTurmaSelecionada(null);
  };

  const handleOpenAlunoMenu = (event, aluno) => {
    setAlunoSelecionado(aluno);
    setMenuAlunoAnchorEl(event.currentTarget);
  };

  const handleCloseAlunoMenu = () => {
    setMenuAlunoAnchorEl(null);
    setAlunoSelecionado(null);
  };

  const salvarAluno = () => {
    if (novoAluno.nome && novoAluno.telefone) {
      const turmaAtual = turmas[turmaSelecionada];
      if (alunoEdicao) {
        const index = turmaAtual.alunos.findIndex(
          (aluno) => aluno.nome === alunoEdicao.nome
        );
        turmaAtual.alunos[index] = novoAluno; // Atualiza os dados do aluno
      } else {
        turmaAtual.alunos.push(novoAluno); // Adiciona novo aluno
      }
      setTurmas({ ...turmas, [turmaSelecionada]: turmaAtual });
      setNovoAluno({
        nome: "",
        telefone: "",
        nomeResponsavel: "",
        telefoneResponsavel: "",
      });
      setAlunoEdicao(null); // Limpa o estado de edição
    }
  };

  // Função para excluir a turma
  const excluirTurma = (turmaId) => {
    const novasTurmas = { ...turmas };
    delete novasTurmas[turmaId];
    setTurmas(novasTurmas);
    setTurmaSelecionada(null); // Reseta a seleção da turma
  };

  // Função para excluir aluno
  const excluirAluno = (alunoNome) => {
    const turmaAtual = turmas[turmaSelecionada];
    turmaAtual.alunos = turmaAtual.alunos.filter(
      (aluno) => aluno.nome !== alunoNome
    );
    setTurmas({ ...turmas, [turmaSelecionada]: turmaAtual });
    setAlunoSelecionado(null); // Limpa a seleção do aluno
    setMenuAlunoAnchorEl(null); // Fecha o menu
  };

  // Função para editar nome da turma
  const editarTurma = () => {
    if (nomeTurma) {
      const turmaAtual = turmas[turmaSelecionada];
      turmaAtual.nome = nomeTurma;
      setTurmas({ ...turmas, [turmaSelecionada]: turmaAtual });
      setNomeTurma("");
      setMenuTurmaAnchorEl(null); // Fecha o menu após editar
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", gap: 2 }}>
      {/* Lado esquerdo - Lista de Turmas */}
      <Box
        sx={{
          width: "30%",
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Turmas
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {Object.keys(turmas).map((turmaId) => (
            <ListItem
              button
              key={turmaId}
              onClick={() => setTurmaSelecionada(turmaId)}
              selected={turmaId === turmaSelecionada}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              <ListItemText primary={turmas[turmaId].nome} />
              <IconButton onClick={(e) => handleOpenTurmaMenu(e, turmaId)}>
                <Edit />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="Nome da nova turma"
            value={nomeTurma}
            onChange={(e) => setNomeTurma(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button onClick={adicionarTurma} sx={{ ml: 1 }} startIcon={<Add />}>
            Adicionar
          </Button>
        </Box>

        {turmaSelecionada && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              label="Editar nome da turma"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button onClick={editarTurma} sx={{ ml: 1 }}>
              Salvar
            </Button>
          </Box>
        )}
      </Box>

      {/* Lado direito - Alunos da turma */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {turmaSelecionada
            ? `Alunos da Turma ${turmas[turmaSelecionada].nome}`
            : "Selecione uma turma"}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {turmaSelecionada ? (
          <>
            <List>
              {turmas[turmaSelecionada].alunos.map((aluno, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={(event) => handleOpenAlunoMenu(event, aluno)}
                >
                  <ListItemText
                    primary={`${aluno.nome} - ${aluno.telefone}`}
                    secondary={`Responsável: ${aluno.nomeResponsavel} - ${aluno.telefoneResponsavel}`}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Nome do aluno"
                value={novoAluno.nome}
                onChange={(e) =>
                  setNovoAluno({ ...novoAluno, nome: e.target.value })
                }
                sx={{ width: "100%", mb: 2 }}
              />
              <TextField
                label="Telefone do aluno"
                value={novoAluno.telefone}
                onChange={(e) =>
                  setNovoAluno({ ...novoAluno, telefone: e.target.value })
                }
                sx={{ width: "100%", mb: 2 }}
              />
              <TextField
                label="Nome do responsável"
                value={novoAluno.nomeResponsavel}
                onChange={(e) =>
                  setNovoAluno({
                    ...novoAluno,
                    nomeResponsavel: e.target.value,
                  })
                }
                sx={{ width: "100%", mb: 2 }}
              />
              <TextField
                label="Telefone do responsável"
                value={novoAluno.telefoneResponsavel}
                onChange={(e) =>
                  setNovoAluno({
                    ...novoAluno,
                    telefoneResponsavel: e.target.value,
                  })
                }
                sx={{ width: "100%", mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={salvarAluno}
                sx={{ width: "100%" }}
              >
                Salvar
              </Button>
            </Box>
          </>
        ) : (
          <TypebotBubble/>
        )}
      </Box>

      {/* Menu de ações da turma */}
      <Menu
        anchorEl={menuTurmaAnchorEl}
        open={Boolean(menuTurmaAnchorEl)}
        onClose={handleCloseTurmaMenu}
      >
        <MenuItem onClick={() => excluirTurma(turmaSelecionada)}>
          <Delete sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Menu de ações do aluno */}
      <Menu
        anchorEl={menuAlunoAnchorEl}
        open={Boolean(menuAlunoAnchorEl)}
        onClose={handleCloseAlunoMenu}
      >
        <MenuItem onClick={() => excluirAluno(alunoSelecionado.nome)}>
          <Delete sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>
      <TypebotBubble/>
    </Box>
  );
};

export default Painel;
