

window.addEventListener("load", function () {
    setGlobalConstants();
    listenUp();
    if (popupcontent.innerHTML!=""){
        this.alert(popupcontent.innerText);
    }
});


//Set some global variables.
function setGlobalConstants() {
    // define vars
    editor = document.getElementsByClassName('editor')[0];
    toolbar = editor.getElementsByClassName('toolbar')[0];
    buttons = toolbar.querySelectorAll('.btn:not(.has-submenu)');
    contentArea = editor.getElementsByClassName('content-area')[0];
    visuellView = contentArea.getElementsByClassName('visuell-view')[0];
    htmlView = contentArea.getElementsByClassName('html-view')[0];
    modal = document.getElementsByClassName('modal')[0];
    newArticleButton = document.getElementById("makeNewArticle");
    editArticleButton = document.getElementById("updateExisitingArticle");
    loadArticleButton = document.getElementById("loadArticle");
    uploadButton = document.getElementById("uploadButton");
    bodyHintText = document.getElementById("bodyHintText");
    popupcontent = document.getElementById("popupcontent");
}

function listenUp() {
    // add active tag event
    document.addEventListener('selectionchange', selectionChange);
    
    if (newArticleButton != null) {
        newArticleButton.addEventListener('click', function() {
            saveNewArticle()}
            );
    }

    if (editArticleButton != null) {
        editArticleButton.addEventListener('click', function() {
            editExisitingArticle()}
            );
    }

    if (bodyHintText != null) {
        visuellView.addEventListener('click', function() {
            //console.log("click detected in editor");
            deleteHintText(bodyHintText)}
            );
    }
    
    uploadButton.addEventListener('click', function() {
        processEditor()}
        );
    loadArticleButton.addEventListener('click', loadArticle);

    // add toolbar button actions
    let button;
    for(button of buttons) {

    button.addEventListener('click', function(e) {
        let action = this.dataset.action;
        switch(action) {
        case 'code':
            execCodeAction(this, editor);
            break;
        case 'createLink':
            execLinkAction();
            break;
        default:
            execDefaultAction(action);
        }

    });
    }

    // add link action
    function execLinkAction() {  
    modal.style.display = 'block';
    let selection = saveSelection();

    let submit = modal.querySelectorAll('button.done')[0];
    let close = modal.querySelectorAll('.close')[0];
    
    // done button active => add link
    submit.addEventListener('click', function() {
        let newTabCheckbox = modal.querySelectorAll('#new-tab')[0];
        let linkInput = modal.querySelectorAll('#linkValue')[0];
        let linkValue = linkInput.value;
        let newTab = newTabCheckbox.checked;    
        
        restoreSelection(selection);
        
        if(window.getSelection().toString()) {
        let a = document.createElement('a');
        a.href = linkValue;
        if(newTab) a.target = '_blank';
        window.getSelection().getRangeAt(0).surroundContents(a);
        }

        modal.style.display = 'none';
        linkInput.value = '';
        
        // deregister modal events
        submit.removeEventListener('click', arguments.callee);
        close.removeEventListener('click', arguments.callee);
    });  
    
    // close modal on X click
    close.addEventListener('click', function() {
        let linkInput = modal.querySelectorAll('#linkValue')[0];
        
        modal.style.display = 'none';
        linkInput.value = '';
        
        // deregister modal events
        submit.removeEventListener('click', arguments.callee);
        close.removeEventListener('click', arguments.callee);
    });
    }

    // executes normal actions
    function execDefaultAction(action) {
    document.execCommand(action, false);
    }

    // saves the current selection
    function saveSelection() {
        if(window.getSelection) {
            let sel = window.getSelection();
            if(sel.getRangeAt && sel.rangeCount) {
                let ranges = [];
                for(var i = 0, len = sel.rangeCount; i < len; ++i) {
                    ranges.push(sel.getRangeAt(i));
                }
                return ranges;
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    // loads a saved selection
    function restoreSelection(savedSel) {
        if(savedSel) {
            if(window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                for(var i = 0, len = savedSel.length; i < len; ++i) {
                    sel.addRange(savedSel[i]);
                }
            } else if(document.selection && savedSel.select) {
                savedSel.select();
            }
        }
    }
}

// sets the current format buttons active/inactive
function selectionChange() {

    for(let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.classList.remove('active');
    }
    
    parentTagActive(window.getSelection().anchorNode.parentNode);

    console.log(window.getSelection().toString());
    }

// this function toggles between visual and html view
function execCodeAction(button, editor) {

    if(button.classList.contains('active')) { // show visuell view
        visuellView.innerHTML = htmlView.value;
        htmlView.style.display = 'none';
        visuellView.style.display = 'block';

        button.classList.remove('active');     
    } else {  // show html view
        htmlView.innerText = visuellView.innerHTML;
        visuellView.style.display = 'none';
        htmlView.style.display = 'block';

        button.classList.add('active'); 
    }
}

function parentTagActive(elem) {
    if(elem.classList.contains('visuell-view')) return false;
    let toolbarButton;

    // active by tag names
    let tagName = elem.tagName.toLowerCase();
    toolbarButton = document.querySelectorAll(`.toolbar .btn[data-tag-name="${tagName}"]`)[0];
    if(toolbarButton) {
        toolbarButton.classList.add('active');
    }

    // active by text-align
    let textAlign = elem.style.textAlign;
    toolbarButton = document.querySelectorAll(`.toolbar .btn[data-style="textAlign:${textAlign}"]`)[0];
    if(toolbarButton) {
        toolbarButton.classList.add('active');
    }

    return parentTagActive(elem.parentNode);
}

function toggleHeading() {
    console.log("attemptingToToggleHeading");
}

function processEditor() {
    console.log("image upload function called");
    const hiddenTitleField = document.getElementById("articleTitleHidden");
    if (hiddenTitleField!=null) {
        hiddenTitleField.value = document.getElementById("articleTitleBox").value;
    }     
    document.getElementById("imageUploadContent").value = document.getElementById("editorContent").innerHTML;
    return true;
  }

//This function creates a new article.
function saveNewArticle() {
    console.log("trying to save editor contents")
    console.log("process function called");
    document.getElementById("articleContent").value = document.getElementById("editorContent").innerHTML;
    return true;
}

function editExisitingArticle() {
    console.log("trying to update existing article with editor contents")
    console.log("process function called");
    document.getElementById("articleContent").value = document.getElementById("editorContent").innerHTML;
    return true;
}

//Doesn't do anything yet, but we will make it do things later with editing articles.
function loadArticle() {
    return null;
}

function deleteHintText(element) {
    element.innerHTML = "";
}