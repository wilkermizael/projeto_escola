import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Checkbox, Typography, Avatar, Switch } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { buscaAlunos } from "../Service/buscaAlunos";

const Chamada = ({ turmaId }) => {
  const [alunos, setAlunos] = useState([]);
  const [presenca, setPresenca] = useState({});
  const [todosSelecionados, setTodosSelecionados] = useState(true);

  // Busca alunos no banco de dados ao carregar o componente
  useEffect(() => {
    const fetchAlunos = async () => {
      const response = await buscaAlunos(turmaId);
      if (response && response.results) {
        setAlunos(response.results);
        const estadoInicialPresenca = response.results.reduce(
          (estado, aluno) => ({ ...estado, [aluno.id]: true }),
          {}
        );
        setPresenca(estadoInicialPresenca);
      }
    };

    if (turmaId) fetchAlunos();
  }, [turmaId]);

  const handleToggleTodos = (event) => {
    const selecionado = event.target.checked;
    setTodosSelecionados(selecionado);

    // Atualiza todos os estados de presença
    setPresenca((prev) =>
      Object.keys(prev).reduce(
        (estado, id) => ({ ...estado, [id]: selecionado }),
        {}
      )
    );
  };

  const handleCheckPresenca = (id) => {
    setPresenca((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 2,
        bgcolor: "#f8f9fa",
        padding: 2,
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mr: 1 }}
      >
        <Typography variant="h6" fontWeight="500">
          Lista de Chamada
        </Typography>
        <Switch checked={todosSelecionados} onChange={handleToggleTodos} />
      </Stack>
      {alunos.map((aluno) => (
        <Stack
          key={aluno.id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: 2,
            borderRadius: 1,
            bgcolor: "#ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#f1f3f5",
            },
          }}
        >
          {/* Nome do Aluno */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#007bff", width: 32, height: 32 }}>
              <PersonIcon sx={{ color: "#ffffff" }} />
            </Avatar>
            <Typography variant="body1" fontWeight="500" sx={{ color: "#343a40" }}>
              {aluno.nome_aluno}
            </Typography>
          </Box>
          {/* Checkbox de presença */}
          <Checkbox
            checked={presenca[aluno.id]}
            onChange={() => handleCheckPresenca(aluno.id)}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
          />
        </Stack>
      ))}
    </Box>
  );
};


Chamada.propTypes = {
    turmaId: PropTypes.string.isRequired,
   
  };
export default Chamada;
