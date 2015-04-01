var slideShowMain = function(){
    var response;
    var currentPageNo = 0;
    var nextButtonClickCount = 0;
    var previousButtonClickCount = 0;
    var pages,pagesByDefault,pagesByAlpha;
    var isCompatible = $.ajax({
                              url: "https://api2.healthline.com/api/service/2.0/slideshow/content?partnerId=7eef498c-f7fa-4f7c-81fd-b1cc53ac7ebc&contentid=17103&includeLang=en",
                              async:true,
                              dataType: "json",
                              cache :false
                            });

    var processInitialResponse = function(){
        var contextData = pages.slice(currentPageNo,currentPageNo+2);
        $('title').html(response.data[0].title);
        processTemplate(response.data[0],"slideSummaryTemplate","#health-summary");
        processTemplate(contextData,"slideTemplate","#slides");
        enableProperSlide();
        $('body').on('click','.slideshow .nextButton',addNextButtonListener);
        $('body').on('click','.slideshow .prevButton',addPreviousButtonListener);
        $('body').on('click','.slideControls .settings',openSettings);
        $('body').on('click','.slideMenu .fa-toggle-off',toggleSortFilter);
        $('body').on('click','.slideMenu .fa-toggle-on',toggleSortFilter);
    }

    var enableProperSlide = function(clickType){
        $('.active').attr('class','inactive');
        $($('.inactive')[currentPageNo]).attr('class','active');
        $('.slideStatus').html("Slide "+(currentPageNo+1)+" of "+pages.length);
        var activeElement  = $('.active');
        var previousElement = $('.active').prev();
        var nextElement = $('.active').next();

        //  USER EVENT TRACKING
        if(clickType == "next"){
            nextButtonClickCount = nextButtonClickCount + 1;
            var pixelImage = new Image();
            pixelImage.src = "http://www.healthline.com/images/clear.gif"+"?nextClickCount="+nextButtonClickCount;
            $(activeElement.find('.nextButton')).append(pixelImage);
        }
        else if(clickType == "previous"){
            previousButtonClickCount = previousButtonClickCount + 1;
            var pixelImage = new Image();
            pixelImage.src = "http://www.healthline.com/images/clear.gif"+"?previousClickCount="+previousButtonClickCount;
            $(activeElement.find('.prevButton')).append(pixelImage);
        }
        
        if(currentPageNo == 0){
            activeElement.find('.prevButton').remove();
        }
        else if(currentPageNo == pages.length - 1){
            activeElement.find('.nextButton').remove();
        }

        $('.fa-spin').hide();
        //processDescriptionTemplate(response.data[0].slides[currentPageNo],"slideDescriptionTemplate",".slideContent");

        $('.slideContent').html("<div class='slideTitle'>"+pages[currentPageNo].title+"</div>");
        $('.slideContent').append(pages[currentPageNo].body);
    }
    
    isCompatible.fail(function(result){
        response = mockResponse;
        pagesByDefault = jQuery.extend(true, {}, response.data[0]).slides;
        pages = jQuery.extend(true, {}, response.data[0]).slides;
        pagesByAlpha = jQuery.extend(true, {}, response.data[0]).slides;
        pagesByAlpha = pagesByAlpha.sort(function(a,b){
            if (a.title > b.title) {
                return 1;
              }
              if (a.title < b.title) {
                return -1;
              }
              return 0;
        });
        processInitialResponse();
    });

    isCompatible.done(function(result){
        response = result;
        pagesByDefault = jQuery.extend(true, {}, response.data[0]).slides;
        pages = jQuery.extend(true, {}, response.data[0]).slides;
        pagesByAlpha = jQuery.extend(true, {}, response.data[0]).slides;
        pagesByAlpha = pagesByAlpha.sort(function(a,b){
            if (a.title > b.title) {
                return 1;
              }
              if (a.title < b.title) {
                return -1;
              }
              return 0;
        });
        processInitialResponse();
    });

    var processTemplate = function(data,sourceId,container){
        var source   = $("#"+sourceId).html();
        var template = Handlebars.compile(source);
        var result = template(data);
        $(container).append(result);
    }

    var processDescriptionTemplate = function(data,sourceId,container){
        console.log("inside processDescriptionTemplate");
        console.log(data);
        var source   = $("#"+sourceId).html();
        var template = Handlebars.compile(source);
        var result = template(data);
        $(container).html(result);
    }

    var addNextButtonListener = function(event){
        console.log("nextbutton");
        currentPageNo = currentPageNo + 1;
        var noOfslides  = $('.slides li');

        if(currentPageNo % 2 == 0 && (currentPageNo == noOfslides.length)){
            var contextData = pages.slice(currentPageNo,currentPageNo+2);
            processTemplate(contextData,"slideTemplate","#slides");
        }

        enableProperSlide('next');
    }

    var addPreviousButtonListener = function(event){
        currentPageNo = currentPageNo - 1;
        enableProperSlide('previous');
    }

    var toggleSortFilter = function(){
        $('.slides li').remove();
        $('.slideContent').html('');

        if($(this).hasClass('fa-toggle-off')){
            $(this).removeClass("fa-toggle-off");
            $(this).addClass("fa-toggle-on");
            pages = pagesByAlpha;
        }
        else{
            $(this).removeClass("fa-toggle-on");
            $(this).addClass("fa-toggle-off");
            pages = pagesByDefault;
        }

        currentPageNo = 0;
        var contextData = pages.slice(currentPageNo,currentPageNo+2);
        processTemplate(contextData,"slideTemplate","#slides");
        enableProperSlide();
    }

    var openSettings = function(){
        if($(this).hasClass('open')){
            $(this).removeClass("open");
            $('.slideMenu').hide('slow');
        }
        else{
            $(this).addClass("open");
            $('.slideMenu').show('slow');
        }
    }

}();
