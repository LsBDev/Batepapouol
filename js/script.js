const nomeUsuario = prompt("Qual seu nome?");
let usuario = {name: nomeUsuario};
let mensagens;
let lastMessage;

//REQUISIÇÃO PARA ENVIO DO NOME DE USUÁRIO.
let resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
resposta.then(logado, naoLogado);
function logado() {
  getMensagens();
  setInterval(estaLogado, 5000);
}
function naoLogado(off) {
  if(off.response.status == 400) {
    let usr = prompt('Nome já existe, por favor escolha outro.');
    usuario = {name: usr};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario).then(logado, naoLogado);
  }
}

//REENVIANDO O NOME PRA MANTER LOGADO.
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

//PEGANDO MENSAGENS DO SERVIDOR. DA PROMISE O QUE INTERESSA É O .DATA.
function getMensagens() {
  let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promise.then(deuCerto, deuErro);
  function deuCerto(sucesso) {
    mensagens = sucesso.data;
    mostrarUltima();
    setInterval(()=>{axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(mostrarMensagens)}, 3000);
  }
  function deuErro(erro) {
    console.log('erro ao pegar mensagens!');
  }
}


//MOSTRAR MENSAGENS NA TELA.
function mostrarMensagens(sucesso) {
  mensagens = sucesso.data;
  let indexLastMessage = mensagens.findIndex(function(obj){return obj.from == lastMessage.from && obj.to == lastMessage.to && obj.text == lastMessage.text && obj.type == lastMessage.type && obj.time == lastMessage.time});
  let msg = document.querySelector('ul');
  for (let i = indexLastMessage + 1; i < mensagens.length; i++) {
    if(mensagens[i].type == 'status') {
    let template = `<li data-test="message" class="status"><span>(${mensagens[i].time})</span><b> ${mensagens[i].from}</b> ${mensagens[i].text} </li>`;
    msg.innerHTML += template;
    }else if(mensagens[i].type == 'message'){
    let template = `<li data-test="message" class="message"><span>(${mensagens[i].time})</span><b> ${mensagens[i].from}</b> para <b>${mensagens[i].to}</b>: ${mensagens[i].text} </li>`;
    msg.innerHTML += template;
    }else if(mensagens[i].type == "private_message" && (mensagens[i].to == nomeUsuario || mensagens[i].from == nomeUsuario)) {
    let template = `<li data-test="message" class="private_message"><span>(${mensagens[i].time})</span><b> ${mensagens[i].from}</b> para <b>${mensagens[i].to}</b>: ${mensagens[i].text} </li>`;
    }
  }
  msg.lastChild.scrollIntoView();
  lastMessage = mensagens[mensagens.length - 1];
}

function mostrarUltima() {
  lastMessage = mensagens[mensagens.length - 1];
  let msg = document.querySelector('ul');
  if(lastMessage.type == 'status') {
    let template = `<li data-test="message" class="status"><span>(${lastMessage.time})</span><b> ${lastMessage.from}</b> ${lastMessage.text} </li>`;
    msg.innerHTML += template;
  }else if(lastMessage.type == 'message'){
    let template = `<li data-test="message" class="message"><span>(${lastMessage.time})</span><b> ${lastMessage.from}</b> para <b>${lastMessage.to}</b>: ${lastMessage.text} </li>`;
    msg.innerHTML += template;
  }
  else if(lastMessage.type == "private_message" && (lastMessage.to == nomeUsuario || lastMessage.from == nomeUsuario)) {
    let template = `<li data-test="message" class="private_message"><span>(${lastMessage.time})</span><b> ${lastMessage.from}</b> para <b>${lastMessage.to}</b>: ${lastMessage.text} </li>`;
  }
}

/*COMO ROLAR A BARRA PRO FINAL?? const elementoQueQueroQueApareca = document.querySelector('.mensagem');
elementoQueQueroQueApareca.scrollIntoView();*/

//ENVIANDO MENSAGENS PARA O SERVIDOR.
function enviarMensagem() {
  let text = document.querySelector('.texto').value;
  let novaMensagem = {
    from: nomeUsuario,
    to: "Todos",
    text: text,
    type: "message"
  };
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem).then(()=>{mostrarMensagens}).catch(()=>{window.location.reload()}); //checar o envio vazio
  document.querySelector('.texto').value = '';
}

//ENVIAR COM O ENTER.
document.addEventListener('keypress', function(e) {
  if(e.key === 'Enter') {
    document.querySelector('.btn').click();
    document.querySelector('.texto').value = '';
  }
});