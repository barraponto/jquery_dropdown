/**
 * Steps:
 *
 * 1. Output a drupal select box by default so that if js is turned off the user would have a normal dropdown + submit form
 * 2. Give drupal a class of "jquery_dropdown"  
 * 3. Have jquery convert it to a hidden input and hide the submit
 * 4. Have jquery grab all the key/values from the select build the css/html markup that 'looks' like a dropdown
 * 5. Add a listener so when an item gets selected and populate the hidden value and submit the form to achieve the same functionality
 *
 **/
$(document).ready(function() {
  //this does the actual css/html replacement of the select dropdown
  $("select.jquery_dropdown").each(function(){
    $(this).load_jquery_dropdown();//load jquery dropdowns
  });
});

/**
 * Load jquery dropdown for a select
 *
 * This is a re-usable function for select elements that don't have the .jquery_dropdown class
 */
$.fn.load_jquery_dropdown = function(options) {
  if (!$(this).html()) return;
    
  $(this).hide();//hide this select
  
  //hide elements with jquery_dropdown class (in case you want to hide the submit button for instance)
  //for a better hide we have included .jquery_dropdown { display: none; } in the default css which keeps
  //the select from "flashing" on and off, the noscript tag inserted in hook_footer() keeps it from hiding
  //those elements when javascript is disabled to make it degrade gracefully
  $(".jquery_dropdown").hide();
  
  var select_id = $(this).attr('id');  
  var select_name = $(this).attr('name');
  var select_name_nice = select_name.replace(/\[[^\"]+/,'');//strip out []
  var select_default_value = $(this).val();
  var select_default_text = $(this).find('option[value='+select_default_value+']').text();
  
  var select_values = new Array();
  var c = 0;
  
  var output = '<div class="jquery_dropdown_container jquery_dropdown_'+select_name_nice+'">';
  
  var is_jumpdown = ($(this).attr('class').match("jquery_dropdown_jump")) ? 1 : 0;//for adding jump class if applicable
    
  //start with the first option
  output += '<div class="jquery_dropdown_header jquery_dropdown_header_'+select_name_nice+'">'+$(this).find("option:first").text()+'</div>';
  output += '<ul class="jquery_dropdown_list '+((is_jumpdown) ? 'jquery_dropdown_jump' : '') +'">';//start unordered list
  
  //build <ul> list here
  $(this).find("option").each(function(){
    output += '<li><a href="#" class="'+select_id+'" rel="'+$(this).val()+'">'+$(this).text().replace(/ /g, '&nbsp;')+'</a></li>';
      
    c++;
  });
    
  output += '</ul></div>';
    
  $(this).after(output);
  
  //this is the click event for when you click the fake select, it shows the options below
  $("div.jquery_dropdown_header_"+select_name_nice).click(function(){
    
    if ($(this).parent("div.jquery_dropdown_container").find("ul.jquery_dropdown_list").css('display') == 'block') {
      $(this).parent("div.jquery_dropdown_container").find("ul.jquery_dropdown_list").attr('style', 'display:hidden');
    }
    else {
      $(this).parent("div.jquery_dropdown_container").find("ul.jquery_dropdown_list").attr('style', 'display:block');
    }
  });
  
  //this is the event for when you select a fake option
  $("ul.jquery_dropdown_list li a").click(function(){

    $(this).parent("li").parent('ul').parent("div.jquery_dropdown_container").find("div.jquery_dropdown_header").text($(this).text());
    $(this).parent("li").parent('ul').parent("div.jquery_dropdown_container").find("ul.jquery_dropdown_list").hide();

    $("#"+$(this).attr('class')).val($(this).attr('rel'));//set value to select
    
    $(this).trigger("jquery_dropdown_list_refreshed");

    return false;
  });

  //hide when mouse out
  $("ul.jquery_dropdown_list").hover(function(){}, function(){
    $(this).hide();
  });

  //set initial header value
  $("div.jquery_dropdown_header_"+select_name_nice).text(select_default_text);
};