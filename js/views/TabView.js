import View from './View.js'
import { TabNames } from '../constants.js'

class TabView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$tab = this.$element.querySelectorAll('.tab_list li')

        this.bindClick()
        this.setActiveTab(TabNames.CLOCK)
    }

    setActiveTab(tabName) {
        for(const li of this.$tab) {
            li.className = li.innerHTML === tabName ?  'active' : ''
        }
        this.tabName = tabName
    }

    bindClick() {
        for(const li of this.$tab) {
            li.addEventListener('click', e => this.onClick(li.innerHTML))
        }
    }

    onClick(tabName) {
        //탭변화 있으면
        if(this.tabName !== tabName) {
            this.setActiveTab(tabName)
            this.emit('@change', { tabName })
        }
    }
}

export default TabView
