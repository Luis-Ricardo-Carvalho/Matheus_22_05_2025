const fila = new FilaEncadeada();
const filaPrioritaria = new FilaEncadeada();
let cont = 0;

function addElemento(){
   const nome = document.getElementById("txtnovoNome");
    const cpf = document.getElementById("txtnovoCPF");
    const nascimento = document.getElementById("txtnovoData");
   // if(!minhaFila.isFull()){
       const novoAtendimento = new Atendimento();
         novoAtendimento.nome = nome.value;
         novoAtendimento.cpf = cpf.value;
         novoAtendimento.dataNascimento = calcularIdade(nascimento.value);
         novoAtendimento.data = obterDataAtual();
         novoAtendimento.hora = obterHoraAtual();

        if(calcularIdade(nascimento.value) >= 60){
          filaPrioritaria.enqueue(novoAtendimento);
          mostrarFilaPreferencial();
        }else{
          fila.enqueue(novoAtendimento);
          mostrarFila();
        }
       nome.value = ""; 
       cpf.value = "";
       nascimento.value = ""; 
       nome.focus(); 
   // } 
   // else
    //    alert("Fila cheia!");     
}// fim addElemento
//-----------------------------------
function atenderFila(){
   if(!fila.isEmpty() || !filaPrioritaria.isEmpty()){
      let pessoaAtendida = "";
      
      if(!filaPrioritaria.isEmpty() && cont <= 3){
      pessoaAtendida = filaPrioritaria.dequeue();
      mostrarFilaPreferencial();
      cont++;
      }else{
      pessoaAtendida = fila.dequeue();
      mostrarFila();
      cont = 0;
      }

      mostrarMensagemRemocao(pessoaAtendida);
      // Armazena o último atendido no localStorage
      localStorage.setItem('ultimoAtendido', pessoaAtendida.nome);
      //salvar no banco texto do navegador
   }
   else
      alert("Fila vazia!");
}
//--------------------------------------------------------------------------------------------
 function buscarCpf() {
    const cpf = document.getElementById("txtnovoCPF");
    let encontrou=false;
    let posicao=0;
    for (const item of fila) {
      posicao++;
      if (item.cpf===cpf.value) {
        encontrou=true;
        alert("CPF encontrado na fila! Posição: " + posicao);
      }
    }
    if(encontrou===false)
      alert("CPF não encontrado na fila!");
}
//--------------------------------------------------------------------------------------------
function mostrarMensagemRemocao(pessoaAtendida) {
    const mensagem = document.getElementById("mensagem-remocao");
    mensagem.innerText ="Chamando para ser atendido(a): "+ pessoaAtendida.nome + ", chegou às " + pessoaAtendida.hora + " está sendo atendido(a) às " + obterHoraAtual()+ ". Tempo de espera: "+calcularDiferencaHoras(pessoaAtendida.hora, obterHoraAtual());
    mensagem.style.display = "block";
}
//--------------------------------------------------------------------------------------------
 // Função para atualizar a exibição da fila
 function mostrarFila() {
      const lblPessoasFila = document.getElementById("lblPessoasFila");
      const listaPessoasFila = document.getElementById("listFila");
      // listaPessoasFila.innerText = minhaFila.toString;
      lblPessoasFila.innerText = "Pessoas na fila:";
      listaPessoasFila.innerText = "";
      for (const item of fila){
            const li = document.createElement("li");
            li.innerText = item.toString();
            listaPessoasFila.appendChild(li);
      }
    }
//--------------------------------------------------------------------------------------------
 // Função para atualizar a exibição da fila Preferencial
 function mostrarFilaPreferencial() {
  const lblPessoasFila = document.getElementById("lblPessoasFilaPreferencial");
  const listaPessoasFila = document.getElementById("listFilaPreferencial");
  // listaPessoasFila.innerText = minhaFila.toString;
  lblPessoasFila.innerText = "Pessoas na fila Preferencial:";
  listaPessoasFila.innerText = "";
  for (const item of filaPrioritaria){
        const li = document.createElement("li");
        li.innerText = item.toString();
        listaPessoasFila.appendChild(li);
  }
}
//--------------------------------------------------------------------------------------------
 // funcao data
 function obterDataAtual() {
    let dataAtual = new Date();
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth() + 1; // Adiciona 1 porque o mês inicia do zero
    let ano = dataAtual.getFullYear();
    // Formata a data como "dd/mm/aaaa"
    let dataFormatada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    return dataFormatada;
}
//--------------------------------------------------------------------------------------------
function obterHoraAtual() {
  const data = new Date();
  const hora = data.getHours().toString().padStart(2, '0');
  const minuto = data.getMinutes().toString().padStart(2, '0');
  const segundo = data.getSeconds().toString().padStart(2, '0');
  return `${hora}:${minuto}:${segundo}`;
}
//--------------------------------------------------------------------------------------------
function calcularDiferencaHoras(hora1, hora2) {
  const [h1, m1, s1] = hora1.split(':').map(Number);
  const [h2, m2, s2] = hora2.split(':').map(Number);
  
  const diferencaSegundos = (h2 * 3600 + m2 * 60 + s2) - (h1 * 3600 + m1 * 60 + s1);
  
  const horas = Math.floor(diferencaSegundos / 3600);
  const minutos = Math.floor((diferencaSegundos % 3600) / 60);
  const segundos = diferencaSegundos % 60;
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function calcularIdade(dataNascimento) {
  // Espera data no formato "dd/mm/aaaa"
  const [dia, mes, ano] = dataNascimento.split('/').map(Number);

  const hoje = new Date();
  const dataNasc = new Date(ano, mes - 1, dia); // Mês começa em 0 no JavaScript

  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();

  // Verifica se a pessoa ainda não fez aniversário neste ano
  if (mesAtual < mes - 1 || (mesAtual === mes - 1 && diaAtual < dia)) {
    idade--;
  }

  return idade;
}
