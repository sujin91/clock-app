import View from './View.js'

import { TAB_NAMES } from '../Constants.js'

class TabView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$tabList = this.createElement('ul', 'tab_list', 'tabs')
        this.$element.append(this.$tabList)
        
        this.tabList = [TAB_NAMES.CLOCK, TAB_NAMES.ALARM, TAB_NAMES.STOPWATCH]

        this.render(this.tabList)
        this.bindEvent()
        this.setActiveTab(TAB_NAMES.CLOCK)
    }

    setActiveTab(tabName) {
        this.$tab = this.$element.querySelectorAll('#tabs li')

        for(const li of this.$tab) {
            li.className = li.innerHTML === tabName ? 'active' : ''
        }

        this.tabName = tabName
    }

    bindEvent() {
        this.$tabList.addEventListener('click', this.onClickTab)
    }

    onClickTab = e => {
        //탭변화 있으면
        if (this.tabName !== e.target.innerHTML && e.target.tagName === 'LI') {
            this.setActiveTab(e.target.innerHTML)
            this.emit('@CHANGE', { tabName: this.tabName })
        }
    }

    render(tabList) {
        tabList.forEach(item => {
            const $li = this.createElement('li')
            $li.innerHTML = item

            this.$tabList.append($li)
        })
    }
}

export default TabView
