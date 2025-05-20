function initialise_jumper(totalDocs, docsPerPage, pageQueryParams){
                              
                              numPages = Math.ceil(totalDocs / docsPerPage);
                              
                              
                              formHTML='<form name="jump" action="/search" method="get"><span class="jumper_text"><input class="ui-state-default ui-corner-all" type="text" name="startPage" value="'+pageQueryParams['startPage']+'" size="5"/> of '+numPages+'</span><input type="hidden" name="startDoc" value="" />';
                                 Object.keys(pageQueryParams).forEach(function (key) { 
                                 if (key !='startPage') {
                                 formHTML+='<input type="hidden" name="'+key+'" value="'+pageQueryParams[key]+'" />';
                                 }
                                 })
                                 formHTML+='<input type="hidden" name="numPages" value="'+numPages+'"/><input type="hidden" name="docsPerPage" value="'+docsPerPage+'"/><input type="submit" value="Jump" class="ui-button ui-widget ui-state-default ui-corner-all" role="button"/></form>';
                              
                              $('.campl-pagination').after(formHTML);
                              }
;($(document).ready(function() {
                              $('form[name="jump"]').submit(function(event){
                              form=$(this);
                              numPages_obj=$(form).find('input[name="numPages"]')
                              docsPerPage_obj=$(form).find('input[name="docsPerPage"]')
                              startPage_obj =$(form).find('input[name="startPage"]');
                              startDoc_obj = $(form).find('input[name="startDoc"]');
                              
                              docsPerPage=docsPerPage_obj.val();
                              requestedPage=startPage_obj.val();
                              numPages=numPages_obj.val();

                              if (requestedPage.match(/^[0-9]+$/g)) {
                              requestedStartDoc=((numPages - 1) * docsPerPage) +1;
                              if (requestedPage >= 1 && requestedPage <= numPages) {
                              requestedStartDoc = ((Number(requestedPage)- 1) * docsPerPage) +1;
                              } 
                              }
                              $(startDoc_obj).val(requestedStartDoc);
                              $(form).hide();
                              startPage_obj.remove();
                              numPages_obj.remove();
                              docsPerPage_obj.remove();

                              });
                 }));          