<!--
  id: 938
  description: How to use the Wordpress media library in a plugin or custom post type... the right way.
  date: 2012-05-01T21:42:37
  modified: 2016-12-14T20:04:32
  slug: using-wordpress-media-library-in-a-plugin
  type: post
  excerpt: <p>I just spent a couple of hours trying to figure this one out. Here&#8217;s how to use the WordPress media library in a plugin or custom post type&#8230; the right way.</p>
  categories: code, Javascript, backend, Wordpress
  tags: hack, plugin, Wordpress
  metaKeyword: media library
  metaTitle: Using Wordpress media library in a plugin
  metaDescription: How to use the Wordpress media library in a plugin or custom post type... the right way.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Using WordPress media library in a plugin

<p>I just spent a couple of hours trying to figure this one out. Here&#8217;s how to use the WordPress media library in a plugin or custom post type&#8230; the right way.</p>
<p><!--more--></p>
<p>It took me a while to to get this right. So much for Google because everybody with a similar problem posted the same solution, mostly with the same cumbersome code (why bother writing a new post if you&#8217;re just gonna copy-paste the code from someone elses blog).</p>
<p><del data-reason="let's not be all negative about this; we all love WordPress :-)">But before I proceed: carefull not to turn this post into a rant I&#8217;ll say it now just to get it over with: &#8220;Wow, what a bunch of poorly documented, badly written spaghetti code WordPress is&#8221;. That&#8217;s it.</del></p>
<p>If you look a bit closer to the admin source you&#8217;ll find a Javascript click-implementation for all &#8216;a.thickbox&#8217; (media-upload.dev.js ln 65-71).<br />
A bit further you&#8217;ll see that the upload uri for that &#8216;a.thickbox&#8217; can be retreived with the PHP function &#8216;get_upload_iframe_src($type)&#8217;. Now it doesn&#8217;t say anywhere what that $type is supposed to be but digging through the code (media.php) and doing some trial and error it seems a string of the possible values: image, video, audio, file or media (where the latter is any of the previous but file). If you want extra types checkout <a href="http://codex.wordpress.org/Function_Reference/add_filter">add_filter</a> with &#8216;<a href="http://codex.wordpress.org/Plugin_API/Filter_Reference/upload_mimes">upload_mimes</a>&#8216;.</p>
<p>All we need now is to add a javascript callback function.<br />
The javascript callback function is a global. This is bloody ridiculous but not surprising if you&#8217;ve ever inspected window or $_GLOBAL in WordPress.<br />
The callback function returns a different HTML string depending on the type of file you&#8217;ve selected (type image has an image tag inserted).<br />
What all these identical solutions on Google do wrong is that they set this global javascript callback function (and add placeholders) the moment you enter the page. It is neater to set it the moment you press the &#8216;a.thickbox&#8217; button, this way you can adjust your callback when you have multiple uploads (ie an image and a pdf).</p>
<p>Once you&#8217;ve added the thickbox and setup the javascript callback you should be able to use the WordPress media library.</p>
<p>But what if you do not want that HTML that is returned but, say, a post_id (more experienced WordPress users will know that posts, pages, attachements, images and everything are all stored in the table [wp]_posts). With the post_id (or attachement_id) you&#8217;d be able to use more than just an image- or attachement uri, you can also use the title and/or description of a file.</p>
<p>As said, the callback function returns a different types of HTML. The image HTML snippet contains the attachement_id but the others don&#8217;t. When you trace back where the callback function is invoked you&#8217;ll find an <a href="http://codex.wordpress.org/Function_Reference/add_filter">add_filter hook</a> called &#8216;media_send_to_editor&#8217;. It&#8217;s nowhere to be found on <a href="http://codex.wordpress.org/">codex.wordpress.org</a> but it&#8217;s easy enough to implement. The call itself is done in media.php ln 488 (apply_filters(&#8216;media_send_to_editor&#8217;, $html, $send_id, $attachment)). And if you look through the surrounding function you&#8217;ll see the $send_id is exactly what we need. Not only that; the $attachement parameter is an associative array filled with other usefull stuff (title,description etc&#8230;).<br />
We overwrite the $html parameter (the filter callback expects $html returned) and set the priority of the filter to something really high so we know for sure it&#8217;s the last function applied&#8230; and we&#8217;re there&#8230;<br />
&#8230;or are we?<br />
Hooking up to &#8216;media_send_to_editor&#8217; will also cause whatever you do in that function to happen in the normal text editor (after all: that&#8217;s what we&#8217;re hacking into).<br />
So we need to try to determine were we come from. There is the $_POST[&#8216;_wp_http_referer&#8217;] but if you examine it you&#8217;ll see that it does not contain the $GET vars we added to the upload button href. It took me a while to notice: if you check the upload iframe uri you&#8217;ll see that somebody did a very sloppy job off chopping of the last $GET variables after &#8216;TB_iframe&#8217; (WTF WordPress, seriously?!). So don&#8217;t append or use add_query_arg but insert your extra variables.</p>
<p>So since we now know  where we come from we can use this in our hook function. We don&#8217;t even have to parse an HTML string. We just want some data so we&#8217;re going to parse JSON.</p>
<p>Here is an example custom post type: <a href="/wordpress/wp-content/uploads/foobarbaz.zip" download="foobarbaz.zip">foobarbaz.zip</a> (simply add it to your theme dir and include the php file in your functions.php).</p>
<p>There are two important lines in the PHP (the rest is mainly for building a custom post type):</p>
<pre><code data-language="php" data-line="67">$sUri = esc_url( str_replace('&amp;type=','&amp;target=foobarbaz&amp;input='.$sInputName.'&amp;preview='.$sPreview.'&amp;tab=library&amp;type=',get_upload_iframe_src($sSubType)) );</code></pre>
<p>This is the code for creating the uri used in the upload button. Notice the insertion of the $GET vars.<br />
And there is the entire mediaSendToEditor function on line 81.<br />
<label class="code">file: posttype-foobarbaz.php</label></p>
<pre><code data-language="php" data-line="81">function mediaSendToEditor($html, $attachment_id, $attachment) {
	// check for the GET vars added in boxView
	parse_str($_POST['_wp_http_referer'], $aPostVars);
	if (isset($aPostVars['target'])&&$aPostVars['target']=='foobarbaz') {
		// add extra data to the $attachement array prior to returning the json_encoded string
		$attachment['id'] = $attachment_id;
		$attachment['edit'] = get_edit_post_link($attachment_id);
		$attachment['input'] = $aPostVars['input'];
		$attachment['preview'] = $aPostVars['preview'];
		if ($aPostVars['type']=='image') {
			foreach (array('thumb','medium','large') as $size) {
				$aImg = wp_get_attachment_image_src( $attachment_id, $size);
				if ($aImg) $attachment['img_'.$size] = $aImg[0];
			}
		}
		$html = json_encode($attachment);
	}
	return $html;
}</code></pre>
<p>There&#8217;s also a tiny caveat conserning the &#8216;Insert into post&#8217; button in the upload iframe. If you create a custom post type that does not support &#8216;editor&#8217; you&#8217;ll have to add this button yourself.</p>
<p>Here&#8217;s the js responsible for the callback:<br />
<label class="code">file: scripts/foobarbaz.js</label></p>
<pre><code data-language="javascript">(function($){
	var fnOldSendToEditor;
	$(function(){
		// store original send_to_editor function
		fnOldSendToEditor = window.send_to_editor;
		// add a different send_to_editor function to each thickbox anchor
		var $Box = $('#foobarbaz-box');
		if ($Box.length) {
			$Box.find('a.thickbox').each(function(i,el){
				var $A = $(el).click(function(){
					window.send_to_editor = getFnSendToEditor($A.data('type'));
				});
			});
		}
		// hack tb_remove to reset window.send_to_editor
		var fnTmp = window.tb_remove;
		window.tb_remove = function(){
			if (fnOldSendToEditor) window.send_to_editor = fnOldSendToEditor;
			fnTmp();
		};
	});
	function getFnSendToEditor(type){
		return function(fileHTML){
			var oData = JSON.parse(fileHTML);
			//console.log(oData);
			$('#'+oData.input).val(oData.url);
			$('#'+oData.preview).text(type+': '+oData.url.split('/').pop());
			tb_remove();
		}
	}
})(jQuery);</code></pre>
<p>First the original send_to_editor function is stored. Then each a.thickbox is assigned an onclick to replace the send_to_editor. This function creates and returns an anonymous function in order to parse the &#8216;type&#8217; parameter through it&#8217;s scope (not manditory but a nice alternative to the insertion of the $GET vars).<br />
Then we hack into tb_remove to restore the original send_to_editor function (since we also want this to happen when you simply close the upload iframe).<br />
You&#8217;ll also notice that the original global &#8216;send-to-editor&#8217; function is stored and restored on callback so as to maintain it&#8217;s original texteditor functionality. And that&#8217;s it.</p>
<p>So there you have it&#8230;</p>
<p>(once again: <a href="/wordpress/wp-content/uploads/foobarbaz.zip" download="foobarbaz.zip">foobarbaz.zip</a>)</p>