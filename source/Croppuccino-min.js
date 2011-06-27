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
var Croppuccino=new Class({version:"0.3",Implements:[Options,Events],options:{preview:false,minSize:100},initialize:function(a){this.setOptions(a);this.container=document.id(this.options.container);this.preview=this.options.preview;this.options.minSize=Math.max(this.options.minSize.toInt(),1);this.setUpImage()},setUpContainers:function(){this.imageCropper=new Element("div",{"class":"cp_image_cropper"});this.imageArea=new Element("div",{"class":"cp_image_area"}).inject(this.imageCropper);this.cropArea=new Element("div",{"class":"cp_crop_area"}).inject(this.imageArea);this.sliderContainer=new Element("div",{"class":"cp_slider_container"}).inject(this.imageCropper);this.smallerIcon=new Element("div",{"class":"cp_smaller_icon"}).inject(this.sliderContainer);this.sliderLeft=new Element("div",{"class":"cp_slider_left"}).inject(this.sliderContainer);this.slider=new Element("div",{"class":"cp_slider"}).inject(this.sliderContainer);this.knob=new Element("div",{"class":"cp_knob"}).inject(this.slider);this.sliderRight=new Element("div",{"class":"cp_slider_right"}).inject(this.sliderContainer);this.largerIcon=new Element("div",{"class":"cp_larger_icon"}).inject(this.sliderContainer);this.imageCropper.inject(this.container)},setUpImage:function(){this.image=new Element("img",{src:this.options.img_src,"class":"cp_target_image",styles:{visibility:"hidden"},events:{load:this.setUpAll.bind(this)}}).inject(this.container);this.fireEvent("startLoad")},setUpDrag:function(){var a=new Drag(this.imageArea,{snap:0,style:false,preventDefault:true});a.addEvents({start:this.dragStart.bind(this),drag:this.dragMoving.bind(this),})},setUpSlider:function(){this.innerRange=(this.minEdge-this.maxViewport);this.outerRange=(this.maxViewport-this.options.minSize);var a=this.innerRange+this.outerRange;this.mySlider=new Slider(this.slider,this.knob,{offset:6,range:a,steps:a,initialStep:this.innerRange});this.mySlider.addEvent("change",this.render.bind(this));this.smallerIcon.addEvent("click",this.mySlider.set.pass(0,this.mySlider));this.largerIcon.addEvent("click",this.mySlider.set.pass(a,this.mySlider))},setUpGlass:function(){this.glassDiv=new Array();for(var a=0;a<4;a++){this.glassDiv[a]=new Element("div",{"class":"cp_image_select_glass",}).inject(this.imageArea)}},setUpPreview:function(){this.previewImage=new Array();this.preview.each(function(b){var a=new Element("img",{src:this.options.img_src,"class":"cp_preview_image"}).inject(b);this.previewImage.push(a)}.bind(this))},setUpAll:function(){var a=this.image.getSize();this.imageWidth=a.x;this.imageHeight=a.y;this.maxEdge=Math.max(this.imageWidth,this.imageHeight);this.minEdge=Math.min(this.imageWidth,this.imageHeight);if(this.maxEdge<=this.options.minSize){this.image.setStyle("visibility","visible");return}if(this.minEdge<260){this.maxViewport=this.minEdge}else{this.maxViewport=260}this.image.setStyle("visibility","visible");this.setUpContainers();this.image.inject(this.imageArea);this.viewportWidth=this.viewportHeight=this.minEdge;this.ratio=1;this.viewportCenterX=this.imageWidth/2;this.viewportCenterY=this.imageHeight/2;this.setUpSlider();this.setUpGlass();this.setUpDrag();if(this.preview){this.setUpPreview()}this.render(this.innerRange);this.fireEvent("load")},render:function(b){if(b<this.innerRange){var a=b+this.maxViewport;this.ratio=a/Math.min(this.imageWidth,this.imageHeight);this.viewportWidth=this.maxViewport;this.viewportHeight=this.maxViewport}else{b-=this.innerRange;this.ratio=1;this.viewportWidth=this.maxViewport-b;this.viewportHeight=this.maxViewport-b}this.renderComponents()},renderComponents:function(){this.ensureBoundary();this.renderGlass();this.renderImage();if(this.preview){this.renderPreview()}},renderPreview:function(){this.previewImage.each(function(i,f){var b=document.id(this.preview[f]).getStyle("width").toInt();var g=document.id(this.preview[f]).getStyle("height").toInt();var h=b/this.viewportWidth*this.ratio;var e=h*this.imageWidth;var a=h*this.imageHeight;var d=this.viewportCenterX*h;var c=this.viewportCenterY*h;i.setStyles({width:e,height:a,left:-(d-b/2),top:-(c-g/2)})}.bind(this))},renderGlass:function(){this.cropArea.setStyles({top:(300-this.viewportWidth)/2-1,left:(300-this.viewportHeight)/2-1,width:this.viewportWidth,height:this.viewportHeight});var a=this.cropArea.getCoordinates(this.imageArea);this.glassDiv[0].setStyles({top:0,left:0,width:a.left,height:300});this.glassDiv[1].setStyles({top:0,left:a.left,width:a.width,height:a.top});this.glassDiv[2].setStyles({top:0,left:a.left+a.width,width:a.right-a.width,height:300});this.glassDiv[3].setStyles({top:a.top+a.height,left:a.left,width:a.width,height:a.bottom-a.height})},renderImage:function(){var b=(this.ratio*this.imageWidth);var a=(this.ratio*this.imageHeight);var d=(this.viewportCenterX*this.ratio);var c=(this.viewportCenterY*this.ratio);this.image.setStyles({width:b,height:a,left:-(d-150),top:-(c-150)})},ensureBoundary:function(){var a=this.viewportWidth/2;var b=this.viewportHeight/2;this.viewportCenterX=Math.max(a/this.ratio,this.viewportCenterX);this.viewportCenterY=Math.max(b/this.ratio,this.viewportCenterY);this.viewportCenterX=Math.min(this.imageWidth-a/this.ratio,this.viewportCenterX);this.viewportCenterY=Math.min(this.imageHeight-b/this.ratio,this.viewportCenterY)},dragStart:function(a,b){this.startPoint=b.page;this.startViewportCenterX=this.viewportCenterX;this.startViewportCenterY=this.viewportCenterY},dragMoving:function(c,d){var f=d.page;var b=f.x-this.startPoint.x;var a=f.y-this.startPoint.y;this.viewportCenterX=this.startViewportCenterX-b/this.ratio;this.viewportCenterY=this.startViewportCenterY-a/this.ratio;this.renderComponents()},getCropConstraints:function(){return{x:this.viewportCenterX,y:this.viewportCenterY,width:this.viewportWidth/this.ratio,height:this.viewportHeight/this.ratio}}});