function Glitchousel(options) {
    this.params = {
        speed: 600,
        timeout: 5000,
    }
    this.timer = null;
    this.container = options.container
};

Glitchousel.prototype.start = function () {
    var that = this;
    console.log('starting');
    play();
    function play() {
        that.next();
        that.timer = setTimeout(play, that.params.timeout + that.params.speed);
    }
};

Glitchousel.prototype.pause = function () {
    var that = this;
    console.log('pausing');
    clearTimeout(that.timer);
    that.ctx.putImageData(this.imgDatas[this.currentIndex], 0, 0);
};

Glitchousel.prototype.bindEvents = function () {
    var that = this;
    this.container.on('hover', that.pause, that.play);

    //var pausebtn = document.getElementById('pausebtn');
    //var resumebtn = document.getElementById('resumebtn');
    // var transbtn = document.getElementById('transbtn');
    // pausebtn.addEventListener("click", function(event){
    //     that.pause();
    // })
    // resumebtn.addEventListener("click", function(event){
    //     that.start();
    // })
    transbtn.addEventListener("click", function(event){
        that.start();
        setTimeout(null, 100);
        that.pause();
    })
}


Glitchousel.prototype.init = function () {
    var that = this;
    var $imgs = this.container.find('img');
    this.imgDatas = [];
    this.currentIndex = 0;
    var canvas = document.createElement('canvas');
    var ctx;
    this.container.append($(canvas));
    var tmpImg = new Image();
    var imgsLoadedCount = 0;
    for (var i = 0; i < $imgs.length; i++) {
        //$imgs[i].onload = function(){
        imgsLoadedCount++;
        if (imgsLoadedCount == $imgs.length) {
            processImgs();
            that.bindEvents();
            console.log("that:", that);
            //that.start(); //comment / uncomment this line to start the animation on page load
        }
        //}
    }

    function processImgs() {
        for (var i = 0; i < $imgs.length; i++) {
            var width = $imgs[i].width;
            var height = $imgs[i].height;
            $imgs[i].style.display = 'none';
            canvas.width = width;
            canvas.height = height;
            tmpImg.src = $imgs[i].src;
            ctx = canvas.getContext('2d');
            ctx.drawImage(tmpImg, 0, 0);
            var tmpImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            that.imgDatas.push(tmpImgData);
        }
        ctx.putImageData(that.imgDatas[0], 0, 0);
        // draw the img on the canvas 
        that.canvas = canvas;
        that.ctx = ctx;
    }
    return this;
};

Glitchousel.prototype.goTo = function (index) {
    var currentImgData = this.imgDatas[index];
    //this.originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.transition(this.imgDatas[this.currentIndex], this.imgDatas[index]);
    this.currentIndex = index;
};

Glitchousel.prototype.next = function () {
    var nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.imgDatas.length) {
        nextIndex = 0;
    }
    this.goTo(nextIndex);
};

Glitchousel.prototype.transition = function (imgSrc, imgTrg) {
    var that = this;
    var finishedTransition = false;
    var direction = 1;
    var timer;
    var currParams = {
        amount: 2,
        seed: 70,
        iterations: 5,
        quality: 100
    };
    var currentImgData = imgSrc;
    var increment = (100 - currParams.amount) / (that.params.speed / 200);
    glitchTo();
    function glitchTo() {
        var from, to;
        if (direction > 0) {
            currParams.amount += 10 + Math.random() * increment + 2;
            currParams.seed += 10 + Math.random() * increment + 2;
            currParams.iterations *= Math.random() + 1;
            currParams.quality -= 1.5;
        }
        else {
            currParams.amount -= 10 + Math.random() * increment + 2;
            currParams.seed -= 10 + Math.random() * increment + 2;
            currParams.iterations /= Math.random() + 1;
            currParams.quality += 10 + Math.random() * increment + 2;
        }

        for (key in currParams) {
            if (currParams[key] >= 100) {
                currParams[key] = 100;
            }
            else if (currParams[key] <= 0) {
                currParams[key] = 0;
            }
            else {
                currParams[key] = Math.floor(currParams[key]);
            }
        }
        timer = setTimeout(glitchTo, Math.random() * 20 + 200);
        if (currParams.amount >= 100) {
            direction = -1;
            currParams.amount = 100;
            currentImgData = imgTrg;
        }
        if (currParams.amount <= 0) {
            clearTimeout(timer);
            // Why is the setTimeout needed to rerender the latest image?
            setTimeout(function () { that.ctx.putImageData(imgTrg, 0, 0); }, 50);
        }
        glitch(currentImgData, currParams, function (img_data) {
            var rdm = Math.random() > 0.25;
            var grayscaleImg = rdm ? img_data :
                grayscale(img_data);
            that.ctx.putImageData(grayscaleImg, 0, 0);
        });
    };
};

