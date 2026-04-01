const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'entrega-drawer-kr');
const htmlContent = fs.readFileSync(path.join(dir, 'drawer.html'), 'utf8');

const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Componente Drawer KR - Isolado</title>

  <!-- Dependência de Ícones (FontAwesome) -->
  <link rel="stylesheet" href="../../../ds-channel/src/assets/fonts/font-awesome/css/font-awesome.css" />
  
  <!-- Folha de estilo isolada do Drawer -->
  <link rel="stylesheet" href="drawer.css" />

  <style>
    body {
      font-family: Tahoma, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #EFEFEF;
    }
    .demo-container {
      background: #fff;
      border: 1px solid #CCC;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .demo-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>

  <div class="demo-container">
    <div class="demo-title">Demonstração do Componente (Hand-off)</div>
    <p style="font-size: 12px; color: #555; margin-bottom: 20px;">
      Clique no botão abaixo para testar a abertura do Drawer de Key Results isolado. Os modais internos também estão configurados nesta entrega.
    </p>
    <button style="padding: 10px 15px; cursor: pointer; border: 1px solid #999; background: #606970; color: #fff;" onclick="openDrawer('Objetivo de Teste (Mock)', 1)">
      Abrir Drawer de KRs
    </button>
  </div>

  <!-- Início do HTML do Componente -->
  ${htmlContent}
  <!-- Fim do HTML do Componente -->

  <!-- Dados mockados isolados -->
  <script src="mock-data.js"></script>

  <!-- Lógica isolada do Drawer -->
  <script src="drawer.js"></script>

</body>
</html>
`;

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
console.log('index.html gerado.');
