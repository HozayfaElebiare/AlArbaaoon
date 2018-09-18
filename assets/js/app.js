/*
    Variables
*/
var hadith={};
var bookmarks=[];
var tashkilToggle=true;
var appURL = location.href.replace(location.hash,"");
$.getJSON(appURL+"content/hadith.json", function(data){hadith=data;});

/*
    Common Functions
*/
function setHash(hashString){
    location.hash=hashString;
}

function getHash(){
    return location.hash;
}

function makeBreadcrumb(a, aRt, b, bRt){
    if (b==null){
        return '<li class="rtLink" goto="#home"><a href="#">متن الأربعین النوویة</a></li><li> » </li><li class="rtLink" goto="'+aRt+'"><a href="#">'+a+'</a></li>';
    }else{
        return '<li class="rtLink" goto="#home"><a href="#">متن الأربعین النوویة</a></li><li> » </li><li class="rtLink" goto="'+aRt+'"><a href="#">'+a+'</a></li><li> » </li><li class="rtLink" goto="'+bRt+'"><a href="#">حدیث '+b+'</a></li>';
    }
}

function arabicClr(text){
    // by Ferouk
    text = text.replace(/َ|ً|ُ|ٌ|ّ|ٍ|ِ|ْ|ٰ|ٓ|ـ/g, "");
    return text;
}

function setCookie(cname, cvalue, exdays){var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";}
function getCookie(cname){var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie); var ca = decodedCookie.split(';'); for(var i = 0; i <ca.length; i++) {var c = ca[i]; while (c.charAt(0) == ' ') {c = c.substring(1);}if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}}return "";}
function cleanArray(actual){var newArray = new Array(); for (var i = 0; i < actual.length; i++) {if (actual[i]) {newArray.push(actual[i]);}}return newArray;}

/*
    Bookmarking
*/
function refreshBookmarkList(){
    bookmarks = JSON.parse(getCookie('AlArbaaoonBookmark'));
    $('.bookmarksContainer').html('');
    var i=0;
    while(bookmarks[i]){
        hid = parseInt(bookmarks[i]);
        hadithTitle = hadith[hid-1].title;
        hadithFTitle = hadith[hid-1].fTitle;
        $('.bookmarksContainer').append('<tr class="rtLink bookmarkLinks" goto="#hadith:'+hid+'">' +
            '<td>'+hid+'</td>' +
            '<td>'+hadithTitle+'</td>' +
            '<td>'+hadithFTitle+'</td>' +
            '</tr>');
        i++;
    }
}
function saveBookmarks(){
    var newArray = cleanArray(bookmarks);
    var bookmarkStr = JSON.stringify(newArray);
    setCookie('AlArbaaoonBookmark', bookmarkStr, 365);
}
function hadithAddToBookmark(id){
    bookmarks.push(id);
}
function hadithRemoveFromBookmark(id){
    var hadithIndex = bookmarks.indexOf(id);
    delete bookmarks[hadithIndex];
}

