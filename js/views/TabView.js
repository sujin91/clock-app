import View from './View.js'

class TabView extends View {
    constructor( $target ) {
        super();
        this.$element = $target
        this.$tab = this.$element.querySelectorAll('.tab_list li')

        this.tabNames = {
            clock: '시계',
            alarm: '알람',
            stopwatch: '스톱워치',
        }

        this.bindClick()
    }

    setActiveTab = tabName => {
        for(const li of this.$tab) {
            li.className = li.innerHTML === tabName ?  'active' : ''
        }
    }

    bindClick = () => {
        for(const li of this.$tab) {
            li.addEventListener('click', e => this.onClick(li.innerHTML))
        }
    }

    onClick = tabName => {
        this.setActiveTab(tabName)
        this.emit('@change', { tabName })
    }
}

export default TabView
