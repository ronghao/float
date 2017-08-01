Magnetic = new(function() {
    function createMagnet(currentPosition) {
        var magnet = new Magnet;
        magnet.position.x = currentPosition.x;
        magnet.position.y = currentPosition.y;

        n0 = currentPosition.x;
        o0 = currentPosition.y;
        currentPosition = magnet.position;
        var magnetbeauty = new Image();
        magnetbeauty.src = "img/iphone4.png";
        magnet.pic = magnetbeauty;
        for (b = 0; b < datas1.length; b++) {
            var particle = new Particle;
            particle.position.x = currentPosition.x;
            particle.position.y = currentPosition.y;
            particle.shift.x = currentPosition.x;
            particle.shift.y = currentPosition.y;
            particle.color = theme.particleFill;
            particle.picUrl = datas1[b].picurl;
            particle.videourl = datas1[b].videourl;
            particle.picSelectedUrl = datas1[b].picurl;
            var beauty = new Image();
            beauty.src = particle.picUrl;
            particle.pic = beauty;

            if (datas1[b].childrens != null && datas1[b].childrens.length != 0) {
                particle.showtext = "";
                for (var i = datas1[b].childrens.length - 1; i >= 0; i--) {
                    var childparticle = new Particle;
                    var beauty = new Image();
                    beauty.src = datas1[b].childrens[i].picurl;
                    childparticle.pic = beauty;
                    childparticle.showtext = datas1[b].childrens[i].line1text;
                    childparticle.showtext2 = datas1[b].childrens[i].line2text;
                    childparticle.showtext3 = datas1[b].childrens[i].line3text;
                    childparticle.showtoptext = datas1[b].childrens[i].toplinetext;
                    var textImage = new Image();
                    textImage.src = datas1[b].childrens[i].texturl;
                    childparticle.textpic = textImage;
                    childparticle.texturl = datas1[b].childrens[i].texturl;
                    childparticle.videourl = datas1[b].childrens[i].videourl;
                    particle.childrens.push(childparticle);
                };
            }

            particle.showtext = datas1[b].line1text;
            particle.showtext2 = datas1[b].line2text;

            magnet.particles.push(particle);
            totalparticles.push(particle);
        }

        magnets.push(magnet);
    }



    function checkAllMagnet() {
        isMouseDown = true;
        if (isShowVideo) {
            return;
        };

        for (var j = magnets.length - 1; j >= 0; j--) {
            var magnet = magnets[j];
            for (var a = 0, b = magnet.particles.length; a < b; a++) {
                particle =
                    magnet.particles[a];
                if (checkIsSelected(particle.position, {
                        x: n,
                        y: o
                    }) < particle.size) {
                    currentParticle = particle;
                    currentParticle.dragging = true;
                    futureIndex = a;
                    return
                }
                var childrens = particle.childrens;
                for (var i = childrens.length - 1; i >= 0; i--) {
                    particle = childrens[i];
                    if (checkIsSelected(particle.position, {
                            x: n,
                            y: o
                        }) < particle.size) {
                        currentParticle = particle;
                        currentParticle.dragging = true;
                        futureIndex = a;
                        return
                    }
                };
            }
            if (checkIsSelected(magnet.position, {
                    x: n,
                    y: o
                }) < magnet.orbit * 0.5) {
                magnet.dragging = true;
            }
        };
    }

    function reset() {
        var magnetNum = magnets.length;
        for (var i = 0; i < magnetNum; i++) {
            var magnet = magnets[i];
            magnet.dragging = false;
            magnet.pointIndex = -1;

            var level2Num = magnet.particles.length;
            for (var z = 0; z < level2Num; z++) {
                var particle = magnet.particles[z];
                particle.dragging = false;
                particle.pointIndex = -1;
            }
        }
    }

    function mousemove(currentPosition) {
        touchPoints = [];
        touchPoints[0] = {
            x: currentPosition.clientX - (window.innerWidth - canvasWidth) * 0.5,
            y: currentPosition.clientY - (window.innerHeight - canvasHeight) * 0.5
        };
    }

    function mousedown(currentPosition) {
        var now = new Date();
        mouseDownTime = now.getTime();
        currentPosition.preventDefault();

        reset();

        var x = currentPosition.clientX - (window.innerWidth - canvasWidth) * 0.5;
        var y = currentPosition.clientY - (window.innerHeight - canvasHeight) * 0.5;

        var magnetNum = magnets.length;

        for (var j = 0; j < magnetNum; j++) {
            var magnet = magnets[j];
            if (checkIsSelected(magnet.position, {
                    x: x,
                    y: y
                }) < 40) {
                magnet.dragging = true;
                magnet.pointIndex = 0;
            }

            var level2Num = magnet.particles.length;
            for (var z = 0; z < level2Num; z++) {
                var particle = magnet.particles[z];
                if (checkIsSelected(particle.position, {
                        x: x,
                        y: y
                    }) < 20) {
                    particle.dragging = true;
                    particle.pointIndex = 0;


                    magnet.dragging = false;
                    magnet.pointIndex = -1;
                }
            };
        };
    }

    function mouseup(currentPosition) {
        // mousedown(currentPosition);
        // checkAllPoint(a);
        mouseupEvent();
        reset();
    }

    function mouseupEvent() {
        var now = new Date();
        for (var i = magnets.length - 1; i >= 0; i--) {
            var magnet = magnets[i];
            if (magnet.dragging) {
                if (now.getTime() - mouseDownTime < 200) {
                    // alert("中心点击");
                } else {
                    // alert("中心平移");
                }
            }
            magnet.dragging = false;

            var particlesNum = magnet.particles.length;
            for (var j = 0; j < particlesNum; j++) {
                var particle = magnet.particles[j];
                if (particle.dragging) {
                    if (now.getTime() - mouseDownTime < 200) {
                        if (particle.childrens.length != 0) {
                            particle.isShowChildren = !particle.isShowChildren;
                        } else if (particle.videourl != null && particle.videourl != "") {
                            // lastParticle
                            if (particle.isShowVideo) {
                                particle.isShowVideo = false;
                                particle.videoElement.pause();
                                particle.dragging = false;
                                particle.pointIndex = -1;
                            } else {
                                particle.isShowVideo = true;
                                var mp4 = document.createElement("video");
                                mp4.src = particle.videourl;
                                mp4.style = "display:;";
                                mp4.addEventListener("ended", function() {
                                    particle.isShowVideo = false;
                                    particle.dragging = false;
                                    particle.pointIndex = -1;
                                });
                                particle.videoElement = mp4;
                                particle.videoElement.play();
                            }

                        } else if (particle.picUrl != '2.png') {
                            particle.isShowChildren = !particle.isShowChildren;
                        }
                    } else {
                        // alert("离子平移");
                    }
                };
            };
        }

        isMouseDown = false;
    }


    function checkAllPoint(a) {
        var magnetNum = magnets.length;

        for (var i = 0; i < magnetNum; i++) {
            var magnet = magnets[i];
            magnet.dragging = false;
            magnet.pointIndex = -1;

            var level2Num = magnet.particles.length;
            for (var z = 0; z < level2Num; z++) {
                var particle = magnet.particles[z];
                particle.dragging = false;
                particle.pointIndex = -1;
            }
        }
        var size = a.touches.length;
        for (var i = 0; i < size; i++) {
            var x = a.touches[i].pageX - (window.innerWidth - canvasWidth) * 0.5;
            var y = a.touches[i].pageY - (window.innerHeight - canvasHeight) * 0.5;

            var magnetNum = magnets.length;

            for (var j = 0; j < magnetNum; j++) {
                var magnet = magnets[j];
                if (checkIsSelected(magnet.position, {
                        x: x,
                        y: y
                    }) < 40) {
                    magnet.dragging = true;
                    magnet.pointIndex = i;
                }

                var level2Num = magnet.particles.length;
                for (var z = 0; z < level2Num; z++) {
                    var particle = magnet.particles[z];
                    if (checkIsSelected(particle.position, {
                            x: x,
                            y: y
                        }) < 20) {
                        particle.dragging = true;
                        particle.pointIndex = i;


                        magnet.dragging = false;
                        magnet.pointIndex = -1;
                    }
                };
            };
        };
    }

    function touchstart(a) {
        touchmove(a);
        checkAllPoint(a)
    }

    function touchmove(a) {
        touchPoints = [];
        for (var i = 0; i < a.touches.length; i++) {
            touchPoints[i] = {
                x: a.touches[i].pageX - (window.innerWidth - canvasWidth) * 0.5,
                y: a.touches[i].pageY -
                    (window.innerHeight - canvasHeight) * 0.5
            };
        };
    }

    function touchend(a) {
        touchmove(a);
        checkAllPoint(a);
        mouseupEvent();
    }

    function resize() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var a = (window.innerWidth - canvasWidth) * 0.5,
            b = (window.innerHeight - canvasHeight) * 0.5;
        canvas.style.position = "absolute";
        canvas.style.left = a +
            "px";
        canvas.style.top = b + "px";
    }

    function jisuan() {
        var totalparticlesNum = totalparticles.length;
        for (var j = 0; j < totalparticlesNum; j++) {
            for (var i = j + 1; i < totalparticlesNum; i++) {
                while (checkIsSelected(totalparticles[i].position, totalparticles[j].position) < 50) {
                    totalparticles[i].position.x = 4.0 / 3 * totalparticles[i].position.x - totalparticles[j].position.x / 3;
                    totalparticles[i].position.y = 4.0 / 3 * totalparticles[i].position.y - totalparticles[j].position.y / 3;
                    totalparticles[j].position.x = 4.0 / 3 * totalparticles[j].position.x - totalparticles[i].position.x / 3;
                    totalparticles[j].position.y = 4.0 / 3 * totalparticles[j].position.y - totalparticles[i].position.y / 3;
                }
            };
        }
    }

    function drawTotalTouch() {

    }

    function touchEvent(touch) {
        var touchNum = touch.touches.length;
        for (var i = 0; i < touchNum; i++) {};
    }

    function drawMp4() {
        var magnetNum = magnets.length;

        for (var i = 0; i < magnetNum; i++) {
            var magnet = magnets[i];
            var level2Num = magnet.particles.length;
            for (var z = 0; z < level2Num; z++) {
                var particle = magnet.particles[z];
                if (particle.isShowVideo) {
                    c = canvas2D.createRadialGradient(particle.position.x, particle.position.y, 0, particle.position.x, particle.position.y, 200);
                    c.addColorStop(0, "rgba(104,138,47,0.3)");
                    c.addColorStop(1, "rgba(104,138,47,0.0)");
                    canvas2D.beginPath();
                    canvas2D.fillStyle = c;
                    canvas2D.arc(particle.position.x, particle.position.y, particle.size * 10, 0, Math.PI * 2, true);
                    canvas2D.fill();
                    canvas2D.closePath();

                    canvas2D.drawImage(particle.videoElement, particle.position.x - 80, particle.position.y - 60, 160, 120);

                    ////////
                    // canvas2D.beginPath();
                    // canvas2D.save();
                    // canvas2D.arc(particle.position.x, particle.position.y, 100, 0, Math.PI * 2);
                    // canvas2D.clip();
                    // canvas2D.beginPath();
                    // canvas2D.drawImage(videoElement, particle.position.x - 110, particle.position.y - 80, 220, 160);
                    // canvas2D.fill();
                    // canvas2D.arc(particle.position.x, particle.position.y, 30, 0, Math.PI * 2);
                    // canvas2D.clip();
                    // canvas2D.restore();

                };
            }
        }
    }

    function drawLevel3(magnet, particle) {

        var size = particle.childrens.length;

        for (var i = 0; i < size; i++) {
            childparticle = particle.childrens[i];
            if (particle.isShowChildren) {

                var x = particle.position.x - magnet.position.x;
                var y = particle.position.y - magnet.position.y;
                var j = 0;
                if (x > 0) {
                    j = Math.atan(y / x) + 4;
                } else {
                    j = Math.atan(y / x) + 1;
                }

                childparticle.childdistance = size > 4 ? 120 : 80;
                childparticle.childstartdistance += (childparticle.childdistance - childparticle.childstartdistance) * 0.2;

                childparticle.position.x = particle.position.x + Math.cos(j + i * (6 / (size + 1))) * childparticle.childstartdistance;
                childparticle.position.y = particle.position.y + Math.sin(j + i * (6 / (size + 1))) * childparticle.childstartdistance;

                canvas2D.beginPath();
                canvas2D.lineWidth = "1";
                canvas2D.strokeStyle = "rgba(125,121,119,0.8)";
                canvas2D.moveTo(particle.position.x, particle.position.y);
                canvas2D.lineTo(childparticle.position.x, childparticle.position.y);
                canvas2D.stroke();
                canvas2D.drawImage(childparticle.pic, childparticle.position.x - 30, childparticle.position.y - 30, 60, 60);
                if (childparticle.showtext != "") {
                    var aaa = 0;
                    if (childparticle.position.x < particle.position.x) {
                        aaa = -120;
                    } else {
                        aaa = 40;
                    }

                    canvas2D.lineWidth = "1";
                    canvas2D.strokeStyle = "rgba(89,120,45,0.7)";
                    canvas2D.beginPath();
                    canvas2D.moveTo(childparticle.position.x + aaa, childparticle.position.y - 10);
                    canvas2D.lineTo(childparticle.position.x + aaa + 80, childparticle.position.y - 10);
                    canvas2D.stroke();
                    canvas2D.font = "10px Arial lighter";
                    canvas2D.fillText(childparticle.showtoptext, childparticle.position.x + aaa, childparticle.position.y - 14);
                    canvas2D.fillText(childparticle.showtext, childparticle.position.x + aaa, childparticle.position.y + 4);
                    if (childparticle.showtext2 != null && childparticle.showtext2 != "") {
                        canvas2D.fillText(childparticle.showtext2, childparticle.position.x + aaa, childparticle.position.y + 20);
                        if (childparticle.showtext3 != null && childparticle.showtext3 != "") {
                            canvas2D.fillText(childparticle.showtext3, childparticle.position.x + aaa, childparticle.position.y + 40);
                        }
                    }
                };
            } else {
                childparticle.childstartdistance = 0;
            }
        }

        if (!particle.isShowChildren && particle.showtext != "") {
            canvas2D.lineWidth = "1";
            canvas2D.strokeStyle = "rgba(89,120,45,0.7)";
            canvas2D.beginPath();
            canvas2D.moveTo(particle.position.x + 30, particle.position.y - 15);
            canvas2D.lineTo(particle.position.x + 200, particle.position.y - 15);
            canvas2D.stroke();
            canvas2D.font = "10px Arial lighter";
            canvas2D.fillText(particle.showtext, particle.position.x + 30, particle.position.y + 3);
            if (particle.showtext2 != "") {
                canvas2D.fillText(particle.showtext2, particle.position.x + 30, particle.position.y + 20);
            }
        };

    }


    function drawLevel2(magnet) {
        var particlesNum = magnet.particles.length;
        for (var i = 0; i < particlesNum; i++) {
            var particle = magnet.particles[i];

            var lastX = particle.shift.x;
            var lastY = particle.shift.y;

            if (particle.dragging && touchPoints.length > particle.pointIndex && particle.pointIndex != -1) {
                var n = touchPoints[particle.pointIndex].x;
                var o = touchPoints[particle.pointIndex].y;
                particle.position.x += (n - particle.position.x) * 0.3;
                particle.position.y += (o - particle.position.y) * 0.3;
                //计算距离
                particle.distance = Math.sqrt(Math.pow((n - magnet.position.x), 2) + Math.pow(o - magnet.position.y, 2));
                particle.startdistance = particle.distance;

                //计算角度
                var a = (o - magnet.position.y) / particle.distance;
                var b = (n - magnet.position.x) / particle.distance;
                if (n - magnet.position.x > 0) {
                    particle.angle = Math.asin(a) - i;
                } else if (o - magnet.position.y < 0) {
                    particle.angle = -Math.acos(b) - i;
                } else {
                    particle.angle = Math.acos(b) - i;
                }

            } else {
                particle.shift.x += (magnet.position.x - particle.shift.x) * particle.speed;
                particle.shift.y += (magnet.position.y - particle.shift.y) * particle.speed;
                particle.startdistance += (particle.distance - particle.startdistance) * 0.1;
                particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * particle.startdistance;
                particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * particle.startdistance;
            }

            particle.position.x = Math.max(Math.min(particle.position.x,
                canvasWidth - particle.size / 2), particle.size / 2);
            particle.position.y = Math.max(Math.min(particle.position.y, canvasHeight - particle.size / 2), particle.size / 2);

            canvas2D.beginPath();
            canvas2D.lineWidth = "2";
            canvas2D.strokeStyle = "rgba(169,175,176,1)";
            canvas2D.fillStyle = "rgba(169,175,176,1)";
            canvas2D.moveTo(magnet.position.x, magnet.position.y);
            var xxx = particle.shift.x - lastX;
            var yyy = particle.shift.y - lastY;
            canvas2D.quadraticCurveTo(particle.position.x + xxx * 2, particle.position.y + yyy * 2, particle.position.x, particle.position.y);
            canvas2D.stroke();
            // canvas2D.closePath();

            drawLevel3(magnet, particle);

            if (particle.isShowChildren) {
                if (particle.picUrl != '2.png') {
                    canvas2D.drawImage(particle.pic, particle.position.x - 30, particle.position.y - 30, 60, 60);
                } else {
                    canvas2D.drawImage(particle.pic, particle.position.x - 20, particle.position.y - 20, 40, 40);
                }
            } else {
                var beauty = new Image();
                beauty.src = '2.png';
                canvas2D.drawImage(beauty, particle.position.x - 20, particle.position.y - 20, 40, 40);
            }
        }
    }

    function draw1() {
        canvas2D.clearRect(0, 0, canvas.width, canvas.height);

        var size = magnets.length;
        for (var i = 0; i < size; i++) {
            var magnet = magnets[i];
            if (magnet.dragging && magnet.pointIndex != -1 && magnet.pointIndex < touchPoints.length) {
                magnet.position.x += (touchPoints[magnet.pointIndex].x - magnet.position.x) * 0.3;
                magnet.position.y += (touchPoints[magnet.pointIndex].y - magnet.position.y) * 0.3;
            }

            magnet.position.x = Math.max(Math.min(magnet.position.x,
                canvasWidth - magnet.size / 2), magnet.size / 2);
            magnet.position.y = Math.max(Math.min(magnet.position.y, canvasHeight - magnet.size / 2), magnet.size / 2);

            drawLevel2(magnet);

            canvas2D.fillStyle = "#040005";
            canvas2D.beginPath();
            canvas2D.arc(magnet.position.x, magnet.position.y, magnet.size / 2 + 10, 0, Math.PI * 2, true);
            canvas2D.closePath();
            canvas2D.fill();

            c = canvas2D.createRadialGradient(magnet.position.x, magnet.position.y, 0, magnet.position.x, magnet.position.y, 200);
            c.addColorStop(0, "rgba(104,138,47,0.3)");
            c.addColorStop(1, "rgba(104,138,47,0.0)");
            canvas2D.beginPath();
            canvas2D.fillStyle = c;
            canvas2D.arc(magnet.position.x, magnet.position.y, magnet.size * 10, 0, Math.PI * 2, true);
            canvas2D.fill();
            canvas2D.closePath();

            canvas2D.drawImage(magnet.pic, magnet.position.x - magnet.size / 2, magnet.position.y - magnet.size / 2, magnet.size, magnet.size);

            // canvas2D.save();
            // canvas2D.arc(magnet.position.x, magnet.position.y, 100, 0, Math.PI * 2);
            // canvas2D.clip();
            // canvas2D.restore();
        }

        drawTotalTouch();

        drawMp4();
    };

    function checkIsSelected(currentPosition, position) {
        var c = position.x - currentPosition.x,
            i = position.y - currentPosition.y;
        return Math.sqrt(c * c + i * i)
    }

    function getUrlRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var key = str.substring(0, str.indexOf("="));
            var value = str.substr(str.indexOf("=") + 1);
            theRequest[key] = decodeURI(value);
        }
        return theRequest;
    }

    var isPhone = navigator.userAgent.toLowerCase().indexOf("android") != -1 || navigator.userAgent.toLowerCase().indexOf("iphone") != -1 || navigator.userAgent.toLowerCase().indexOf("ipad") != -1,
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,
        TotalMagnetNum = 2,
        isShowVideo = false,
        futureIndex = -1,
        canvas, canvas2D, totalparticles = [],
        magnets = [],
        currentParticle = null,
        lastParticle = null,
        magnet = null,
        n = window.innerWidth - canvasWidth,
        o = window.innerHeight - canvasHeight,
        n0 = window.innerWidth - canvasWidth,
        o0 = window.innerHeight - canvasHeight,
        isMouseDown = false,
        mouseDownTime = 0;
    var touchPoints = [];
    x = 0,
        theme = {
            glowA: "rgba(233,143,154,1.0)",
            glowB: "rgba(0,143,154,0.0)",
            particleFill: "#ffffff",
            fadeFill: "rgba(22,22,22,.6)",
            useFade: false
        };
    var childdatas1 = [{
        picurl: "2.png",
        texturl: "2.png",
        line1text: "与ipad相关的交互设计师",
        line2text: "The intertactive designer of ipad",
        childrens: [{
            picurl: "img/1.png",
            texturl: "img/1-1.png",
            line1text: "Aqua",
            line2text: "Mac Osx 设计师",
            toplinetext: "JOY IVE"
        }, {
            picurl: "img/2.png",
            texturl: "img/2-1.png",
            line1text: "MAC OSX 系统",
            line2text: "AQUA界面",
            line3text: "IOS操作系统",
            toplinetext: "福斯特尔"
        }, {
            picurl: "img/3.png",
            texturl: "img/3-1.png",
            line1text: "美国苹果公司联合创始人",
            toplinetext: "史蒂夫。乔布斯"
        }, {
            picurl: "img/4.png",
            texturl: "img/4-1.png",
            line1text: "Aqua",
            line2text: "Mac Osx 设计师",
            toplinetext: "柯普拉.瑞兹拉 (Cordell Ratzlaff)"
        }]
    }, {
        picurl: "2.png",
        texturl: "2.png",
        line1text: "ipad的技术",
        line2text: "多点触摸技术",
        childrens: [{
            picurl: "img/5.png",
            texturl: "img/5-1.png",
            line1text: "显示命令",
            line2text: "平移",
            line3text: "缩小",
            toplinetext: "多点触摸手势设计"
        }, {
            picurl: "img/6.png",
            texturl: "img/6-1.png",
            line1text: "缩小",
            line2text: "扩大",
            line3text: "调整",
            toplinetext: "多点触摸手势设计"
        }, {
            picurl: "img/7.png",
            texturl: "img/7-1.png",
            line1text: "缩小",
            line2text: "扩大",
            line3text: "调整",
            toplinetext: "多点触摸手势设计"
        }, {
            picurl: "img/8.png",
            texturl: "img/8-1.png",
            line1text: "打开",
            line2text: "选择",
            line3text: "打开模式",
            toplinetext: "多点触摸手势设计"
        }]
    }, {
        picurl: "2.png",
        texturl: "2.png",
        line1text: "ipad的设计发展史",
        line2text: "The design history of ipad",
        childrens: [{
            picurl: "img/9.png",
            texturl: "img/9-1.png",
            line1text: "2001年",
            toplinetext: "设计历史"
        }, {
            picurl: "img/10.png",
            texturl: "img/10-1.png",
            line1text: "2002年",
            toplinetext: "设计历史"
        }, {
            picurl: "img/11.png",
            texturl: "img/11-1.png",
            line1text: "2003年",
            toplinetext: "设计历史"
        }, {
            picurl: "img/12.png",
            texturl: "img/12-1.png",
            line1text: "2005-2010年",
            toplinetext: "设计历史"
        }, {
            picurl: "img/13.png",
            texturl: "img/13-1.png",
            line1text: "2011年",
            toplinetext: "设计历史"
        }, {
            picurl: "img/14.png",
            texturl: "img/14-1.png",
            line1text: "2011年",
            toplinetext: "设计历史"
        }]
    }, {
        picurl: "2.png",
        texturl: "img/15-1.png",
        line1text: "银河系漫游指南 1968",
        line2text: "Hitchhiker guide to the galaxy",
        videourl: "mp4/1.mp4"
    }, {
        picurl: "2.png",
        texturl: "img/16-1.png",
        line1text: "星际穿越  1995",
        line2text: "star trek",
        videourl: "mp4/3.mp4"
    }, {
        picurl: "2.png",
        texturl: "img/17-1.png",
        line1text: "超人总动员 2014",
        line2text: "The Incredibles",
        videourl: "mp4/2.mp4"
    }, {
        picurl: "2.png",
        texturl: "img/18-1.png",
        line1text: "星际漫游 1995",
        line2text: "star trek",
        videourl: "mp4/3.mp4"
    }, {
        picurl: "img/19.png",
        texturl: "img/19.png",
        line1text: "",
        line2text: "",
        videourl: ""
    }];

    var datas = [childdatas1];
    var dataindex = 0;
    var datas1 = datas[dataindex];

    if (getUrlRequest()['id'] != null) {
        dataindex = parseInt(getUrlRequest()['id']);
    } else {
        dataindex = 0;
    }
    datas1 = datas[dataindex];

    this.init = function() {
        canvas = document.getElementById("world");
        if (canvas && canvas.getContext) {
            canvas2D = canvas.getContext("2d");
            if (isPhone)
                canvas.style.border = "none";
            document.addEventListener("mousemove", mousemove, false);
            canvas.addEventListener("mousedown", mousedown, false);
            document.addEventListener("mouseup", mouseup, false);
            window.addEventListener("resize", resize, false);
            canvas.addEventListener("touchstart", touchstart, false);
            document.addEventListener("touchmove", touchmove, false);
            document.addEventListener("touchend", touchend, false);
            createMagnet({
                x: (canvasWidth - 300) * 0.5 + Math.random() * 300,
                y: (canvasHeight - 300) * 0.5 + Math.random() * 300
            });

            createMagnet({
                x: 300,
                y: 300
            });
            resize();
            setInterval(draw1, 1E3 / 30)
        }
    }
});

