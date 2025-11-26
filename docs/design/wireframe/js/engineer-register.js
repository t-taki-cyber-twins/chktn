/* ========================================
   エンジニア登録画面固有JavaScript
   ======================================== */

// グローバル変数
let skills = []; // スキル一覧
let projects = []; // 案件一覧

/**
 * タブ切り替え処理
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // すべてのタブボタンとコンテンツからactiveクラスを削除
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // クリックされたタブボタンと対応するコンテンツにactiveクラスを追加
            this.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * スキルシートアップロード処理
 */
function initSkillSheetUpload() {
    const uploadBtn = document.getElementById('skill-sheet-upload-btn');
    const uploaderComponent = document.querySelector('app-skill-sheet-uploader');
    const statusDiv = document.getElementById('skill-sheet-status');

    if (uploadBtn && uploaderComponent) {
        uploadBtn.addEventListener('click', function() {
            uploaderComponent.open(
                // アップロード完了時のコールバック
                function(file) {
                    updateSkillSheetStatus('アップロード済み', file.name);
                },
                // AI解析完了時のコールバック
                function(result) {
                    updateSkillSheetStatus('解析完了', result.file.name);
                    // AI解析で抽出されたスキルをスキル一覧に追加
                    if (result.skills && result.skills.length > 0) {
                        result.skills.forEach(skill => {
                            addSkillToList(skill.name, skill.category, skill.level, skill.memo);
                        });
                    }
                    // AI解析で抽出された案件を案件一覧に追加
                    if (result.projects && result.projects.length > 0) {
                        result.projects.forEach(project => {
                            addProjectToList(project);
                        });
                    }
                }
            );
        });
    }
}

/**
 * スキルシートアップロード状況を更新
 */
function updateSkillSheetStatus(status, fileName) {
    const statusDiv = document.getElementById('skill-sheet-status');
    if (statusDiv) {
        const statusText = statusDiv.querySelector('.skill-sheet-status-text');
        if (statusText) {
            statusText.textContent = `${status}${fileName ? ': ' + fileName : ''}`;
        }
    }
}

/**
 * モーダルの開閉処理
 */
function initModals() {
    // モーダルを開くボタン（ブラックリスト、スキルシートアップロード、案件選択、案件追加はコンポーネントまたは専用関数で処理）
    const openButtons = {
        'engineer-managers-btn': 'engineer-managers-modal'
    };

    Object.keys(openButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        const modalId = openButtons[buttonId];
        
        if (button) {
            button.addEventListener('click', function() {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                }
            });
        }
    });

    // モーダルを閉じる
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // オーバーレイクリックで閉じる
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = overlay.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
}

/**
 * エンジニア担当者選択処理（複数選択）
 */
/**
 * エンジニア担当者選択処理（複数選択）
 */
function initEngineerManagersSelection() {
    const selectBtn = document.getElementById('engineer-managers-btn');
    const selectedDiv = document.getElementById('engineer-managers-selected');
    const selectedList = document.getElementById('engineer-managers-selected-list');
    const removeAllBtn = document.getElementById('engineer-managers-remove-all');
    const selectorComponent = document.querySelector('app-engineer-representative-selector');
    
    let selectedItems = []; // 選択されたアイテムの配列

    // 選択されたアイテムを表示
    function renderSelectedItems() {
        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (selectedItems.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        selectedItems.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${escapeHtml(item.name)}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        // 個別削除ボタンのイベントリスナー
        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                selectedItems.splice(index, 1);
                renderSelectedItems();
            });
        });
    }

    // 選択ボタンクリック
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            if (selectorComponent) {
                selectorComponent.open(selectedItems, function(newSelectedItems) {
                    selectedItems = newSelectedItems;
                    renderSelectedItems();
                });
            }
        });
    }

    // すべて解除ボタン
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', function() {
            selectedItems = [];
            renderSelectedItems();
        });
    }
}

/**
 * スキル一覧テーブルの処理
 */
