/*
---

script: Croppuccino.js

name: Croppuccino

description: Croppuccino image cropper

license: MIT-style license

authors:
  - huangyq23 <huangyq23 (at) gmail.com>

requires:
  - Mootools
  - Mootools More
  - Slider More

...
*/
var Croppuccino = new Class({
    version: '0.4',
    Implements: [Options, Events],
    options: {
        preview: false,
        minSize: 100/*,
        onStartLoad: $empty,
        onLoad: $empty,
        onError: $empty
        */
    },
    initialize: function(options){
        this.setOptions(options);
        this.container=document.id(this.options.container);
        this.preview=this.options.preview;
        this.options.minSize=Math.max(this.options.minSize.toInt(), 1);
        this.setUpImage();
    },
    setUpContainers: function(){
        this.imageCropper=new Element('div', {'class': 'cp_image_cropper'});
        this.imageArea=new Element('div', {'class': 'cp_image_area'}).inject(this.imageCropper);
            this.cropArea=new Element('div', {'class': 'cp_crop_area'}).inject(this.imageArea);
        this.sliderContainer=new Element('div', {'class': 'cp_slider_container'}).inject(this.imageCropper);
            this.smallerIcon=new Element('div', {'class': 'cp_smaller_icon'}).inject(this.sliderContainer);
            this.sliderLeft=new Element('div', {'class': 'cp_slider_left'}).inject(this.sliderContainer);
            this.slider=new Element('div', {'class': 'cp_slider'}).inject(this.sliderContainer);
                this.knob=new Element('div', {'class': 'cp_knob'}).inject(this.slider);
            this.sliderRight=new Element('div', {'class': 'cp_slider_right'}).inject(this.sliderContainer);
            this.largerIcon=new Element('div', {'class': 'cp_larger_icon'}).inject(this.sliderContainer);
        this.imageCropper.inject(this.container);
    },
    setUpImage: function(){
        this.image=new Element('img', {
            src: this.options.img_src,
            'class': 'cp_target_image',
            styles: {
                'visibility': 'hidden'
            },
            events: {
                'load': this.setUpAll.bind(this),
                'error': this.fireEvent.pass('error', this)
            }
        }).inject(this.container);
        this.fireEvent('startLoad');
    },
    setUpDrag: function(){
        var myDrager = new Drag(this.imageArea, {
            snap: 0,
            style: false,
            preventDefault: true
        });
        myDrager.addEvents({
            'start': this.dragStart.bind(this),
            'drag': this.dragMoving.bind(this),
        });
    },
    setUpSlider: function(){
        this.innerRange = (this.minEdge-this.maxViewport);
        this.outerRange = (this.maxViewport-this.options.minSize);
        var rangeSize = this.innerRange+this.outerRange;
        this.mySlider=new Slider(this.slider, this.knob, {
            offset: 6,
            range: rangeSize,
            steps: rangeSize, 
            initialStep: this.innerRange
        });
        this.mySlider.addEvent('change', this.render.bind(this));
        this.smallerIcon.addEvent('click', this.mySlider.set.pass(0, this.mySlider));
        this.largerIcon.addEvent('click', this.mySlider.set.pass(rangeSize, this.mySlider));
    },
    setUpGlass: function(){
        this.glassDiv=new Array();
        for(var i=0; i<4; i++){
            this.glassDiv[i]=new Element('div', {
                'class': 'cp_image_select_glass',
            }).inject(this.imageArea);
        }
    },
    setUpPreview: function(){
        this.previewImage=new Array();
        this.preview.each(function(item){
            var tempImage=new Element('img', {
                src: this.options.img_src,
                'class': 'cp_preview_image'
            }).inject(item);
            this.previewImage.push(tempImage);
        }.bind(this));
        
    },
    setUpAll: function(){
        var tempSize=this.image.getSize();
        this.imageWidth=tempSize.x;
        this.imageHeight=tempSize.y;
        this.maxEdge=Math.max(this.imageWidth, this.imageHeight);
        this.minEdge=Math.min(this.imageWidth, this.imageHeight);
        if(this.maxEdge<=this.options.minSize){
            this.image.setStyle('visibility', 'visible');
            return;
        }
        if(this.minEdge<260){
            this.maxViewport=this.minEdge;
        }else{
            this.maxViewport=260;
        }
        this.image.setStyle('visibility', 'visible');
        this.setUpContainers();
        this.image.inject(this.imageArea);
        this.viewportWidth=this.viewportHeight=this.minEdge;
        this.ratio = 1;
        this.viewportCenterX=this.imageWidth/2;
        this.viewportCenterY=this.imageHeight/2;
        this.setUpSlider();
        this.setUpGlass();
        this.setUpDrag();
        if(this.preview){
            this.setUpPreview();
        }
        this.render(this.innerRange);
        this.fireEvent('load');
    },
    render: function(value){
        if(value<this.innerRange){
            var k = value+this.maxViewport;
            this.ratio = k/Math.min(this.imageWidth, this.imageHeight);
            this.viewportWidth=this.maxViewport;
            this.viewportHeight=this.maxViewport;
        }else{
            value-=this.innerRange;
            this.ratio=1;
            this.viewportWidth=this.maxViewport-value;
            this.viewportHeight=this.maxViewport-value;
        }
        this.renderComponents();
    },
    renderComponents: function(){
        this.ensureBoundary();
        this.renderGlass();
        this.renderImage();
        if(this.preview){
            this.renderPreview();
        }
    },
    renderPreview: function(){
        this.previewImage.each(function(item, index){
            var previewWidth=document.id(this.preview[index]).getStyle('width').toInt();
            var previewHeight=document.id(this.preview[index]).getStyle('height').toInt();
            var previewRatio=previewWidth/this.viewportWidth*this.ratio;
            var newWidth=previewRatio*this.imageWidth;
            var newHeight=previewRatio*this.imageHeight;
            var realX=this.viewportCenterX*previewRatio;
            var realY=this.viewportCenterY*previewRatio;
            item.setStyles({
                width: newWidth,
                height: newHeight,
                left: -(realX-previewWidth/2),
                top: -(realY-previewHeight/2)
            });
        }.bind(this));
    },
    renderGlass: function(){
        this.cropArea.setStyles({
            top: (300-this.viewportWidth)/2-1,
            left: (300-this.viewportHeight)/2-1,
            width: this.viewportWidth,
            height: this.viewportHeight
        });
        var coord=this.cropArea.getCoordinates(this.imageArea);
        this.glassDiv[0].setStyles({
            top: 0,
            left: 0,
            width: coord.left,
            height: 300
        });
        this.glassDiv[1].setStyles({
            top: 0,
            left: coord.left,
            width: coord.width,
            height: coord.top
        });
        this.glassDiv[2].setStyles({
            top: 0,
            left: coord.left+coord.width,
            width: coord.right-coord.width,
            height: 300
        });
        this.glassDiv[3].setStyles({
            top: coord.top+coord.height,
            left: coord.left,
            width: coord.width,
            height: coord.bottom-coord.height
        });
    },
    renderImage: function(){
        var newWidth=(this.ratio*this.imageWidth);
        var newHeight=(this.ratio*this.imageHeight);
        var realX=(this.viewportCenterX*this.ratio);
        var realY=(this.viewportCenterY*this.ratio);
        this.image.setStyles({
            width: newWidth,
            height: newHeight,
            left: -(realX-150),
            top: -(realY-150)
        });
    },
    ensureBoundary: function(){
        var xFactor= this.viewportWidth/2;
        var yFactor= this.viewportHeight/2;
        this.viewportCenterX=Math.max(xFactor/this.ratio,this.viewportCenterX);
        this.viewportCenterY=Math.max(yFactor/this.ratio,this.viewportCenterY);
        this.viewportCenterX=Math.min(this.imageWidth-xFactor/this.ratio,this.viewportCenterX);
        this.viewportCenterY=Math.min(this.imageHeight-yFactor/this.ratio,this.viewportCenterY);
    },
   
    dragStart: function(el, e){
        this.startPoint=e.page;
        this.startViewportCenterX=this.viewportCenterX;
        this.startViewportCenterY=this.viewportCenterY;
    },
    dragMoving: function(el, e){
        var tempPoint=e.page;
        var deltaX=tempPoint.x-this.startPoint.x;
        var deltaY=tempPoint.y-this.startPoint.y;
        this.viewportCenterX=this.startViewportCenterX-deltaX/this.ratio;
        this.viewportCenterY=this.startViewportCenterY-deltaY/this.ratio;
        this.renderComponents();
    },
    getCropConstraints: function(){
        return {x: this.viewportCenterX, y: this.viewportCenterY, width: this.viewportWidth/this.ratio, height: this.viewportHeight/this.ratio};
    }
});