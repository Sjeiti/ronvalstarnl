//window.onerror = err=>alert(err)

import '../style/screen.less'
import './views'
import './head'
import {initialise} from './component'
import './component/Search'
import './component/Header'
import './component/Code'

initialise()

import './signal/scroll'
