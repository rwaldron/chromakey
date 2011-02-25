$(function() {
  
  
  $("#chroma-demo-trigger").bind( "click", function( event ) {
    
    
    $("#chroma-demo-iframe, #chroma-demo-panel").css({
      width: $(window).width() - 50, 
      height: $(window).height()
    });
    
    
    $("#chroma-demo-iframe").attr({
      src: "chroma-key.demo.html"
    });
    
    $("#chroma-demo-panel").show();
    
  
  });


  $("#chroma-demo-panel a").bind( "click", function( event ) {
    
    event.preventDefault();
    
    $("#chroma-demo-panel").hide();
  
  });

});