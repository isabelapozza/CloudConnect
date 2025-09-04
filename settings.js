
// Elementos do DOM
const settingsForm = document.getElementById('settings-form');
const settingsMessage = document.getElementById('settings-message');
const currentPat = document.getElementById('current-pat');
const currentBaseId = document.getElementById('current-base-id');
const clearSettingsBtn = document.getElementById('clear-settings');

// Função para carregar configurações salvas
function loadSettings() {
    const pat = localStorage.getItem('AIRTABLE_PAT');
    const baseId = localStorage.getItem('AIRTABLE_BASE_ID');
    
    if (pat) {
        currentPat.textContent = pat.substring(0, 15) + '...';
        document.getElementById('airtable-pat').value = pat;
    }
    
    if (baseId) {
        currentBaseId.textContent = baseId;
        document.getElementById('airtable-base-id').value = baseId;
    }
}

// Função para salvar configurações
function saveSettings(pat, baseId) {
    localStorage.setItem('AIRTABLE_PAT', pat);
    localStorage.setItem('AIRTABLE_BASE_ID', baseId);
    
    settingsMessage.textContent = 'Configurações salvas com sucesso!';
    settingsMessage.className = 'message success';
    
    // Atualiza a exibição das configurações atuais
    loadSettings();
}

// Função para limpar configurações
function clearSettings() {
    if (confirm('Tem certeza que deseja limpar todas as configurações?')) {
        localStorage.removeItem('AIRTABLE_PAT');
        localStorage.removeItem('AIRTABLE_BASE_ID');
        
        currentPat.textContent = 'Não configurado';
        currentBaseId.textContent = 'Não configurado';
        
        document.getElementById('airtable-pat').value = '';
        document.getElementById('airtable-base-id').value = '';
        
        settingsMessage.textContent = 'Configurações removidas com sucesso!';
        settingsMessage.className = 'message success';
    }
}

// Event Listeners
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pat = document.getElementById('airtable-pat').value.trim();
    const baseId = document.getElementById('airtable-base-id').value.trim();
    
    if (!pat || !baseId) {
        settingsMessage.textContent = 'Por favor, preencha todos os campos.';
        settingsMessage.className = 'message error';
        return;
    }
    
    saveSettings(pat, baseId);
});

clearSettingsBtn.addEventListener('click', clearSettings);

// Carrega as configurações ao carregar a página
document.addEventListener('DOMContentLoaded', loadSettings);
