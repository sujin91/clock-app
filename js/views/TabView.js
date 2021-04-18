import View from './View.js'

import { TAB_NAMES } from '../Constants.js'

class TabView extends View {
    constructor($target) {
        super()
        const DEFAULT_TAB = TAB_NAMES.CLOCK
        this.$element = $target
        this.$tabList = this.createElement('ul', 'tab_list', 'tabs')
        this.$element.append(this.$tabList)
        this.tabList = Object.values(TAB_NAMES)

        this.render(this.tabList)
        this.bindEvent()
        this.setActiveTab(DEFAULT_TAB) // 디폴트 탭: 시계
    }

    setActiveTab(tabName) {
        this.$tab = this.$element.querySelectorAll('#tabs li')

        for (const li of this.$tab) {
            li.className = li.innerHTML === tabName ? 'active' : ''
        }

        this.tabName = tabName
    }

    bindEvent() {
        this.$tabList.addEventListener('click', this.onClickTab)
    }

    onClickTab = (e) => {
        // 탭변화 있으면 && li요소이면
        if (this.tabName !== e.target.innerHTML && e.target.tagName === 'LI') {
            this.setActiveTab(e.target.innerHTML)
            this.emit('@CHANGE', { tabName: this.tabName }) // 탭 클릭 broadcast
        }
    }

    render(tabList) {
        tabList.map((item) => {
            const $li = this.createElement('li')
            $li.innerHTML = item
            this.$tabList.append($li)
        })
    }
}

export default TabView
