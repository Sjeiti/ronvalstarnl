<!--
  date: 2012-08-24
  modified: 2012-08-24
  slug: migrating-a-subversion-repository-from-google-code-to-github
  type: post
  categories: code, JavaScript, jQuery, Python
  tags: Google Code, SVN, Git, Github, migrating
  description: Recently I did a full history and issue migration from Google Code to Github. I expected the worst but it was actually quite easy.
-->

# Migrating a subversion repository from Google Code to Github

<p>Recently I migrated <a href="https://github.com/Sjeiti/TinySort" title="TinySort" target="_blank">TinySort</a> from Google Code to Github. I&#8217;m a real Git noob so I expected a full history migration to be a real pain in the ass. Plus I also wanted to move both the open and closed issues (since they correspond to the regression tests). Luckily it turned out to be a lot easier than I anticipated.</p>
<p><!--more--></p>
<p>Unlike <a href="https://help.github.com/articles/importing-from-subversion" title="Github: Importing from Subversion" target="_blank">what Github says you should do to migrate</a> I started at Google Code itself. Google Code also supports Git and <a href="http://code.google.com/p/support/wiki/ConvertingSvnToGit" title="Google Code: Convert your project from Subversion to Git" target="_blank">they have excellent instructions</a> to convert your existing Subversion repository into a Git repository.</p>
<p><small>Since my project didn&#8217;t have any tags the Google Code instructions sufficed. If your project does have tags and you want to convert them properly you might be better off following Githubs suggestion to use the <a href="https://github.com/nirvdrum/svn2git" target="_blank">svn2git tool</a> (there&#8217;s also the <a href="https://github.com/JohnAlbin/git-svn-migrate" target="_blank">git-svn-migrate tool</a>, I have no idea which is better). My main reason for not using svn2git was that it requires Ruby. And although I think I have that installed I didn&#8217;t want to overcomplicate things because I already didn&#8217;t know what I was doing learing Git and all.</small></p>
<p>Once you&#8217;ve followed the instructions you should have a checkout of your project on your local machine. Now all that is left is to move it to Github.</p>
<p>I&#8217;m mainly using Git Bash here but I also have Tortoise Git installed and Githubs own Windows client (although the latter sucks a bit).</p>
<p>Presuming you have a Github account and created an empty project to push the lot into; you first have to add the Github remote to the project (Unlike Subversion a Git project can have multiple locations called &#8216;remotes&#8217;):</p>
<pre><code data-language="git">$ git remote add origin git@github.com:GITHUB_USERNAME/REPO_NAME.git</code></pre>
<p>You can check yourself we now have two remotes: googlecode (you added earlier) and origin.</p>
<pre><code data-language="git">$ git remote
googlecode
origin</code></pre>
<p>Before we can push to Github (origin) we must do a pull. And since origin is not our default remote (googlecode is) we must also specify which branch to pull from (the master branch).</p>
<pre><code data-language="git">$ git pull origin master</code></pre>
<p>Since your repo is now up-to-date you can push:</p>
<pre><code data-language="git">$ git push --all origin</code></pre>
<p>&#8230;and that&#8217;s it!</p>
<p>Now for the issues, this proved somewhat more laborious. <a href="https://github.com/alexrudnick/migrate-googlecode-issues" title="migrate Google Code issues" target="_blank">This piece of Python code</a> does the trick. I speak as much Python as I speak Japanese so I hardly bothered checking the code. I only added my login data, altered it to move everything instead of only the open issues and commented out ln 13 &#8216;from __future__ import print_function&#8217; since that line prevented it from running.</p>
<p>This worked with only two minor mishaps: all thirty or so closed issues I had were now open on Github and all issues on Google Code were now tagged &#8216;migrated&#8217; and open. For the latter I just added the migrated tag to the closed issues list on Google Code. On Github I just closed the issues by hand.<br />
So next time I&#8217;ll try to alter the script a bit to actually close the closed issues (also some good Python practice for me).</p>
