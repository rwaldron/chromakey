document.addEventListener( "DOMContentLoaded", function() {
  
  var bgcss =  {
        //"background-image": "url(assets/boston.jpg)", 
        "border" : "1px solid #444444"
      }, 
      
      okgo, video, green, blue, lego, oceans;
  
  
  
  okgo = chromaKey( "okgo", {
            scale: 1, 
            //match: [ 30, 50, 150 ],
            match: "blue", 
            width: 600, 
            height: 333, 
            css: {
              width: "600px",
              height: "333px", 
              "background-image": "url(http://www.workingsheepdog.co.uk/im/100902_MossieRed-01-600.jpg)"
              
            
              
            }
          });

  video = chromaKey( "video", {
            scale: 1, 
            match: [ 100, 100, 43 ], 

            css: bgcss
          });

  green = chromaKey( "green", {
            scale: 1, 
            match: [ 0, 230, 52 ],
            css: bgcss

          });

  blue = chromaKey( "blue", {
            scale: 1, 
            match: [ 0, 230, 150 ],

            width: 320, 
            height: 192,                   
            css: bgcss

          });
  
  lego = chromaKey( "lego", {
            width: 321, 
            height: 439, 
            scale: 1, 
            match: [ 100, 100, 43 ],
            css: bgcss

          });


  oceans = chromaKey( "oceans", {
              scale: 1, 
              match: "blue", 
              css: bgcss
            });


                
                
  //console.log( okgo, video, green, blue, lego );                
  

}, false);