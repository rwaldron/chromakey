document.addEventListener( "DOMContentLoaded", function() {
  
  var bgcss =  {
        "background-image": "url(assets/boston.jpg)", 
        "border" : "1px solid #444444"
      }, 
      
      okgo, video, green, blue, tunic, lego, oceans;
  

  chromaKey( "green", {
            scale: .75, 
            match: [ 0, 230, 52 ],
            css: bgcss
          });


  chromaKey( "monster-green", {
            scale: 1, 
            match: "green", //[ 0, 230, 150 ],
                  
            css: bgcss

          });

          
  chromaKey( "set", {
            scale: 1, 
            match: "blue", //[ 0, 230, 150 ],
                  
            css: bgcss

          });
  chromaKey( "blue", {
            scale: .75, 
            match: [ 0, 230, 150 ],

            width: 320, 
            height: 192,                   
            css: bgcss

          });
  chromaKey( "tunic", {
            width: 404, 
            height: 400, 
            scale: 1, 
            match: [ 100, 100, 43 ],
            css: bgcss

          });
          
  chromaKey( "lego", {
            width: 321, 
            height: 439, 
            scale: .75, 
            match: [ 100, 100, 43 ],
            css: bgcss

          });

  chromaKey( "okgo", {
    scale: .5, 
    //match: [ 30, 50, 150 ],
    match: "blue", 

    css: {

      "background-image": "url(http://www.workingsheepdog.co.uk/im/100902_MossieRed-01-600.jpg)"



    }
  });          
/*
  okgo = chromaKey( "okgo", {
            scale: .75, 
            //match: [ 30, 50, 150 ],
            match: "blue", 

            css: {

              "background-image": "url(http://www.workingsheepdog.co.uk/im/100902_MossieRed-01-600.jpg)"
              
            
              
            }
          });

  video = chromaKey( "video", {
            scale: .75, 
            match: [ 100, 100, 43 ], 

            css: bgcss
          });
  oceans = chromaKey( "oceans", {
              scale: .75, 
              match: "blue", 
              css: bgcss
            });

*/
                
                
  //console.log( okgo, video, green, blue, lego );                
  

}, false);