//粒子
function Particle() {
    this.size = 3 + Math.random() * 3.5;
    this.position = {
        x: 0,
        y: 0
    };
    this.shift = {
        x: 0,
        y: 0
    }; //偏移
    this.finalposition = {
        x: 0,
        y: 0
    };

    // this.distance = 100;
    this.angle = 0; //角度
    this.speed1 = 0.001; //转动速度
    this.speed = 0.2; //
    this.force = Math.max(2.5 - Math.random() * 2, 1); //排斥力
    this.color = "#ffffff"; //颜色
    this.orbit = 1; //轨道
    this.magnet = null //父类磁体；
    this.picSelectedUrl = null;
    this.picUrl = null;
    this.pic = null;
    this.videourl = "";
    this.dragging = false;
    this.distance = 100 * this.force; //平移后的距离
    this.startdistance = 0;
    this.childdistance = 0;
    this.childstartdistance = 0;
    this.showtext = '你好';
    this.showtext2 = '你好';
    this.showtext3 = '你好';
    this.showtoptext = '你好';
    this.texturl = '';
    this.textpic = null;
    this.isShowChildren = false;
    this.childrens = []; //子类粒子；
    this.size = 50;
    this.isShowVideo = false;
    this.pointIndex = -1;
    this.videoElement = null;
}

//磁铁
function Magnet() {
    this.orbit = 160; //轨道
    this.position = {
        x: 0,
        y: 0
    }; //位置
    this.dragging = false; //拖动
    this.connections = 0;
    this.weight = 100;
    this.size = 120; ////
    this.particles = [];
    this.pic = null;
    this.pointIndex = -1;
}
Magnetic.init();

document.onkeydown = function(event) {
    if (event.keyCode == 96 || event.keyCode == 96) {
        location = 'index.html?id=0';
        alert('场景1');
    } else if (event.keyCode == 27 || event.keyCode == 27) {
        location = 'index.html';
        alert('退出场景');
    }
}