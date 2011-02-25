

//  Iteration optimization algorithm

//  10x10 image
//  100 pixels
//  400 items in pixel array, 0-399, 4 items per pixel
var pxs = 100, 
    pxsData = new Uint16Array( pxs * 4 );
    pxsLen = pxsData.length;

    


for ( var idx = 0; idx < pxsLen / 4; idx = idx + 4 ) {
  
  var subPxsData = pxsData.subarray( idx, idx + 4 );
  
  
  
  for ( var pix = 0; pix < 4; ++pix ) {

    subPxsData[ pix ] = pix;

  }

}


console.log(pxsData);