function grayscale(pixels, args) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
}

/*       Init the whole lot      */
window.glitchousels = [];
$(document).on('ready page:load', function () {
    var containers = $('.glitchousel');
    //var glitchousels = [];
    containers.each(function () {
        window.glitchousels.push(new Glitchousel({
            container: $(this),
        }).init());
    });
});

// glitch-canvas from: https://github.com/snorpey/glitch-canvas Thanks dude!
!function (a, b) { "function" == typeof define && define.amd ? define(b) : "object" == typeof exports ? module.exports = b() : a.glitch = b() }(this, function () { function p(d, e, f) { if (y(d) && z(e, "parameters", "object") && z(f, "callback", "function")) { for (h = x(e), q(a, d), q(b, d), i = s(d, h.quality), j = u(i), k = t(j), n = 0, o = h.iterations; o > n; n++)r(j, k, h.seed, h.amount, n, h.iterations); l = new Image, l.onload = function () { c.drawImage(l, 0, 0), m = c.getImageData(0, 0, d.width, d.height), f(m) }, l.src = v(j) } } function q(a, b) { a.width !== b.width && (a.width = b.width), a.height !== b.height && (a.height = b.height) } function r(a, b, c, d, e, f) { var g = a.length - b - 4, h = parseInt(g / f * e, 10), i = parseInt(g / f * (e + 1), 10), j = i - h, k = parseInt(h + j * c, 10); k > g && (k = g); var l = Math.floor(b + k); a[l] = Math.floor(256 * d) } function s(a, c) { var e = "number" == typeof c && 1 > c && c > 0 ? c : .1; d.putImageData(a, 0, 0); var f = b.toDataURL("image/jpeg", e); switch (f.length % 4) { case 3: f += "="; break; case 2: f += "=="; break; case 1: f += "===" }return f } function t(a) { var b = 417; for (n = 0, o = a.length; o > n; n++)if (255 === a[n] && 218 === a[n + 1]) { b = n + 2; break } return b } function u(a) { var c, d, e, b = []; for (n = 23, o = a.length; o > n; n++) { switch (d = g[a.charAt(n)], c = (n - 23) % 4) { case 1: b.push(e << 2 | d >> 4); break; case 2: b.push((15 & e) << 4 | d >> 2); break; case 3: b.push((3 & e) << 6 | d) }e = d } return b } function v(a) { var c, d, e, b = ["data:image/jpeg;base64,"]; for (n = 0, o = a.length; o > n; n++) { switch (d = a[n], c = n % 3) { case 0: b.push(f[d >> 2]); break; case 1: b.push(f[(3 & e) << 4 | d >> 4]); break; case 2: b.push(f[(15 & e) << 2 | d >> 6]), b.push(f[63 & d]) }e = d } return 0 === c ? (b.push(f[(3 & e) << 4]), b.push("==")) : 1 === c && (b.push(f[(15 & e) << 2]), b.push("=")), b.join("") } function x(a) { return { seed: (a.seed || 0) / 100, quality: (a.quality || 0) / 100, amount: (a.amount || 0) / 100, iterations: a.iterations || 0 } } function y(a) { return z(a, "image_data", "object") && z(a.width, "image_data.width", "number") && z(a.height, "image_data.height", "number") && z(a.data, "image_data.data", "object") && z(a.data.length, "image_data.data.length", "number") && A(a.data.length, "image_data.data.length", B, "> 0") ? !0 : !1 } function z(a, b, c) { return typeof a === c ? !0 : (C(a, "typeof " + b, '"' + c + '"', '"' + typeof a + '"'), !1) } function A(a, b, c, d) { return c(a) === !0 ? !0 : (C(a, b, d, "not"), void 0) } function B(a) { return a > 0 } function C(a, b, c, d) { throw new Error("glitch(): Expected " + b + " to be " + c + ", but it was " + d + ".") } var h, i, j, k, l, m, n, o, a = document.createElement("canvas"), b = document.createElement("canvas"), c = a.getContext("2d"), d = b.getContext("2d"), e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = e.split(""), g = {}; return f.forEach(function (a, b) { g[a] = b }), p });