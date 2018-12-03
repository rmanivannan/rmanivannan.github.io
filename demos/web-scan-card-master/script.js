

//-1, -1     0, -1   1, -1
//- 1, 0     0, 0    1, 0
//- 1, 1     0, 1    1, 1

//(function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var ccImg = document.getElementById('ccImg');
    var boolImg = [[]];
    var bits = [];
    var bitIndex = 0;
    
    var buffer = 1; // closeness

    var iterations = 0; //thinning iterations
    var isDarkBg = false;
    var ignoreNoicePixcelsIflessersize = 10;
    var ignoreNoicePixcelsIfLargersize = 350;
    var minEligibleScore = 0.4;
    var startCoodrinateToscan = [10,84];
    var boxSizeToscan = [280,18];
    
    var cardImgWidth = 310;
    var cardImgHeight = 190;
    
    var smootThreshold = 6; // if more than smootThreshold sourandings are white, center cell also will be white
    var numberOfsmoothIteration = 5;
    var grayscaleThreshold = 100; // half of 256 = 2^8 - need some logic to get for particular image, number of pixcels vs grey scall(0-255)
    var arAr = [[]];

    var matchList = [
        // [{x,y},{0,1},{1,1},{2,1}] - item 1
        //[ {x,y}, {10,11},{11,11},{12,11}] - item 2
    ];
    var colors = [
        [255, 0, 0],
        [255, 255, 255]
    ];

    ccImg.crossOrigin = 'Anonymous';
    
    
    // Read image
    setTimeout(() => {
        //ctx.drawImage(ccImg, -70, -280, 520, 600); // cc1.jpg
        //ctx.drawImage(ccImg, 0, -190, 425, 375); // cc2.jpg
        //ctx.drawImage(ccImg, 0, -5, 400, 600); // cc3.jpg
        //ctx.drawImage(ccImg, 0, 0, cardImgWidth, cardImgHeight); // cc4.png
    }, 100);


    // Convert to black&white
    setTimeout(() => {
        //convertColorToBW(ctx);
        //scanCard();
    }, 1000);

    function scanCard () {
        if ( window.location.protocol !== "https:" ) {
        //document.body.innerHTML = 'Must be https.';
        //return;
        }
        
        navigator.getUserMedia  = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;

        if ( !navigator.getUserMedia ) { return false; }
        
        var width = 0, height = 0;
        
        //var canvas = document.createElement('canvas'),
        //ctx = canvas.getctx('2d');
        //document.body.appendChild(canvas);

        
        
        var video = document.createElement('video'),
            track;
        video.setAttribute('autoplay',true);
        video.setAttribute('width',100);
        video.setAttribute('height',100);
        
        window.vid = video;
        
        function getWebcam(){ 
            var constraints = {
                advanced: [{
                    facingMode: "environment"
                }]
            };
            navigator.getUserMedia({ 
                video: constraints, 
                audio: false }, 
                function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    track = stream.getTracks()[0];
                }, 
                function(e) {
                    console.error('Rejected!', e);
                }
            );
        }
        
        getWebcam();
        
        var rotation = 0,
            loopFrame,
            centerX,
            centerY,
            twoPI = Math.PI * 2;
        
        function loop(){
            
            loopFrame = window.requestAnimationFrame(loop);
            
                //ctx.clearRect(0, 0, width, height);
                
                // ctx.globalAlpha = 0.005;
                // ctx.fillStyle = "#FFF";
                // ctx.fillRect(0, 0, width, height);
                
                ctx.save();
                
                
                // ctx.beginPath();
                // ctx.arc( centerX, centerY, 140, 0, twoPI , false);
                // //ctx.rect(0, 0, width/2, height/2);
                // ctx.closePath();
                // ctx.clip();
                
                //ctx.fillStyle = "#FFF";
                //ctx.fillRect(0, 0, width, height);
                
                // ctx.translate( centerX, centerY );
                // rotation += 0.005;
                // rotation = rotation > 360 ? 0 : rotation;
                // ctx.rotate(rotation);
                // ctx.translate( -centerX, -centerY );
                
                ctx.globalAlpha = 0.1;
                if(track){
                    ctx.drawImage(video, 0, 0, width, height);
                    ctx.restore();
                }

            }
            
            function startLoop(){ 
                loopFrame = loopFrame || window.requestAnimationFrame(loop);
            }
            
            video.addEventListener('loadedmetadata',function(){
                width =  video.videoWidth;
                height = video.videoHeight;

                canvas.width = cardImgWidth;
                canvas.height = cardImgHeight;

                //width = 200;
                //height = 100;

                centerX = width / 2;
                centerY = height / 2;
                startLoop();
            });
            
            canvas.addEventListener('click',function(){
                if ( track ) {
                    if ( track.stop ) { track.stop(); }
                    track = null;
                } else {
                getWebcam();
                }
            });
    }


    function convertColorToBW(){
        var w = canvas.width;
        var h = canvas.height;

        //w = 500;
        //h = 70;
        var imgPixels = ctx.getImageData(startCoodrinateToscan[0], startCoodrinateToscan[1], boxSizeToscan[0], boxSizeToscan[1]);

        //return ;
        
        function isThresholdMetForWhite(avg, grayscaleThreshold) {
            var islighter = avg >= grayscaleThreshold;
            return isDarkBg ? islighter : !islighter;
        }
        
        for (var i = 0; i < imgPixels.data.length; i += 4) {
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            avg = (avg >= grayscaleThreshold) ? 255 : 0;

        
            var boolVal = avg == 0 ? 0 : 1;
            bits[i/4] = boolVal;

            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;

        }

        drowImg(ctx, imgPixels);

        // fill the gaps / Blur it before applaying skelitons
        // NOT in use
        // Need improvement



        while (numberOfsmoothIteration !=0 ) {
            numberOfsmoothIteration --;
            for (var i = 0; i < imgPixels.height; i++) {
                for (var j = 0; j < imgPixels.width; j++) {
                    var index = getIndexFromPos(j, i);//(i * 4) * imgPixels.width + j * 4;
                    var bitsInx = index / 4;
                    if (bits[bitsInx] == 0) {
                        fillGaps(j, i, bitsInx);
                    }
                }
            }
            drowImg(ctx, imgPixels);
        }

            
        function fillGaps(x, y, bitsInx) {
            //if 2 or more more white sroundeded  

                //-1, -1     0, -1   1, -1
                //- 1, 0     *,*     1, 0
                //- 1, 1     0, 1    1, 1
            var sumOfWhites =   isWhite(x-1 , y-1 ) +
                                isWhite(x,    y-1 ) +
                                isWhite(x+1,  y-1 ) +
                                isWhite(x- 1, y   ) +
                                isWhite(x+1,  y   ) +
                                isWhite(x- 1, y+1 ) +
                                isWhite(x,    y+1 ) +
                                isWhite(x+1,  y+1 );

            if (sumOfWhites >= smootThreshold){
                bits[bitsInx] = 1; // set white
                imgPixels.data[bitsInx * 4    ] = 255;
                imgPixels.data[bitsInx * 4 + 1] = 0;
                imgPixels.data[bitsInx * 4 + 2] = 0;
            }
        }

        function isWhite(x,y) {
            return bits[getIndexFromPos(x, y) / 4] == 1 ? 1:0;
        }


        
        


        // Skeletonization || thinning
        // Need improvement

        var morph = new Morph(imgPixels.width, imgPixels.height, bits)
        morph.iterativeThinning(iterations);

        for (var i = 0; i < imgPixels.data.length; i += 4) {
            var avg = bits[i / 4] == 0 ? 0 : 255;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;

        }
        drowImg(ctx, imgPixels);

        
        
        


        // Splitting connected pics as groups

        

        for (var i = 0; i < imgPixels.height; i++) {
            for (var j = 0; j < imgPixels.width; j++) {
                var index = (i * 4) * imgPixels.width + j * 4;
                if (bits[index/4] == 1){
                    addTomatchList(j,i);

                    imgPixels.data[index] = 255;
                    imgPixels.data[index + 1] = 0;
                    imgPixels.data[index+ 2] = 0; 
                }
                /* if (i % 2 == 0 || j % 2 == 0){
                    imgPixels.data[index] = 255;
                    imgPixels.data[index + 1] = 255;
                    imgPixels.data[index + 2] = 0; 
                } */
            }
        }

        function getIndexFromPos(x,y) {
            return (y * 4) * imgPixels.width + x * 4;
        }
        
        function addTomatchList(x,y) {
            var foundMatch = false;
            for (var i=0;i< matchList.length;i++){
                var item = matchList[i];
                if(item){
                    var temp = JSON.stringify(item)
                    
                    if(
                            //-1, -1     0, -1   1, -1
                            //- 1, 0     *,*     1, 0
                            //- 1, 1     0, 1    1, 1

                            temp.indexOf(JSON.stringify({ x: x-1,   y: y-1 })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x,     y: y-1 })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x+1,   y: y-1 })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x-1,   y: y })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x+1,   y: y })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x-1,   y: y+1 })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x,     y: y+1 })) >=0 ||
                            temp.indexOf(JSON.stringify({ x: x + 1, y: y + 1 }))>= 0 
                    ) {

                        foundMatch = true;
                        item.push({
                            x: x,
                            y: y
                        });
                        return;

                        }
                    
                }
            }
            if (!foundMatch){
                matchList.push([{
                    x: x,
                    y: y
                }])
            }
            
        } 

        drowImg(ctx, imgPixels);


        // Display each groups with diff colors

        for (var i in matchList) {
            var item = matchList[i];
            if (item) {
                for (var j in item) {
                    var pos = item[j];
                    var ind = getIndexFromPos(pos.x, pos.y);
                    imgPixels.data[ind] = colors[i%2][0];
                    imgPixels.data[ind + 1] = colors[i%2][1];
                    imgPixels.data[ind + 2] = colors[i%2][2]; 
                }
            }
        }
        
        console.log('groups count', matchList.length, matchList);
        drowImg(ctx, imgPixels);


        matchList = matchList.filter(function name(a) {
            return a.length < ignoreNoicePixcelsIfLargersize;
        })

        // mergigng nearset groups 


        function findCornersFromPositions(posGroup) {
            var temp = {
                minX: posGroup[0].x,
                minY: posGroup[0].y,
                maxX: posGroup[0].x,
                maxY: posGroup[0].y
            };

            for (var i = 0; i < posGroup.length;i++) {
                var pos = posGroup[i];
                if (!pos) continue;
                if (pos.x > temp.maxX) {
                    temp.maxX = pos.x;
                }
                if (pos.y > temp.maxY) {
                    temp.maxY = pos.y;
                }
                if (pos.x < temp.minX) {
                    temp.minX = pos.x;
                }
                if (pos.y < temp.minY) {
                    temp.minY = pos.y;
                }
            }
            return temp;
        }

        // Genting rect edges
        var rectEdges = matchList.map(function (a, index) {
            var temp = findCornersFromPositions(a);
            return {
                minX: temp.minX - buffer,
                minY: temp.minY - buffer,
                maxX: temp.maxX + buffer,
                maxY: temp.maxY + buffer,
                index
            };
        });


        // Sorting based on cordinates
        // 1 or 2 picels up&down will be there, so order would have been changed
        rectEdges = rectEdges.sort(function (a, b) {
            keyA = a.minX + a.minY;
            keyB = b.minX + b.minY;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        var newSortedMapList = [];
        for (var i = 0; i < rectEdges.length; i++) {
            newSortedMapList[i] = matchList[rectEdges[i].index];
        }
        matchList = newSortedMapList;


        for (var i =0;i< rectEdges.length;i++){
            var rect1 = rectEdges[i];
            if(rect1){
                for (var j = i; j < rectEdges.length; j++) {
                    var rect2 = rectEdges[j];
                    if (i != j && rect2 && rect1 && isIntersectRects(rect1, rect2)){
                        matchList[i] = matchList[i] && matchList[i].concat(matchList[j]);
                        matchList[j] = null;
                    }
                }
            }
        }

        function isIntersectRects(r1, r2) {
            return !(r2.minX > r1.maxX ||
                r2.maxX < r1.minX ||
                r2.minY > r1.maxY ||
                r2.maxY < r1.minY);
        }

        matchList = matchList.filter(function (a) {
            return !!a;
        })

        matchList = matchList.filter(function name(a) {
            return a.length > ignoreNoicePixcelsIflessersize;
        })

        //wipeout

        function wipeImgPix() {
            for(var i in bits){
                imgPixels.data[i*4] = 0;
                imgPixels.data[i*4+1] = 0;
                imgPixels.data[i*4+2] = 0;
            };
        }

        function colorPosArry(item,colorArr) {
            if (item) {
                for (var j in item) {
                    var pos = item[j];
                    if (pos) {
                        var ind = getIndexFromPos(pos.x, pos.y);
                        imgPixels.data[ind] = colorArr[0];
                        imgPixels.data[ind + 1] = colorArr[1];
                        imgPixels.data[ind + 2] = colorArr[2];
                    }
                }
            }
            drowImg(ctx, imgPixels);
        }

        for (var i=0;i<matchList.length;i++) {
            var item = matchList[i];
            colorPosArry(item, [colors[i % 2][0], colors[i % 2][1], colors[i % 2][2]])
        }

        function removePositionsBeforeCarecterCoords(groups) {
            return groups.map(function (item) {
                var rectCordinets = findCornersFromPositions(item);
                return item.map(function (pos) {
                    return pos&& {
                        x : pos.x - rectCordinets.minX,
                        y : pos.y - rectCordinets.minY
                    }
                });
            })
        }

        var matchListWithStartsFromZeroCordinates = removePositionsBeforeCarecterCoords(matchList);

        var op = matchListWithStartsFromZeroCordinates.map(function (a) {
            return findMatchFromSample(a);
        })

        op = op.filter(function name(a) {
            return (a.MaxScore > minEligibleScore);
        })

        console.log(op);

        var opNumbers = op.map(a => a.MaxScoreItem);
        console.log(opNumbers.join());
        alert(opNumbers.join());

        console.log('length after mergging close groups', matchList.length, matchList);
        drowImg(ctx, imgPixels);

    }

    function findMatchFromSample(item) {
        
        var scoreAr =[];
        
        var op = [];
        var MaxScore = 0;
        var MaxScoreItem = 'NA';
        for(var i =0; i< numericSample.length; i++){
            
            var sample = numericSample[i];
            comp1 = compPosGroup1and2(sample, item);
            comp2 = compPosGroup1and2(item, sample)
            var matchPercentageAvg = (comp1.match + comp2.match) / (comp1.len + comp2.len);
            
            if (MaxScore < matchPercentageAvg){
                MaxScore = matchPercentageAvg;
                MaxScoreItem = i;
            }
            scoreAr[i] = { 
                matchPercentageAvg, 
                sampLength:numericSample[i].length,
                itemLength:item.length
            };
        }
        return { MaxScoreItem, MaxScore, scoreAr};
    }
    
    function compPosGroup1and2(pos1,pos2) {
        var sampString = JSON.stringify(pos1);
        var score = 0;
        for (var j = 0; j < pos2.length; j++) {
            var pos = JSON.stringify(pos2[j]);
            var isMatchFound = sampString.indexOf(pos) != -1;
            if (isMatchFound) {
                score++;
            }
        }
        return {
                match: score,
                len: pos2.length
        };
    }

    function compareWithNumbers(pos) {
        
    }


    function drowImg(ctx, imgPixels) {
        //alert('OK')
        ctx.putImageData(imgPixels, startCoodrinateToscan[0], startCoodrinateToscan[1], 0, 0, imgPixels.width, imgPixels.height);
    }


//})();
