var modal;
// var modal2;

window.onload = function() {
	colors();
	document.getElementById('cssshade').style.display = 'none';
	var sb = document.getElementById('search');
	window.addEventListener('keydown', function(e) {
		if (e.keyCode == 27) {
			closeUserMenu();
			// closeMenu();
		}
	});
	sb.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			if (isSet(sb.value)) {
				window.location.href = 'search.html?q=' + encodeURIComponent(sb.value);
			}
		}
	});
	if (typeof importantLoad == 'function') {
		importantLoad();
	}
	modal = document.getElementById('usermenubox');
	// modal2 = document.getElementById('menubox');
	var sesses = localStorage.getItem('astiw_sesses');
	var usernames = localStorage.getItem('astiw_usernames');
	if (isSet(sesses)) {
		var sessList = JSON.parse(sesses);
		var usernameList = JSON.parse(usernames);
		if (sessList.length == usernameList.length) {
			if (sessList.length > 0) {
				var ibs = document.getElementsByClassName('ib');
				var usermenu = document.getElementById('usermenu');
				usermenu.innerHTML = usernameList[0];
				for (i = 0; i < ibs.length; i++) {
					ibs[i].style.display = 'initial';
				}
				checkSess(sessList[0]);
			} else {
				notLoggedIn();
			}
		} else {
			localStorage.removeItem('astiw_sesses');
			localStorage.removeItem('astiw_usernames');
			window.location.reload();
		}
	} else {
		notLoggedIn();
	}
};

function getCurrentUser() {
	var lsu = localStorage.getItem('astiw_usernames');
	if (isSet(lsu) && JSON.parse(lsu).length > 0) {
		return JSON.parse(lsu)[0];
	} else {
		return '';
	}
};

function putLinksInText(inp) {
	var list = inp.split(/( |<br\/>)/g);
	var temp;
	var tempName;
	var currentUser = getCurrentUser();
	for (j = 0; j < list.length; j++) {
		if (list[j].substring(0,7) == 'http://' || list[j].substring(0,8) == 'https://') {
			temp = list[j];
			list[j] = '<a class="classic" target="_blank" href="' + encodeURI(temp) + '">' + temp + '</a>';
		} else if (list[j][0] == '@' && list[j].length >= 2) {
			temp = list[j];
			tempName = list[j].substring(1);
			list[j] = '<a class="classic" ' + (tempName == currentUser ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(tempName) + '">' + temp + '</a>';
		}
	}
	return list.join('');
};

function colors() {
	var theme = localStorage.getItem('astiw_theme');
	var link = document.getElementById('themer');
	if (isSet(theme)) {
		if (theme == 'custom') {
			var customTheme = localStorage.getItem('astiw_customtheme');
			if (isSet(customTheme)) {
				link.href = customTheme;
			} else {
				link.href = 'dark.css';
			}
		} else {
			link.href = theme;
		}
	}
};

function notLoggedIn() {
	var lbs = document.getElementsByClassName('lb');
	for (i = 0; i < lbs.length; i++) {
		lbs[i].style.display = 'initial';
	}
	startnotifs();
	load();
};

function isSet(thing) {
	return thing != undefined && thing != null && thing != '';
};

function checkSess(sess) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.addEventListener('load', function() {
		if (xmlHttp.responseText.split('\n')[0] == 'bad') {
			localStorage.removeItem('astiw_sesses');
			localStorage.removeItem('astiw_usernames');
			window.location.reload();
		} else {
			startnotifs();
			load();
		}
	});
	xmlHttp.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
	xmlHttp.open('get', 'https://api.stibarc.gq/checksess.sjs?sess=' + sess, true);
	xmlHttp.send();
};

function openUserMenu() {
	var accounts = document.getElementById('accounts');
	var me = document.getElementById('currentUserName');
	var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
	document.getElementById('userMenuProfButton').href = 'user.html?id=' + encodeURIComponent(usernames[0]);
	me.innerHTML = usernames[0];
	var oof;
	for (i = 1; i < usernames.length; i++) {
		document.getElementById('accountSwitcher').style.display = '';
		oof = document.createElement('li');
		oof.innerHTML = '<a class="classic" href="javascript:switchUser(' + i.toString() + ')">' + usernames[i] + '</a>';
		oof.style.marginTop = '0.5em';
		accounts.appendChild(oof);
	}
	modal.style.display = 'initial';
};

function closeUserMenu() {
	modal.style.display = 'none';
};

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
	/* if (event.target == modal2) {
		modal2.style.display = 'none';
	} */
};

function switchUser(n) {
	var sesses = JSON.parse(localStorage.getItem('astiw_sesses'));
	var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
	var wantedSess = sesses[n];
	var wantedUsername = usernames[n];
	sesses.splice(n, 1);
	usernames.splice(n, 1);
	sesses.splice(0, 0, wantedSess);
	usernames.splice(0, 0, wantedUsername);
	localStorage.setItem('astiw_sesses', JSON.stringify(sesses));
	localStorage.setItem('astiw_usernames', JSON.stringify(usernames));
	window.location.reload();
};

function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];
		var arr = queryString.split('&');
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split('=');
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return '';
			});
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
			paramName = paramName;
			paramValue = paramValue;
			if (obj[paramName]) {
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				if (typeof paramNum === 'undefined') {
					obj[paramName].push(paramValue);
				}
				else {
					obj[paramName][paramNum] = paramValue;
				}
			}
			else {
				obj[paramName] = paramValue;
			}
		}
	}
	return obj;
};

