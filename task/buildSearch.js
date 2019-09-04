const {promisify} = require('util')
const glob = promisify(require('glob'))
// const fetch = require('node-fetch')
const utils = require('./util/utils.js')
const {read, save} = utils
// const {parse} = require('node-html-parser')

const common = [
  'you','was','the','got','for','but'
  ,'bit','are','and','all','with','want','than'
  ,'same','post','late','know','just','here'
  ,'from','done','never','bring','so8230'
  ,'reason','really','holler','hellip','finish'
  ,'better','it8217s','i8217ll','anybody'
  ,'on','my','me','in','two','put','not','may'
  ,'has','those'
  ,'yet','yes','wtf','wow','won','win','wil'
  ,'why','who','web','way','wap','via','var'
  ,'van','val','v15','use','try','top','too'
  ,'ton','tif','ten','tea','tag','tad','tab'
  ,'sub','src','six','sip','sin','she','set'
  ,'see','sea','scr','say','saw','sad','run'
  ,'row','ron','rom','rel','red','ran','pro'
  ,'pow','pos','pop','pie','per','pay','pad'
  ,'own','out','our','org','one','old','okt'
  ,'off','obj','nr5','now','nov','nor','non'
  ,'net','mtv','mrt','mrs','moz','mov','mod'
  ,'mix','mis','min','met','max','map','man'
  ,'low','lot','log','lib','let','len','led'
  ,'kok','key','ken','jun','jos','job','jaw'
  ,'jan','its','isn','ish','int','ins','img'
  ,'iky','huh','htc','how','hot','hit','his'
  ,'hey','hex','her','had','god','get','gen'
  ,'fny','fnx','fns','fix','fff','few','far'
  ,'fan','f00','etc','err','env','end','elm'
  ,'ehm','eeh','dvd','due','dra','dpi','don'
  ,'div','dir','dig','die','did','dev','dec'
  ,'day','dam','cut','cus','cup','cs6','cos'
  ,'com','can','buy','bug','btw','boy','box'
  ,'bot','big','bed','bat','bar','bad','awd'
  ,'ass','art','arr','apt','app','any','amp'
  ,'aka','ago','age','add','act'
  ,'zoom','zero','your','year','yeah','word'
  ,'woot','wish','wise','will','wild','when'
  ,'what','were','went','well','week','ways'
  ,'wasn','walk','wake','wait','view','very'
  ,'vary','vars','uses','user','used','uris'
  ,'upon','unix','ugly','typo','turn','true'
  ,'toys','toxi','tops','tool','took','tons'
  ,'told','todo','tldr','tips','thus','they'
  ,'then','them','that','test','term','tend'
  ,'tell','talk','take','tags','swim','suri'
  ,'sure','sup2','suck','such','stuf','stay'
  ,'stam','spun','spot','spit','spec','soon'
  ,'some','snow','slow','skip','skim','sign'
  ,'side','show','sept','sent','send','sell'
  ,'self','sees','seen','seem','seek','sean'
  ,'sdfe','scan','says','sake','said','runs'
  ,'rule','ruiz','ruby','room','rome','roll'
  ,'roam','risk','real','read','rdjh','rate'
  ,'rank','quit','puts','push','pure','pull'
  ,'proj','pose','poor','pool','plus','plug'
  ,'play','plan','pivo','pity','pile','pigs'
  ,'pick','pfff','peek','past','pass','part'
  ,'pans','pair','pain','paid','page','pace'
  ,'over','outs','orig','open','onto','only'
  ,'ones','once','okay','octx','note','none'
  ,'nice','next','news','need','neck','neat'
  ,'near','nbsp','name','must','much','move'
  ,'most','more','mode','mine','mind','mess'
  ,'mere','menu','mean','mark','many','make'
  ,'main','mail','made','luck','lots','lost'
  ,'look','long','lock','live','link','like'
  ,'lies','libs','lets','lens','left','lead'
  ,'last','lack','l33t','knew','kind','kids'
  ,'kick','keys','kept','kees','keep','keen'
  ,'jong','joke','join','john','jobs','item'
  ,'into','init','img_','idea','hunt','hugo'
  ,'huge','hour','host','hope','hook','home'
  ,'holy','hole','hold','hmmm','hits','hire'
  ,'high','hide','hero','help','hell','held'

  ,'hear','head','have','hash','hard','hand'
  ,'half','haha','hadn','guys','gras','grab'
  ,'good','gone','gold','goes','goal','give'
  ,'gist','girl','gifs','gets','geek','gave'
  ,'game','full','fuck','free','frdy','frdx'
  ,'frds','four','form','font','fond','fold'
  ,'flat','flag','five','fine','find','film'
  ,'fill','file','felt','fell','feel','feed'
  ,'fear','fast','fair','fade','fact','face'
  ,'evil','ever','even','ends','else','eehr'
  ,'eeeh','edit','edge','easy','ears','earn'
  ,'duty','dust','dump','dude','drop','draw'
  ,'down','dove','dots','does','docs','divs'
  ,'didn','devs','demo','deep','deal','days'
  ,'dawn','dare','cute','crux','crap','cost'
  ,'cook','conf','cone','come','city','cave'
  ,'case','care','card','came','call','cake'
  ,'busy','burp','bulk','bugs','bots','both'
  ,'boss','book','bold','body','boat','blow'
  ,'bits','bide','best','beer','been','beat'
  ,'bear','bash','base','bank','ball','back'
  ,'baby','axis','axes','away','auto','asks'
  ,'arse','aren','apps','anti','also','aimg'
  ,'ages','adds','able','zooms','yummy','yield'
  ,'years','wrote','wrong','write','wraps','would'
  ,'worth','worst','worse','world','works','words'
  ,'woods','wiped','width','whole','whish','while'
  ,'which','where','wheel','weten','weren','weird'
  ,'weeks','weeds','watch','wants','visit','views'
  ,'vague','usual','using','users','usage','upped'
  ,'until','unset','under','typed','twice','tweak'
  ,'turns','tuned','tries','tried','trick','trial'
  ,'trend','trees','train','trade','track','towns'
  ,'tough','total','topic','tools','todos','today'
  ,'title','times','tiles','tifft','throw','threw'
  ,'three','third','think','thing','these','there'
  ,'their','tests','terms','tells','tasks','takes'
  ,'taken','taint','table','suite','sugar','sucks'
  ,'style','stunt','stuff','study','stuck','strip'
  ,'story','store','stone','still','stick','stext'
  ,'steep','stays','stats','stash','start','stamp'
  ,'spent','spend','speak','spark','spare','spans'
  ,'space','sound','souls','sorts','sorry','smart'
  ,'small','slows','slime','slice','sleep','sizes'
  ,'sized','sixty','sixth','sites','since','sight'
  ,'sides','shows','shown','short','ships','shims'
  ,'shelf','sheet','sheer','shear','share','shame'
  ,'setup','serve','sense','seems','scode','scene'
  ,'scary','scare','scans','saves','saved','safer'
  ,'s0o8i','rusty','rules','ruins','royal','round'
  ,'rough','rocks','roads','rigid','right','renew'
  ,'ready','reads','reach','range','qunit','quite'
  ,'quilt','quick','prove','proud','proof','prone'
  ,'prize','prior','print','price','press','pound'
  ,'posts','pocus','pmth4','place','piece','phone'
  ,'phace','paths','paste','party','parts','pairs'
  ,'paint','pages','other','opera','older','often'
  ,'odata','occur','nodes','night','nifty','nicer'
  ,'newly','newer','needs','names','named','mypos'
  ,'moved','motto','moons','month','money','mixed'
  ,'minus','might','meten','messy','merry','medal'
  ,'means','mayke','maybe','matic','mario','makes'
  ,'maker','lying','lucky','lower','loved','lorem'
  ,'looks','loads','liven','lists','links','liked'
  ,'light','leave','least','learn','leaks','laugh'
  ,'later','lasts','large','laden','knows','known'
  ,'kicks','keeps','jules','jason','items','isnum'
  ,'isize','ipads','iotic','input','image','idiot'
  ,'ideas','humid','human','house','hours','horse'
  ,'hoped','henri','hence','hello','heard','haxor'
  ,'haven','happy','handy','group','green','great'
  ,'grasp','gonna','going','gmail','given','giant'
  ,'fysin','funny','fully','front','fresh','found'
  ,'forth','fntmp','flare','first','fired','final'
  ,'filed','favor','fancy','faked','extra','exist'
  ,'exact','entry','enter','enjoy','ended','elout'
  ,'eight','dusty','dummy','dryer','drive','drawn'
  ,'doing','doesn','ditch','depth','david','daily'
  ,'cycle','curve','curly','cruel','crawl','craig'
  ,'crack','couse','could','corny','comic','coelr'
  ,'codex','coded','cloud','close','claim','check'
  ,'cheat','cheap','chain','cause','catch','carry'
  ,'cared','candy','cache','bunch','built','brute'
  ,'broke','break','brace','bound','bored','bloat'
  ,'black','bitch','bezig','below','being','bdate'
  ,'based','badly','asked','argue','april','apart'
  ,'angle','alter','alpha','along','alone','allow'
  ,'agree','agile','again','after','added','above'

  ,'about','zipped','wouldn','worked','wonder'
  ,'within','winner','window','willem','wether'
  ,'webcam','wanted','visual','viewer','viewed'
  ,'vertex','versed','useful','upward','upside'
  ,'upload','update','unused','untill','unread'
  ,'unpack','unlike','unhide','uglier','typing'
  ,'twelve','turned','tucked','trying','tricky'
  ,'travel','traded','toward','toggle','tissue'
  ,'timing','ticket','though','thirty','thingy'
  ,'theory','thefwa','tester','tested','target'
  ,'taking','tagged','switch','sweden','sunday'
  ,'suited','substr','stupid','studio','strain'
  ,'stored','stefan','square','spider','sparse'
  ,'sorted','sooner','solver','solved','solely'
  ,'slower','sloppy','slight','sleepy','simply'
  ,'should','shaved','shared','severe','select'
  ,'seeing','secure','second','scared','saying'
  ,'saving','safely','rolled','roamed','revise'
  ,'rested','resort','reside','rescue','remedy'
  ,'remake','recent','rather','rarely','quirky'
  ,'proved','proper','pricey','pretty','preset'
  ,'prefix','posted','ported','poorly','poored'
  ,'policy','plenty','please','player','played'
  ,'placed','pissed','person','people','pcloud'
  ,'pasted','partly','parsed','parked','overal'
  ,'ovalue','osheet','oneday','oliver','notnot'
  ,'notice','normal','nobody','nicest','nicely'
  ,'needle','needed','neatly','neater','navier'
  ,'native','naming','myself','mutual','moving'
  ,'mostly','moreso','monday','module','modern'
  ,'mockup','missed','middle','merged','mental'
  ,'measly','matter','mapped','mangle','manage'
  ,'making','mainly','magnet','lowest','losing'
  ,'looked','longer','loaded','living','lively'
  ,'little','listed','likely','letter','lesser'
  ,'latter','latest','lately','lastly','larger'
  ,'jagged','itself','islive','island','invoke'
  ,'invest','insist','inside','insane','indeed'
  ,'ihsize','hungry','humble','hubcap','hourly'
  ,'hooked','higher','hiding','having','hassle'
  ,'hardly','harder','happen','handle','gotten'
  ,'glance','giving','gather','garden','future'
  ,'frozen','friend','french','fourth','former'
  ,'format','forgot','forget','forced','footer'
  ,'follow','fnswap','flying','fluffy','flavor'
  ,'fixing','filled','figure','faster','faking'
  ,'failed','extent','evenly','eugene','etched'
  ,'erased','entity','entire','ensure','enough'
  ,'emerge','either','easily','easier','earned'
  ,'during','dragen','detail','derive','deploy'
  ,'depend','denser','decide','daniel','damage'
  ,'crappy','couple','couldn','costly','corner'
  ,'copied','cooler','cooked','convey','coming'
  ,'color2','color1','closer','closed','client'
  ,'clever','circle','church','chosen','choose'
  ,'choice','chance','cavern','caveat','caused'
  ,'cannot','called','bullet','bugged','broken'
  ,'breeze','bought','bother','botany','boring'
  ,'border','bloody','beyond','belong','behold'
  ,'behing','behind','before','become','beauty'
  ,'author','attack','asylum','aslive','asking'
  ,'around','arange','appear','anyway','anyone'
  ,'amount','almost','albeit','adjust','adhere'
  ,'adding','addict','addflv','actual','active'
  ,'aaargh','zooming','wrongly','written','writing'
  ,'wrapped','worried','working','without','willing'
  ,'whieeee','whether','weirdly','weekend','webpage'
  ,'wasting','warning','wanting','walking','viewing'
  ,'variant','values2','values1','utterly','usually'
  ,'usefull','upgrade','updated','unhappy','unclear'
  ,'typepad','turning','trouble','trivial','trigger'
  ,'tracker','touched','totally','toggled','through'
  ,'thougth','thought','theorem','textual','testing'
  ,'telling','teeming','tapping','talking','tainted'
  ,'tabstop','syncing','svn2git','suspect','suppose'
  ,'suffice','sucking','storing','startup','started'
  ,'stampen','stacked','squared','sponsor','spoiler'
  ,'specify','special','speaker','spacial','someone'
  ,'somehow','someday','smaller','slowing','slowest'
  ,'slicing','sixteen','similar','sifting','siberia'
  ,'showing','shouldn','shortly','shorter','shinier'
  ,'sheared','several','settled','setsize','session'
  ,'sending','section','scratch','schmidt','satisfy'
  ,'sailing','running','roughly','ripping','rewrote'
  ,'resized','removed','removal','relying','relaxed'
  ,'reflect','reduced','recurse','rebuild','realize'
  ,'realism','reading','reacted','reached','ranting'
  ,'ranging','rainbow','quiting','quickly','putting'
  ,'pushing','purpose','publish','program','proceed'
  ,'problem','pricing','preview','prevent','present'
  ,'prepend','precise','porting','popular','popping'
  ,'pointed','poincar','playing','perfect','payment'
  ,'patient','pasting','passing','passage','parsing'
  ,'overall','outside','ordered','optimum','optimal'
  ,'opposed','opinion','ontario','offered','nowhere'
  ,'noticed','nothing','notepad','nitpick','newyear'
  ,'neither','nearest','natural','nanoxml','myfloat'
  ,'mscript','missing','minimum','minimal','mindset'
  ,'million','migrate','medvjed','meaning','mashing'
  ,'mapping','managed','luckily','looping','looking'
  ,'locally','loading','listing','linking','limited'
  ,'lifting','letting','lengthy','leaving','learned'
  ,'learing','lazered','laporte','labgame','kubrick'
  ,'kitchen','keyword','keeping','karsten','january'
  ,'janjina','invoked','invited','intense','instead'
  ,'install','initial','incline','imaging','imagine'
  ,'ignored','iconico','hundred','however','hosting'
  ,'horizon','hooking','history','highest','helpful'
  ,'handled','halfway','hacking','guessed','growing'
  ,'gritted','granted','goodbye','getting','getname'
  ,'further','fucking','freedom','frdssin','frankly'
  ,'founded','formula','forming','floored','fire_iv'
  ,'finding','finally','figured','fifteen','feeding'
  ,'falling','factory','extract','explore','explain'
  ,'examine','exactly','everday','esc_url','enlarge'
  ,'english','england','elegant','elapsed','eeeeehm'
  ,'easiest','earlier','dynamic','dropped','driving'
  ,'drawing','dragged','divided','diverse','ditched'
  ,'display','discard','digging','diagram','desired'
  ,'derived','declare','decimal','decided','dealing'
  ,'crossed','cropped','creator','created','covered'
  ,'coupled','correct','copying','convert','contest'
  ,'conjure','concept','compute','compare','company'
  ,'combine','colored','collect','clearly','clearer'
  ,'cleanup','clarity','checked','charset','charged'
  ,'chaotic','changed','certain','ceiling','causing'
  ,'catalog','cashing','capital','capable','calling'
  ,'butthat','browser','broaden','briefly','brevity'
  ,'bosnian','borowed','blindly','billion','biggest'
  ,'between','because','basicly','bashing','baroque'
  ,'bargain','backend','awesome','awaited','article'
  ,'aquired','applied','anytime','anymore','another'
  ,'ancient','america','altered','alright','already'
  ,'allowed','aliased','against','advance','adapted'
  ,'account','ability','yourself','wrapping'
  ,'workflow','wordlike','whenever','whatever'
  ,'weirdest','visiting','vacation','uploaded'
  ,'upgraded','updating','unwanted','unsplash'
  ,'unclosed','ultimate','tweaking','tutorial'
  ,'trstenik','trickier','trickery','traverse'
  ,'trailing','tracking','tortoise','together'
  ,'tiresome','tileable','throwing','thousand'
]