/*
    Router
*/
window.onhashchange = function(){
    $('.footerMnu').removeClass('footerMnuActived');
    $('.nav li a').removeClass('actived');
    hash = getHash();
    if (hash=="#home" || hash=="#bookmarks"){$('#footer').hide();}else{$('#footer').show();}
    switch (hash){
        case "#home":
            document.title = "متن الأربعین النوویة";
            $('.aaBox').hide();
            $('#homeDiv').fadeIn(300);
            $('.breadcrumbUl').html(makeBreadcrumb("صفحه‌ی خانگی", "#home"));
            $('.mnuHome').addClass('actived');
            break;
        case "#hadith":
            document.title = "متن الأربعین النوویة - لیست احادیث";
            $('.aaBox').hide();
            $('.hadithList').html('');
            for (i=0; i<=41; i++){
                hid = i+1;
                $('.hadithList').append('<tr class="rtLink listLinks" goto="#hadith:'+hid+'">' +
                    '<td>'+hadith[i].id+'</td>' +
                    '<td>'+hadith[i].title+'</td>' +
                    '<td>'+hadith[i].fTitle+'</td>' +
                    '</tr>');
            }
            $('.breadcrumbUl').html(makeBreadcrumb("لیست احادیث", "#hadith"));
            $('#hadithList').fadeIn(300);
            $('.mnuHadith').addClass('actived');
            $('.fm1').addClass('footerMnuActived');
            break;
        case "#about":
            document.title = "متن الأربعین النوویة - درباره‌ی اربعین";
            $('.aaBox').hide();
            $('.breadcrumbUl').html(makeBreadcrumb("درباره‌ی اربعین", "#about"));
            $('#about').fadeIn(300);
            $('.mnuAbout').addClass('actived');
            $('.fm2').addClass('footerMnuActived');
            break;
        case "#bio":
            document.title = "متن الأربعین النوویة - بیوگرافی";
            $('.aaBox').hide();
            $('.breadcrumbUl').html(makeBreadcrumb("بیوگرافی", "#bio"));
            $('#bio').fadeIn(300);
            $('.mnuBio').addClass('actived');
            $('.fm3').addClass('footerMnuActived');
            break;
        case "#contact":
            document.title = "متن الأربعین النوویة - درباره‌ی اربعین";
            $('.aaBox').hide();
            $('.breadcrumbUl').html(makeBreadcrumb("ارتباط و حمایت مالی", "#contact"));
            $('#contact').fadeIn(300);
            $('.mnuContact').addClass('actived');
            break;
        case "#bookmarks":
            if (bookmarks.length==0){
                setHash("#home");
                M.toast({html: 'لیست علاقه‌مندی‌ها خالی است!'});
            }else{
                $('.aaBox').hide();
                $('.breadcrumbUl').html(makeBreadcrumb("لیست علاقه‌مندی‌ها", "#bookmarks"));
                $('#bookmarks').fadeIn(300);
                $('#footer').show();
            }
            break;
        case "#error":
            $('.aaBox').hide();
            $('.breadcrumbUl').html(makeBreadcrumb("خطایی رخ داد!", "#error"));
            $('#error').fadeIn(300);
            break;
    }
    if (hash.substring(0,8)=="#hadith:"){
            var hadithID = parseInt(hash.substring(8,10))-1;
            $('.aaBox, .hadithTitle, .hadithText').hide();
            if (hadithID+1<=42 && hadithID+1>=1){
                $('.hadithNum').html(hadith[hadithID].id);
                $('.hadithTitle').html(hadith[hadithID].title);
                if (tashkilToggle==false){
                    var newText = arabicClr(hadith[hadithID].text);
                    $('.hadithText').html(newText);
                }else{
                    $('.hadithFTitle').html('ترجمه: ' + hadith[hadithID].fTitle);
                    $('.hadithText').html(hadith[hadithID].text);
                }
                $('.hadithTranslate').html(hadith[hadithID].fText);
                $('.hadithSource').attr('data-tooltip', hadith[hadithID].source);
                $('.soundIcon').attr('url', 'https://archive.org/download/40nawawiyat/40Nawawiyat'+hadith[hadithID].id+'.mp3');
                if (bookmarks.indexOf((hadith[hadithID].id).toString())==-1){
                    $('.hadithBookmark').attr('bookmark', 'no');
                    $('.hadithBookmark').attr('data-tooltip', 'افزودن به لیست علاقه‌مندی‌ها');
                }else{
                    $('.hadithBookmark').attr('bookmark', 'yes');
                    $('.hadithBookmark').attr('data-tooltip', 'حذف از لیست علاقه‌مندی‌ها');
                }
                $('#hadithBox, #hadithTranslateBox, .hadithTitle, .hadithText').fadeIn(300);
                $('.breadcrumbUl').html(makeBreadcrumb("لیست احادیث", "#hadith", hadith[hadithID].title, "#hadith:"+hadith[hadithID].id));
            }else{
                location.hash = '#error';
                M.toast({html: 'خطایی رخ داد!'});
            }
    }
};

