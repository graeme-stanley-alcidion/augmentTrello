//console.log("start AugmentTrello !");

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
var tm = Date.now();
var timeSinceMouseMove = 0;


$(function() {
    createButtons();
    createZendeskLauncher(); 
    hideHeader();
    updateListLayout();

    //keep things updated...
    setInterval(regularUpdate, 500);
    document.addEventListener("keyup", function(e) {
        if(e.keyCode==13) tm = Date.now();
    });
});


function regularUpdate(){
    timeSinceMouseMove = Date.now()-tm;
    //console.log("calling regularUpdate.. timeSinceMouseMove=",timeSinceMouseMove); 
    if(timeSinceMouseMove<1000){
        updateListLayout();
        if($('.btn_pomo').length==0){
            createButtons();
        } 

        if($('#zid_div').length==0){
            createZendeskLauncher();
        } 

        
    } 
}


function processActivityFeed(d){
    for(i=0;i<d.length;i++){
        //if(d[i].display.translationKey=="action_move_card_from_list_to_list" && d[i].display.entities.listAfter.text=="DONE"){
            console.log("["+i+"]  >> date",d[i].date);
            console.log("translationKey",d[i].display.translationKey);
            //console.log("before",d[i].display.entities.listBefore.text)
            //console.log("after",d[i].display.entities.listAfter.text)
            //console.log("card '"+ d[i].display.entities.card.text +"' moved to DONE");
        //}
    }
}



function viewFeed(d){
    for(i=0;i<d.length;i++){
        //if(d[i].display.translationKey=="action_move_card_from_list_to_list" && d[i].display.entities.listAfter.text=="DONE"){
            console.log("["+i+"]  >> date",d[i].date);
            console.log("translationKey",d[i].display.translationKey);
            //console.log("before",d[i].display.entities.listBefore.text)
            //console.log("after",d[i].display.entities.listAfter.text)
            //console.log("card '"+ d[i].display.entities.card.text +"' moved to DONE");
            console.log(d[i]);
        //}
    }
}





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


    div.append('<div class="btn_week board-header-btn-round" href="#">ALL WEEK</div>');
    addButtonStyle('.btn_week');
    $('.btn_week').click(function() {
        setMode("week");
    });


    div.append('<div class="btn_normal board-header-btn-round" href="#">ALL + MENU</div>');
    addButtonStyle('.btn_normal');
    $('.btn_normal').click(function() {
        setMode("normal");
    });

    div.append('<div class="btn_done board-header-btn-round" href="#" color="#00cc00">DONE</div>');
    addButtonStyle('.btn_done');
    $('.btn_done').click(function() {
        setMode("done");
    });
}

function createZendeskLauncher(){
    $('#surface').append('<div id="zid_div"><input value="" id="zid" style="width:58px"></div>');
    $('#zid_div').css('position','absolute').css("left","18px").css("bottom","10px").keypress(function(e) {
        if(e.which==13){
            //alert( "Handler for .keyup() called." + $('#zid').val());
            window.open("https://alcidion.zendesk.com/agent/tickets/"+$('#zid').val(), "_blank");
        }
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
    $('.btn_done').css('opacity',grey);    
    $('.btn_week').css('opacity',grey);    
    
}

function highlightButton(sel){
    unhighlightAllButtons();
    //console.log("highlight button...", sel);
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
    $('#classic-body').css('zoom',1);
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

    } else if (mode == "planner") {
        setListOpacity(iDONE, 0);

        setListOpacity(iLATER, 1);
        setListOpacity(iPOMO, 1);
        setListOpacity(iNEXT_WEEK, 1);
        hideAndHighlightWeekdays(true);
        //hide 'add list'
        $('.js-add-list').hide();
        decorateLists();
    } else if (mode == "week") {
        
        setListOpacity(iDONE, 0);
        setListOpacity(iLATER, 1);
        setListOpacity(iPOMO, 1);
        setListOpacity(iNEXT_WEEK, 1);
        //hide 'add list'
        $('.js-add-list').hide();
        decorateLists();
        //make bigger!
        $('#classic-body').css('zoom',0.7);

    } else if (mode == "done") {
        hideAllLists();
        setListOpacity(iDONE, 1);
        //hide 'add list'
        $('.js-add-list').hide();
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




//gts


function getPomoActivitySummary(){
    var url  = 'https://trello.com/1/lists/5c5db88c46c11502b0ff5ec4/actions?fields=data,type,date&limit=55&memberCreator=false'
    var data, name;
    var dt1, dt2, diff = -1;


    $.getJSON( url, function( rows ) {
        for(var i=0;i<rows.length;i++){
            
            diff=-1;
            try{
                data = rows[i].data;
                name = data.card.name;

                if(i>0){
                    dt1=new Date(rows[i-1].date);
                    dt2=new Date(rows[i].date);
                    diff=dt1-dt2;
                }
            } catch (e){
                name="??"
            }
            
            if(diff>5000){
                console.log(i, "dt: ", dt2, " name", name, " diff:", diff);
            }
            
            
            

        }
    });

}




