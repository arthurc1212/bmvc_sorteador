function parseItems(text){
    return text.split(',').map(s => s.trim()).filter(Boolean);
}

function pushHistory(vencedor){
    if(!vencedor) return;
    const raw = localStorage.getItem('sorteio_history');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(vencedor);
    localStorage.setItem('sorteio_history', JSON.stringify(arr));
}

function renderHistory(){
    const ulNames = document.getElementById('history_list');
    const ulNumbers = document.getElementById('history_list_numeros');
    const raw = localStorage.getItem('sorteio_history');
    const arr = raw ? JSON.parse(raw) : [];
    const last = arr.slice(-10).reverse();

    if (ulNames) {
        ulNames.innerHTML = '';
        last.forEach(v => {
            const li = document.createElement('li');
            li.textContent = v;
            ulNames.appendChild(li);
        });
    }

    if (ulNumbers) {
        ulNumbers.innerHTML = '';
        last.forEach(v => {
            const li = document.createElement('li');
            li.textContent = v;
            ulNumbers.appendChild(li);
        });
    }
}

function abrirAba(evt, abaId) {
    console.log('Abrindo aba:', abaId);
    
    const abaConteudos = document.getElementsByClassName("aba-conteudo");
    for (let i = 0; i < abaConteudos.length; i++) {
        abaConteudos[i].classList.remove("active");
    }
    
    const abaLinks = document.getElementsByClassName("aba-link");
    for (let i = 0; i < abaLinks.length; i++) {
        abaLinks[i].classList.remove("active");
    }
    
    document.getElementById(abaId).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    carregarConteudoAba(abaId);
    
    return false;
}

function carregarConteudoAba(abaId) {
    const conteudoDiv = document.getElementById(abaId);
    
    if (abaId === 'sorteio-nomes' && !conteudoDiv.querySelector('h2')) {
        console.log('Carregando aba de nomes...');
        const template = document.getElementById('template-nomes');
        if (template) {
            conteudoDiv.innerHTML = template.innerHTML;
            setTimeout(inicializarSorteioNomes, 50);
        }
    }
    else if (abaId === 'grafico') {
    console.log('Carregando aba de gráfico...');
    const template = document.getElementById('template-grafico');
    if (template) {
        conteudoDiv.innerHTML = template.innerHTML;
        setTimeout(inicializarGrafico, 50);
    }
}

}

function inicializarSorteioNumeros() {
    console.log('INICIALIZANDO SORTEIO DE NÚMEROS');
    
    const btnSortearNumeros = document.getElementById('btn_sortear_numeros');
    const btnClearNumeros = document.getElementById('btn_clear_numeros');
    const resultadoNumeros = document.getElementById('resultado_numeros');

    console.log('Elementos encontrados:', {
        btnSortearNumeros: !!btnSortearNumeros,
        btnClearNumeros: !!btnClearNumeros,
        resultadoNumeros: !!resultadoNumeros
    });

    // ✅ Evita adicionar o mesmo listener mais de uma vez
    if (btnSortearNumeros && resultadoNumeros && !btnSortearNumeros.dataset.listenerAdded) {
        btnSortearNumeros.addEventListener('click', function() {
            console.log('Botão de números CLICADO!');
            
            const min = parseInt(document.getElementById('numero_min').value) || 1;
            const max = parseInt(document.getElementById('numero_max').value) || 100;
            const quantidade = parseInt(document.getElementById('quantidade_numeros').value) || 1;

            console.log('Valores:', { min, max, quantidade });

            if (min >= max) {
                resultadoNumeros.textContent = 'O número mínimo deve ser menor que o máximo.';
                return;
            }

            if (quantidade > (max - min + 1)) {
                resultadoNumeros.textContent = `Não é possível sortear ${quantidade} números no intervalo de ${min} a ${max}.`;
                return;
            }

            const numeros = [];
            for (let i = 0; i < quantidade; i++) {
                let numero;
                do {
                    numero = Math.floor(Math.random() * (max - min + 1)) + min;
                } while (numeros.includes(numero));
                numeros.push(numero);
            }

            console.log('Números sorteados:', numeros);
            resultadoNumeros.textContent = numeros.join(', ');
            
            numeros.forEach(num => {
                console.log('Adicionando ao histórico:', num);
                pushHistory(num.toString());
            });
            renderHistory();
        });

        // ✅ Marca que o listener já foi adicionado
        btnSortearNumeros.dataset.listenerAdded = 'true';
        console.log('Listener do sorteio de números adicionado com sucesso!');
    }

    // ✅ Mesma proteção para o botão de limpar
    if (btnClearNumeros && !btnClearNumeros.dataset.listenerAdded) {
        btnClearNumeros.textContent = 'Limpar Histórico';
        
        btnClearNumeros.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja limpar todo o histórico de sorteios?')) {
                localStorage.removeItem('sorteio_history');
                renderHistory();

                // limpa a área de resultado atual
                if (resultadoNumeros) resultadoNumeros.textContent = '';

                // 🔹 limpa o gráfico, se a aba estiver aberta
                const graficoDiv = document.getElementById('grafico_simples');
                const statsDiv = document.getElementById('dados_estatisticas');
                if (graficoDiv && statsDiv) {
                    graficoDiv.innerHTML = '<p style="color: #666; text-align: center;"> Nenhum sorteio realizado ainda.</p>';
                    statsDiv.innerHTML = '<p>Nenhum dado disponível</p>';
                }

                console.log('Histórico completamente limpo!');
            }
        });

        btnClearNumeros.dataset.listenerAdded = 'true';
        console.log('Listener do botão limpar adicionado com sucesso!');
    }
}


