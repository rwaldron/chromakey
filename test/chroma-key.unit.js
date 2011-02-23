var bgcss =  {
      "background-image": "url(assets/boston.jpg)", 
      "border" : "1px solid #444444"
    }, 
    $fixture, $fixtureHTML; 


module("chromaKey", {
  setup: function() {
    
    if ( !$fixture ) {
      $fixture = jQuery("#qunit-fixture");
      fixtureHTML = $fixture.html();
    } else {
      $fixture.html(fixtureHTML);
    }
    
    
    jQuery("canvas").remove();
    
    
    
  },
  teardown: function() {
    //ok(true);
    //console.log("teardown");
  }
});

test("exists", function() {
  
  expect(2);
  
  
  ok( chromaKey, "chromaKey exists");
  
  equal( typeof chromaKey, "function", "chromaKey() is a function" );
  
});


asyncTest("instance", function() {
  
  expect(7);
  
  setTimeout(function() {

    var instance = chromaKey( "green", {
                      match: [ 0, 230, 52 ],
                      css: bgcss
                    });


    equal( typeof instance.data, "object", "Instance has data prop" );

    equal( typeof instance.guid, "number", "Instance has guid number" );

    equal( typeof instance.hue, "number", "Instance has a hue" );

    equal( typeof instance.key, "string", "Instance has a key" );

    equal( typeof instance.scale, "number", "Instance has a scale" );

    equal( typeof instance.type, "string", "Instance has a type" );

    equal( typeof instance.media, "object", "Instance has media" );

    start();
  
  }, 500);
});


asyncTest("keying types", function() {
  
  expect(2);
 
 
  setTimeout(function() { 
  
    var green = chromaKey( "green", {
              scale: 1, 
              match: [ 0, 230, 52 ],
              css: bgcss
            }), 
      blue = chromaKey( "blue", {
            scale: 1, 
            match: [ 0, 230, 150 ],

            width: 320, 
            height: 192,                   
            css: bgcss
          });

    equal( green.key, "green", "green.key is green" );
    equal( blue.key, "blue", "blue.key is blue" );

    start();
  
  }, 500);    
  
});


asyncTest("media node types", function() {
  
 expect(2);
 
 setTimeout(function() { 
 
   var okgo = chromaKey( "okgo", {
                scale: 1, 
                //match: [ 30, 50, 150 ],
                match: "blue", 
                width: 320, 
                height: 192, 
                css: {
                  "background-image": "url(http://www.workingsheepdog.co.uk/im/100902_MossieRed-01-600.jpg)"
                }
              }), 
      lego = chromaKey( "lego", {
                scale: 1, 
                match: "green",
                css: bgcss
              });

    equal( okgo.media.nodeName, "VIDEO", "okgo.media.nodeName is VIDEO" );
    equal( lego.media.nodeName, "IMG", "lego.media.nodeName is IMG" );

    start();
  
  }, 500);    
    
});