const basePath = './src/data/search/'

glob('src/data/json/@(post|page|fortpolio)_*.json')
  // .then(a=>(console.log(a),a))
  //.then(files=>files.slice(0,5))
  .then(files=>Promise.all(files.map(read)))
  .then(files=>files.map(parseJSON))
  .then(files=>{
    const index = createIndex(files)
    mapIndex(files,index)
  })

function parseJSON(s){
  let parsed
  try {
    parsed = JSON.parse(s)
  } catch (err) {
    console.error(err,s)
  }
	return parsed
}

function createIndex(files){
  const words = files
    .map(file=>{
      const title = file.title.rendered||file.title
      const content = file.content.rendered||file.content
      const excerpt = file.excerpt.rendered||file.excerpt
      return [title,content,excerpt]
        .join(' ')
        .replace(/<\/?[^>]+(>|$)/g,' ')
        .replace(/[^\w\s]/g,' ')
        .toLowerCase()
        .split(/\s/g)
    })
    .reduce((acc,a)=>(acc.push(...a),acc),[])
  const text = words
    .filter((s,i,a)=>a.indexOf(s)===i)
    .filter(s=>s.length>2&&s.length<13)
    .filter(s=>!/^\d{3}$|^\d+\w+$|^_|s$/.test(s))
    .filter(s=>!common.includes(s))
    .sort()
    .sort((a,b)=>a.length>b.length?1:-1)
  console.log(text.length)
  save(basePath+'words.json',JSON.stringify(text))
  return text
}

function mapIndex(files,index){
  index
    //.slice(0,132)
    .forEach(word=>{
      const slugs = files
        .filter(file=>{
          const title = file.title.rendered||file.title
          const content = file.content.rendered||file.content
          const excerpt = file.excerpt.rendered||file.excerpt
          const string = [title,content,excerpt]
            .join(' ')
            .replace(/<\/?[^>]+(>|$)/g,' ')
            .replace(/[^\w\s]/g,' ')
            .toLowerCase()
          return string.includes(word)
        })
        .map(file=>file.type+'_'+file.slug)
      save(basePath+`s_${word}.json`,JSON.stringify(slugs))
      //console.log(word,slugs)
    })
}