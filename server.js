const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Usar body-parser para processar dados JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Caminho do arquivo JSON onde as lembranças serão armazenadas
const lembrancasFilePath = path.join(__dirname, 'lembrancas.json');

// Função para ler as lembranças do arquivo JSON
const readLembrancas = () => {
    if (fs.existsSync(lembrancasFilePath)) {
        const data = fs.readFileSync(lembrancasFilePath, 'utf8');
        return JSON.parse(data);
    }
    return []; // Retorna uma lista vazia se o arquivo não existir
};

// Função para salvar as lembranças no arquivo JSON
const saveLembrancas = (lembrancas) => {
    fs.writeFileSync(lembrancasFilePath, JSON.stringify(lembrancas, null, 2), 'utf8');
};

// Endpoint para listar as lembranças
app.get('/lembrancas', (req, res) => {
    const lembrancas = readLembrancas();
    res.json(lembrancas);
});

// Endpoint para adicionar uma nova lembrança
app.post('/lembranca', (req, res) => {
    const { titulo, descricao, imagem, data } = req.body;
    const lembrancas = readLembrancas();
    const novaLembranca = { titulo, descricao, imagem, data, id: Date.now().toString() };
    lembrancas.push(novaLembranca);
    saveLembrancas(lembrancas);
    res.json({ mensagem: 'Lembrança salva com sucesso!', lembranca: novaLembranca });
});

// Endpoint para excluir uma lembrança
app.delete('/lembranca/:id', (req, res) => {
    const { id } = req.params;
    let lembrancas = readLembrancas();
    lembrancas = lembrancas.filter(lembranca => lembranca.id !== id);
    saveLembrancas(lembrancas);
    res.json({ mensagem: 'Lembrança excluída com sucesso!' });
});

// Endpoint para listar imagens
app.get('/imagens-lista', (req, res) => {
    const imageDir = path.join(__dirname, 'imagens');
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler o diretório de imagens:', err);
            res.status(500).send('Erro ao listar imagens');
        } else {
            const imageFiles = files.filter(file => /\.(jpg|heic)$/i.test(file));
            res.json(imageFiles);
        }
    });
});

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
