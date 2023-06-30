addEvent(window, 'load', initForm);

var highlight_array = new Array();

function initForm(){
	browserDetect();
	idLearnLi(); // JY ADDED
	initializeFocus();
	ifInstructs();
	showRangeCounters();
}

// for radio and checkboxes, they have to be cleared manually, so they are added to the
// global array highlight_array so we dont have to loop through the dom every time.
// JY MODIFIED
function initializeFocus(){
	fields = getElementsByClassName(document, "*", "field");
	for(i = 0; i < fields.length; i++) {
		if (fields[i].type == 'radio' || fields[i].type == 'checkbox' || fields[i].type == 'file') {
		        if (fields[i].type == 'radio') {
		            if (fields[i].checked) {
			        radioIdSectionControl(fields[i].id);
			    }
			    fields[i].onclick = function(){clearSafariRadios(); addClassName(this.parentNode.parentNode, "focused", true);
			                                   radioIdSectionControl(this.id); };
			} else {
			    fields[i].onclick = function(){clearSafariRadios(); addClassName(this.parentNode.parentNode, "focused", true)};
			}
			fields[i].onfocus = function(){clearSafariRadios(); addClassName(this.parentNode.parentNode, "focused", true)};
			highlight_array.splice(highlight_array.length,0,fields[i]);
		}
		if(fields[i].className.match('addr')){
			fields[i].onfocus = function(){clearSafariRadios();addClassName(this.parentNode.parentNode.parentNode, "focused", true)};
			fields[i].onblur = function(){removeClassName(this.parentNode.parentNode.parentNode, "focused")};
		}
		else {
			fields[i].onfocus = function(){clearSafariRadios();addClassName(this.parentNode.parentNode, "focused", true)};
			fields[i].onblur = function(){removeClassName(this.parentNode.parentNode, "focused")};
		}
	}
}

// JY ADDED
// Learn a particular element ID so that it can be later
// addressed by radioIdSectionControl.
// To enable ID groupings, IDs are expanded to multiple labels
// that can be referenced by sc_xxx in radio button control lists.
// For example:
//   foo : not referenceable
//   foo_48 : can be referenced by 'foo'
//   foo_test_99 : can be referenced by 'foo' or 'footest'
//   foo_test_a_7 : can be referenced by 'foo', 'footest', 'fooa' or 'footesta'

var idpre = new Array();
var idstate = new Array();

function idLearnLabel(id, label) {
    if (!idpre[label])
        idpre[label] = new Array();
    idpre[label].push(id);
    //dump("LEARN " + label + "/" + id + "\n");
}

function idLearn(id) {
  var id_split = id.split("_");
  var head = id_split[0];
  var label = head;
  var seg = "";
  var n = id_split.length-1
  if (n >= 1) {
    for (var i=0; i<n; ++i) {
      if (i >= 1)
	  seg =  id_split[i];
      if (i >= 2)
          idLearnLabel(id, head+seg); // ID foo_a_b_c_1 indexed by sc_x labels fooa, foob, fooc
      label = label + seg;
      idLearnLabel(id, label); // ID foo_a_b_c_1 indexed by sc_x labels fooa, fooab, fooabc
    }
  } else {
      idLearnLabel(id, id); // ID foo indexed by foo
  }
}

// Learn all <li> IDs.
function idLearnLi() {
  var li_list=document.getElementsByTagName('li');
  for (var i=0; i<li_list.length; i++) {
    var id = li_list[i].id;
    if (id)
      idLearn(id);
  }
}

// Turn on or off sections of a form based on the ID
// of clicked radio buttons.  For example,
// given a radio_id in the form sc29_0foo_1bar, set
// all <li> IDs of "foo_x" to display=none and IDs of
// "bar_x" to display="".  Values 0/1, 2/3, 4/5, 6/7,
// and 8/9 can be used to control off/on state from
// different nested levels (referred to below by var cell).
function radioIdSectionControl(radio_id) {
  var id_ops = radio_id.split("_");
  if (id_ops[0].substring(0, 2) == "sc") {
    for (var i=1; i<id_ops.length; i++) {
      var e = id_ops[i];
      var ctl = (+e.substring(0, 1));
      var onoff = ctl & 1;
      var cell = ctl >> 1;
      var target_prefix = e.substring(1);
      if (idpre[target_prefix]) {
	var target_list = idpre[target_prefix];
	for (var j=0; j<target_list.length; j++) {
	  var target_id = target_list[j];
	  if (!idstate[target_id])
	     idstate[target_id] = new Array();
	  var state_list = idstate[target_id];
	  state_list[cell] = !onoff;
	  var invisible = 0;
	  for (var k=0; k<state_list.length; k++) {
	      if (state_list[k])
		 invisible = 1;
	  }
          if (invisible)
            document.getElementById(target_id).style.display = "none";
          else
            document.getElementById(target_id).style.display = "";
	}
      }
    }
  }
}
// END JY ADDED
/* FP added*/
function toggleScriptShow(id_suffix) {

          if( document.getElementById(id_suffix).style.display == 'none')
	  {
            document.getElementById(id_suffix).style.display = "";
            document.getElementById(id_suffix+'+s1').style.display = "none";
            document.getElementById(id_suffix+'+s2').style.display = "none";

	  }
	  else
          {
            document.getElementById(id_suffix).style.display = "none";
            document.getElementById(id_suffix+'+s1').style.display = "";
            document.getElementById(id_suffix+'+s2').style.display = "";
	  }
}

function toggleShowID(id_suffix) {

          if( document.getElementById(id_suffix).style.display == 'none')
	  {
            document.getElementById(id_suffix).style.display = "";

	  }
	  else
          {
            document.getElementById(id_suffix).style.display = "none";
	  }
}

