function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
// Variáveis dos Jogadores
let fazendeiroX, fazendeiroY;
let civilX, civilY;
let velocidadeFazendeiro = 3; // Mais lento pra carregar os produtos
let velocidadeCivil = 5;    // Mais rápido, mas precisa desviar mais
let pontuacaoFazendeiro = 0;
let pontuacaoCivil = 0;
let larguraJogador = 40;
let alturaJogador = 60;

// Variáveis dos Produtos (Obstáculos/Itens)
let produtos = [];
let maxProdutos = 10; // Quantos produtos aparecem na tela
let tamanhoProduto = 20;

// Variáveis da Pista
let pistaY = 0; // Para simular o movimento da pista
let velocidadePista = 2; // A pista se move pra baixo

// Cores
let corFazendeiro = 'green';
let corCivil = 'blue';
let corProduto = 'brown';
let corPista = 'darkgray';
let corBordaPista = 'white';

function setup() {
  createCanvas(600, 700); // Largura x Altura
  // Posição inicial dos jogadores
  fazendeiroX = width / 4;
  fazendeiroY = height - 100;

  civilX = width / 4 * 3;
  civilY = height - 100;

  // Cria os primeiros produtos
  for (let i = 0; i < maxProdutos; i++) {
    criarProduto();
  }
}

function draw() {
  background(100); // Fundo da tela

  // Desenha e move a pista
  desenhaPista();
  pistaY += velocidadePista; // Move a pista pra baixo
  if (pistaY > 20) { // Se a pista "andou" muito, reseta pra simular loop
    pistaY = 0;
  }

  // Desenha os jogadores
  fill(corFazendeiro);
  rect(fazendeiroX, fazendeiroY, larguraJogador, alturaJogador);

  fill(corCivil);
  rect(civilX, civilY, larguraJogador, alturaJogador);

  // Movimento dos jogadores (aqui o jogador 1 controla o fazendeiro e o jogador 2 o civil)
  // Fazendeiro (setas do teclado)
  if (keyIsDown(LEFT_ARROW)) {
    fazendeiroX -= velocidadeFazendeiro;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    fazendeiroX += velocidadeFazendeiro;
  }
  // Limita o fazendeiro à metade esquerda da tela (simulando a pista do campo)
  fazendeiroX = constrain(fazendeiroX, 0, width / 2 - larguraJogador);

  // Civil (teclas 'A' e 'D')
  if (keyIsDown(65)) { // Tecla 'A'
    civilX -= velocidadeCivil;
  }
  if (keyIsDown(68)) { // Tecla 'D'
    civilX += velocidadeCivil;
  }
  // Limita o civil à metade direita da tela (simulando a pista da cidade)
  civilX = constrain(civilX, width / 2, width - larguraJogador);


  // Desenha e atualiza os produtos
  for (let i = produtos.length - 1; i >= 0; i--) {
    let p = produtos[i];
    fill(corProduto);
    ellipse(p.x, p.y, tamanhoProduto, tamanhoProduto); // Produto como círculo

    p.y += velocidadePista; // Produto se move com a pista

    // Checa colisão com o fazendeiro
    if (dist(fazendeiroX + larguraJogador / 2, fazendeiroY + alturaJogador / 2, p.x, p.y) < (larguraJogador / 2 + tamanhoProduto / 2) && p.tipo === 'campo') {
      pontuacaoFazendeiro++;
      produtos.splice(i, 1); // Remove o produto
      criarProduto(); // Cria um novo
    }
    // Checa colisão com o civil
    else if (dist(civilX + larguraJogador / 2, civilY + alturaJogador / 2, p.x, p.y) < (larguraJogador / 2 + tamanhoProduto / 2) && p.tipo === 'cidade') {
      pontuacaoCivil++;
      produtos.splice(i, 1); // Remove o produto
      criarProduto(); // Cria um novo
    }
    // Se o produto sumir da tela, remove e cria outro
    else if (p.y > height) {
      produtos.splice(i, 1);
      criarProduto();
    }
  }

  // Exibe a pontuação
  fill(255); // Cor branca para o texto
  textSize(24);
  text("Fazendeiro: " + pontuacaoFazendeiro, 20, 30);
  text("Civil: " + pontuacaoCivil, width - 150, 30);

  // Simplesmente para o jogo depois de X pontos
  if (pontuacaoFazendeiro >= 20 || pontuacaoCivil >= 20) {
    textSize(40);
    fill('red');
    textAlign(CENTER, CENTER);
    if (pontuacaoFazendeiro > pontuacaoCivil) {
      text("Fazendeiro Venceu!", width / 2, height / 2);
    } else if (pontuacaoCivil > pontuacaoFazendeiro) {
      text("Civil Venceu!", width / 2, height / 2);
    } else {
      text("Empate!", width / 2, height / 2);
    }
    noLoop(); // Para o loop do draw
  }
}

// Função para criar um novo produto
function criarProduto() {
  let tipoProduto = random(['campo', 'cidade']); // Define se é produto do campo ou da cidade
  let xPos;
  if (tipoProduto === 'campo') {
    xPos = random(tamanhoProduto, width / 2 - tamanhoProduto); // Na área do fazendeiro
  } else {
    xPos = random(width / 2 + tamanhoProduto, width - tamanhoProduto); // Na área do civil
  }
  produtos.push({
    x: xPos,
    y: random(-200, 0), // Aparece no topo da tela
    tipo: tipoProduto // Guarda o tipo do produto
  });
}

// Função para desenhar a pista
function desenhaPista() {
  // Metade esquerda: Campo
  fill(50, 150, 50); // Verde grama
  rect(0, 0, width / 2, height);
  // Metade direita: Cidade
  fill(150); // Cinza rua
  rect(width / 2, 0, width / 2, height);

  // Linha do meio da pista
  stroke(corBordaPista);
  strokeWeight(5);
  line(width / 2, 0, width / 2, height);

  // Linhas tracejadas da pista (simulando movimento)
  stroke(corBordaPista);
  strokeWeight(2);
  for (let i = 0; i < height / 20; i++) {
    line(width / 2, i * 40 + pistaY, width / 2, i * 40 + 20 + pistaY);
  }
}