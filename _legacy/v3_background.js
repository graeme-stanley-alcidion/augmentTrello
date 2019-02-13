console.log("STARTING backgorund.js....");
start();

function start(){
    //startup...


    //hide power ups
    $("<style type='text/css'> .js-plugin-buttons{ display: none;} </style>").appendTo("head");
    //hide comments on cards
    $("<style type='text/css'> .add-comment-section{ display: none;} </style>").appendTo("head");
    
    //hide activity on cards
    $("<style type='text/css'> .add-comment-section + .mod-card-detail-icons-smaller{ display: none;} </style>").appendTo("head");
    
    $("<style type='text/css'> div.board-header-btns.mod-left{ display: none;} </style>").appendTo("head");
    $("<style type='text/css'> a.js-show-sidebar{ display: none;} </style>").appendTo("head");
    $("<style type='text/css'> a.js-rename-board{ display: none;} </style>").appendTo("head");
    $("<style type='text/css'> a.js-star-board{ display: none;} </style>").appendTo("head");
    $("<style type='text/css'> #header{ display: none;} </style>").appendTo("head");
    



/*
    //hide menu link
    $("<style type='text/css'> .mod-show-menu{ display: none;} </style>").appendTo("head");

    //hide team button
    $("<style type='text/css'> .js-open-show-all-board-members{ display: none;} </style>").appendTo("head");



    //init time
    var t = Date.now();
    var delta = 0;

    //keep things updated...
    //click listener (not so reliable but useful in places)
    window.addEventListener("mouseup", function(e) {
        regularUpdate();
    });
    

    document.addEventListener("mousemove", function(e) {
        delta = Date.now()-t;
        if(delta>250){
            t=Date.now();
            regularUpdate();
        }
    });


    createButtons(); 
*/

    //hideHeader();
	
/*


    updateListLayout();
    regularUpdate();

    setTimeout(updateListLayout, 1000);
*/

   
}



//hardcoded indices of the Trello board lists
//assumes a board with specific named lists
var iNOTES=2,
    iDONE = 1,
    iNOW = 3,
    iTODAY = 4,
    i2MORO = 5,
    iSOON = 6,
    iMAYBE = 7;

    

//default mode is day
var mode="day";



function createButtons(){
        //console.log("ADDING BUTTONS....");  
        var div = $($('.board-header > .board-header-btns.mod-left')[1]);



        div.append('<div class="b122 board-header-btn-round" href="#">POMO</div>');
        addButtonStyle('.b122');
        $('.b122').click(function() {
            setMode("POMO");
        }); 

        

        div.append('<div class="b124 board-header-btn-round" href="#">TODAY</div>');
        addButtonStyle('.b124');
        $('.b124').click(function() {
            setMode("day");
        });

        div.append('<div class="b125 board-header-btn-round" href="#">PLANNER</div>');
        addButtonStyle('.b125');
        $('.b125').click(function() {
            setMode("planner");
        });



        div.append('<div class="b123 board-header-btn-round" href="#">ALL</div>');
        addButtonStyle('.b123');
        $('.b123').click(function() {
            setMode("all");
        });

        div.append('<div class="b127 board-header-btn-round" style="background-color:#fff9e1" href="#"><font color=red>FILTER</font></div>');
        addButtonStyle('.b127');
        $('.b127').click(function() {
            //setMode("normal");
            $('.js-search-open-card-filter').click();
        });

        $(".window").css('background','white');


         
        
        
}

function addButtonStyle(strSel){
    $(strSel)
        .css("width","60px")
        .css('borderRadius', '20px')
        .css('display','inline-block')
        .css('line-height','26px')
        .css('text-align','center')
        .css('background','white')
        .css('cursor','pointer');
}

function setMode(strMode){
    mode = strMode;
    updateListLayout();
}

function regularUpdate(){
    updateNames();
    updateListLayout();

    if($('.b124').length==0){
    	createButtons();
    }
    
}

function updateListLayout() {

    //console.log("updateListLayout");
    //reset everything first...
    $('#classic').css('zoom',1);
    hideHeader();
    showAllLists();


    if (mode == "normal") {
        restoreHeader();

    } else if (mode == "day") {
        setListOpacity(iNOTES, 0.5);
        setListOpacity(iDONE, 0.2);
        setListOpacity(iNOW, 1);
        setListOpacity(iTODAY, 1);
        setListOpacity(i2MORO, 0);
        setListOpacity(iSOON, 0);
        setListOpacity(iMAYBE, 0);

        //hide 'add list'
        $('.js-add-list').hide();

        decorateLists();


    } else if (mode == "POMO") {
        hideAllLists();
        setListOpacity(iNOW, 1);
        decorateLists();
        $('#classic').css('zoom',1.2);

    } else if (mode == "planner") {
        setListOpacity(iNOTES, 0);
        setListOpacity(iDONE, 0.2);
        setListOpacity(iNOW, 1);
        setListOpacity(iTODAY, 1);
        setListOpacity(i2MORO, 1);
        setListOpacity(iSOON, 1);
        setListOpacity(iMAYBE, 1);
        //hide 'add list'
        $('.js-add-list').hide();
        decorateLists();
    } else if (mode == "all") {
    	decorateLists();
    }


}

function decorateLists(){
    decorateList(iDONE, '#aaffaa');
    decorateList(iNOW, '#ff6666');
}