function jq( myid ) {
    return "[id='" + myid.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" ) + "']";
}
function toggleShowIDoff(id_suffix) {
    $(jq(id_suffix)).fadeOut();
}

function toggleShowIDon(id_suffix) {
    $(jq(id_suffix)).fadeIn();
}
/* END FP Added*/

// acain added
function showHideControl(id_prefix, id_suffix) {
  var link = document.getElementById('id+' + id_prefix + '+' + id_suffix);

  if (document.all) { //IS IE 4 or 5 or later
    if(link.innerText=="Show") {
      link.innerText="Hide";
      v = '_1';
    }
    else {
      link.innerText="Show";
      v = '_0';
    }
  }
  //IS NETSCAPE 4 or below
  if (document.layers) {
    if(link.innerText=="Show") {
      link.innerText="Hide";
      v = '_1';
    }
    else {
      link.innerText="Show";
      v = '_0';
    }
  }
  //Mozilla/Netscape6+ and all the other Gecko-based browsers
  if (document.getElementById &&!document.all) {
    if(link.firstChild.nodeValue=="Show") {
      link.firstChild.nodeValue="Hide";
      v = '_1';
    }
    else {
      link.firstChild.nodeValue="Show";
      v = '_0';
    }
  }
  ctl_id = id_prefix + v + id_suffix;
/* calling radioIdSectionControl causes problems...since it changes multiple ID's when you only want one changed*/
  //radioIdSectionControl(ctl_id);
  if (document.getElementById(id_suffix).style.display != "none")
      document.getElementById(id_suffix).style.display = "none";
  else
      document.getElementById(id_suffix).style.display = "";

}

function clearSafariRadios() {
	for(var i = 0; i < highlight_array.length; i++) {
		if(highlight_array[i].parentNode) {
			removeClassName(highlight_array[i].parentNode.parentNode, 'focused');
		}
	}
}

function ifInstructs(){
	var container = document.getElementById('public');
	if(container){
		removeClassName(container,'noI');
		var instructs = getElementsByClassName(document,"*","instruct");
		if(instructs == ''){
			addClassName(container,'noI',true);
		}
		if(container.offsetWidth <= 450){
			addClassName(container,'altInstruct',true);
		}
	}
}

function browserDetect(){
	var detect = navigator.userAgent.toLowerCase();
	var container = document.getElementsByTagName('html');
	if(detect.indexOf('safari') + 1){
		addClassName(container[0], 'safari', true);
	}
	if(detect.indexOf('firefox') + 1){
		addClassName(container[0], 'firefox', true);
	}
}

function showRangeCounters(){
	counters = getElementsByClassName(document, "em", "currently");
	for(i = 0; i < counters.length; i++) {
		counters[i].style.display = 'inline';
	}
}

function validateRange(ColumnId, RangeType) {
	if(document.getElementById('rangeUsedMsg'+ColumnId)) {
		var field = document.getElementById('Field'+ColumnId);
		var msg = document.getElementById('rangeUsedMsg'+ColumnId);

		switch(RangeType) {
			case 'character':
				msg.innerHTML = field.value.length;
				break;

			case 'word':
				var words = field.value.split(" ");
				var used = 0;
				for(i =0; i < words.length; i++) {
					if(words[i].replace(/\s+$/,"") != "") used++;
				}
				msg.innerHTML = used;
				break;

			case 'digit':
				msg.innerHTML = field.value.length;
				break;
		}
	}
}

/*--------------------------------------------------------------------------*/

//http://www.robertnyman.com/2005/11/07/the-ultimate-getelementsbyclassname/
function getElementsByClassName(oElm, strTagName, strClassName){
	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");
	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
	var oElement;
	for(var i=0; i<arrElements.length; i++){
		oElement = arrElements[i];
		if(oRegExp.test(oElement.className)){
			arrReturnElements.push(oElement);
		}
	}
	return (arrReturnElements)
}

//http://www.bigbold.com/snippets/posts/show/2630
function addClassName(objElement, strClass, blnMayAlreadyExist){
   if ( objElement.className ){
      var arrList = objElement.className.split(' ');
      if ( blnMayAlreadyExist ){
         var strClassUpper = strClass.toUpperCase();
         for ( var i = 0; i < arrList.length; i++ ){
            if ( arrList[i].toUpperCase() == strClassUpper ){
               arrList.splice(i, 1);
               i--;
             }
           }
      }
      arrList[arrList.length] = strClass;
      objElement.className = arrList.join(' ');
   }
   else{
      objElement.className = strClass;
      }
}

//http://www.bigbold.com/snippets/posts/show/2630
function removeClassName(objElement, strClass){
   if ( objElement.className ){
      var arrList = objElement.className.split(' ');
      var strClassUpper = strClass.toUpperCase();
      for ( var i = 0; i < arrList.length; i++ ){
         if ( arrList[i].toUpperCase() == strClassUpper ){
            arrList.splice(i, 1);
            i--;
         }
      }
      objElement.className = arrList.join(' ');
   }
}

//http://ejohn.org/projects/flexible-javascript-events/
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj["e"+type+fn] = fn;
    obj[type+fn] = function() { obj["e"+type+fn]( window.event ) };
    obj.attachEvent( "on"+type, obj[type+fn] );
  }
  else{
    obj.addEventListener( type, fn, false );
  }
}

function popup_help(url) {
	newwindow=window.open(url,'name','height=580,width=620,location=0,status=0,menubar=0,toolbar=0,scrollbars=1,top=100,left=600');
	if (window.focus) {newwindow.focus()}
	return false;
}
