/*******************************************************
**  bloggerFeeds.js
**    bloggerのfeedを処理してごにょごょ表示するscript
**  author: choniwaniwani
*******************************************************/

let _start_index = 1;
// bloggerが一度に出してくれるfeedの最大数
const MAX_FEED_NUM = 150;
let _label_name = "";
let _site_url = "";

/**
 * 指定ラベルの投稿一覧を読み込む
 * 		読み込んだらcallbackで、on_load_feedsが実行される。
 * @param {string} label_name 投稿ラベル名
 * @param {string} site_url ページとfeedのサーバーが異なるときにfeed側のサーバーを指定する。
 */
function load_entry_list(label_name, site_url="") {
	let scpt = document.createElement("script");
	scpt.src = `${site_url}/feeds/posts/summary/-/${label_name}?redirect=false&max-results=${MAX_FEED_NUM}&alt=json&callback=on_load_feeds&start-index=${_start_index}`;
	_label_name = label_name;
	_site_url = site_url;
	document.body.appendChild(scpt);
}

/**
 * html断片をNodeListに変換する。
 * @param {string} html文字列
 * @return {NodeList}
 */
function html_to_elements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

/**
 * feedが読み込まれたときに実行されるcallback
 * 		ここで画面への表示も行う
 * @param {Object} root 
 */
function on_load_feeds(root) {
	let div = document.getElementsByClassName("entry-content")[0];
	if (!div) return;

	if("entry" in root.feed){
		const entryNum = root.feed.entry.length;
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

			const children = html_to_elements(`<a class='linkHref' href='${url}'>${entry.title.$t}</a><br/>`);
			while (children && (children.length > 0)) {
				div.appendChild(children[0]);
			}
		}

		const all_feed_num = Number(root.feed.openSearch$totalResults.$t);
		const done_feed_num = _start_index + root.feed.entry.length - 1;
		// 件数が多くて一度に読めていないときは続きを読み込む
		if (all_feed_num > done_feed_num) {
			_start_index += root.feed.entry.length;
			load_entry_list(_label_name, _site_url);
		}
	}
}