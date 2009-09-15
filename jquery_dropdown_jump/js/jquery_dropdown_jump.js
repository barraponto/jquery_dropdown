/**
 * This uses some clever logic to find the parent form of the select and submit the button
 */
$(document).ready(function() {
  
  $("ul.jquery_dropdown_jump li a").click(function(){
    if ($(this).attr('rel') == '') return;//don't jump if no value
    
    //find the parent form of this jump menu
    var parent_form = $(this).parents().filter("form");
   
    //submit the form by clicking the submit button 
    parent_form.find("input.form-submit").click();
  });
});