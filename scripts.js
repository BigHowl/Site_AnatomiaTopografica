

//  saudação com nome persistente

// localStorage é uma memória do navegador.
// Ela guarda informações mesmo trocando de página.
// localStorage.getItem('chave') → lê um valor salvo
// localStorage.setItem('chave', valor) → salva um valor

function iniciarSaudacao() {

  // Tenta recuperar um nome já salvo de uma visita anterior
  var nomeSalvo = localStorage.getItem('nomeAluno');

  if (!nomeSalvo) {
    // Primeira visita: pergunta o nome
    var nome = prompt("Olá! Qual é o seu nome?");

    if (!nome || nome.trim() === "") {
      nome = "Visitante";
    }

    // Salva no navegador para usar nas outras páginas
    localStorage.setItem('nomeAluno', nome);
    nomeSalvo = nome;
  }

  // Preenche o <h2> com o nome
  var titulo = document.getElementById("titulo-boas-vindas");
  if (titulo) {
    // O 'if' evita erro nas outras páginas que não têm esse <h2>
    titulo.textContent = "Olá, seja bem-vindo(a), " + nomeSalvo + "!";
  }
}

// Chama a função assim que o script carrega
iniciarSaudacao();



//  navegação por abas
// (só usada nas páginas que têm abas internas)

function mostrarSecao(idSecao, botaoClicado) {
  document.querySelectorAll('.secao').forEach(function(secao) {
    secao.classList.remove('ativa');
  });

  document.querySelectorAll('.tabs-nav button').forEach(function(btn) {
    btn.classList.remove('ativa');
  });

  document.getElementById(idSecao).classList.add('ativa');
  botaoClicado.classList.add('ativa');
}



//  mostrar/esconder dica

function mostrarDica(idDica) {
  var dica = document.getElementById(idDica);
  dica.classList.toggle('visivel');
}



//  limpar campos de um exercício

function limparExercicio() {
  for (var i = 0; i < arguments.length; i++) {
    var elemento = document.getElementById(arguments[i]);
    if (!elemento) continue;

    if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
      elemento.value = '';
    }
    if (elemento.classList.contains('feedback')) {
      elemento.classList.remove('visivel', 'correto', 'errado');
      elemento.textContent = '';
    }
    if (elemento.classList.contains('dica')) {
      elemento.classList.remove('visivel');
    }
  }
}



//  comparar resposta com gabarito
// Remove acentos para comparação mais tolerante

function compararResposta(resposta, gabarito) {
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  for (var i = 0; i < gabarito.length; i++) {
    if (normalizar(resposta) === normalizar(gabarito[i])) {
      return true;
    }
  }
  return false;
}



//  mostrar feedback de acertos

function mostrarFeedback(idFeedback, acertos, total) {
  var feedback = document.getElementById(idFeedback);

  if (acertos === total) {
    feedback.className = 'feedback correto visivel';
    feedback.textContent = '✓ Parabéns! Todas as ' + total + ' respostas estão corretas.';
  } else {
    feedback.className = 'feedback errado visivel';
    feedback.textContent = '✗ ' + acertos + ' de ' + total + ' corretas. Revise e tente novamente.';
  }
}

// ==============================================
// AUTO-EXPAND nos textareas
// Faz o campo crescer conforme o usuário digita,
// igual ao campo de texto do Claude.
//
// document.querySelectorAll pega TODOS os
// textareas da página de uma vez.
// forEach percorre cada um e adiciona o evento.
// ==============================================
document.querySelectorAll('textarea').forEach(function(textarea) {

  // Quando o usuário digitar qualquer coisa:
  textarea.addEventListener('input', function() {

    // Reset da altura para recalcular corretamente
    // (necessário para quando o usuário apaga texto)
    this.style.height = 'auto';

    // Define a altura igual ao conteúdo interno
    this.style.height = this.scrollHeight + 'px';
  });
});

/* Para salvar e restaurar o progresso nos exercícios, o raciocínio está relacionado ao id de cada exercício.*/

function salvarCampo(elemento){
  var chave = window.location.pathname + '_' + elemento.id; 
  localStorage.setItem(chave, elemento.value);
  atualizarProgresso();
}

// Restaurar campos ao carregar a página

function restaurarProgresso(){
  var campos = document.querySelectorAll('input[type=“text”, textarea');
  campos.forEach(function(campo){
    var chave = window.location.pathname + '_' + campo.id;
    var valorSalvo = localStorage.getItem(chave);

    if (valorSalvo){
      campo.value = valorSalvo; 

      if (campo.tagName === 'TEXTAREA'){
        campo.style.height = 'auto';
        campo.style.height = campo.scrollHeight + 'px';
      }
    }

    campo.addEventListener('input', function(){
      salvarCampo(this);
    });
  });

  atualizarProgresso();

}

// Contagem de campos preenchidos e indicador 

function atualizarProgresso(){
  var campos = document.querySelectorAll('input[type = “text”], textarea');
  var total = campos.length;
  var preenchidos = 0;

  campos.forEach(function(campo){
    if (campo.value.trim() !== ''){
      preenchidos ++;
    }
  });

  // Atualiza o elemento de progresso

  var indicador = document.getElementById('indicador-progresso');
  if (indicador){
    indicador.textContent = preenchidos + '/' + total + 'questões respondidas';

    // Mudar cor de acordo com o progresso
    if (preenchidos == total){
      indicador.className = 'Exercícios feitos!';
    } else if (preenchidos > 0){
      indicador.className = 'Exercícios em andamento';
    } else {
      indicador.className = 'Nenhum exercício feito ainda';
    }
  }
}

// Limpar progresso 

function limparProgresso() {
  var campos = document.querySelectorAll('input[type="text"], textarea');
  campos.forEach(function(campo) {
    var chave = window.location.pathname + '_' + campo.id;
    localStorage.removeItem(chave);
    campo.value = '';
    if (campo.tagName === 'TEXTAREA') {
      campo.style.height = 'auto';
    }
  });
  atualizarProgresso();
}

// Chama restauração da página quando terminar de carregar 

document.addEventListener('DOMContentLoaded', restaurarProgresso);

function verificarMC(nomeQuestao, gabarito, idFeedback) {

  var opcoes = document.querySelectorAll('input[name="' + nomeQuestao + '"]');
  var selecionada = null;

  // Descobre qual alternativa foi marcada
  // e limpa colorações de tentativas anteriores
  opcoes.forEach(function(opcao) {
    if (opcao.checked) {
      selecionada = opcao.value;
    }
    opcao.parentElement.classList.remove('correta', 'errada');
  });

  // Nenhuma opção selecionada — avisa o aluno
  if (!selecionada) {
    var fb = document.getElementById(idFeedback);
    fb.className = 'feedback errado visivel';
    fb.textContent = '⚠ Selecione uma alternativa antes de verificar.';
    return;
  }

  // Colore os labels: verde = gabarito, vermelho = errou
  opcoes.forEach(function(opcao) {
    if (opcao.value === gabarito) {
      opcao.parentElement.classList.add('correta');
    } else if (opcao.checked) {
      opcao.parentElement.classList.add('errada');
    }
  });

  // Exibe o feedback de acerto ou erro
  var feedback = document.getElementById(idFeedback);
  if (selecionada === gabarito) {
    feedback.className = 'feedback correto visivel';
    feedback.textContent = '✓ Correto!';
  } else {
    feedback.className = 'feedback errado visivel';
    feedback.textContent = '✗ Incorreto. A alternativa correta está destacada em verde.';
  }
}