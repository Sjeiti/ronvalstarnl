//window.onerror = err=>alert(err)

import '../style/screen.less'
import './views'
import './head'
import {initialise} from './component'
import './component/Search'
import './component/Header'
import './component/Code'
import './component/Icon'
import './component/Skill'

initialise()

import './signal/scroll'
