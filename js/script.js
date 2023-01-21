const nomeUsuario = prompt("Qual seu nome?");
let usuario = {name: nomeUsuario};
let mensagens;
let lastMessage;
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

setInterval(estaLogado, 5000);
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

//MOSTRAR MENSAGENS NA TELA.
function mostrarMensagens(sucesso) {
  mensagens = sucesso.data;
  let indexLastMessage = mensagens.findIndex(function(obj){return obj.from == lastMessage.from && obj.to == lastMessage.to && obj.text == lastMessage.text && obj.type == lastMessage.type && obj.time == lastMessage.time});
  let msg = document.querySelector('ul');
  for (let i = indexLastMessage + 1; i < mensagens.length; i++) {
    if(mensagens[i].type == 'status') {
      let template = `<li data-test="message" class="status">(${mensagens[i].time})<span> ${mensagens[i].from}</span> ${mensagens[i].text} </li>`;
      msg.innerHTML += template;
    }else if(mensagens[i].type == 'message'){
      let template = `<li data-test="message" class="message">(${mensagens[i].time})<span> ${mensagens[i].from}</span> para <span>${mensagens[i].to}</span>: ${mensagens[i].text} </li>`;
      msg.innerHTML += template;
    }
  }
  lastMessage = mensagens[mensagens.length - 1];
}
function mostrarUltima() {
  lastMessage = mensagens[mensagens.length - 1];
  let msg = document.querySelector('ul');
  if(lastMessage.type == 'status') {
    let template = `<li data-test="message" class="status">(${lastMessage.time})<span> ${lastMessage.from}</span> ${lastMessage.text} </li>`;
    msg.innerHTML += template;
  }else if(lastMessage.type == 'message'){
    let template = `<li data-test="message" class="message">(${lastMessage.time})<span> ${lastMessage.from}</span> para <span>${lastMessage.to}</span>: ${lastMessage.text} </li>`;
    msg.innerHTML += template;
  }
}

//ENVIANDO MENSAGENS PARA O ARRAY DE MENSAGENS.
function enviarMensagem() {
  let text = document.querySelector('input').value;
  let novaMensagem = {
    from: nomeUsuario,
    to: "Todos",
    text: text,
    type: "message"
  }
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem).then(()=>{mostrarMensagens}).catch(()=>{window.location.reload()});
}



