import axios from 'axios';

export async function updateAluno(props) {
    const {id, nome_aluno, telefone_aluno, nome_responsavel, telefone_responsavel, qtd_faltas} = props
    //console.log(turmaId, nome_aluno)
    try {
        const token = import.meta.env.VITE_Token; // Certifique-se de que VITE_Token está definido no .env
        if (!token) {
          throw new Error("Token não encontrado. Verifique suas configurações de ambiente.");
        }
    //const token = import.meta.env.VITE_Token;
    const response = await axios({
      method: "PATCH",
      url: `https://baserow.winikii.com/api/database/rows/table/25/${id}/?user_field_names=true`,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json"
    },
      data: {
        "nome_aluno": nome_aluno,
        "telefone_aluno": telefone_aluno,
        "nome_responsavel": nome_responsavel,
        "telefone_responsavel":telefone_responsavel,
        "qtd_faltas": qtd_faltas
    
    }
    });
    return response.data; // Retorna o resultado esperado
  } catch (error) {
    throw new Error(error);
    //console.error("Erro ao realizar cadastro:", error.message);
    //return null; // Retorna um valor seguro em caso de erro
  }
}
