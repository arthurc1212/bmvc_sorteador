<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{titulo}}</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<script>
    console.log('Layout carregado - verificando JavaScript...');
</script>
<script src="/static/js/script.js"></script>
<script>
    console.log('Script.js carregado - verificando funções...');
    console.log('abrirAba existe?', typeof abrirAba);
</script>
<body>
    <header class="site-header">
        <h1>Sorteador</h1>
        <nav>
            <a href="/">Início</a>
        </nav>
    </header>

    <main class="container">
        <div class="abas">
            <button class="aba-link active" onclick="abrirAba(event, 'sorteio-numeros')">Sorteio por Números</button>
            <button class="aba-link" onclick="abrirAba(event, 'sorteio-nomes')">Sorteio por Nomes</button>
            <button class="aba-link" onclick="abrirAba(event, 'grafico')">Gráfico e Estatísticas</button>
        </div>

        <div id="sorteio-numeros" class="aba-conteudo active">
            {{!base}}
        </div>

        <div id="sorteio-nomes" class="aba-conteudo">
        </div>

        <div id="grafico" class="aba-conteudo">
        </div>
    </main>

    <footer class="site-footer">
        <p>© 2025 - Projeto BMVC Sorteador (Arthur e Gabriela)</p>
    </footer>

    <script src="/static/js/script.js"></script>
</body>
</html>