function initSkillListTable() {
    const skillTableBody = document.getElementById('skill-list-table-body');
    const skillAddBtn = document.getElementById('skill-add-btn');
    const skillCategory = document.getElementById('skill-category');
    const skillMaster = document.getElementById('skill-master');
    const skillNameCustom = document.getElementById('skill-name-custom');
    const skillLevel = document.getElementById('skill-level');
    const skillMemo = document.getElementById('skill-memo');

    // スキル一覧を表示
    function renderSkillList() {
        if (!skillTableBody) return;

        if (skills.length === 0) {
            skillTableBody.innerHTML = '<tr><td colspan="5" class="no-results">スキルが登録されていません</td></tr>';
            return;
        }

        skillTableBody.innerHTML = skills.map((skill, index) => {
            const categoryText = getCategoryText(skill.category);
            const levelText = getLevelText(skill.level);
            return `
                <tr data-skill-index="${index}">
                    <td>${escapeHtml(skill.name)}</td>
                    <td>${escapeHtml(categoryText)}</td>
                    <td>${escapeHtml(levelText)}</td>
                    <td>${escapeHtml(skill.memo || '')}</td>
                    <td>
                        <button type="button" class="btn btn-secondary btn-sm skill-delete-btn" data-index="${index}">削除</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 削除ボタンのイベントリスナー
        const deleteButtons = skillTableBody.querySelectorAll('.skill-delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeSkillFromList(index);
            });
        });
    }

    // スキルを追加
    function addSkill() {
        const category = skillCategory ? skillCategory.value : '';
        const skillName = skillMaster && skillMaster.value 
            ? skillMaster.options[skillMaster.selectedIndex].text 
            : (skillNameCustom ? skillNameCustom.value.trim() : '');
        const level = skillLevel ? skillLevel.value : '';
        const memo = skillMemo ? skillMemo.value.trim() : '';

        if (!skillName) {
            alert('スキル名を入力または選択してください');
            return;
        }

        if (!category) {
            alert('スキルカテゴリを選択してください');
            return;
        }

        if (!level) {
            alert('スキルレベルを選択してください');
            return;
        }

        addSkillToList(skillName, category, level, memo);

        // フォームをクリア
        if (skillCategory) skillCategory.value = '';
        if (skillMaster) skillMaster.value = '';
        if (skillNameCustom) skillNameCustom.value = '';
        if (skillLevel) skillLevel.value = '';
        if (skillMemo) skillMemo.value = '';
    }

    // スキル追加ボタン
    if (skillAddBtn) {
        skillAddBtn.addEventListener('click', addSkill);
    }

    // スキルマスタ選択時、カスタム入力欄をクリア
    if (skillMaster) {
        skillMaster.addEventListener('change', function() {
            if (this.value && skillNameCustom) {
                skillNameCustom.value = '';
            }
        });
    }

    // カスタム入力時、マスタ選択をクリア
    if (skillNameCustom) {
        skillNameCustom.addEventListener('input', function() {
            if (this.value && skillMaster) {
                skillMaster.value = '';
            }
        });
    }

    // 初期表示
    renderSkillList();
}

/**
 * スキルをリストに追加
 */
function addSkillToList(name, category, level, memo) {
    // 既に追加されているかチェック
    if (skills.find(s => s.name === name && s.category === category)) {
        alert('このスキルは既に追加されています');
        return;
    }

    const skill = {
        name: name,
        category: category,
        level: parseInt(level),
        memo: memo || ''
    };
    skills.push(skill);
    initSkillListTable();
}

/**
 * スキルをリストから削除
 */
function removeSkillFromList(index) {
    if (confirm('このスキルを削除しますか？')) {
        skills.splice(index, 1);
        initSkillListTable();
    }
}

/**
 * カテゴリテキストを取得
 */
function getCategoryText(category) {
    const categoryMap = {
        'language': 'プログラミング言語',
        'framework': 'フレームワーク',
        'database': 'データベース',
        'cloud': 'クラウド',
        'tool': 'ツール',
        'other': 'その他'
    };
    return categoryMap[category] || category;
}

/**
 * レベルテキストを取得
 */
function getLevelText(level) {
    const levelMap = {
        1: '1（初級）',
        2: '2（中級）',
        3: '3（上級）',
        4: '4（エキスパート）',
        5: '5（マスター）'
    };
    return levelMap[level] || level;
}

/**
 * 案件一覧テーブルの処理
 */
function initProjectListTable() {
    const projectTableBody = document.getElementById('project-list-table-body');
    const projectAddBtn = document.getElementById('project-add-btn');
    const projectSelector = document.querySelector('app-project-selector');
    const projectAddModal = document.getElementById('project-add-modal');
    const projectSelectBtn = document.getElementById('project-select-btn');
    const projectSelected = document.getElementById('project-selected');
    const projectAddConfirmBtn = document.querySelector('.project-add-confirm-btn');
    const projectAddCancelBtn = document.querySelector('.project-add-cancel-btn');

    let selectedProjectData = null;
    let editingProjectIndex = null; // 編集中の案件インデックス

    // 案件一覧を表示
    function renderProjectList() {
        if (!projectTableBody) return;

        if (projects.length === 0) {
            projectTableBody.innerHTML = '<tr><td colspan="5" class="no-results">案件が登録されていません</td></tr>';
            return;
        }

        projectTableBody.innerHTML = projects.map((project, index) => {
            const startDate = project.startDate ? formatDate(project.startDate) : '-';
            const endDate = project.endDate ? formatDate(project.endDate) : '-';
            const price = project.price ? project.price + '万円' : '-';
            const projectName = project.projectName || project.projectData?.name || '未紐づけ案件';
            
            // 案件名のリンクを条件分岐で設定
            let projectLinkHtml = '';
            if (project.projectId) {
                const isOwnProject = project.isOwnProject !== undefined ? project.isOwnProject : (project.projectData ? true : false);
                const linkUrl = isOwnProject 
                    ? `project-edit.html?id=${project.projectId}` 
                    : `public-project-detail.html?id=${project.projectId}`;
                projectLinkHtml = `<a href="${linkUrl}" class="table-link">${escapeHtml(projectName)}</a>`;
            } else {
                projectLinkHtml = escapeHtml(projectName);
            }

            return `
                <tr data-project-index="${index}">
                    <td>
                        ${projectLinkHtml}
                    </td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>${price}</td>
                    <td>
                        <div class="table-actions">
                            <button type="button" class="btn btn-secondary btn-sm project-edit-btn" data-index="${index}">編集</button>
                            <button type="button" class="btn btn-danger btn-sm project-delete-btn" data-index="${index}">削除</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // 編集ボタンのイベントリスナー
        const editButtons = projectTableBody.querySelectorAll('.project-edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                openProjectEditModal(index);
            });
        });

        // 削除ボタンのイベントリスナー
        const deleteButtons = projectTableBody.querySelectorAll('.project-delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeProjectFromList(index);
            });
        });
    }

    // 案件編集モーダルを開く
    function openProjectEditModal(index) {
        if (index < 0 || index >= projects.length) return;

        editingProjectIndex = index;
        const project = projects[index];

        // モーダルに既存データをセット
        if (project.projectId && project.projectData) {
            selectedProjectData = project.projectData;
            const selectedText = projectSelected.querySelector('.selected-value-text');
            if (selectedText) {
                selectedText.textContent = project.projectData.name;
            }
            projectSelected.style.display = 'flex';
            projectSelectBtn.style.display = 'none';
        } else {
            selectedProjectData = null;
            projectSelected.style.display = 'none';
            projectSelectBtn.style.display = 'flex';
        }

        document.getElementById('project-start-date').value = project.startDate || '';
        document.getElementById('project-end-date').value = project.endDate || '';
        document.getElementById('project-price').value = project.price || '';
        document.getElementById('project-work-content').value = project.workContent || '';
        document.getElementById('project-languages-tools').value = project.languagesTools || '';
        document.getElementById('project-role-process').value = project.roleProcess || '';

        // モーダルタイトルを変更
        const modalTitle = projectAddModal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '案件編集';
        }

        // モーダルを開く
        if (projectAddModal) {
            projectAddModal.classList.add('active');
        }
    }

    // 案件追加モーダルを開く（新規追加）
    function openProjectAddModal() {
        editingProjectIndex = null;
        selectedProjectData = null;
        projectSelected.style.display = 'none';
        if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
        document.getElementById('project-start-date').value = '';
        document.getElementById('project-end-date').value = '';
        document.getElementById('project-price').value = '';
        document.getElementById('project-work-content').value = '';
        document.getElementById('project-languages-tools').value = '';
        document.getElementById('project-role-process').value = '';

        // モーダルタイトルを変更
        const modalTitle = projectAddModal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '追加';
        }

        // モーダルを開く
        if (projectAddModal) {
            projectAddModal.classList.add('active');
        }
    }

    // 案件選択ボタン
    if (projectSelectBtn && projectSelector) {
        projectSelectBtn.addEventListener('click', function() {
            projectSelector.open(function(projectData) {
                selectedProjectData = projectData;
                const selectedText = projectSelected.querySelector('.selected-value-text');
                if (selectedText) {
                    selectedText.textContent = projectData.name;
                }
                projectSelected.style.display = 'flex';
                projectSelectBtn.style.display = 'none';
            });
        });
    }

    // 案件選択解除
    const projectRemoveBtn = projectSelected ? projectSelected.querySelector('.selected-value-remove') : null;
    if (projectRemoveBtn) {
        projectRemoveBtn.addEventListener('click', function() {
            selectedProjectData = null;
            projectSelected.style.display = 'none';
            if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
        });
    }

    // 案件追加確定ボタン
    if (projectAddConfirmBtn) {
        projectAddConfirmBtn.addEventListener('click', function() {
            const startDate = document.getElementById('project-start-date').value;
            const endDate = document.getElementById('project-end-date').value;
            const price = document.getElementById('project-price').value;
            const workContent = document.getElementById('project-work-content').value;
            const languagesTools = document.getElementById('project-languages-tools').value;
            const roleProcess = document.getElementById('project-role-process').value;

            const project = {
                projectId: selectedProjectData ? selectedProjectData.id : null,
                projectData: selectedProjectData,
                projectName: selectedProjectData ? selectedProjectData.name : null,
                isOwnProject: selectedProjectData ? true : false, // 自社案件かどうか（モックでは選択された案件は自社案件とする）
                startDate: startDate || null,
                endDate: endDate || null,
                price: price || null,
                workContent: workContent || '',
                languagesTools: languagesTools || '',
                roleProcess: roleProcess || ''
            };

            if (editingProjectIndex !== null) {
                // 編集モード：既存データを更新
                projects[editingProjectIndex] = project;
            } else {
                // 新規追加モード：新しいデータを追加
                projects.push(project);
            }

            renderProjectList();

            // フォームをクリア
            if (projectAddModal) projectAddModal.classList.remove('active');
            editingProjectIndex = null;
            selectedProjectData = null;
            if (projectSelected) projectSelected.style.display = 'none';
            if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
            document.getElementById('project-start-date').value = '';
            document.getElementById('project-end-date').value = '';
            document.getElementById('project-price').value = '';
            document.getElementById('project-work-content').value = '';
            document.getElementById('project-languages-tools').value = '';
            document.getElementById('project-role-process').value = '';
        });
    }

    // 案件追加キャンセルボタン
    if (projectAddCancelBtn) {
        projectAddCancelBtn.addEventListener('click', function() {
            if (projectAddModal) projectAddModal.classList.remove('active');
            editingProjectIndex = null;
            selectedProjectData = null;
            if (projectSelected) projectSelected.style.display = 'none';
            if (projectSelectBtn) projectSelectBtn.style.display = 'flex';
            document.getElementById('project-start-date').value = '';
            document.getElementById('project-end-date').value = '';
            document.getElementById('project-price').value = '';
            document.getElementById('project-work-content').value = '';
            document.getElementById('project-languages-tools').value = '';
            document.getElementById('project-role-process').value = '';
        });
    }

    // 案件追加ボタン
    if (projectAddBtn) {
        projectAddBtn.addEventListener('click', function() {
            openProjectAddModal();
        });
    }

    // 初期表示
    renderProjectList();
}

