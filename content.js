// Alas 'run_at document_idle' is still too early...
// (there's probably a better way of doing this though - eg, DOM observers)
setTimeout(function(){
  // Template Matching algorithm using correlation coeffizient
  // http://en.wikipedia.org/wiki/Template_matching
  // learned at HTW Berlin tought by Prof. Dr. Kai Uwe Barthel
  function getCorrelationCoeffizient(data1, data2){
    var sumI = 0, sumI2 = 0, sumIR = 0, sumR = 0, sumR2 = 0;
    var nR = data1.length;

    for(var i=0; i<nR; i++){
      var vI = data1[i];
      var vR = data2[i];

      sumI += vI;
      sumI2 += vI * vI;

      sumR += vR;
      sumR2 += vR * vR;

      sumIR += vI * vR;
    }

    var meanI = sumI / nR;
    var meanR = sumI / nR;
    var sigmaI = Math.sqrt(sumI2 - nR * meanI * meanI);
    var sigmaR = Math.sqrt(sumR2 - nR * meanR * meanR);

    return (sumIR - nR * meanI * meanR) / (sigmaI * sigmaR);
  }

  // place a yellow star onto the album cover
  function placeStar(i){
    $('.searchList__item').eq(i).find('.image').append($('<span class="star">★</span>').css({
      position: 'absolute',
      right: '-13px',
      bottom: '-18px',
      fontSize: '34px',
      color: 'hsl(48,100%,50%)',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.21)'
    }));
  }

  var waveformData = [];

  // collect all waveforms
  $('canvas.waveform__layer:first-child').each(function(i, canvas){
    var ctx = canvas.getContext('2d');
    waveformData.push( ctx.getImageData(0,0,canvas.clientWidth,canvas.clientHeight).data );
  });

  // compare each waveform against one another
  // and star them if their euqal enough (0.9 threshold)
  for(var i=0, l=waveformData.length; i<l; i++){
    for(var j=1; j < (l-i); j++){
      var coeffizient = getCorrelationCoeffizient(waveformData[i], waveformData[i+j]);
      console.log(coeffizient);
      if(coeffizient > 0.9){
        placeStar(i);
        placeStar(i+j);
      }
    }
  }
}, 2 * 1000)


