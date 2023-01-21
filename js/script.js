const nomeUsuario = prompt("Qual seu nome?");
let usuario = {name: nomeUsuario};

let resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

resposta.then(logado, naoLogado);

function logado() {
  return;
}
function naoLogado(off) {
  if(off.response.status == 400) {
    let usr = prompt('Nome já existe, por favor escolha outro.');
    usuario = {name: usr};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario).then(logado, naoLogado);
  }
}

console.log(usuario);

setInterval(estaLogado, 4000);
function estaLogado() {
  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario).then(
  () => {
    console.log('continuo logado!');
  }, 
  () => {
    console.log('Deu Ruim');
  }
  );
}









// let mensagens = [];


// let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
// console.log(promise);
// promise.then(deuCerto, deuErro);


// function deuCerto(sucesso) {
//   mensagens.push(sucesso.data);
// }
// function deuErro(erro) {
//   console.log('Deu erro aqui!');
// }


// //MOSTRAR MENSAGENS NA TELA.
// function mostrarMensagens() {
//   let msg = document.querySelector('ul');
//   msg.innerHTML = '';
//   for (let i = 0; i < mensagens.length; i++) {
//     let template = `<li data-test="message"> ${mensagens[0][i].text} </li>`;
//     msg.innerHTML += template; 
//   }

// }
// mostrarMensagens();

// //ENVIANDO MENSAGENS PARA O ARRAY DE MENSAGENS.
// function enviarMensagem() {
//   let text = document.querySelector('input').value;

//   let novaMensagem = {
//     from: nomeUsuario,
//     text: text,
//     time: "09:13:59",
//     to: "Todos",
//     type: "status"
//   }
//   mensagens.push(novaMensagem);

// ENVIANDO MENSAGENS PARA O SERVIDOR
// let resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',mensagens); //objeto nova mensagem.
// resposta.then(respostaPositiva, respostaNegativa);
// function respostaPositiva(certo){
//   console.log(certo);
// }
// function respostaNegativa(errado)  {
//   console.log('deu errado');
// }

// }


