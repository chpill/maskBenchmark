var benchSuite = new Benchmark.Suite,
    results = document.getElementById('results'),
    // images to use in the test
    lena = document.createElement('img'),
    mask = document.createElement('img'),
    maskInverted = document.createElement('img'),
    cv = document.getElementById('cv'),
    ctx = cv.getContext('2d'),
    resourcesRemaining = 2;

function logResult(text){
  var li = document.createElement('li');
  li.innerHTML = text;
  results.appendChild(li);
}


function draw(destination, source, composition){
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(
    destination,
    0, 0, destination.width, destination.height,
    0, 0, cv.width, cv.height
  );

  ctx.globalCompositeOperation = composition;
  ctx.drawImage(
    source,
    0, 0, source.width, source.width,
    0, 0, cv.width, cv.height
  );
}

function clearCanvas(){
  ctx.clearRect(0, 0, cv.width, cv.height);
}

testCases = [
  {operation: 'destination-in', destination: lena, source: maskInverted},
  {operation: 'destination-out', destination: lena, source: mask},
  {operation: 'destination-atop', destination: lena, source: maskInverted},
  {operation: 'source-in', destination: maskInverted, source: lena},
  {operation: 'source-out', destination: mask, source: lena},
  {operation: 'source-atop', destination: maskInverted, source: lena},
  {operation: 'xor', destination: lena, source: mask},
];

benchSuite.on('cycle', function (evt){
  logResult(String(evt.target));
})
  .on('complete', function(){
    // just to desmonstrate the subject of the test
    t = testCases[0];
    draw(t.destination, t.source, t.operation);

    // remove progress notice
    progressNotice = document.getElementById("inProgress");
    progressNotice.parentNode.removeChild(progressNotice);
});

testCases.forEach(function(t){
  benchSuite.add({
    name: t.operation,
    fn: function(){
      draw(t.destination, t.source, t.operation);
      clearCanvas();
    },
  });
});


// add the src to the images, the test will begin as soon as they are loaded
function loadedRessource (){
  if(! --resourcesRemaining) benchSuite.run({
      async: true,
      queued: true
    });
}

lena.onload = maskInverted.onload = mask.onload = loadedRessource;
lena.src = "assets/images/lena.jpg";
maskInverted.src = "assets/images/maskInverted.png";
mask.src = "assets/images/mask.png";

