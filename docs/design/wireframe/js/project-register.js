/* ========================================
   案件登録画面固有JavaScript
   ======================================== */

/**
 * モーダルの開閉処理
 */
function initModals() {
    // モーダルを開くボタン（ブラックリストとメーリングリストはコンポーネントで処理）
    const openButtons = {
        'end-company-btn': 'end-company-modal',
        'project-manager-btn': 'project-manager-modal'
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
 * 取引先会社選択処理
 */
function initCompanySelection() {
    const companyButtons = document.querySelectorAll('.company-list-btn');
    const selectedDiv = document.getElementById('end-company-selected');
    const selectBtn = document.getElementById('end-company-btn');
    const modal = document.getElementById('end-company-modal');

    companyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const companyId = button.getAttribute('data-company-id');
            const companyName = button.getAttribute('data-company-name');
            
            // 選択された値を表示
            const selectedText = selectedDiv.querySelector('.selected-value-text');
            if (selectedText) {
                selectedText.textContent = companyName;
            }
            selectedDiv.style.display = 'flex';
            selectBtn.style.display = 'none';
            
            // TODO: 選択された会社IDをフォームデータに保存
            
            // モーダルを閉じる
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // 選択解除
    const removeBtn = selectedDiv.querySelector('.selected-value-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            selectedDiv.style.display = 'none';
            selectBtn.style.display = 'flex';
            // TODO: フォームデータから会社IDを削除
        });
    }
}

/**
 * 案件担当者選択処理(複数選択)
 */
function initProjectManagerSelection() {
    const selectedDiv = document.getElementById('project-manager-selected');
    const selectedList = document.getElementById('project-manager-selected-list');
    const selectBtn = document.getElementById('project-manager-btn');
    const removeAllBtn = document.getElementById('project-manager-remove-all');
    const modal = document.getElementById('project-manager-modal');
    const confirmBtn = document.getElementById('project-manager-confirm-btn');
    
    let selectedManagers = []; // 選択された担当者の配列

    // 選択された担当者を表示
    function renderSelectedManagers() {
        if (!selectedList) return;
        
        selectedList.innerHTML = '';
        if (selectedManagers.length === 0) {
            selectedDiv.style.display = 'none';
            if (selectBtn) selectBtn.style.display = 'flex';
            return;
        }

        selectedDiv.style.display = 'block';
        if (selectBtn) selectBtn.style.display = 'none';

        selectedManagers.forEach((manager, index) => {
            const tag = document.createElement('div');
            tag.className = 'selected-value-tag';
            tag.innerHTML = `
                <span class="selected-value-text">${manager.name}</span>
                <button type="button" class="selected-value-remove" data-index="${index}">×</button>
            `;
            selectedList.appendChild(tag);
        });

        // 個別削除ボタンのイベントリスナー
        const removeButtons = selectedList.querySelectorAll('.selected-value-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                selectedManagers.splice(index, 1);
                renderSelectedManagers();
            });
        });
    }

    // 選択完了ボタン
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.employee-checkbox:checked');
            
            checkboxes.forEach(checkbox => {
                const employeeId = checkbox.getAttribute('data-employee-id');
                const employeeName = checkbox.getAttribute('data-employee-name');
                
                // 既に選択されているかチェック
                if (!selectedManagers.find(m => m.id === employeeId)) {
                    selectedManagers.push({
                        id: employeeId,
                        name: employeeName
                    });
                }
                
                // チェックボックスをクリア
                checkbox.checked = false;
            });
            
            renderSelectedManagers();
            
            // TODO: 選択された担当者IDをフォームデータに保存
            
            // モーダルを閉じる
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }

    // すべて解除ボタン
    if (removeAllBtn) {
        removeAllBtn.addEventListener('click', function() {
            selectedManagers = [];
            renderSelectedManagers();
        });
    }
}



/**
 * スキル選択処理
 */