function updateNames() {
    setTeamNamesOnLists();
    setTeamNamesOnTeamDropdown();
    setNamesOnCardMembers();
}

function showLabelValues(){
	//get an array of all the label marker spans
	var arr = $('div.list-card-details > div.list-card-labels.js-card-labels > span');

	//iterate over them!
	for (i = 0; i < arr.length; i++) {
        var el = $(arr[i]);
        //console.log(el.title); 
        var ttl = el.attr('title');
        el.text(ttl);
        el.css('height','20px');
        el.css('paddingLeft','4px');
        el.css('lineHeight','20px');
        el.parent().css('width','110px');
        el.css("maxWidth","120px");
		el.css("minWidth","10px");

    }

}

function setNamesOnCardMembers(){
	var arr = $('div.pop-over.is-shown div.pop-over-section.js-board-members > ul li a');
	for (i = 0; i < arr.length; i++) {
        var el = $(arr[i]);
        //console.log(el.title); 
        var ttl = extractName(el.attr('title'));
        el.text(ttl);
        el.css('width','120px');
        el.css('backgroundColor', '#89c4ff');
        el.css('text-align','center');
    }
}

function setTeamNamesOnLists() {
    var arr = $('#board div.list-card-details div.list-card-members div span.member-initials');
    for (i = 0; i < arr.length; i++) {
        var el = arr[i];
        //console.log(el.title); 
        var ttl = extractName(el.title);
        el.innerText = ttl;

    }

    //set name styles
    var w = '54px';
    var h = '22px';

    //widths
    $('.list-card-members .member').css('width', w);
    $('.list-card-members .member .member-initials').css('width', w);

    //heights
    $('.list-card-members .member').css('height', h);
    $('.list-card-members .member .member-initials').css('height', h);
    $('.list-card-members .member .member-initials').css('lineHeight', h);

    $('.list-card-members .member .member-initials').css('fontSize', '10px');
    //background color
    $('.member.member-virtual').css('backgroundColor', '#89c4ff');
}

function setTeamNamesOnTeamDropdown() {   
    //size the popup?
    //$('div.pop-over.is-shown').css('width','105px');
    $('div.pop-over.is-shown > div > div.pop-over-header.js-pop-over-header').hide();
    $('div.pop-over.is-shown > div div.board-menu-member-section.js-list-members.is-partial-row').hide();
    $('div.pop-over.is-shown > div div.board-menu-member-section-header.js-heading').text(" ");


    var div = $('.js-list-invited-members .js-list-draggable-board-members div.member-virtual');
    //SET TEAM NAMES
    for (i = 0; i < div.length; i++) {
        var el = $('.js-list-invited-members .js-list-draggable-board-members div.member-virtual:nth-child(' + (i+1) + ') span.member-initials');
        var t = extractName(el.attr("title")); 
        div.css('width', '125px');
        el.text(t);
    }

}




function showAllLists(){
    //reset lists
    for (i = 0; i < 15; i++) {
        setListOpacity(i, 1);
        decorateList(i, '#dfe3e6', '#dfe3e6');
    }
}

function hideAllLists(){
    //hide all lists
    for (i = 0; i < 15; i++) {
        setListOpacity(i, 0);
        decorateList(i, '#dfe3e6', '#dfe3e6');
    }
}

function restoreHeader(){
    //restore header
    $('.board-header').show();
    $('#header').show();
    $('#content').css('marginTop', '');
    $('.js-add-list').show();

    //TODO restore more things...
}



function hideHeader() {
    //remove sub header
    //$('.board-header').hide();

    //remove top header
    $('#header').hide();

    //remove stuff
    $('a.js-rename-board').hide();
    $('a.js-star-board').hide();

    //add padding at the top
    $('#content').css('marginTop', '8px');
    //hide private buttons
    $('div.js-board-header > div:nth-child(3)').hide();

    //divider
    $('span.board-header-btn-divider').hide();


    //'facepile'
    $('div.js-fill-facepile').hide();

    //$('a.js-open-manage-board-members').hide();

    //hide 'add list'
    $('.js-add-list').hide();

    //keep the TEAM button
    var a = $('div.board-header-btns > a#member-count');
    a.css('width', '100px')
    a.css('borderRadius', '20px');
    //var n= a.text();
    a.text('TEAM');
	
	//$('div.board-header-btns.mod-left').hide();
	
	
}

function decorateList(idx, bg) {
    var el;
    //el = $('#board .list-wrapper:nth-child('+idx+') div.list > div.list-header');
    //$(el).css('backgroundColor',header);

    el = $('#board .list-wrapper:nth-child(' + idx + ') div.list');
    $(el).css('backgroundColor', bg);

    //$($('#board .list-wrapper:nth-child(2) div.list > div.list-header')).css('backgroundColor','#FF0000');
}

function setListOpacity(idx, opacity) {
    el = $('#board .list-wrapper:nth-child(' + idx + ')');
    if (opacity == 0) {
        $(el).hide();
    } else {
        $(el).show();
        $(el).css('opacity', opacity);
    }
}

function extractName(s) {
    if (s.length > 1 && s.indexOf("(") > -1) {
        return s.substring(0, 1).toUpperCase() + s.substring(1, s.indexOf('(') - 1)
    }
    return s;
}

