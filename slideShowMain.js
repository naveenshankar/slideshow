var slideShowMain = function(){
    var response;
    var currentPageNo = 0;
    var pages;
    var isCompatible = $.ajax({
                              url: "https://api2.healthline.com/api/service/2.0/slideshow/content?partnerId=7eef498c-f7fa-4f7c-81fd-b1cc53ac7ebc&contentid=17103&includeLang=en",
                              async:true,
                              dataType: "json",
                              cache :false
                            });
    var utils = new slideShowUtils();

    var processInitialResponse = function(myResponse){
        $('title').append(response.data[0].title);
        $('.health-summary').append(response.data[0].summary);
        pages = response.data[0].slides;
        var contextData = pages.slice(currentPageNo,currentPageNo+2);
        processFutureResponses(contextData);
        $($('.inactive')[0]).attr('class','active');
        $('.nextButton').click(addNextButtonListener);
        $('.prevButton').click(addPreviousButtonListener);
    }

    var processFutureResponses = function(data){
        console.log("inside processFutureResponses");
        console.log(data);
        utils.processTemplate(data,"slideTemplate","slides");
    }
    
    isCompatible.fail(function(data){
        response = mockResponse;
        processInitialResponse(response);
    });

    isCompatible.done(function(data){
        response = data;
        processInitialResponse(response);
    });

    var addNextButtonListener = function(event){
        console.log("nextbutton");
        currentPageNo = currentPageNo + 1;
        var activeElement  = $('.active');
        var nextElement = $('.active').next();
        activeElement.attr('class','inactive');
        nextElement.attr('class','active');

        if(currentPageNo == pages){
            if($(nextElement).next().length < 1){
                nextElement.find(".nextButton").remove();
            }
        }
        else if(currentPageNo % 2 == 0){
            var contextData = pages.slice(currentPageNo,currentPageNo+2);
            processFutureResponses(contextData);
        }
    }

    var addPreviousButtonListener = function(event){
        console.log("prevButton");
        currentPageNo = currentPageNo - 1;
        var activeElement  = $('.active');
        var previousElement = $('.active').prev();
        activeElement.attr('class','inactive');
        previousElement.attr('class','active');

        if($(previousElement).prev().length < 1){
            previousElement.find('.prevButton').remove();
        }
    }

}();
