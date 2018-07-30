/*******************************************************
**  bloggerFeeds.js
**    bloggerのfeedを処理してごにょごにょ表示するscript
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
	_label_name = avoid_blogger_bug(label_name);
	_site_url = site_url;
	let scpt = document.createElement("script");
	scpt.src = `${_site_url}/feeds/posts/summary/-/${_label_name}?redirect=false&max-results=${MAX_FEED_NUM}&alt=json&callback=on_load_feeds&start-index=${_start_index}`;
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
 * bloggerが全角の記号をjavascript内でも勝手にescapeしてしまうバグを回避
 * @param {string} str 
 */
function avoid_blogger_bug(str) {
	return (str.indexOf("&#") >= 0) ?
		str.replace("&#65281;", "！")
		.replace("&#65289;", "）")
		.replace("&#65288;", "（")
		.replace("&#8217;", "’")
		.replace("&#65286;", "＆")
		.replace("&#65285;", "％")
		.replace("&#65284;", "＄")
		.replace("&#65283;", "＃")
		.replace("&#8221;", "”")
		.replace("&#65371;", "｛")
		.replace("&#65339;", "［")
		.replace("&#65344;", "｀")
		.replace("&#65312;", "＠")
		.replace("&#65372;", "｜")
		.replace("&#65509;", "￥")
		.replace("&#65374;", "～")
		.replace("&#65342;", "＾")
		.replace("&#65309;", "＝")
		.replace("&#65293;", "－")
		.replace("&#65311;", "？")
		.replace("&#65295;", "／")
		.replace("&#65310;", "＞")
		.replace("&#65294;", "．")
		.replace("&#65308;", "＜")
		.replace("&#65292;", "，")
		.replace("&#65373;", "｝")
		.replace("&#65341;", "］")
		.replace("&#65290;", "＊")
		.replace("&#65306;", "：")
		.replace("&#65291;", "＋")
		.replace("&#65307;", "；")
		.replace("&#12443;", "゛")
		.replace("&#12301;", "」")
		.replace("&#12300;", "「")
		.replace("&#12289;", "、")
		.replace("&#12290;", "。")
		.replace("&#12539;", "・")
		.replace("&#65343;", "＿")
	: str;
}

/**
 * feedが読み込まれたときに実行されるcallback
 * 		ここで画面への表示も行う
 * @param {Object} root 
 */
function on_load_feeds(root) {
	let div = document.getElementById("entry_list_by_label");
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
