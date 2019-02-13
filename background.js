console.log("STARTING backgorund.js....");

//hardcoded indices of the Trello board lists
//assumes a board with specific named lists
var iDONE=1, 
    iPOMO=2, 
    iNEXT=3
    iMON=4, iTUE=5, iWED=6, iTHU=7, iFRI=8,
    iNEXT_WEEK=9, 
    iLATER=10;



//default mode is day
var mode="day";




$(function() {
	createButtons(); 
    hideHeader();
    updateListLayout();
});





function createButtons(){
        //console.log("ADDING BUTTONS....");  
        var div = $($('.board-header > .board-header-btns.mod-left')[1]);

        div.append('<div class="btn_pomo board-header-btn-round" href="#">POMO</div>');
        addButtonStyle('.btn_pomo');
        $('.btn_pomo').click(function() {
            setMode("pomo");
        });
 
        div.append('<div class="btn_day board-header-btn-round" href="#">DAY</div>');
        addButtonStyle('.btn_day');
        $('.btn_day').click(function() {
            setMode("day");
        });

        div.append('<div class="btn_planner board-header-btn-round" href="#">PLANNER</div>');
        addButtonStyle('.btn_planner');
        $('.btn_planner').click(function() {
            setMode("planner");
        });

        div.append('<div class="btn_normal board-header-btn-round" href="#">NORMAL</div>');
        addButtonStyle('.btn_normal');
        $('.btn_normal').click(function() {
            setMode("normal");
        });
        
}

function addButtonStyle(strSel){
    $(strSel)
        .css("width","80px")
        .css('borderRadius', '10px')
        .css('display','inline-block')
        .css('line-height','26px')
        .css('text-align','center')
        .css('background','white')
        .css('cursor','pointer');
}



function unhighlightAllButtons(){
    var grey = 0.3;
    $('.btn_pomo').css('opacity',grey);
    $('.btn_day').css('opacity',grey);
    $('.btn_planner').css('opacity',grey);
    $('.btn_normal').css('opacity',grey);    
}

function highlightButton(sel){
    unhighlightAllButtons();
    console.log("highlight button...", sel);
    $(sel).css('opacity',1);
}







function setMode(strMode){
    mode = strMode;
    updateListLayout();
}



function updateListLayout() {

    highlightButton(".btn_"+mode);

    //console.log("updateListLayout");
    //reset everything first...
    $('#classic').css('zoom',1);
    hideHeader();
    showAllLists();

    if (mode == "normal") {
        restoreHeader();

    } else if (mode == "day") {
        setListOpacity(iDONE, 0.2);
        setListOpacity(iLATER, 0);
        setListOpacity(iNEXT_WEEK, 0);
        hideAndHighlightWeekdays(false);
        setListOpacity(iPOMO, 1);
        //hide 'add list'
        $('.js-add-list').hide();
        decorateLists();

    } else if (mode == "pomo") {
        hideAllLists();
        setListOpacity(iPOMO, 1);
        decorateLists();
        //make bigger!
        //$('#classic').css('zoom',1.2);

    } else if (mode == "planner") {
        setListOpacity(iDONE, 0);
        setListOpacity(iLATER, 0);
        setListOpacity(iNEXT_WEEK, 1);
        hideAndHighlightWeekdays(true);
        setListOpacity(iPOMO, 0.8);
        //hide 'add list'
        $('.js-add-list').hide();
        decorateLists();
    }

}

function decorateLists(){
    decorateList(iPOMO, '#ff0000', '#ff6666');
    decorateList(iNEXT, '#ff0000', '#ffcccc'); 
}




function hideAndHighlightWeekdays(planner){
    var activeAlpha=0.8;
    var day = new Date().getDay();
    //day=3;
    //Sunday is 0, Monday is 1 ...tue 2, wed 3, thur 4, fri 5, sat 6

    //hide All Days
    setListOpacity(iMON, 0);
    setListOpacity(iTUE, 0);
    setListOpacity(iWED, 0);
    setListOpacity(iTHU, 0);
    setListOpacity(iFRI, 0);

    //console.log("the day is..."+ day);
    if(day==1){                                 //Mon
        setListOpacity(iMON, activeAlpha);
        if(planner) setListOpacity(iTUE, activeAlpha);
    } else if(day==2){                          //Tue
        setListOpacity(iTUE, activeAlpha);
        if(planner) setListOpacity(iWED, activeAlpha);
    } else if(day==3){                          //Wed
        setListOpacity(iWED, activeAlpha);
        if(planner) setListOpacity(iTHU, activeAlpha);
    } else if(day==4){                          //Thu
        setListOpacity(iTHU, activeAlpha);
        if(planner) setListOpacity(iFRI, activeAlpha);
    } else {                                    //Fri, Sat, Sun
        setListOpacity(iFRI, activeAlpha);
        if(planner) setListOpacity(iMON, activeAlpha);
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

    //hide the TEAM button
    $('div.board-header-btns > a#member-count').hide();

    //hide share buitton
    $('div.board-header-btns > a.js-open-manage-board-members').hide();

}

function decorateList(idx, header, bg) {
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