function initSkillSelection() {
    const skillList = document.getElementById('skill-list');
    const skillMaster = document.getElementById('skill-master');
    const skillCustom = document.getElementById('skill-custom');
    const skillAddBtn = document.querySelector('.skill-add-btn');
    const skills = []; // 選択されたスキルのリスト

    function addSkill(skillId, skillName, isCustom = false) {
        // 既に追加されているかチェック
        if (skills.find(s => s.id === skillId && !isCustom) || 
            skills.find(s => s.name === skillName && isCustom)) {
            alert('このスキルは既に追加されています');
            return;
        }

        const skill = {
            id: skillId,
            name: skillName,
            isCustom: isCustom,
            level: 1 // デフォルトレベル
        };
        skills.push(skill);
        renderSkillList();
        
        // 入力フィールドをクリア
        if (isCustom) {
            skillCustom.value = '';
        } else {
            skillMaster.value = '';
        }
    }

    function removeSkill(index) {
        skills.splice(index, 1);
        renderSkillList();
    }

    function renderSkillList() {
        if (!skillList) return;
        
        skillList.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <span class="skill-item-name">${skill.name}</span>
                <span class="skill-item-level">レベル: ${skill.level}</span>
                <button type="button" class="skill-item-remove" data-index="${index}">×</button>
            `;
            skillList.appendChild(skillItem);
        });

        // 削除ボタンのイベントリスナーを追加
        const removeButtons = skillList.querySelectorAll('.skill-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                removeSkill(index);
            });
        });
    }

    // マスタからスキルを追加
    if (skillMaster) {
        skillMaster.addEventListener('change', function() {
            if (this.value) {
                const option = this.options[this.selectedIndex];
                const skillId = option.value;
                const skillName = option.text;
                addSkill(skillId, skillName, false);
            }
        });
    }

    // カスタムスキルを追加
    if (skillAddBtn) {
        skillAddBtn.addEventListener('click', function() {
            const customSkillName = skillCustom.value.trim();
            if (customSkillName) {
                addSkill(null, customSkillName, true);
            } else {
                alert('スキル名を入力してください');
            }
        });
    }

    // Enterキーでカスタムスキルを追加
    if (skillCustom) {
        skillCustom.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                skillAddBtn.click();
            }
        });
    }
}

/**
 * フォームバリデーション
 */
function validateForm() {
    const projectName = document.getElementById('project-name');
    const endCompany = document.getElementById('end-company-selected');
    
    let isValid = true;
    const errors = [];

    // 案件名の必須チェック
    if (!projectName || !projectName.value.trim()) {
        isValid = false;
        errors.push('案件名は必須です');
        if (projectName) {
            projectName.style.borderColor = '#e74c3c';
        }
    } else if (projectName) {
        projectName.style.borderColor = '#e0e0e0';
    }

    // エンド会社の必須チェック
    if (!endCompany || endCompany.style.display === 'none') {
        isValid = false;
        errors.push('案件エンド会社は必須です');
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
                    // フォームの値を取得してオブジェクトにまとめる
                };
                console.log('フォーム送信:', formData);
                alert('案件を登録しました（モック）');
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('入力内容を破棄して戻りますか？')) {
                // TODO: 前の画面に戻る
                console.log('キャンセル');
            }
        });
    }
}

/**
 * 検索機能（モック）
 */
function initSearch() {
    const searchInputs = document.querySelectorAll('.modal-search-input');
    const searchButtons = document.querySelectorAll('.modal-search-btn');

    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const searchInput = button.previousElementSibling;
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            // TODO: APIで検索処理を実行
            console.log('検索:', searchTerm);
        });
    });

    // Enterキーで検索
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchBtn = this.nextElementSibling;
                if (searchBtn) {
                    searchBtn.click();
                }
            }
        });
    });
}

/**
 * 新規取引先登録ボタン
 */
function initNewCompanyButton() {
    const newCompanyBtn = document.querySelector('.modal-new-btn');
    if (newCompanyBtn) {
        newCompanyBtn.addEventListener('click', function() {
            // TODO: 新規取引先登録画面に遷移
            console.log('新規取引先登録');
            alert('新規取引先登録画面に遷移します（モック）');
        });
    }
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
                <span class="selected-value-text">${item.name}${isLikePattern ? ' (LIKE)' : ''}</span>
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
 * メーリングリスト選択処理（複数選択）
 */
function initMailingListSelection() {
    const selectBtn = document.getElementById('mailing-list-btn');
    const selectedDiv = document.getElementById('mailing-list-selected');
    const selectedList = document.getElementById('mailing-list-selected-list');
    const removeAllBtn = document.getElementById('mailing-list-remove-all');
    const selectorComponent = document.querySelector('app-mailing-list-selector');
    
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
                <span class="selected-value-text">${item.name}</span>
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
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', function() {
    initModals();
    initCompanySelection();
    initProjectManagerSelection();
    initSkillSelection();
    initBlacklistSelection();
    initMailingListSelection();
    initFormSubmit();
    initSearch();
    initNewCompanyButton();
});

