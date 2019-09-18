<!--
  id: 1001
  date: 2012-06-28T16:40:08
  modified: 2014-05-05T21:36:35
  slug: test-rainbow
  type: post
  excerpt: <p>Just a test&#8230;</p>
  categories: uncategorized
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Test Rainbow line numbering

<p>Just a test&#8230;</p>
<p><!--more--></p>
<pre><code data-language="php" data-line="123">function mediaSendToEditor($html, $attachment_id, $attachment) {
	// check for the GET vars added in boxView
	parse_str($_POST['_wp_http_referer'], $aPostVars);
	if (isset($aPostVars['target'])&amp;&amp;$aPostVars['target']=='foobarbaz') {
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