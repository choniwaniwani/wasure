/*******************************************************
**  bloggerFeeds.js
**    blogger‚Ìfeed‚ğˆ—‚µ‚Ä‚²‚É‚å‚²‚å•\¦‚·‚éscript
**  author: choniwaniwani
*******************************************************/

function onLoadFeeds(root) {
	if("entry" in root.feed){
		var entryNum = root.feed.entry.length;
		for(var e=0; e<entryNum; e++) {
			var entry=root.feed.entry[e];
			var url;
			var linkNum=entry.link.length;
			for(var l=0; l<linkNum; l++) {
				var link=entry.link[l];
				if(link.rel=="alternate"){
					url=link.href;
					break;
				}
			}
			document.write("<a class='linkHref' href='"+url+"'>"+entry.title.$t+"</a><br/>");
		}
	}
}
