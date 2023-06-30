/* Copyright (C) 2010-2021 OpenVPN, Inc. - http://openvpn.net/ */
var CWSController=function(){function c(g){h(function(n){1==n?g():(console.log("Connection is lost. Reloading..."),m.run())})}function f(g,n,t,u){if("function"==typeof u){var p=u;u={success:p,forbidden:p,error:p}}$.ajax({type:g,url:n,data:t,dataType:"text",beforeSend:function(q,A){q.setRequestHeader("X-OpenVPN","1");q.setRequestHeader("X-CWS-Proto-Ver",v.cws_proto_ver_max)},success:function(q,A,D){q&&"string"==typeof q&&0==q.indexOf(w)&&(q=q.replace(w,""));try{q=JSON.parse(q)}catch(E){}u.success(q,
D)},error:function(q,A,D){(A=q.responseText)&&"string"==typeof A&&0==A.indexOf(w)&&(A=A.replace(w,""));try{A=JSON.parse(A)}catch(E){}403==q.status&&u.forbidden?u.forbidden(A,q):500==q.status?document.write(q.responseText):u.error&&u.error(A,q)}})}function l(g,n){f("POST","/__auth__",g.challenge?{response:g.response}:{username:g.username,password:g.password},{success:function(t,u){n?e():(B=1,m.run())},forbidden:function(t,u){B=2;if("login-failure"==t.type){var p=t.synopsis?t.synopsis:"";"object"==
typeof p&&(p=p[0]);(p=p.match(/^(.+): (.*)/))&&p[1]?e({"auth-error":p[1]}):(p=t.synopsis,x.clear(),z.setCredentials(x),m.dispatch(z),z.showAuthFailure(p))}else if("reason"==t.type){B=3;var q=t.message;p=q.reason;q=q.flags;k("login challenge: "+p);k("  flags: "+q);x.challenge=p;if(q)for(p=0;p<q.length;p++)"R"==q[p]?x.response=!0:"E"==q[p]&&(x.echo=!0);m.dispatch(z)}else k("unknown authentication result: "+JSON.stringify(t)),location.reload(!0)}})}function e(g){f("POST","/__logout__",null,function(n,
t){var u=[];C.src&&u.push("src="+encodeURIComponent(C.src));if(g)for(var p in g)u.push(p+"="+encodeURIComponent(g[p]));u=u.join("&");0<u.length&&(u="?"+u);location.hash&&0<location.hash.length&&(u+=location.hash);window.top.location.replace(location.protocol+"//"+location.host+"/"+u)})}function h(g){f("GET",r,{_ts:+new Date},{success:function(n,t){B=1;g(B)},error:function(n,t){B=2;g(B)}})}function y(){c(function(){f("POST","/downloads.json",null,{success:function(g,n){var t=OpenVPN.Connect.app.getController("downloads");
t.setDownloads(g);m.dispatch(t)}})})}function b(g){for(var n={},t=/([^&=]+)=([^&]*)/g,u;u=t.exec(g);)n[decodeURIComponent(u[1])]=decodeURIComponent(u[2]);return n}var k=function(g){console.log("[CWSController] "+g)},v=OpenVPN.Connect.CONFIG,w=v.js_exec_breaker||"",r=2<=v.cws_proto_ver_max?"/session2.json":"/session.json",m=this,x,B=0,C,z;CWSController.prototype.init=function(){k("init()");C=b(location.search.substring(1));x=OpenVPN.Connect.app.getModel("credentials");z=OpenVPN.Connect.app.getController("login");
z.setCredentials(x);h(function(){m.run()});v.company_name&&$("#company-name").html(v.company_name);"hide"==v.cws_footer&&$("#footer").addClass("d-none")};CWSController.prototype.run=function(){k("CWSController.prototype.run()");if(0==B)k("  not ready to run yet");else if(1==B)k("  going to Downloads portal"),y();else if(2==B){k("  not authenticated");m.dispatch(z);if("true"==C.reauth)z.showAuthFailure("Session expired. Please login again.");else if("true"==C.relogin_with_google_auth)z.showAuthFailure("Ready to connect with Google Authenticator code");
else if(C.error)z.showAuthFailure("Unexpected error: "+C.error);else if(C["auth-error"]){switch(C["auth-error"]){case "DENY":var g="Your account has been suspended.";break;case "REVOKED":g="Your certificate has been revoked.";break;case "LICENSE":g="This Access Server has reached its concurrent connections limit. Try again later.";break;case "SESSION":g="Your session has expired, please login again.";break;case "SWITCH_REAUTH":g="You have been disconnected from the old server. Please login again to the new server.";
break;default:g=C["auth-error"]}z.showAuthFailure(g)}else C.revoked&&z.showAuthFailure("Your certificate has been revoked.");0==location.hash.indexOf("#user/")&&z.setUsername(location.hash.substr(6))}else k("  other auth status: "+B)};CWSController.prototype.setCredentials=function(g){x=g};CWSController.prototype.login=function(){l(x)};CWSController.prototype.submitResponse=function(){l(x)};CWSController.prototype.discardChallenge=function(){l(x,!0)};CWSController.prototype.logout=function(){e()};
CWSController.prototype.change_password=function(g){c(function(){f("POST","/change_password",g,{success:function(n,t){$("#error").text(n.reason);$("#error").removeClass("d-none");1==n.status&&($("#cancel").addClass("d-none"),$("#error").removeClass("alert-danger"),$("#error").addClass("alert-success"),$("#continue").click(function(){m.run()}))}})})};CWSController.prototype.showChangePassword=function(){c(function(){m.dispatch(OpenVPN.Connect.app.getController("password"))})};CWSController.prototype.showProfiles=
function(){c(function(){f("POST","/downloads.json",null,{success:function(g,n){var t=OpenVPN.Connect.app.getController("profile");t.setProfiles(g);m.dispatch(t)}})})};CWSController.prototype.download_installer=function(g){c(function(){window.location="download_installer?type="+g})};CWSController.prototype.check_ga=function(g,n){c(function(){isNaN(g)?($("#qr-error").removeClass("d-none"),$("#qr-error").html("Code must be a 6-digit number")):6!=g.length?($("#qr-error").removeClass("d-none"),$("#qr-error").html("Code length must be exactly 6-digits")):
(dict={totp_code:g,secret:$("#ga-key").html()},f("POST","/check_ga",dict,function(t,u){if(1==t){console.log("GA code verified and locked");var p=$("#downloads");0<p.length&&p.remove();$("#googleauth").addClass("d-none");$("#googleauth-locked").removeClass("d-none");m.run()}else $("#qr-error").removeClass("d-none"),console.log("incorrect GA code")}))})};CWSController.prototype.create_profile=function(g){c(function(){var n="create_profile?comment="+$("#input-comment").val();n=n+"&autologin="+($("#checkbox-autologin").is(":checked")?
!0:!1);$("#div-tlscryptv2").length&&(n=n+"&tlscryptv2="+($("#checkbox-tlscryptv2").is(":checked")?!0:!1));window.location=n})};CWSController.prototype.delete_profile=function(g){c(function(){f("POST","/delete_profile",g,function(n,t){OpenVPN.Connect.app.getController("cws").showProfiles()})})};CWSController.prototype.download_profile=function(g,n){c(function(){window.location=n?"download_profile?type="+n:"download_profile?serial="+g})}};CWSController.prototype=new stdui.Application.prototype.Controller;
CWSController.prototype.constructor=CWSController;OpenVPN.Connect.app.add("cws",CWSController);
var UserProfileController=function(){var c=this,f,l;UserProfileController.prototype.init=function(){f=OpenVPN.Connect.app.getView("profile")};UserProfileController.prototype.setProfiles=function(e){l=e};UserProfileController.prototype.run=function(){f.setModel(l);f.on_cancel(function(){c.dispatch(OpenVPN.Connect.app.getController("cws"))});f.on_delete_profile(function(){serial=$("#select-delete-profile").val();OpenVPN.Connect.app.getController("cws").delete_profile({serial:serial})});f.on_create_profile(function(){dict=
{comment:$("#input-comment").val(),autologin:$("#checkbox-autologin").is(":checked")?!0:!1};$("#div-tlscryptv2").length&&(dict.tlscryptv2=$("#checkbox-tlscryptv2").is(":checked")?!0:!1);OpenVPN.Connect.app.getController("cws").create_profile(dict)});f.show()}};UserProfileController.prototype=new stdui.Application.prototype.Controller;UserProfileController.prototype.constructor=UserProfileController;OpenVPN.Connect.app.add("profile",UserProfileController);
var ChangePasswordController=function(){var c=this,f;ChangePasswordController.prototype.init=function(){f=OpenVPN.Connect.app.getView("password")};ChangePasswordController.prototype.run=function(){console.log("changepasswordcontroller.show()");f.on_continue(function(){new_pass=$("#new-password").val();old_pass=$("#current-password").val();new_pass_vfy=$("#new-password-verify").val();error="";old_pass==new_pass&&(error="New password and current password cannot be the same");new_pass&&old_pass&&new_pass_vfy||
(error="All fields are mandatory");new_pass!=new_pass_vfy&&(error="New password and confirmation do not match");""!=error?f.show(error):(dict={current_password:old_pass,new_password:new_pass},OpenVPN.Connect.app.getController("cws").change_password(dict))});f.on_cancel(function(){c.dispatch(OpenVPN.Connect.app.getController("cws"))});f.show()}};ChangePasswordController.prototype=new stdui.Application.prototype.Controller;ChangePasswordController.prototype.constructor=ChangePasswordController;
OpenVPN.Connect.app.add("password",ChangePasswordController);
var LoginController=function(){var c,f,l;LoginController.prototype.init=function(){f=OpenVPN.Connect.app.getView("login");l=OpenVPN.Connect.app.getView("login-challenge")};LoginController.prototype.run=function(){var e=OpenVPN.Connect.app.getController("cws");f.model=c;c.challenge?(l.setCredentials(c),l.show(),l.on_continue(function(){l.hide();e.setCredentials(c);e.submitResponse()}),l.on_cancel(function(){l.hide();e.discardChallenge()})):(f.show(),f.on_downloads(function(){f.hide();e.setCredentials(c);
e.login()}))};LoginController.prototype.setCredentials=function(e){c=e};LoginController.prototype.showAuthFailure=function(e){f.showMessage(e)};LoginController.prototype.setUsername=function(e){f.setUsername(e)}};LoginController.prototype=new stdui.Application.prototype.Controller;LoginController.prototype.constructor=LoginController;OpenVPN.Connect.app.add("login",LoginController);
var DownloadsController=function(){var c=this,f,l;DownloadsController.prototype.init=function(){f=OpenVPN.Connect.app.getView("downloads")};DownloadsController.prototype.run=function(){f.setModel(l);f.setOS(c.getOS());f.show();var e=l.user_profiles,h=l.prop_autogenerate,y=l.prop_autologin,b=l.cws_ui_offer;b.autologin||b.user_locked?b.user_locked||y?e.num_profiles||h?($("#btn-profile").removeClass("d-none"),$("#btn-profile").click(function(){OpenVPN.Connect.app.getController("cws").showProfiles()})):
$("#btn-profile").addClass("d-none"):$("#btn-profile").addClass("d-none"):$("#btn-profile").addClass("d-none");l.allow_password_change?($("#chpasswd").removeClass("d-none"),$("#chpasswd").click(function(){OpenVPN.Connect.app.getController("cws").showChangePassword()})):$("#chpasswd").addClass("d-none");f.on_logout(function(){f.hide();OpenVPN.Connect.app.getController("cws").logout()});f.on_ga_qr_scanned(function(){root=$("#main").find("#qr-challenge");code=root.find("#response-clear").val();OpenVPN.Connect.app.getController("cws").check_ga(code,
f)});f.on_manage(function(){window.location.href=l.adminui_port!=l.cws_port?"https://"+window.location.hostname+":"+l.adminui_port+"/":"/admin/"})};DownloadsController.prototype.setDownloads=function(e){l=e};DownloadsController.prototype.getOS=function(){var e=window.navigator.userAgent,h=window.navigator.platform,y=["Win32","Win64","Windows","WinCE"],b=["iPhone","iPad","iPod"],k=null;-1!==["Macintosh","MacIntel","MacPPC","Mac68K"].indexOf(h)?k="Mac OS":-1!==b.indexOf(h)?k="iOS":-1!==y.indexOf(h)?
k="Windows":/Android/.test(e)?k="Android":!k&&/Linux/.test(h)&&(k="Linux");return k}};DownloadsController.prototype=new stdui.Application.prototype.Controller;DownloadsController.prototype.constructor=DownloadsController;OpenVPN.Connect.app.add("downloads",DownloadsController);var LoginView=function(){this.root=this.cb_downloads=null;this.html=OpenVPN.Connect.app.getHTML("html/login.html")};LoginView.prototype=new stdui.Application.prototype.View;LoginView.prototype.constructor=LoginView;
LoginView.prototype.model=null;
LoginView.prototype.show=function(){$("#main").html("");$("#main").append(this.html);this.view=$("#main div:first-child");this.root=$("#main").find("#login");var c=this.model,f=this.root,l=this,e=function(){c.username=f.find("#username").val();c.password=f.find("#password").val();l.cb_downloads()};f.find("#username").keypress(function(h){if(13==h.keyCode)return e(),!1});f.find("#password").keypress(function(h){if(13==h.keyCode)return e(),!1});f.find("#go").click(e);f.find("#username").focus()};
LoginView.prototype.hide=function(){this.view.remove()};LoginView.prototype.setUsername=function(c){this.root.find("#username").val(c);this.root.find("#password").focus()};LoginView.prototype.on_downloads=function(c){this.cb_downloads=c};LoginView.prototype.showMessage=function(c){var f=this.root.find("#message");c instanceof String||"string"==typeof c?f.show().text(c):f.show().text(c.join("<br />"))};OpenVPN.Connect.app.add("login",LoginView);
var LoginChallengeView=function(){function c(){e()}function f(){v.response&&(v.response=w.val());h()}function l(r){r.keypress(function(m){if(13==m.keyCode)return f(),!1});return r}var e,h,y=OpenVPN.Connect.app.getHTML("html/login-challenge.html"),b,k,v,w;LoginChallengeView.prototype.show=function(){$("#main").html("");$("#main").append(y);b=$("#main div:first-child");k=$("#main").find("#login-challenge");var r=k.find("h5"),m=k.find("#response-masked"),x=k.find("#response-clear");r.text(v.challenge);
v.response?v.echo?(m.remove(),w=x):(x.remove(),w=m):(m.remove(),x.remove(),w=void 0);w&&(r.attr("for",w.attr("id")),l(w).focus(),"Enter Authenticator Code"==v.challenge&&w.attr("placeholder","6-digit code"));k.find("#cancel").click(c);k.find("#continue").click(f)};LoginChallengeView.prototype.hide=function(){b.remove()};LoginChallengeView.prototype.setCredentials=function(r){v=r};LoginChallengeView.prototype.on_cancel=function(r){e=r};LoginChallengeView.prototype.on_continue=function(r){h=r}};
LoginChallengeView.prototype=new stdui.Application.prototype.View;LoginChallengeView.prototype.constructor=LoginChallengeView;OpenVPN.Connect.app.add("login-challenge",LoginChallengeView);
var DownloadsView=function(){var c={},f=OpenVPN.Connect.app.getHTML("html/downloads.html"),l=$("#main div:first-child"),e,h,y=function(b){OpenVPN.Connect.app.getController("cws").download_installer(b)};DownloadsView.prototype.show=function(){$("#main").html("");$("#main").append(f);e.is_external_pki&&(document.getElementById("select-profile-section").style.display="none",document.getElementById("btn-profile").style.display="none");l=$("#main div:first-child");if("google_auth_key"in e&&e.google_auth_key[2]&&
!e.google_auth_key[3]&&!e.skip_ga_enrollment){var b=qrcode(-1,"L");b.addData(e.google_auth_key[1]);b.make();tbl=b.createTableTag(8,1);document.getElementById("qrcode-table").innerHTML=tbl;$("#qrcode-table").removeClass("d-none");$("#ga-key").text(e.google_auth_key[0]);$("#googleauth").removeClass("d-none");$("#response-clear").removeClass("d-none");$("#response-clear").focus();$("#downloads-buttons").addClass("d-none");qr_submit=function(){c.ga_qr_scanned&&c.ga_qr_scanned()};$("#ga-qr-scanned").click(qr_submit);
qr_cancel=function(){c.logout&&c.logout()};$("#ga-qr-cancel").click(qr_cancel);$("#response-clear").keypress(function(x){if(13==x.keyCode)return qr_submit(),!1})}else{var k=function(x){outer_span=$("<span></span>").attr("class","fa-stack fa-2x").attr("style","color: #ea7e23;");circle=$("<i></i>").attr("class","fa-stack-2x ml-2 cws-circle");inner_span="";inner_span="ios"==x.toLowerCase()?$("<span></span>").attr("style","color: #1a3867;font-size: 24px;font-family: 'Arial narrow';").attr("class","fa-stack-1x").text("iOS"):
$("<span></span>").attr("class","fab fa-stack-1x fa-".concat(x)).attr("style","color: #1a3867;").text("");outer_span.append(circle);outer_span.append(inner_span);return outer_span},v=function(){return $("<span></span>").attr("class","cws-badge").text("NEW")};$("#logout").click(function(){c.logout&&c.logout()});!0===e.is_admin&&($("#manage").removeClass("d-none"),$("#manage").click(function(){c.manage&&c.manage()}));var w=!1,r=!1;b=!1;var m=e.cws_ui_offer;null!=h&&("Linux"==h?m.linux&&(b=$("<li></li>"),
b.appendTo($("#recommended-apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_linux").text("").appendTo(b),outer_span=$("<span></span>").attr("class","fa-stack fa-2x").attr("style","color: #ea7e23;"),circle=$("<i></i>").attr("class","fal fa-circle fa-stack-2x"),inner_span=$("<span></span>").attr("style","color: #1a3867;font-size: 24px;font-family: 'Arial narrow';").attr("class","fa-stack-1x").text("iOS"),a.append(k("linux")),b=!0):"Android"==h?m.android&&(b=$("<li></li>"),
b.appendTo($("#recommended-apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_connect_android").text("").appendTo(b),a.append(k("android")),b=!0):"iOS"==h?m.ios&&(b=$("<li></li>"),b.appendTo($("#recommended-apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_connect_ios").text("").appendTo(b),a.append(k("ios")),b=!0):"Mac OS"==h?m.mac_v3?(b=$("<li></li>"),b.appendTo($("#recommended-apps")),d=$("<div></div>").attr("class","cws-item").appendTo(b),
a=$("<button></button>").attr("class","cws-installer-button").attr("id","r_mac_v3").text("").appendTo(d),a.append(k("apple")),a.append(v()),$("#r_mac_v3").click(function(){y("mac_v3")}),b=!0):m.mac&&(b=$("<li></li>"),b.appendTo($("#recommended-apps")),a=$("<button></button>").attr("class","cws-installer-button").attr("id","r_mac").text("").appendTo(b),a.append(k("apple")),$("#r_win").click(function(){y("mac")}),b=!0):"Windows"==h&&(m.win_v3?(b=$("<li></li>"),b.appendTo($("#recommended-apps")),d=$("<div></div>").attr("class",
"cws-item").appendTo(b),a=$("<button></button>").attr("class","cws-installer-button").attr("id","r_win_v3").text("").appendTo(d),a.append(k("windows")),a.append(v()),$("#r_win_v3").click(function(){y("win_v3")}),b=!0):m.win&&(b=$("<li></li>"),b.appendTo($("#recommended-apps")),a=$("<button></button>").attr("class","cws-installer-button").attr("id","win").text("").appendTo(b),a.append(k("windows")),$("#r_win").click(function(){y("win")}),b=!0)));b&&$("#recommended-apps-section").removeClass("d-none");
if(1==m.win||null==m.win)b=$("<li></li>"),b.appendTo($("#apps")),a=$("<button></button>").attr("class","cws-installer-button").attr("id","win").text("").appendTo(b),a.append(k("windows")),null==m.win?$("#win").click(function(){$("#modalDownloadError").modal("show")}):$("#win").click(function(){y("win")}),w=!0;if(1==m.mac||null==m.mac)b=$("<li></li>"),b.appendTo($("#apps")),a=$("<button></button>").attr("class","cws-installer-button").attr("id","mac").text("").appendTo(b),a.append(k("apple")),null==
m.mac?$("#mac").click(function(){$("#modalDownloadError").modal("show")}):$("#mac").click(function(){y("mac")}),w=!0;m.linux&&(b=$("<li></li>"),b.appendTo($("#apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_linux").text("").appendTo(b),a.append(k("linux")),w=!0);m.android&&(b=$("<li></li>"),b.appendTo($("#mobile-apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_connect_android").text("").appendTo(b),a.append(k("android")),
w=r=!0);m.ios&&(b=$("<li></li>"),b.appendTo($("#mobile-apps")),a=$("<a></a>").attr("href","https://openvpn.net/clients/index.php?client=openvpn_connect_ios").text("").appendTo(b),a.append(k("ios")),w=r=!0);w&&$("#all-apps-section").removeClass("d-none");r&&$("#mobile-apps-section").removeClass("d-none");if(1==m.win_v3||null==m.win_v3)b=$("<li></li>"),b.appendTo($("#new-apps")),d=$("<div></div>").attr("class","cws-item").appendTo(b),a=$("<button></button>").attr("class","cws-installer-button").attr("id",
"win_v3").text("").appendTo(d),a.append(k("windows")),a.append(v()),null==m.win_v3?$("#win_v3").click(function(){$("#modalDownloadError").modal("show")}):$("#win_v3").click(function(){y("win_v3")}),$("#new-apps-section").removeClass("d-none");if(1==m.mac_v3||null==m.mac_v3)b=$("<li></li>"),b.appendTo($("#new-apps")),d=$("<div></div>").attr("class","cws-item").appendTo(b),a=$("<button></button>").attr("class","cws-installer-button").attr("id","mac_v3").text("").appendTo(d),a.append(k("apple")),a.append(v()),
null==m.mac_v3?$("#mac_v3").click(function(){$("#modalDownloadError").modal("show")}):$("#mac_v3").click(function(){y("mac_v3")}),$("#new-apps-section").removeClass("d-none");k=e.cws_ui_offer.user_locked;v=e.cws_ui_offer.autologin;w=e.prop_autogenerate;r=e.prop_autologin;e.cws_ui_offer.server_locked&&(b=$("<li></li>"),b.appendTo($("#select-profile")),a=$("<button></button").attr("class","btn btn-link").attr("onclick","OpenVPN.Connect.app.getController('cws').download_profile(null, 'serverlocked')").text("Anyone at this server (server-locked profile)").appendTo(b),
$("#select-profile-section").removeClass("d-none"));w&&(k&&(b=$("<li></li>"),b.appendTo($("#select-profile")),a=$("<button></button").attr("onclick","OpenVPN.Connect.app.getController('cws').download_profile(null, 'userlocked')").attr("class","btn btn-link").text("Yourself (user-locked profile)").appendTo(b),$("#select-profile-section").removeClass("d-none")),v&&r&&(b=$("<li></li>"),b.appendTo($("#select-profile")),a=$("<button></button").attr("onclick","OpenVPN.Connect.app.getController('cws').download_profile(null, 'autologin')").attr("class",
"btn btn-link").text("Yourself (autologin profile)").appendTo(b),$("#select-profile-section").removeClass("d-none")))}};DownloadsView.prototype.hide=function(){$("#downloads").addClass("d-none");var b=$("#main div:first-child");0<b.length&&b.remove();l&&l.remove()};DownloadsView.prototype.on_logout=function(b){c.logout=b};DownloadsView.prototype.on_manage=function(b){c.manage=b};DownloadsView.prototype.on_ga_qr_scanned=function(b){c.ga_qr_scanned=b};DownloadsView.prototype.setModel=function(b){e=
b};DownloadsView.prototype.setOS=function(b){h=b}};DownloadsView.prototype=new stdui.Application.prototype.View;DownloadsView.prototype.constructor=DownloadsView;OpenVPN.Connect.app.add("downloads",DownloadsView);
var UserProfileView=function(){var c={},f=OpenVPN.Connect.app.getHTML("html/profiles.html"),l=$("#main div:first-child"),e;UserProfileView.prototype.show=function(h){console.log("UserProfileView show()");$("#main").html("");$("#main").append(f);l=$("#main div:first-child");$("#btn-create-profile").click(function(){c.create_profile&&c.create_profile()});$("#btn-delete-profile").click(function(){c.delete_profile&&c.delete_profile()});$("#btn-cancel").click(function(){c.cancel&&c.cancel()});e.prop_autogenerate||
$("#div-create-new-profile").remove();e.cws_ui_offer.tlscryptv2||$("#div-tlscryptv2").remove();e.cws_ui_offer.user_locked||$("#checkbox-autologin").attr("disabled","true");e.cws_ui_offer.autologin||$("#div-autologin").remove();e.prop_autologin||$("#div-autologin").remove();h&&($("#error").removeClass("d-none"),$("#error").html(h));$("[id='tooltip-tlscryptv2']").tooltip({title:"for openvpn 2.5+ clients only",placement:"right"});$('[data-toggle="tooltip"]').tooltip();var y=$("#select-delete-profile"),
b=e.user_profiles;b.num_profiles?(profile_categories=["autologin+tlscryptv2","userlocked+tlscryptv2","autologin","userlocked"],$.each(profile_categories,function(k,v){profiles=b[v];optgrp_delete=$("<optgroup>",{label:v});$.each(profiles,function(w,r){r.comment||(r.comment="");val="#"+r.serial_number+" "+r.comment;optgrp_delete.append($("<option>",{value:r.serial_number,text:val,"data-subtext":"valid until "+r.not_after}))});y.append(optgrp_delete)}),$("#div-delete-profile").removeClass("d-none")):
$("#div-delete-profile").addClass("d-none");$(".selectpicker").selectpicker()};UserProfileView.prototype.hide=function(){var h=$("#main div:first-child");0<h.length&&h.remove();l&&l.remove()};UserProfileView.prototype.on_delete_profile=function(h){c.delete_profile=h};UserProfileView.prototype.on_create_profile=function(h){c.create_profile=h};UserProfileView.prototype.on_back=function(h){c.create_profile=h};UserProfileView.prototype.on_continue=function(h){c["continue"]=h};UserProfileView.prototype.on_cancel=
function(h){c.cancel=h};UserProfileView.prototype.setModel=function(h){e=h}};UserProfileView.prototype=new stdui.Application.prototype.View;UserProfileView.prototype.constructor=UserProfileView;OpenVPN.Connect.app.add("profile",UserProfileView);
var ChangePasswordView=function(){var c={},f=OpenVPN.Connect.app.getHTML("html/password.html"),l=$("#main div:first-child");ChangePasswordView.prototype.show=function(e){$("#main").html("");$("#main").append(f);l=$("#main div:first-child");$("#continue").click(c["continue"]);$("#cancel").click(c.cancel);e&&$("#error").removeClass("d-none");$("#error").html(e)};ChangePasswordView.prototype.hide=function(){var e=$("#main div:first-child");0<e.length&&e.remove();l&&l.remove()};ChangePasswordView.prototype.on_continue=
function(e){c["continue"]=e};ChangePasswordView.prototype.on_cancel=function(e){c.cancel=e}};ChangePasswordView.prototype=new stdui.Application.prototype.View;ChangePasswordView.prototype.constructor=ChangePasswordView;OpenVPN.Connect.app.add("password",ChangePasswordView);var Credentials=function(){};
Credentials.prototype={username:null,password:null,challenge:null,echo:!1,response:null,clear:function(){this.username=this.password=this.challenge=this.response=null;this.echo=!1},clearPassword:function(){this.password=null},clearChallenge:function(){this.challenge=this.response=null;this.echo=!1},isEmpty:function(){return this.username==this.password==this.challenge==this.response==null&&0==this.echo}};OpenVPN.Connect.app.add("credentials",Credentials);
