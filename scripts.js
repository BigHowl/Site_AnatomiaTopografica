

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