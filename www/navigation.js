document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btnEntrar");
  const btnCadastrar = document.getElementById("btn-cadastrar");
  const btnEsqueci = document.getElementById("btn-esqueci");
  const btnVoltar = document.getElementById("btnVoltar")
  const btnRegister = document.getElementById("btnRegister")
  const btnRecover = document.getElementById("btnRecover")

  // Botão para lógica do Login
  if (btnEntrar) {
      btnEntrar.addEventListener("click", async (e) => {  // <-- async aqui
        e.preventDefault();
        const email = document.querySelector('ion-input[type="email"]').value;
        const senha = document.querySelector('ion-input[type="password"]').value;

        try {
          await signInWithEmailAndPassword(auth, email, senha);
          window.location.href = "home.html"; // Login bem-sucedido
        } catch (error) {
          alert("Erro ao entrar: " + error.message);
        }
      });
    }

// Botão Voltar do Home para Index
 if (btnVoltar){
 btnVoltar.addEventListener("click",(e) =>{
  window.location.href = "index.html"
  });
 }

  // Botão seguir para página de cadastro
  if (btnCadastrar) {
    btnCadastrar.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  // Botão da função para cadastrar usuário
  if (btnRegister) {
    btnRegister.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.querySelector('ion-input[type="email"]').value;
      const senha = document.querySelector('ion-input[type="password"]').value;

      if (!email || !senha) {
        alert("Preencha o e-mail e a senha!");
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("Conta criada com sucesso!");
        window.location.href = "index.html"; // Redireciona após sucesso
      } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
      }
    });
  }


  // Botão para redirecionar para página de recuperar senha
  if (btnEsqueci) {
    btnEsqueci.addEventListener("click", () => {
      window.location.href = "forgot.html";
    });
  }



 // Botão adicionando funcionalidade de recuperação de senha
  if (btnRecover) {
      btnRecover.addEventListener("click", async (e) => {
      e.preventDefault();

          const email = document.querySelector('ion-input[type="email"]').value;

     if (!email) {
       alert("Digite seu e-mail!");
       return;
     }

     try {
       await sendPasswordResetEmail(auth, email);
       alert("Um link para redefinir a senha foi enviado para o seu e-mail ✅");
       window.location.href = "index.html"; // volta para login
     } catch (error) {
       alert("Erro: " + error.message);
     }
   });
 }


});

