/**
 * 서비스 기획자 에이전트 - 프론트엔드 앱
 * SSE 스트리밍, 마크다운 렌더링, 모델 선택 관리
 */

// === State ===
const state = {
    currentModel: 'gpt-4o',
    isStreaming: false,
    models: [],
};

// === DOM Elements ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const messagesContainer = $('#messagesContainer');
const welcomeScreen = $('#welcomeScreen');
const messageInput = $('#messageInput');
const sendBtn = $('#sendBtn');
const modelSelected = $('#modelSelected');
const modelOptions = $('#modelOptions');
const modelDropdown = $('#modelDropdown');
const modelBadge = $('#modelBadge');
const newChatBtn = $('#newChatBtn');
const sidebar = $('#sidebar');
const menuBtn = $('#menuBtn');

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    setupEventListeners();
    setupTextareaAutoResize();
    marked.setOptions({
        breaks: true,
        gfm: true,
    });
});

// === Load Models ===
async function loadModels() {
    try {
        const res = await fetch('/api/models');
        const data = await res.json();
        state.models = data.models;
        renderModelOptions();

        // 사용 가능한 첫 번째 모델을 기본으로 선택
        const firstAvailable = state.models.find(m => m.available);
        if (firstAvailable) {
            selectModel(firstAvailable.id);
        }
    } catch (err) {
        console.error('모델 로드 실패:', err);
    }
}

// === Render Model Options ===
function renderModelOptions() {
    modelOptions.innerHTML = state.models.map(m => `
        <div class="model-option ${m.id === state.currentModel ? 'active' : ''} ${!m.available ? 'disabled' : ''}"
             data-model-id="${m.id}">
            <span class="model-icon">${m.icon}</span>
            <span>${m.name}</span>
            <span class="provider-tag">${m.provider}</span>
            ${!m.available ? '<span class="provider-tag">키 없음</span>' : ''}
        </div>
    `).join('');

    // 모델 옵션 클릭 이벤트
    modelOptions.querySelectorAll('.model-option:not(.disabled)').forEach(opt => {
        opt.addEventListener('click', () => {
            selectModel(opt.dataset.modelId);
            modelDropdown.classList.remove('open');
        });
    });
}

// === Select Model ===
function selectModel(modelId) {
    const model = state.models.find(m => m.id === modelId);
    if (!model || !model.available) return;

    state.currentModel = modelId;
    modelSelected.querySelector('.model-icon').textContent = model.icon;
    modelSelected.querySelector('.model-name').textContent = model.name;
    modelBadge.textContent = model.name;

    // 활성 상태 업데이트
    modelOptions.querySelectorAll('.model-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.modelId === modelId);
    });
}

// === Event Listeners ===
function setupEventListeners() {
    // 전송 버튼
    sendBtn.addEventListener('click', sendMessage);

    // Enter 키로 전송 (Shift+Enter = 줄바꿈)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 모델 드롭다운 토글
    modelSelected.addEventListener('click', () => {
        modelDropdown.classList.toggle('open');
    });

    // 드롭다운 외부 클릭 닫기
    document.addEventListener('click', (e) => {
        if (!modelDropdown.contains(e.target)) {
            modelDropdown.classList.remove('open');
        }
    });

    // 빠른 액션 버튼
    $$('.action-btn, .welcome-card').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action) sendQuickAction(action);
        });
    });

    // 새 대화 버튼
    newChatBtn.addEventListener('click', clearChat);

    // 모바일 메뉴
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
}

// === Textarea Auto Resize ===
function setupTextareaAutoResize() {
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
    });
}

// === Send Message ===
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || state.isStreaming) return;

    // 웰컴 스크린 숨기기
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }

    // 사용자 메시지 추가
    appendMessage('user', message);

    // 입력 초기화
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // 스트리밍 시작
    await streamResponse(message);
}

// === Send Quick Action ===
async function sendQuickAction(actionId) {
    const actionLabels = {
        brainstorm: '🧠 아이디어 브레인스토밍을 해주세요',
        persona: '👤 사용자 페르소나를 작성해주세요',
        spec: '📋 기능 명세서를 작성해주세요',
        market: '📊 시장 분석을 해주세요',
    };

    // 웰컴 스크린 숨기기
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }

    // 사용자 메시지 표시 (라벨)
    appendMessage('user', actionLabels[actionId] || actionId);

    // 스트리밍 시작 (서버에 action ID 전송)
    await streamResponse(actionId);
}

// === Stream Response ===
async function streamResponse(message) {
    state.isStreaming = true;
    sendBtn.disabled = true;

    // 어시스턴트 메시지 컨테이너 생성
    const { messageEl, contentEl } = appendMessage('assistant', '', true);

    // 타이핑 인디케이터
    const typingHtml = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    contentEl.innerHTML = typingHtml;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                model: state.currentModel,
                session_id: 'default',
            }),
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE 이벤트 파싱
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const dataStr = line.slice(5).trim();
                    if (!dataStr) continue;

                    try {
                        const data = JSON.parse(dataStr);

                        if (data.token) {
                            fullText += data.token;
                            contentEl.innerHTML = marked.parse(fullText);
                        }

                        if (data.error) {
                            contentEl.innerHTML = `<div class="error-message">⚠️ ${data.error}</div>`;
                        }
                    } catch (parseErr) {
                        // JSON 파싱 실패 무시
                    }
                }
            }
        }

        // 최종 마크다운 렌더링
        if (fullText) {
            contentEl.innerHTML = marked.parse(fullText);
        }
    } catch (err) {
        contentEl.innerHTML = `<div class="error-message">⚠️ ${err.message}<br>서버가 실행 중인지 확인해주세요.</div>`;
    } finally {
        state.isStreaming = false;
        sendBtn.disabled = false;
        scrollToBottom();
        messageInput.focus();
    }
}

// === Append Message ===
function appendMessage(role, content, isStreaming = false) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', role);

    const avatar = role === 'assistant' ? '🎯' : '👤';

    messageEl.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${
            role === 'user'
                ? escapeHtml(content)
                : (content ? marked.parse(content) : '')
        }</div>
    `;

    messagesContainer.appendChild(messageEl);
    scrollToBottom();

    const contentEl = messageEl.querySelector('.message-content');
    return { messageEl, contentEl };
}

// === Clear Chat ===
async function clearChat() {
    try {
        await fetch('/api/history', { method: 'DELETE' });
    } catch (err) {
        console.error('히스토리 초기화 실패:', err);
    }

    // 메시지 제거
    messagesContainer.querySelectorAll('.message').forEach(m => m.remove());

    // 웰컴 스크린 다시 표시
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
    }
}

// === Toggle Sidebar (Mobile) ===
function toggleSidebar() {
    sidebar.classList.toggle('open');

    // 오버레이
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('sidebar-overlay');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
    overlay.classList.toggle('active');
}

// === Utilities ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}
