# Dama - Jogo de Damas Clássico

[Visite o jogo online](https://dama.rennan-alves.com)

Uma versão moderna do jogo de damas inspirada nas regras da minha infância. Desenvolvido com **React** e aprimorado com **Framer Motion**, este jogo oferece uma experiência interativa e visualmente agradável, ideal para desafiar sua estratégia e raciocínio.

## 🎯 Objetivo do Jogo

O objetivo é capturar todas as peças do adversário ou deixá-lo sem movimentos possíveis. Utilize suas habilidades táticas para vencer partidas desafiadoras contra o computador!

## ⚙️ Funcionalidades

- **Movimentos Diagonais:**  
  As peças se movem apenas nas diagonais, respeitando as regras tradicionais do jogo.

- **Captura Múltipla:**  
  Se houver mais de uma possibilidade de captura, o jogador pode encadear movimentos para capturar várias peças em uma única jogada.

- **Promoção à Dama:**  
  Quando uma peça alcança a última fileira do tabuleiro, ela é promovida a **Dama**, adquirindo a liberdade de mover-se em todas as direções diagonais e capturar à distância.

- **Níveis de Dificuldade:**  
  Selecione entre os níveis **Fácil**, **Médio** e **Difícil** para ajustar o desafio proposto pela inteligência artificial.

- **Animações Suaves:**  
  A interface conta com animações desenvolvidas com Framer Motion, proporcionando transições dinâmicas e feedback visual para cada ação.

- **Feedback Interativo:**  
  Notificações (toasts) informam eventos importantes como capturas, promoções e fim de jogo.

## 📜 Regras do Jogo

- **Movimento Padrão:**  
  - As peças se movem nas diagonais e somente para frente enquanto não são damas.
  
- **Captura:**  
  - A captura é obrigatória quando uma peça adversária está em posição de ser capturada.
  - É possível realizar múltiplas capturas consecutivas, desde que as condições permitam.

- **Promoção:**  
  - Ao alcançar a última fileira do tabuleiro, a peça é promovida a **Dama**.
  - A Dama tem liberdade de movimento em todas as diagonais e pode capturar peças à distância.

- **Fim do Jogo:**  
  - O jogo encerra quando um jogador não possui mais movimentos possíveis, seja por ter suas peças capturadas ou por ficar bloqueado.

## 💻 Tecnologias Utilizadas

- [React](https://react.dev) – Biblioteca para construção da interface.
- [Framer Motion](https://www.framer.com/motion/) – Para animações e transições fluidas.
- [Tailwind CSS](https://tailwindcss.com) – Utilitário para estilização rápida e responsiva.
- [Shadcn/UI](https://ui.shadcn.com/) – Componentes de interface, como botões e notificações.

## 🚀 Como Executar Localmente

1. **Clone o Repositório:**
    ```bash
    git clone https://github.com/rennan-dev/dama.git
    cd dama
    ```

2. **Instale as Dependências:**
    ```bash
    npm install
    ```

3. **Execute o Projeto:**
    ```bash
    npm run dev
    ```

4. **Acesse no Navegador:**  
   Abra [http://localhost:5000](http://localhost:5000) para jogar.

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Caso queira sugerir melhorias ou reportar algum problema, por favor, abra uma *issue* ou envie um *pull request*.

## 📄 Licença

Este projeto está licenciado sob os termos da [Licença MIT](./LICENSE).

---

Desenvolvido por [Rennan Alves](https://rennan-alves.com)

Aproveite o jogo e compartilhe sua experiência!