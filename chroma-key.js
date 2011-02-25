(function ( global, Math ) {
  
  var doc = global.document, 
  
  //  Minor method lookup performance improvement
  ceil = Math.ceil, 
  
  //  Inspired by Underscore.js's _.range(), only...
  //  deliriously fast in Chrome: http://jsperf.com/range-vs-range
  range = function(start, stop, step) {
    var start = start || 0,
        stop  = stop || start || 0,
        step  = step || 1,
        len   = ceil( (stop - start) / step) || 0 ,
        idx   = 0,
        range = [];
    
    range.length = len;
    
    while ( idx < len ) {
      range[ idx++ ] = start;
      start += step;
    }
    return range;
  },  
  //  http://130.113.54.154/~monger/hsl-rgb.html
  rgbHue = function( r, g, b ){
    
    //  Convert to 0-1 range
    r /= 255, g /= 255, b /= 255;
    
    //  Determine the max/min values 
    var max = Math.max( r, g, b ), 
        min = Math.min( r, g, b ), 
        lum = ( max + min ) / 2, 
        hue, sat, 
        delta;

    //  Return for black, white, gray values
    if ( max === min ) {
      return {
        H: 0, 
        S: 0, 
        L: lum
      };
    }

    delta = max - min;
    
    sat = delta / ( lum > 0.5 ? 2 - max - min : max + min );
    
    
    if ( max === r ) {
      hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); 
    }

    if ( max === g ) {
      hue = ( b - r ) / delta + 2; 
    }

    if ( max === b ) {
      hue = ( r - g ) / delta + 4; 
    }  

    
    return {
      //  Scale conversion to integer  
      H: hue * 60, 
      S: sat * 100, 
      L: lum * 100
    };    
  }, 
  nodeData = {
    video : {
      ready: "readyState",
      load: "loadeddata", 
      width: "videoWidth", 
      height: "videoHeight", 
      action: "throttle"
    },
    img : {
      ready: "complete", 
      load: "load", 
      width: "width", 
      height: "height",
      action: "process"
    }
  },
  keyData = {
    green: [ 0, 255, 0 ],
    blue: [ 50, 70, 135 ]
  },
  hueData = {
    green: range( 59, 159 ), 
    blue: range( 160, 260 )
  };  

  
  //console.log(hueData.blue, hueData.green);
  
  function ChromaKey( id, options ) {

    //  Store ref to `this` context
    var self = this;
    
    options = options || {};
    
    //  Store a ref to the media element - needs better checks
    this.media = doc.getElementById( id ) || doc.getElementsByTagName( id )[0] ;
    
    //  Key Matching
    if ( options.match && typeof options.match === "string" ) {
      
      //  If options.mtach is a string and matches the hueData keys
      //console.log(hueData[ options.match ]);
      
      this.key = hueData[ options.match ] && options.match;
      this.hsl = rgbHue.apply( null, keyData[ this.key ] );

    } else {
      
      
      //  Translate from array
      options.match = options.match || [ 100, 100, 100 ];
      
      
      this.hsl = rgbHue.apply( null, options.match );
      this.hue = ceil( this.hsl.H );
      
      //  Match type branching
      this.key = "";

      for ( var prop in hueData ) {
        //  Find the hue within this hue data set to select correct set
        if ( hueData[ prop ].indexOf( this.hue ) > -1  ) {
          this.key = prop;
        }
      }
    }
    
    //  Output scaling
    this.scale = options.scale || 1;
    
    //  GUID
    this.guid = +new Date();
    
    //  Media node type
    this.type = this.media.nodeName.toLowerCase();
    
    //  Node specific properties
    this.data = nodeData[ this.type ];
    
    //  Raw caching for last frame data
    this.last = [];

    //  Ceil caching for last frame data
    //  Will be set to Uint16Array
    this.Uint16Ceil;
    
    
    
    var initKeying = function() {

      //  Store a ref to the video element dimensions
      self.width = ( options.width || self.media[ self.data.width ] ) * self.scale;
      self.height = ( options.height || self.media[ self.data.height ] ) * self.scale; 

      //  Create canvases, auto-id unless provided
      self.reference = self.canvas( options.reference || "chroma-ref-" + self.guid );
      self.chromakey = self.canvas( options.chromakey || "chroma-chr-" + self.guid );

      //  Stash the reference canvas
      self.reference.style.display = "none";


      //  If style specified, apply
      if ( options.css ) {
        for ( var prop in options.css ) {
          self.chromakey.style[ prop ] = options.css[ prop ];
        }
      }

      //  Store refs to canvas contexts
      self.referenceContext = self.reference.getContext("2d");
      self.chromakeyContext = self.chromakey.getContext("2d");


      //  If just an image, then process immediately
      if ( self.data.action === "process" ) {

        self.process();

      } else {

        //  Throttling 
        self.timeout = options.timeout || 0;        

        //  Register listener to handle playback rendering
        self.media.addEventListener( "play", function() {

          //  Call the processing throttler
          self.throttle();

        }, false);  
      }
    };
    
    //  Media exists
    if ( this.media ) {
      
      //  Media is ready to process
      if ( this.media[ this.data.ready ] ) {
      
        initKeying();
      
      //  Media is not ready, listen for readyness
      } else {
      
        this.media.addEventListener( this.data.load , initKeying, false);
      
      }
    }
    
    return this;
  }

  ChromaKey.prototype.canvas = function( id ) {
    
    var canvas = doc.createElement("canvas");
    
    this.media.parentNode.appendChild( canvas );
    
    canvas.id = id;
    canvas.width = this.width;
    canvas.height = this.height;    
    
    return canvas;
    
  };
 
  ChromaKey.prototype.throttle = function() {
    
    
    //  Return immediately if paused/ended
    if ( this.media.paused || this.media.ended ) {
      return;
    }
    
    //  Process the current scene
    this.process();
    
    //  Store ref to `this` context
    var self = this;
    
    //  The actual throttling is handled here, 
    //  throttle set to 20 fps
    setTimeout(function () {
      
      //  Recall the processing throttler
      self.throttle();

    }, this.timeout );
  };
  
  
  ChromaKey.prototype.process = function() {
      
    var width = this.width, 
        height = this.height,
        ceils = [], 
        last, frame, frameLen, r, g, b, idx, hsl, hueIdx;
    
    
    //  Draw current video frame
    this.referenceContext.drawImage( this.media, 0, 0, width, height );

    //  Return current 32-bit CanvasPixelArray data
    frame = this.referenceContext.getImageData( 0, 0, width, height );

    //  Cache the length of the current frame.data ( CanvasPixelArray )
    frameLen = frame.data.length;
    

    //  Reference last frame raw, allows us to speed up pixel writing
    //  by skipping pixels that havent changed
    last = this.last;
    
    //  Reference last frame ceil, allows us to speed up pixel writing
    //  by skipping pixels that havent changed    
    
    if ( !this.Uint16Ceil ) {
      
      this.Uint16Ceil = new Uint16Array( frameLen );
    
    }
    
    ceils = this.Uint16Ceil;
    
    //  Each "frame" populates 4 indices of the ImageData/
    //  CanvasPixelData array, representing R, G, B, A

    //  Iterate sets of 4 pixel indices this frame  
    for ( idx = 0; idx < frameLen; idx = idx + 4 ) {
      
      
      //  TODO: This entire process needs work...
      //   - anti-aliasing
      //   - active contour

      
      if ( last.length && ( ceils[ idx + 0 ] === ceil( frame.data[ idx + 0 ] ) &&
                             ceils[ idx + 1 ] === ceil( frame.data[ idx + 1 ] ) && 
                               ceils[ idx + 2 ] === ceil( frame.data[ idx + 2 ] ) ) ) {

        frame.data[ idx + 3 ] = last[ idx + 3 ];

      } else {
        
        //  Ceil cache
        for ( var c = 0; c < 3; c++ ) {
          ceils[ idx + c ] = ceil( frame.data[ idx + c ] );
        }
        
        //  Get HSL for this pixel
        testHsl = rgbHue( frame.data[ idx + 0 ], 
                          frame.data[ idx + 1 ], 
                          frame.data[ idx + 2 ] 
                        );

        hueIdx = hueData[ this.key ].indexOf( ceil( testHsl.H ) );

        if ( hueIdx > -1 ) {

          //  Setting the pixel's `alpha` value to 0 will result in transparency
          //  frame.data[ idx + 3 ] = hueIdx / hueData[ this.key ].length;

          //if ( testHsl.S  >= this.hsl.S - 10 && testHsl.L >= this.hsl.L - 10  ) {// && hsl.L < 75
          if ( testHsl.S > 25 && testHsl.L > 1 ) {
          
            frame.data[ idx + 3 ] = 0;

          }
        }
      } 
    }
    
    this.last = frame.data;
    
    this.Uint16Ceil = ceils;
    
    //  Draw back to the chroma canvas
    this.chromakeyContext.putImageData( frame, 0, 0 );

  };


  //  Expose API
  global.chromaKey = function( id, options ) {
    return new ChromaKey( id, options );
  }
  

})( this, Math );
