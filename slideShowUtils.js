var slideShowUtils = function()
{	

}

slideShowUtils.prototype.processTemplate = function(data,sourceId,container){
	var source   = $("#"+sourceId).html();
	var sourceBackUp = $("#"+sourceId);
	var template = Handlebars.compile(source);
	var result = template(data);
	$("#"+container).html(result);
	$("#"+container).append(sourceBackUp);
}