/**
 * 案件をリストに追加
 */
function addProjectToList(projectData) {
    const project = {
        projectId: projectData.projectId || null,
        projectData: projectData.projectData || null,
        projectName: projectData.projectName || null,
        isOwnProject: false, // AI解析で抽出された案件は紐づいていないためfalse
        startDate: projectData.startDate || null,
        endDate: projectData.endDate || null,
        price: projectData.price || null,
        workContent: projectData.workContent || '',
        languagesTools: projectData.languagesTools || '',
        roleProcess: projectData.roleProcess || ''
    };

    projects.push(project);
    initProjectListTable();
}

/**
 * 案件をリストから削除
 */
function removeProjectFromList(index) {
    if (confirm('この案件を削除しますか？')) {
        projects.splice(index, 1);
        initProjectListTable();
    }
}

/**
 * 日付をフォーマット
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

/**
 * ブラックリスト選択処理（複数選択）
 */
function initBlacklistSelection() {
    const selectBtn = document.getElementById('blacklist-btn');
    const selectedDiv = document.getElementById('blacklist-selected');
    const selectedList = document.getElementById('blacklist-selected-list');
    const removeAllBtn = document.getElementById('blacklist-remove-all');
    const selectorComponent = document.querySelector('app-blacklist-selector');
    
    let selectedItems = []; // 選択されたアイテムの配列

    // 選択されたアイテムを表示
    function renderSelectedItems() {
        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (selectedItems.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        selectedItems.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            // LIKEパターンの場合は視覚的に区別
            const isLikePattern = item.type === 'like';
            if (isLikePattern) {
                tag.classList.add('selected-value-tag-like');
            }
            tag.innerHTML = `
                <span class="selected-value-text">${escapeHtml(item.name)}${isLikePattern ? ' (LIKE)' : ''}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        // 個別削除ボタンのイベントリスナー
        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                selectedItems.splice(index, 1);
                renderSelectedItems();
            });
        });
    }

    // 選択ボタンクリック
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            if (selectorComponent) {
                selectorComponent.open(selectedItems, function(newSelectedItems) {
                    selectedItems = newSelectedItems;
                    renderSelectedItems();
                });
            }
        });
    }

    // すべて解除ボタン
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', function() {
            selectedItems = [];
            renderSelectedItems();
        });
    }
}

/**
 * フォームバリデーション
 */
function validateForm() {
    const engineerName = document.getElementById('engineer-name');
    
    let isValid = true;
    const errors = [];

    // エンジニア名の必須チェック
    if (!engineerName || !engineerName.value.trim()) {
        isValid = false;
        errors.push('エンジニア名は必須です');
        if (engineerName) {
            engineerName.style.borderColor = '#e74c3c';
        }
    } else if (engineerName) {
        engineerName.style.borderColor = '#e0e0e0';
    }

    if (!isValid) {
        alert('入力エラー:\n' + errors.join('\n'));
    }

    return isValid;
}

/**
 * フォーム送信処理
 */
function initFormSubmit() {
    const saveBtn = document.querySelector('.sidebar-save-btn');
    const cancelBtn = document.querySelector('.sidebar-cancel-btn');

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (validateForm()) {
                // TODO: APIにフォームデータを送信
                const formData = {
                    engineerName: document.getElementById('engineer-name').value,
                    isPublic: document.getElementById('is-public').checked,
                    // 社員情報
                    birthDate: document.getElementById('birth-date').value,
                    nearestStation: document.getElementById('nearest-station').value,
                    address: document.getElementById('address').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    company: document.getElementById('company').value,
                    department: document.getElementById('department').value,
                    position: document.getElementById('position').value,
                    // エンジニア基本情報
                    engineerStatus: document.getElementById('engineer-status').value,
                    availableDate: document.getElementById('available-date').value,
                    experienceYears: document.getElementById('experience-years').value,
                    desiredPrice: document.getElementById('desired-price').value,
                    engineerMemo: document.getElementById('engineer-memo').value,
                    engineerNote: document.getElementById('engineer-note').value,
                    // スキル、案件
                    skills: skills,
                    projects: projects
                };
                console.log('フォーム送信:', formData);
                alert('エンジニアを登録しました（モック）');
                // TODO: 登録完了後、エンジニア詳細画面に遷移
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('入力内容を破棄して戻りますか？')) {
                // TODO: 前の画面に戻る
                window.location.href = 'engineer-search.html';
            }
        });
    }
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initSkillSheetUpload();
    initModals();
    initEngineerManagersSelection();
    initSkillListTable();
    initProjectListTable();
    initBlacklistSelection();
    initFormSubmit();
    initSkillMemoButtons();
});

/**
 * スキルメモボタンの初期化
 */
function initSkillMemoButtons() {
    const extractBtn = document.getElementById('extract-skill-memo-btn');
    const generateBtn = document.getElementById('generate-skill-memo-btn');

    if (extractBtn) {
        extractBtn.addEventListener('click', function() {
            alert('スキルメモから情報抽出機能は後で実装予定です。');
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            alert('スキルメモを生成機能は後で実装予定です。');
        });
    }
}
