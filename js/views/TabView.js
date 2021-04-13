import View from './View.js'

import { TAB_NAMES } from '../constants.js'

class TabView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$tab = this.$element.querySelectorAll('#tabs li')

        this.bindTabEvent()
        this.setActiveTab(TAB_NAMES.CLOCK)
    }

    setActiveTab(tabName) {
        for(const li of this.$tab) {
            li.className = li.innerHTML === tabName ? 'active' : ''
        }
        this.tabName = tabName
    }

    bindTabEvent() {
        for(const li of this.$tab) {
            li.addEventListener('click', e => this.onClickTab(li.innerHTML))
        }
    }

    onClickTab(tabName) {
        //탭변화 있으면
        if(this.tabName !== tabName) {
            this.setActiveTab(tabName)
            this.emit('@CHANGE', { tabName })
        }
    }
}

export default TabView
