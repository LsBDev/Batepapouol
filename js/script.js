const nomeUsuario = prompt("Qual seu nome?");
let usuario = {name: nomeUsuario};
let lastMessage;

//REQUISIÇÃO PARA ENVIO DO NOME DE USUÁRIO.
let resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',
                          usuario,
                          );
resposta.then(logado, naoLogado);
function logado() {
  setInterval(getMensagens, 3000);
  setInterval(estaLogado, 5000);
}
function naoLogado(off) {
  if(off.response.status == 400) {
    let usr = prompt('Nome já existe, por favor escolha outro.');
    usuario = {name: usr};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
              .then(logado,
                    naoLogado
                  );
  }
}

//REENVIANDO O NOME PRA MANTER LOGADO.
function estaLogado() {
  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario).then(
  () => {
    // console.log('continuo logado!');
  }, 
  () => {
    console.log('Deu Ruim');
  }
  );
}

//PEGANDO MENSAGENS DO SERVIDOR. DA PROMISE O QUE INTERESSA É O .DATA.
function getMensagens() {
  let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promise.then(mostrarMensagens, deuErroMensagens);
  function deuErroMensagens(erro) {
    console.log(`Erro ao pegar mensagens!Erro ${erro.status}`);
  }
}

//MOSTRAR MENSAGENS NA TELA.
function mostrarMensagens(sucesso) {
  let mensagens = sucesso.data;
  let msg = document.querySelector('ul');
  msg.innerHTML = '';
  for (let i = 0; i < mensagens.length; i++) {
    if(mensagens[i].type == 'status') {
      let template =
        `<li data-test="message" class="status">
        <span>(${mensagens[i].time})</span>
        <b>${mensagens[i].from}</b>
        ${mensagens[i].text}
        </li>`;
      msg.innerHTML += template;

    }else if(mensagens[i].type == 'message'){
      let template = `<li data-test="message" class="message"><span>(${mensagens[i].time})</span><b> ${mensagens[i].from}</b> para <b>${mensagens[i].to}</b>: ${mensagens[i].text} </li>`;
      msg.innerHTML += template;

    }else if(mensagens[i].type == "private_message" && (mensagens[i].to == nomeUsuario || mensagens[i].from == nomeUsuario)) {
      let template = `<li data-test="message" class="private_message"><span>(${mensagens[i].time})</span><b> ${mensagens[i].from}</b> reservadamente para <b>${mensagens[i].to}</b>: ${mensagens[i].text} </li>`;
      msg.innerHTML += template;
    }
  }
  msg = document.querySelector('ul');
  msg.lastElementChild.scrollIntoView();
}

//ENVIANDO MENSAGENS PARA O SERVIDOR.
function enviarMensagem() {
  let text = document.querySelector('.texto').value;
  let novaMensagem = {
    from: nomeUsuario,
    to: "Todos",
    text: text,
    type: "message"
  };
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem).then(
    ()=>{
      getMensagens();
    })
    .catch(
      (xabu)=>{
        console.log(`Erro: ${xabu.status}`);
        window.location.reload();

    }); //checar o envio vazio


  // axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem).then(sucesso,erro);
  // function sucesso(ok) {
  //   getMensagens();
  // }
  // function erro(xabu) {
  //   console.log(`Erro: ${xabu.status}`);
  //   window.location.reload();
  // }

  document.querySelector('.texto').value = '';
 
}

//ENVIAR COM O ENTER.
document.addEventListener('keypress', function(e) {
  if(e.key === 'Enter') {
    document.querySelector('.btn').click();
    document.querySelector('.texto').value = '';
  }
});