function inicializarSorteioNomes() {
    console.log(' INICIALIZANDO SORTEIO DE NOMES ');
    
    const btn = document.getElementById('btn_sortear');
    const btnClear = document.getElementById('btn_clear');
    const input = document.getElementById('input_items');
    const countInput = document.getElementById('input_count');
    const resultadoBox = document.getElementById('resultado_box');

    console.log('Elementos encontrados na aba nomes:', {
        btn: !!btn,
        btnClear: !!btnClear,
        input: !!input,
        countInput: !!countInput,
        resultadoBox: !!resultadoBox
    });

    if (btn && input && resultadoBox) {
        renderHistory();

        btn.addEventListener('click', function() {
            console.log(' Botão de nomes CLICADO!');
            
            const items = parseItems(input.value);
            const count = Math.max(1, parseInt(countInput.value) || 1);
            
            console.log('Dados do sorteio:', { items, count });

            if (items.length === 0) {
                resultadoBox.textContent = ' Insira pelo menos um nome.';
                return;
            }

            const winners = [];
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * items.length);
                winners.push(items[idx]);
            }

            console.log('Vencedores:', winners);
            resultadoBox.textContent = winners.join(', ');
            
            winners.forEach(w => {
                console.log('Adicionando ao histórico:', w);
                pushHistory(w);
            });
            
            renderHistory();
        });

        console.log('Sorteio de nomes inicializado com sucesso!');
    } else {
        console.log('Elementos do sorteio de nomes não encontrados');
    }

    if (btnClear) {
        btnClear.addEventListener('click', function() {
            if (confirm('Limpar histórico local?')) {
                localStorage.removeItem('sorteio_history');
                renderHistory();
                if (resultadoBox) resultadoBox.textContent = '';
        
                const graficoDiv = document.getElementById('grafico_simples');
                const statsDiv = document.getElementById('dados_estatisticas');
                if (graficoDiv && statsDiv) {
                    graficoDiv.innerHTML = '<p style="color: #666; text-align: center;"> Nenhum sorteio realizado ainda.</p>';
                    statsDiv.innerHTML = '<p>Nenhum dado disponível</p>';
                }

                console.log('Histórico limpo e gráfico resetado!');
            }
        });
    }
}

function inicializarGrafico() {
    console.log('INICIALIZANDO GRÁFICO');
    
    const raw = localStorage.getItem('sorteio_history');
    const historico = raw ? JSON.parse(raw) : [];
    
    const container = document.getElementById('grafico_simples');
    const statsDiv = document.getElementById('dados_estatisticas');
    
    console.log('Elementos do gráfico:', {
        container: !!container,
        statsDiv: !!statsDiv,
        historicoLength: historico.length
    });

    if (container && statsDiv) {
        if (historico.length === 0) {
            container.innerHTML = '<p style="color: #666; text-align: center;"> Nenhum sorteio realizado ainda.</p>';
            statsDiv.innerHTML = '<p>Nenhum dado disponível</p>';
            return;
        }

        const frequencia = {};
        historico.forEach(item => {
            frequencia[item] = (frequencia[item] || 0) + 1;
        });

        const itensOrdenados = Object.entries(frequencia)
            .sort((a, b) => b[1] - a[1]);

        let htmlGrafico = '<div class="grafico-barras">';
        
        itensOrdenados.forEach(([item, count]) => {
            const percentual = (count / historico.length) * 100;
            const larguraBarra = Math.max(20, percentual * 2); 
            
            htmlGrafico += `
                <div class="linha-barra">
                    <span class="rotulo">${item}</span>
                    <div class="barra-container">
                        <div class="barra" style="width: ${larguraBarra}px; background-color: #e67e22;">
                            <span class="contador">${count}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        htmlGrafico += '</div>';
        container.innerHTML = htmlGrafico;

        const totalSorteios = historico.length;
        const itensUnicos = itensOrdenados.length;
        const maisSorteado = itensOrdenados[0];
        
        statsDiv.innerHTML = `
            <p><strong>Total de sorteios:</strong> ${totalSorteios}</p>
            <p><strong>Itens únicos sorteados:</strong> ${itensUnicos}</p>
            <p><strong>Mais sorteado:</strong> ${maisSorteado[0]} (${maisSorteado[1]} vezes)</p>
        `;

        console.log('Gráfico inicializado com sucesso!');
    } else {
        console.log(' Elementos do gráfico não encontrados');
    }
}

document.addEventListener('DOMContentLoaded', function(){
    console.log('INICIANDO SISTEMA');
    
    inicializarSorteioNumeros();
    
    console.log('SISTEMA PRONTO');
});
