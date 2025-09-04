// Função para obter configurações do localStorage ou usar valores padrão
function getAirtableConfig() {
    const pat = localStorage.getItem('AIRTABLE_PAT');
    const baseId = localStorage.getItem('AIRTABLE_BASE_ID');
    const tableName = "Clientes"; // Nome da tabela permanece fixo
    
    return {
        pat,
        baseId,
        tableName,
        apiUrl: `https://api.airtable.com/v0/${baseId}/${tableName}`
    };
}

// Obtém as configurações
const config = getAirtableConfig();
const AIRTABLE_PAT = config.pat;
const AIRTABLE_BASE_ID = config.baseId;
const AIRTABLE_TABLE_NAME = config.tableName;
const API_URL = config.apiUrl;

// Elementos do DOM
const form = document.getElementById('client-form');
const clientList = document.getElementById('client-list');
const formMessage = document.getElementById('form-message');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');

// Configuração dos headers para a API
const headers = {
    'Authorization': `Bearer ${AIRTABLE_PAT}`,
    'Content-Type': 'application/json'
};

// Funções de utilidade para o estado da UI
function showLoading() {
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    emptyState.style.display = 'none';
    clientList.innerHTML = '';
}

function showError(message) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    errorState.textContent = message;
    emptyState.style.display = 'none';
    clientList.innerHTML = '';
}

function showEmpty() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    emptyState.style.display = 'block';
    clientList.innerHTML = '';
}

function hideStates() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    emptyState.style.display = 'none';
}

// 1. Função para carregar e listar os clientes (GET)
async function fetchClients() {
    showLoading();
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (data.records.length === 0) {
            showEmpty();
        } else {
            hideStates();
            renderClients(data.records);
        }

    } catch (error) {
        console.error('Falha ao carregar clientes:', error);
        showError('Falha ao carregar clientes. Por favor, verifique sua conexão ou token.');
    }
}

// Função para renderizar os clientes na UI
function renderClients(clients) {
    clientList.innerHTML = ''; // Limpa a lista antes de renderizar
    clients.forEach(client => {
        const li = document.createElement('li');
        li.className = 'client-item';
        li.setAttribute('data-id', client.id);

        const clientInfo = `
            <div class="client-info">
                <strong>${client.fields.Nome}</strong>
                <span>Email: ${client.fields.Email}</span><br>
                <span>Telefone: ${client.fields.Telefone}</span>
            </div>
            <button class="delete-btn" data-id="${client.id}">Excluir</button>
        `;
        li.innerHTML = clientInfo;
        clientList.appendChild(li);
    });
}

// 2. Função para criar um novo cliente (POST)
async function createClient(clientData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                records: [{
                    fields: clientData
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar cliente: ${response.status}`);
        }

        formMessage.textContent = 'Cliente adicionado com sucesso!';
        formMessage.className = 'message success';
        form.reset();
        fetchClients(); // Recarrega a lista
    } catch (error) {
        console.error('Falha ao criar cliente:', error);
        formMessage.textContent = `Falha ao adicionar cliente: ${error.message}`;
        formMessage.className = 'message error';
    }
}

// 3. Função para excluir um cliente (DELETE)
async function deleteClient(clientId) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${clientId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir cliente: ${response.status}`);
        }

        console.log(`Cliente com ID ${clientId} excluído com sucesso.`);
        fetchClients(); // Recarrega a lista
    } catch (error) {
        console.error('Falha ao excluir cliente:', error);
        alert('Falha ao excluir cliente. Por favor, tente novamente.');
    }
}

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientData = {
        Nome: form.elements['nome'].value,
        Email: form.elements['email'].value,
        Telefone: form.elements['telefone'].value
    };
    createClient(clientData);
});

clientList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const clientId = e.target.getAttribute('data-id');
        deleteClient(clientId);
    }
});

// Inicialização: carrega a lista de clientes ao carregar a página
document.addEventListener('DOMContentLoaded', fetchClients);