$(document).ready(function(){
    // onLoad Routing
    if (getHash()!=''){
        var h = getHash();
        h = h.substring(1, h.length);
        setHash('#loading');
        setHash(h);
    }
    // Materialize Initialization
    $('.tooltipped').tooltip();
    // Routing Links Class
    $(document).on('click','.rtLink', function(){
        var goto = $(this).attr('goto');
        setHash(goto);
        $('.rtLink').removeClass('actived');
        if ($(this).attr('ismenu')=='yes'){
            $(this).addClass('actived');
            $('.mobileMenu').hide(100);
        }
        return false;
    });
    // Tashkil (Toggle)
    $('.hadithTashkil').click(function(){
        if (tashkilToggle){
            var newText = arabicClr($('.hadithText').text());
            $('.hadithText').html(newText);
            $(this).attr('data-tooltip', 'نمایش اعراب').html('zoom_in');
            tashkilToggle=false;
        }else{
            var hadithID = parseInt($('.hadithNum').text())-1;
            $('.hadithText').html(hadith[hadithID].text);
            $(this).attr('data-tooltip', 'مخفی‌کردن اعراب').html('zoom_out');
            tashkilToggle=true;
        }
    });
    // Copy it!
    $('.hadithCopy').click(function(){
        var temp = $("<input style='width:0px;height:0px;'>");
        var text = $('.hadithText').text();
        $("body").append(temp);
        temp.val(text);
        temp.select();
        temp.focus();
        document.execCommand("copy");
        M.toast({html: 'متن حدیث به حافظه انتقال یافت!'});
        temp.remove();
    });
    // Download it!
    $('.soundIcon').click(function(){
        window.open($(this).attr('url'), 'Download');
    });
    // Bookmark Button
    $('.hadithBookmark').click(function(){
        var hadithNumber = $('.hadithNum').text();
        if ($(this).attr('bookmark')=='yes'){
            $(this).attr('bookmark', 'no').css('transform', 'rotateY(0deg)');
            hadithRemoveFromBookmark(hadithNumber);
            $('.hadithBookmark').attr('data-tooltip', 'افزودن به لیست علاقه‌مندی‌ها');
            M.toast({html: 'از لیست علاقه‌مندی‌ها حذف شد!'});
        }else{
            $(this).attr('bookmark', 'yes').css('transform', 'rotateY(180deg)');
            hadithAddToBookmark(hadithNumber);
            $('.hadithBookmark').attr('data-tooltip', 'حذف از لیست علاقه‌مندی‌ها');
            M.toast({html: 'به لیست علاقه‌مندی‌ها افزوده شد!'});
        }
        saveBookmarks();
        refreshBookmarkList();
    });
    // Random Hadith Selection
    $('.randomHadith').click(function(){
        var rndNumber = Math.floor(Math.random() * 41) + 1;
        setHash("#hadith:"+rndNumber.toString());
    });
    // Pay Button
    $('.paySubmit').click(function(){
       var amount = parseInt($('#payAmount').val());
       if ($.isNumeric(amount)){
           window.open('https://idpay.ir/webpajooh?amount='+amount+'&desc=حمایت مالی از توسعه‌دهنده‌ی متن الأربعین النوویة', "حمایت مالی");
       }else{
           M.toast({html: 'لطفاً مبلغی عددی و معتبر را وارد کنید!'});
       }
       $('#payAmount').val('');
    });
    // Load Bookmark List
    if (getCookie('AlArbaaoonBookmark')!=''){refreshBookmarkList();}
    // Mobile Menu
    $('.mobileMnuToggle').click(function(){
        $('.mobileMenu').fadeToggle("fast", "linear");
    });
});