const inputTag = document.querySelector('#form-control')
const inputCheck = document.querySelector('.check-input-readonly')
const tagField = document.querySelector('.form-tags')
//
//
//
class WithData {
    constructor() {
        this.readonly = inputCheck.checked
    }
    get item() {
        return this.value
    }

    set item(newValue) {
        return (this.value = newValue)
    }

    // getting list of items
    get itemList() {
        return this.items
    }

    // setting list of items in local
    set itemList(mas) {
        return (this.items = mas)
    }

    // add item to localStore
    addItemStorage = newValue => {
        if (!this.readonly) {
            localStorage.setItem(localStorage.length, newValue ? newValue : this.value)
        }
    }

    // remove item(id)
    removeItemStorage = id => {
        const newTags = this.getItemListStorage()
        localStorage.clear()
        newTags.splice(id, 1)
        this.addItemListStorage(newTags)
    }

    // add a new list instead of the previous
    addItemListStorage = mas => {
        localStorage.clear()
        mas.forEach(el => {
            this.addItemStorage(el)
        })
    }

    // get a list of added tags
    getItemListStorage = () => {
        let values = []
        for (let key = localStorage.length - 1; key >= 0; key--) {
            values.push(localStorage[key])
        }
        return values.reverse()
    }

    // setting an internal veriable
    switcherReadonly = boolean => {
        this.readonly = boolean
    }

    updateSettings = id => {
        if (!id) return
        if (!this.readonly) {
            inputTag[0].value = localStorage[id]
            inputTag[0].focus()
            this.input = inputTag[0].value
            this.id = id
        }
    }
}
const Storage = new WithData()
//
//
//
//
//
//
class TagUI {
    constructor() {
        this.readonly = inputCheck.checked
    }

    switcherReadonly = boolean => {
        this.readonly = boolean
    }

    clearField = () => {
        tagField.innerHTML = ' '
    }

    renderTag = () => {
        this.clearField()

        if (!localStorage.length) {
            this.clearField()
            this.showEmptyMsg()
            return
        }

        let fragment = ''

        for (let key = localStorage.length - 1; key >= 0; key--) {
            const value = localStorage[key]
            fragment += TagUI.tagTemplate(value, key)
        }

        tagField.insertAdjacentHTML('afterbegin', fragment)
    }

    removeTag = id => {
        if (!this.readonly) {
            Storage.removeItemStorage(id)
            this.renderTag()
        }
    }

    updateTag = ({ target }) => {
        if (target.classList.contains('btn-close-tag')) {
            this.removeTag(target.parentElement.id)
        }
        if (target.id || target.classList.contains('tag-name')) {
            if (target.classList.contains('tag-name')) {
                Storage.updateSettings(target.parentElement.id)
            }
            if (target.id) {
                Storage.updateSettings(target.id)
            }
        } else {
            inputTag[0].value = ''
            Storage.updateSettings(null)
        }
    }

    showEmptyMsg() {
        const template = TagUI.emptyMsgTemplate()
        tagField.insertAdjacentHTML('afterbegin', template)
    }

    static emptyMsgTemplate() {
        return `
        <Span class='tickets-empty-res-msg noselect'>
          Currently no tags
        </Span>
        `
    }

    static tagTemplate(value, id) {
        return `
        <div id="${id}" class="tag">
            <span class="tag-name noselect max-size-tag">${value}</span>
            <button class="btn btn-close-tag noselect">X</button>
        </div>
        `
    }
}
const TagView = new TagUI()
//
//
//
//
//
//
inputTag.addEventListener('submit', e => {
    e.preventDefault()
    if (inputTag[0].value) {
        Storage.addItemStorage(inputTag[0].value)
        inputTag.reset()
        TagView.renderTag()
    }
    if (Storage.input == localStorage[Storage.id] && localStorage[Storage.id]) {
        Storage.removeItemStorage(Storage.id)
        inputTag.reset()
        TagView.renderTag()
    }
})

inputCheck.addEventListener('click', () => {
    Storage.switcherReadonly(inputCheck.checked)
    TagView.switcherReadonly(inputCheck.checked)
})

tagField.addEventListener('click', TagView.updateTag)
