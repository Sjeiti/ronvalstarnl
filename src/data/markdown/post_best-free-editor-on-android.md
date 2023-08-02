<!--
  date: 2017-08-09
  modified: 2020-03-16
  slug: best-free-editor-on-android
  type: post
  header: termux.png
  categories: code, CSS, HTML, JavaScript
  tags: CSS, HTML, JavaScript, cli, linux, bash, android
  description: Apps for programming on an Android are clumsy at best, and full of adds. But the best one is really just a Linux terminal: Termux!
  sticky: true
-->

# The best programming editor on Android is free

If you are so hooked on programming that you even do it on tablets and phones I have a suggestion for you. A few years back I used [Textastic](https://www.textasticapp.com/) on an iPad. But since that was an iPad one and phones have come a long way I just use Android now (when I have no pc in sight that is).

## Android programming apps

There’s plenty of choice for Android when it comes to programming editors since it is less restricted than IOS. So naturally there is also tons of crap.  
Another problem is that for Web programming you will mostly need a web server, mostly an app to install separately.  
I have used both [anWriter](https://play.google.com/store/apps/details?id=com.ansm.anwriter) and [AWD](https://play.google.com/store/apps/details?id=org.kidinov.awd) together with [SimpleHttpServer](https://play.google.com/store/apps/details?id=jp.ubi.common.http.server).  
The latter just does what is says. But both AWD and anWriter leave too much room for improvement.  
Both are free in the sense that they are so called nagware. If you don’t want to spend a small amount of cash (around €5) you’ll have to learn to live with adds popping up every now and then.

## Command line to the rescue

[Somehow](https://stackoverflow.com/questions/36632649/running-node-js-on-android) I stumbled upon [Termux](https://play.google.com/store/apps/details?id=com.termux). Which is a Linux terminal wrapped in an app.  
Stackoverflow is right: my jaw dropped when I did my first `git clone` and `npm i`.

But we were talking about editors weren’t we? Well maybe you’ve heard about [VIM](http://www.vim.org). I once tried it and didn’t really get it. But from within Termux it’s actually just as good (if not better) than the two editors mentioned above. I will definitely give it another try on my pc.

## Getting started with Termux

[Install Termux](https://play.google.com/store/apps/details?id=com.termux) and run it. You might also want to throw in [Hacker’s keyboard](XXXXX) for better control.

In Termux run `apt update && apt upgrade` to get the [package manager](https://termux.com/package-management.html) up and running.

(you can have multiple sessions: swipe the left border to the right)

Do `apt install coreutils` to get [better base utilities](https://termux.com/common-packages.html)

Next install Nodejs: `apt install nodejs`

Install Vim: `apt install vim`

Git: `apt install git`

And we’re done. Actually you are just getting started but don’t think you need me to clone a repo and get it running.

## A few more tips

I am not a native Linux speaker but I know enough to get by on a pc using Bash.  
In Termux things like typing can get a bit tiresome.

So type this: `vim $HOME/.bash_profile`,  
then enter and save this: `alias conf="vim ${HOME}/.bash_profile"`

Next time you start a session and type `conf` you get this file to add some shortcuts to. Mine looks something like this:

```bash_profile
export HTDOCS=${HOME}/storage/shared/htdocs
alias size="du -h --max-depth=1 ."
alias vimrc="vim ~/.vimrc"
alias proj="cd ${HTDOCS} && ls"
alias home="cd ${HOME} && ls"
alias conf="vim ${HOME}/.bash_profile"
# git
alias gitadded="git diff --cached --name-only"
alias gitnotadded="git clean -dn"
```

Notice that vimrc? I have it setup like this currently:

```vimrc
set nowrap
set tabstop=2
set shiftwidth=2
set expandtab
colorscheme sjeiti
```

## Some small downsides

### Losing sessions

Termux on my phone has the tendency close (all sessions) when the phone is in sleep mode _and_ Termux was not the last open app.  
There is a [wake lock](https://termux.com/user-interface.html) functionality butthat solves a different issue.

### Storage and `npm install`

Termux has [three types of storage](https://termux.com/storage.html). Unfortunately I’ve only been able to `npm install` from within internal storage. But the internal storage is not accessible from outside (should you want to copy your files from your phone to somewhere else).  
As a workaround you can setup aliases in your `/.bash_profile` to copy stuff from _home_ to _shared_ or _external storage_ (like the _node_modules_ folder). That way you can even use another editor app.  
Or you can just work from `internal storage` and use GIT to sync your data.  
I mostly do the latter, unless I have files that are not in VCS.

If you’ve read this far, I guess you should go [check it out](https://play.google.com/store/apps/details?id=com.termux).