function startnotifs() {
	if (localStorage.getItem('astiw_notifs') != 'true') {
		if (Notification.permission = 'default') {
			Notification.requestPermission();
		}
		checknotifs();
	}
};

var notifs1;
var notifs2;

function checknotifs() {
	if (Notification.permission = 'granted') {
		notifs1 = localStorage.getItem('astiw_notifyPosts') == 'true' || (isSet(getCurrentUser()) && localStorage.getItem('astiw_notifyMentions') != 'true');
		notifs2 = isSet(getCurrentUser()) && (localStorage.getItem('astiw_notifyComms') != 'true' || localStorage.getItem('astiw_notifyMentions') != 'true');
		if (notifs1) {
			var njsonurl = 'https://api.stibarc.gq/getnotifs.sjs';
			var nr = new XMLHttpRequest();
			nr.addEventListener('load', function() {
				if (nr.responseText != 'None\n') {
					var tmp = nr.responseText.split('\n');
					var lastnotifid = localStorage.getItem('astiw_lastnotifid');
					if (!isSet(lastnotifid)) {
						lastnotifid = -1;
					}
					if (tmp[0] != lastnotifid) {
						var ntext = '';
						for (k = 1; k < tmp.length - 2; k++) {
							ntext += tmp[k] + (k < tmp.length - 3 ? '\n' : '');
						}
						if (isSet(ntext)) {
							localStorage.setItem('astiw_lastnotifid', tmp[0]);
							var theNotifTitle = '';
							if (isSet(getCurrentUser()) && localStorage.getItem('astiw_notifyMentions') != 'true') {
								var lyst = ntext.split(/( |<br\/>)/g);
								if (lyst.indexOf('@' + JSON.parse(localStorage.getItem('astiw_sesses'))[0]) > -1) {
									theNotifTitle = 'Mention';
								}
							}
							if (theNotifTitle == '' && localStorage.getItem('astiw_notifyPosts') == 'true') {
								theNotifTitle = 'New post';
							}
							if (isSet(theNotifTitle)) {
								var dts = Math.floor(Date.now());
								var ftnotif = new Notification(theNotifTitle, {body: ntext, icon: 'https://savaka2.github.io/favicon.ico', timestamp: dts});
								ftnotif.onclick = function(e) {
									e.preventDefault();
									ftnotif.close();
									var postID = tmp[tmp.length - 2];
									window.open('post.html?id=' + postID, '_blank');
								}
							}
						}
					}
				}
				if (notifs2) {
					nr2.send();
				} else {
					setTimeout(checknotifs, 500);
				}
			});
			nr.addEventListener('error', function() {
				if (notifs2) {
					nr2.send();
				} else {
					setTimeout(checknotifs, 500);
				}
			});
			nr.open('get', njsonurl, true);
		}
		if (notifs2) {
			var njsonurl2 = 'https://api.stibarc.gq/getusernotifs.sjs?id=' + JSON.parse(localStorage.getItem('astiw_usernames'))[0];
			var nr2 = new XMLHttpRequest();
			nr2.addEventListener('load', function() {
				if (nr2.responseText != 'None\n') {
					var tmp = nr2.responseText.split('\n');
					var lastnotifid = localStorage.getItem('astiw_lastusernotifid');
					if (!isSet(lastnotifid)) {
						lastnotifid = -1;
					}
					if (tmp[0].concat(tmp[tmp.length - 2]) != lastnotifid) {
						var ntext = '';
						for (k = 2; k < tmp.length - 2; k++) {
							ntext += tmp[k] + (k < tmp.length - 3 ? '\n' : '');
						}
						localStorage.setItem('astiw_lastusernotifid', tmp[0].concat(tmp[tmp.length - 2]));
						if (isSet(ntext)) {
							var theNotifTitle = '';
							var uiqitn = tmp[1].split(' ')[0];
							if (localStorage.getItem('astiw_notifyComms') != 'true' && tmp[1].indexOf(' commented on your post!') > -1) {
								var theNotifTitle = 'Comment by ' + uiqitn;
							}
							if (localStorage.getItem('astiw_notifyMentions') != 'true' && tmp[1].indexOf(' mentioned you!') > -1) {
								var theNotifTitle = 'Mention by ' + uiqitn;
							}
							if (uiqitn == getCurrentUser()) {
								theNotifTitle = '';
							}
							if (isSet(theNotifTitle)) {
								var dts = Math.floor(Date.now());
								var ftnotif = new Notification(theNotifTitle, {body: ntext, icon: 'https://savaka2.github.io/favicon.ico', timestamp: dts});
								ftnotif.onclick = function(e) {
									e.preventDefault();
									ftnotif.close();
									var postID = tmp[tmp.length - 2];
									window.open('post.html?id=' + postID, '_blank');
								}
							}
						}
					}
				}
				setTimeout(checknotifs, 500);
			});
			nr2.addEventListener('error', function() {setTimeout(checknotifs, 500);});
			nr2.open('get', njsonurl2, true);
		}
		if (notifs1) {
			nr.send();
		} else if (notifs2) {
			nr2.send();
		} else {
			setTimeout(checknotifs, 500);
		}
	}
};

function editProfile() {
	if (confirm('This feature is not yet available on ASTiW. Open the STiBaRC website?')) {
		window.open('https://stibarc.gq/', '_blank')
	}
};