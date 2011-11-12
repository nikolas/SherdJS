/*
SherdJS - a javascript library to allow annotating objects.
Copyright 2008-2011 to Columbia University
Center for New Media Teaching and Learning
authors: Schuyler Duveen, Susan Dreher

see: https://github.com/ccnmtl/sherdjs and https://github.com/ccnmtl/mediathread
*/
if(typeof Sherd=='undefined'||!Sherd){Sherd={};}
function hasAttr(obj,key){try{return(typeof(obj[key])!='undefined');}catch(e){return false;}}
var new_id=0;Sherd.Base={'hasAttr':hasAttr,'newID':function(prefix){prefix=prefix||'autogen';var new_id=1;while(document.getElementById(prefix+new_id)!==null){new_id=Math.floor(Math.random()*10000);}
return prefix+new_id;},'log':function(){try{window.console.log(arguments);}catch(e){var args=[];var m=arguments.length;while(--m>=0){args.unshift(arguments[m]);}
document.body.appendChild(Sherd.Base.html2dom('<div class="log">'+String(args)+'</div>'));}},'html2dom':function(html_text,doc){doc=(doc)?doc:document;var temp_div=doc.createElement('div');temp_div.innerHTML=html_text;if(temp_div.childNodes.length==1){return temp_div.firstChild;}},'Observer':function(){var _listeners={};var _named_listeners={};var _nextListener=0;this.addListener=function(obj,slot){if(slot&&_named_listeners[slot]){this.removeListener(slot);_named_listeners[slot]=obj;return slot;}else{_listeners[++_nextListener]=obj;return _nextListener;}};this.removeListener=function(slot_or_pos){var stor=(_named_listeners[slot_or_pos])?_named_listeners:_listeners;if(stor[slot_or_pos]){stor[slot_or_pos].disconnect();delete stor[slot_or_pos];}};this.clearListeners=function(){for(var a in _named_listeners){this.removeListener(a);}
for(var b in _listeners){this.removeListener(b);}};this.events={signal:Sherd.Base.Events.signal,connect:Sherd.Base.Events.connect};},'DomObject':function(){Sherd.Base.Observer.call(this);var self=this;this.components={};this.get=function(){throw Error("get() not implemented");};this.microformat=function(){throw Error("microformat() not implemented");};this.idPrefix=function(){return'domObj';};this.id=function(){var _dom=this.get();if(!_dom.id){_dom.id=Sherd.Base.newID(this.idPrefix());}
return _dom.id;};this.attachMicroformat=function(microformat){this.microformat=microformat;};this.html={get:function(part){part=(part)?part:'media';return self.components[part];},put:function(dom,create_obj){if(self.microformat&&self.microformat.components){self.components=self.microformat.components(dom,create_obj);}else{self.components={'top':dom};}
if(self.initialize)
self.initialize(create_obj);},remove:function(){self.clearListeners();if(self.deinitialize)
self.deinitialize();for(var part in self.components){if(typeof self.components[part]==='object'&&self.components[part].parentNode){self.components[part].parentNode.removeChild(self.components[part]);}}},write:function(towrite,doc){doc=(doc)?doc:document;if(typeof towrite=='string'){doc.write(towrite);}else if(typeof towrite=='object'&&towrite.text){doc.write(towrite.text);if(towrite.htmlID)
self.html.put(doc.getElementById(towrite.htmlID));}},replaceContents:function(htmlstring,dom){if(typeof htmlstring=='string'){dom.innerHTML=htmlstring;}}};},'AssetView':function(){var self=this;Sherd.Base.DomObject.apply(this);this.options={};this.getState=function(){};this.setState=function(obj){};if(this.html&&!this.html.pull){this.html.pull=function(dom_or_id,optional_microformat){if(typeof dom_or_id=='string'){dom_or_id=document.getElementById(dom_or_id);}
var mf=(optional_microformat)?optional_microformat:self.microformat;var asset=mf.read({html:dom_or_id});self.events.signal(self,'asset.update');return asset;};this.html.push=function(dom_or_id,options){options=options||{};options.microformat=options.microformat||self.microformat;options.asset=options.asset||self._asset;if(typeof dom_or_id=='string'){dom_or_id=document.getElementById(dom_or_id);}
if(options.asset){if(options.asset!=self._asset){if(self.deinitialize)
self.deinitialize();var updated=(options.microformat.update&&options.microformat.update(options.asset,dom_or_id.firstChild));if(!updated){var create_obj=options.microformat.create(options.asset);if(create_obj.text&&dom_or_id)
dom_or_id.innerHTML=create_obj.text;for(div in options.extra){if(div in create_obj){dom_or_id=document.getElementById(options.extra[div]);if(dom_or_id)
dom_or_id.innerHTML=create_obj[div];}}
var top=document.getElementById(create_obj.htmlID);self.html.put(top,create_obj);}}}};}},'AssetManager':function(config){this.config=(config)?config:{'storage':Sherd.Base.Storage,'layers':{}};},'Storage':function(){Sherd.Base.Observer.call(this);var _local_objects={};var localid_counter=0;this._localid=function(obj_or_id){var localid;if(typeof obj_or_id=='string'){localid=obj_ord_id;}else if(hasAttr(obj_or_id,'local_id')){localid=obj_or_id['local_id'];}else{localid=String(++localid_counter);}
return localid;};this._local=function(id,obj){if(arguments.length>1){_local_objects[id]=obj;}
return(hasAttr(_local_objects,id))?_local_objects[id]:false;};this.load=function(obj_or_id){};this.get=function(obj_or_id){var localid=this._localid(obj_or_id);return this._local(localid);};this.save=function(obj){var localid=this._localid(obj);this._local(localid,obj);};this.remove=function(obj_or_id){};this._update=function(){this.callListeners('update',[this]);};}};if(typeof jQuery!='undefined'){Sherd.winHeight=function(){return jQuery(window).height()-235;};Sherd.Base.Events={'connect':function(subject,event,func){var disc=jQuery(subject).bind(event,function(evt,param){if(param)func(param);else func(evt);});return{disconnect:function(){jQuery(disc).unbind(event);}};},'signal':function(subject,event,param){jQuery(subject).trigger(event,[param]);}};}
else if(typeof MochiKit!='undefined'){Sherd.winHeight=function(){return MochiKit.Style.getViewportDimensions().h-250;};Sherd.Base.Events={'connect':function(subject,event,func){if(typeof subject.nodeType!=='undefined'||subject===window||subject===document){event='on'+event;}
var disc=MochiKit.Signal.connect(subject,event,func);return{disconnect:function(){MochiKit.Signal.disconnect(disc);}};},'signal':function(subject,event,param){MochiKit.Signal.signal(subject,event,param);}};}
else{throw Error("Use a framework, Dude! MochiKit, jQuery, YUI, whatever!");}
if(!Math.log2){var div=Math.log(2);Math.log2=function(x){return Math.log(x)/div;};}
if(!window.console){window.console={log:function(){}};}
if(!Sherd){Sherd={};}
if(!Sherd.Image){Sherd.Image={};}
if(!Sherd.Image.OpenLayers){Sherd.Image.OpenLayers=function(){var self=this;Sherd.Base.AssetView.apply(this,arguments);this.openlayers={'features':[],'feature2json':function(feature){if(self.openlayers.GeoJSON){return{'geometry':self.openlayers.GeoJSON.extract.geometry.call(self.openlayers.GeoJSON,feature.geometry)};}},'features2svg':function(){throw Error('not implemented correctly');var x=new OpenLayers.Format.XML();return x.write(self.openlayers.vectorLayer.v.renderer.rendererRoot);},'frag2feature':function(obj,map){var extent=self.openlayers.map.getMaxExtent().toArray();var geow=extent[2]-extent[0],geoh=extent[3]-extent[1];if(self.current_obj.type==='xyztile'){geoh=self.current_obj.dim.height*90/1000;}
switch(obj.xywh.units){case'pixel':geow/=self.current_obj.dim.width;geoh/=self.current_obj.dim.height;break;case'percent':geow/=100;geoh/=100;break;default:return false}
var topleft=[extent[0]+obj.xywh.x*geow,extent[3]-obj.xywh.y*geoh];var geometry={type:'Polygon',coordinates:[]};if(obj.xywh.w===0&&obj.xywh.h===0){geometry.type='Point';geometry.coordinates=topleft;}else{var right=topleft[0]+geow*obj.xywh.w;var bottom=topleft[1]-geoh*obj.xywh.h;geometry.coordinates.push([topleft,[right,topleft[1]],[right,bottom],[topleft[0],bottom],topleft]);}
return self.openlayers.GeoJSON.parseFeature({geometry:geometry});},'object_proportioned':function(object){var dim={w:180,h:90};var w=object.width||180;var h=object.height||90;if(w/2>h){dim.h=Math.ceil(180*h/w);}else{dim.w=Math.ceil(90*w/h);}
return dim;},'object2bounds':function(object){var dim=self.openlayers.object_proportioned(object);return new OpenLayers.Bounds(-dim.w,-dim.h,dim.w,dim.h);}};this.Layer=function(){};this.Layer.prototype={all_layers:[],root:{hover:false,click:false,layers:{}},_adoptIntoRootContainer:function(new_layer,opts){layerSelf=this;if(this.root.globalMouseListener&&this.root.globalMouseListener.map){this.root.globalMouseListener.destroy();}
var listeners=this.root.layers[new_layer.v.id]={me:new_layer};this.all_layers.push(new_layer.v);this.all_layers.sort(function(a,b){return a.sherd_layerapi.zIndex-b.sherd_layerapi.zIndex;});for(var i=0,l=this.all_layers.length;i<l;i++){var layer=this.all_layers[i];this.root.layers[layer.id].index=i;layer.map.setLayerIndex(layer,i+1);}
if(opts.onmouseenter){this.root.hover=true;listeners.onmouseenter=opts.onmouseenter;}
if(opts.onmouseleave){this.root.hover=true;listeners.onmouseleave=opts.onmouseleave;}
if(opts.onclick){this.root.click=true;listeners.onclick=opts.onclick;}
this.root.globalMouseListener=new OpenLayers.Control.SelectFeature(this.all_layers,{'hover':this.root.hover,overFeature:function(feature){var lay=layerSelf.root.layers[feature.layer.id];if(lay.onmouseenter){lay.onmouseenter(feature.sherd_id,feature.layer.sherd_layername);}},clickFeature:function(feature){var lay=layerSelf.root.layers[feature.layer.id];if(lay.onclick){lay.onclick(feature.sherd_id,feature.layer.sherd_layername);}},outFeature:function(feature){var lay=layerSelf.root.layers[feature.layer.id];if(lay.onmouseleave){lay.onmouseleave(feature.sherd_id,feature.layer.sherd_layername);}},highlightOnly:true,renderIntent:"temporary"});self.openlayers.map.addControl(this.root.globalMouseListener);this.root.globalMouseListener.activate();},create:function(name,opts){this.v=new OpenLayers.Layer.Vector(name||"Annotations",{projection:'Flatland:1',rendererOptions:{zIndexing:true}});this.name=name;this._anns={};this.v.styleMap=new OpenLayers.StyleMap(self.openlayers.styles);this.zIndex=(opts&&opts.zIndex)||200;this.v.setZIndex(this.zIndex);this.v.sherd_layername=name;this.v.sherd_layerapi=this;self.openlayers.map.addLayer(this.v);this._adoptIntoRootContainer(this,opts);return this;},destroy:function(){this.all_layers.splice(this.root.layers[this.v.id].index,1);delete this.root.layers[this.v.id];this.v.destroy();for(var ann_id in this._anns)
delete this._anns[ann_id];},add:function(ann,opts){if(!this.v)
throw Error('layer not created yet');var feature_bg=self.openlayers.GeoJSON.parseFeature(ann);var feature_fg=feature_bg.clone();var features=[feature_bg,feature_fg];feature_bg.renderIntent='blackbg';feature_fg.renderIntent='defaulta';if(opts){if(opts.id){this._anns[opts.id]={'f':features,'opts':opts};feature_fg.sherd_id=opts.id;feature_bg.sherd_id=opts.id;}
if(opts.color){if(opts.color in this.v.styleMap.styles){feature_fg.renderIntent=opts.color;}else if(feature_fg.geometry){var feature_style=feature_fg.id+':'+opts.color;this.v.styleMap.styles[feature_style]=new OpenLayers.Style({fillOpacity:0,strokeWidth:1,strokeColor:opts.color,pointerEvents:(opts.pointerEvents),graphicZIndex:(opts.zIndex||300-parseInt(feature_fg.geometry.getBounds().top,10))});feature_fg.renderIntent=feature_style;}}
if(opts.bgcolor){feature_bg.renderIntent=opts.bgcolor;}}
this.v.addFeatures(features);},remove:function(ann_id){if(this.v&&ann_id in this._anns){this.v.removeFeatures(this._anns[ann_id].f);var o=this._anns[ann_id].opts;delete this._anns[ann_id];return o;}},removeAll:function(){if(!this.v)return;this.v.removeAllFeatures();for(var ann_id in this._anns)
delete this._anns[ann_id];},show:function(){this.v.setVisibility(true);},hide:function(){this.v.setVisibility(false);},getLayer:function(){return this.v;}};this.presentations={'thumb':{height:function(){return'100px';},width:function(){return'100px';},initialize:function(obj,presenter){var m=presenter.openlayers.map;while(m.controls.length){m.removeControl(m.controls[0]);}}},'default':{height:function(obj,presenter){return Sherd.winHeight()+'px';},width:function(obj,presenter){return'100%';},initialize:function(obj,presenter){self.events.connect(window,'resize',function(){presenter.components.top.style.height=Sherd.winHeight()+'px';});}},'medium':{height:function(){return'383px';},width:function(){return'100%';},initialize:function(){}},'small':{height:function(){return'240px';},width:function(){return'320px';},initialize:function(){}}};this.currentfeature=false;this.current_obj=false;this.getState=function(){var geojson={};if(self.currentfeature){geojson=self.openlayers.feature2json(self.currentfeature);}
var m=self.openlayers.map;if(m){var center=m.getCenter();geojson['default']=(!geojson.geometry&&center.lon===0&&center.lat===0);geojson['x']=center.lon;geojson['y']=center.lat;geojson['zoom']=m.getZoom();geojson['extent']=m.getMaxExtent().toArray();}
return geojson;};this.setState=function(obj){var state={'zoom':2};if(obj===null)obj={};if(typeof obj==='object'&&obj!==null){if(obj.feature){self.currentfeature=obj.feature;}else if(obj.geometry){self.currentfeature=self.openlayers.GeoJSON.parseFeature(obj);}else if(obj.xywh){self.currentfeature=self.openlayers.frag2feature(obj,self.openlayers.map);}else{if(obj.x)state.x=obj.x;if(obj.y)state.y=obj.y;if(obj.zoom)state.zoom=obj.zoom;self.currentfeature=false;}}
self.openlayers.vectorLayer.removeAll();if(self.currentfeature){self.openlayers.vectorLayer.add(self.openlayers.feature2json(self.currentfeature),{color:'grey',bgcolor:'white',zIndex:850});var bounds=self.currentfeature.geometry.getBounds();if(!obj.preserveCurrentFocus){if(obj.zoom&&obj.zoom<self.openlayers.map.getZoomForExtent(bounds)){self.openlayers.map.setCenter(bounds.getCenterLonLat(),obj.zoom);}else{self.openlayers.map.zoomToExtent(bounds);}}}else if(!obj||!obj.preserveCurrentFocus){if(state.x){self.openlayers.map.setCenter(new OpenLayers.LonLat(state.x,state.y),state.zoom);}else{self.openlayers.map.zoomToMaxExtent();}}};this.microformat={};this.microformat.create=function(obj,doc){var wrapperID=Sherd.Base.newID('openlayers-wrapper');if(!obj.options)obj.options={numZoomLevels:5,sphericalMercator:false,projection:'Flatland:1',maxExtent:new OpenLayers.Bounds(-180,-90,180,90)};if(obj['image-metadata']){obj.options.numZoomLevels=Math.ceil(Math.log2(Math.max(obj['image-metadata'].height,obj['image-metadata'].width))-5);}
return{object:obj,htmlID:wrapperID,text:'<div id="'+wrapperID+'" class="sherd-openlayers-map"></div>'};};this.microformat.update=function(obj,html_dom){};this.deinitialize=function(){if(this.openlayers.map){var lays=this.Layer.prototype.root.layers;for(var a in lays){if(lays[a].name!='annotating')
lays[a].me.destroy();}
this.openlayers.map.destroy();}};this.initialize=function(create_obj){if(create_obj){var top=document.getElementById(create_obj.htmlID);var presentation;switch(typeof create_obj.object.presentation){case'string':presentation=self.presentations[create_obj.object.presentation];break;case'object':presentation=create_obj.object.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
top.style.width=presentation.width(create_obj.object,self);top.style.height=presentation.height(create_obj.object,self);self.openlayers.map=new OpenLayers.Map(create_obj.htmlID);var objopt=create_obj.object.options;if(create_obj.object.xyztile){var md=create_obj.object['xyztile-metadata'];if(create_obj.object['xyztile-metadata']){objopt.numZoomLevels=Math.ceil(Math.log2(Math.max(md.height,md.width))-7);var dim=self.openlayers.object_proportioned(md);var px2deg=180/Math.pow(2,objopt.numZoomLevels+6);objopt.maxExtent=new OpenLayers.Bounds(-180,-280,-180+Math.ceil(md.width*px2deg),80);}else{objopt.maxExtent=new OpenLayers.Bounds(-180,(80-360),180,80);}
self.openlayers.graphic=new OpenLayers.Layer.XYZ(create_obj.object.title||'Image',create_obj.object.xyztile,objopt);self.openlayers.map.maxExtent=objopt.maxExtent;self.openlayers.graphic.getImageSize=function(){return null;};self.openlayers.graphic.zoomToMaxExtent=function(){self.openlayers.map.setCenter(this.maxExtent.getCenterLonLat());};self.current_obj={create_obj:create_obj,dim:md,type:'xyztile'};if(/TileGroup\d/.test(create_obj.object.xyztile)){self.current_obj.zoomify=true;var tiles_x=Math.ceil(md.width/256)*2;var tiles_y=Math.ceil(md.height/256)*2;var tiles=[];while(tiles_x>1&&tiles_y>1){tiles_x=Math.ceil(tiles_x/2);tiles_y=Math.ceil(tiles_y/2);tiles.push({'all':tiles_x*tiles_y,'x':tiles_x});}
tiles.push({all:1,x:1});tiles=tiles.reverse();self.openlayers.graphic.getURL=function(bounds){var res=this.map.getResolution();var x=Math.round((bounds.left-this.maxExtent.left)/(res*this.tileSize.w));var y=Math.round((this.maxExtent.top-bounds.top)/(res*this.tileSize.h));var z=this.map.getZoom();var url=this.url;var tile_sum=tiles[z].x*y+x;for(var i=0;i<z;i++){tile_sum+=tiles[i].all;}
var tilegroup=Math.floor(tile_sum/256);if(tilegroup){url=url.replace(/TileGroup\d/,'TileGroup'+tilegroup);}
var path=OpenLayers.String.format(url,{'x':x,'y':y,'z':z});return path;};}}else{var o2b=self.openlayers.object2bounds;var bounds=o2b(create_obj.object);var odim=self.openlayers.object_proportioned(create_obj.object);objopt.maxExtent=o2b(create_obj.object);self.openlayers.graphic=new OpenLayers.Layer.Image(create_obj.object.title||'Image',create_obj.object.image,bounds,new OpenLayers.Size(odim.w,odim.h),objopt);self.current_obj={create_obj:create_obj,dim:create_obj.object['image-metadata'],type:'image'};}
var projection='Flatland:1';self.openlayers.styles={'highlight':new OpenLayers.Style({fillOpacity:0,strokeWidth:6,strokeColor:'#ffffff',pointerEvents:'none',labelSelect:false,graphicZIndex:1}),'grey':new OpenLayers.Style({fillOpacity:0,strokeWidth:2,strokeColor:'#905050',pointerEvents:'none',graphicZIndex:5}),'blackbg':new OpenLayers.Style({fillOpacity:0,strokeWidth:3,strokeColor:'#000000',pointerEvents:'none',graphicZIndex:0}),'defaulta':new OpenLayers.Style({fillOpacity:0,strokeWidth:2,graphicZIndex:0}),'white':new OpenLayers.Style({fillOpacity:0,strokeWidth:4,strokeColor:'#ffffff',pointerEvents:'none',labelSelect:false,graphicZIndex:0}),'defaultx':new OpenLayers.Style({fillOpacity:0,strokeWidth:2,pointerEvents:'none',labelSelect:false,graphicZIndex:0})};self.openlayers.map.addControl(new OpenLayers.Control.MousePosition());self.openlayers.map.addLayers([self.openlayers.graphic]);self.openlayers.vectorLayer=new self.Layer().create('annotating',{zIndex:1000});self.openlayers.GeoJSON=new OpenLayers.Format.GeoJSON({'internalProjection':self.openlayers.map.baseLayer.projection,'externalProjection':new OpenLayers.Projection(projection)});presentation.initialize(create_obj.object,self);}};this.microformat.components=function(html_dom,create_obj){return{'top':html_dom};};this.queryformat={find:function(str){var xywh=String(str).match(/xywh=((\w+):)?([.\d]+),([.\d]+),([.\d]+),([.\d]+)/);if(xywh!==null){var ann={xywh:{x:Number(xywh[3]),y:Number(xywh[4]),w:Number(xywh[5]),h:Number(xywh[6]),units:xywh[2]||'pixel'}}
return[ann];}
return[];}};};}
if(!Sherd){Sherd={};}
if(!Sherd.Image){Sherd.Image={};}
if(!Sherd.Image.Annotators){Sherd.Image.Annotators={};}
if(!Sherd.Image.Annotators.FSIViewer){Sherd.Image.Annotators.FSIViewer=function(){var self=this;Sherd.Base.AssetView.apply(this,arguments);this.attachView=function(view){self.targetview=view;};this.targetstorage=[];this.addStorage=function(stor){this.targetstorage.push(stor);};this.getState=function(){return self.targetview.getState();};this.current_state=null;this.setState=function(obj,options){if(typeof obj=='object'){self.current_state=obj;self.mode=null;if(!options||!options.mode||options.mode=="browse"){if(self.components.instructions)
self.components.instructions.style.display='none';}else{if(self.components.instructions)
self.components.instructions.style.display='block';}}};this.initialize=function(create_obj){self.events.connect(self.components.center,'click',function(evt){self.targetview.setState(self.current_state);});self.events.connect(self.components.redo,'click',function(evt){var current_state=self.targetview.getState();self.storage.update(current_state);});};this.storage={'update':function(obj,just_downstream){if(!just_downstream){self.setState(obj);}
for(var i=0;i<self.targetstorage.length;i++){self.targetstorage[i].storage.update(obj);}}};this.microformat={'create':function(){var id=Sherd.Base.newID('openlayers-annotator');return{htmlID:id,text:'<div id="'+id+'"><p style="display:none;" id="instructions" class="sherd-instructions">Zoom and Pan to the frame you want to save, and then click Save</p></div>'};},'components':function(html_dom,create_obj){if(!html_dom)
return{};var buttons=html_dom.getElementsByTagName('button');return{'top':html_dom,'image':html_dom.getElementsByTagName('img')[0],'center':document.getElementById('btnCenter'),'instructions':document.getElementById('instructions')};}};};}
if(typeof Sherd=='undefined'){Sherd={};}
if(!Sherd.AssetLayer){Sherd.AssetLayer=function(){};}
if(!Sherd.GenericAssetView){Sherd.GenericAssetView=function(options){var self=this;var Clipstripper=Sherd.Video.Annotators.ClipStrip;var Clipformer=Sherd.Video.Annotators.ClipForm;this.options=options;this.settings={};if(Sherd.Video){var decorateVideo=function(options,viewgroup){if(options.clipform){viewgroup.clipform=new Clipformer();viewgroup.clipform.attachView(viewgroup.view);if(options.storage){viewgroup.clipform.addStorage(options.storage);}}
if(options.clipstrip){viewgroup.clipstrip=new Clipstripper();viewgroup.clipstrip.attachView(viewgroup.view);}};if(Sherd.Video.QuickTime){var quicktime=this.settings.quicktime={'view':new Sherd.Video.QuickTime()};decorateVideo(options,quicktime);}
if(Sherd.Video.YouTube){var youtube=this.settings.youtube={'view':new Sherd.Video.YouTube()};decorateVideo(options,youtube);}
if(Sherd.Video.Flowplayer){var flowplayer=this.settings.flowplayer={'view':new Sherd.Video.Flowplayer()};decorateVideo(options,flowplayer);}
if(Sherd.Video.RealPlayer){var realplayer=this.settings.realplayer={'view':new Sherd.Video.RealPlayer()};decorateVideo(options,realplayer);}
if(Sherd.Video.Videotag){var videotag=this.settings.videotag={'view':new Sherd.Video.Videotag()};decorateVideo(options,videotag);}
if(Sherd.Video.Kaltura){var player=this.settings.kaltura={'view':new Sherd.Video.Kaltura()};decorateVideo(options,player);}
if(Sherd.Video.Vimeo){var player=this.settings.vimeo={'view':new Sherd.Video.Vimeo()};decorateVideo(options,player);}}
if(Sherd.Image&&Sherd.Image.OpenLayers){var image={'view':new Sherd.Image.OpenLayers()};if(options.clipform){image.clipform=new Sherd.Image.Annotators.OpenLayers();image.clipform.attachView(image.view);if(options.storage){image.clipform.addStorage(options.storage);}}
this.settings.image=image;}
if(Sherd.Image&&Sherd.Image.FSIViewer){var fsi={'view':new Sherd.Image.FSIViewer()};if(options.clipform){fsi.clipform=new Sherd.Image.Annotators.FSIViewer();fsi.clipform.attachView(fsi.view);if(options.storage){fsi.clipform.addStorage(options.storage);}}
this.settings.fsiviewer=fsi;}
this.settings.NONE={view:{html:{remove:function(){},push:function(){}},setState:function(){},getState:function(){},queryformat:{find:function(){}}}};this.settings.NONE.clipform=this.settings.NONE.view;this.settings.NONE.clipstrip=this.settings.NONE.view;var current_type=false;this.html={remove:function(){if(current_type){self.settings[current_type].view.html.remove();if(self.clipstrip){self.clipstrip.html.remove();}
current_type=false;}},push:function(html_dom,options){if(options.asset&&options.asset.type&&(options.asset.type in self.settings)){if(current_type){if(current_type!=options.asset.type){self.html.remove();}}
current_type=options.asset.type;var cur=self.settings[current_type];cur.view.html.push(html_dom,options);if(cur.clipform){self.clipform=cur.clipform;}
if(cur.clipstrip){var target='clipstrip-display';if(options.targets&&options.targets.clipstrip){target=options.targets.clipstrip;}else if(self.options.targets&&self.options.targets.clipstrip){target=self.options.targets.clipstrip;}
cur.clipstrip.html.push(target,{asset:{}});self.clipstrip=cur.clipstrip;}}else{if(window.console){console.log(options);console.log(self.settings);}
throw Error("Your asset does not have a (supported) type marked.");}}};this.setState=function(){if(current_type){var cur=self.settings[current_type];cur.view.setState.apply(cur.view,arguments);if(self.clipstrip){self.clipstrip.setState.apply(self.clipstrip,arguments);}}};this.getState=function(){if(current_type){return self.settings[current_type].view.getState.apply(self.settings[current_type].view,arguments);}};this.queryformat={find:function(str){if(self.settings[current_type].view.queryformat&&self.settings[current_type].view.queryformat.find){return self.settings[current_type].view.queryformat.find(str);}else{return[];}}};this.layer=function(){if(self.settings[current_type].view.Layer){return new self.settings[current_type].view.Layer();}else if(self.clipstrip&&self.clipstrip.Layer){return new self.clipstrip.Layer();}};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Vimeo){Sherd.Video.Vimeo=function(){var self=this;Sherd.Video.Base.apply(this,arguments);this.state={starttime:0,endtime:0,seeking:false};this.presentations={'small':{width:function(){return 310;},height:function(){return 220;}},'medium':{width:function(){return 540;},height:function(){return 383;}},'default':{width:function(){return 620;},height:function(){return 440;}}};this.microformat.create=function(obj){var wrapperID=Sherd.Base.newID('vimeo-wrapper-');var playerID=Sherd.Base.newID('vimeo_player_');var autoplay=obj.autoplay?1:0;self.media._ready=false;if(!obj.options){var presentation;switch(typeof obj.presentation){case'string':presentation=self.presentations[obj.presentation];break;case'object':presentation=obj.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
obj.options={width:presentation.width(),height:presentation.height()};}
var objectID='';var embedID='';if(window.navigator.userAgent.indexOf("MSIE")>-1){objectID='id="'+playerID+'"';}else{embedID='id="'+playerID+'"';}
var bits=obj.vimeo.split('/');var clipId=bits[bits.length-1];var embedCode='<div id="'+wrapperID+'" class="sherd-vimeo-wrapper">'+'  <object width="'+obj.options.width+'" height="'+obj.options.height+'" '+'          classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '+objectID+'>'+'  <param name="movie" value="http://vimeo.com/moogaloop.swf"></param>'+'  <param name="allowscriptaccess" value="always"/></param>'+'  <param name="autoplay" value="'+autoplay+'"></param>'+'  <param name="width" value="'+obj.options.width+'"></param>'+'  <param name="height" value="'+obj.options.height+'"></param>'+'  <param name="allowfullscreen" value="true"></param>'+'  <param name="flashvars" value="autoplay=0&amp;loop=0&amp;clip_id='+clipId+'&amp;color=0&amp;fullscreen=1&amp;server=vimeo.com&amp;show_byline=1&amp;show_portrait=1&amp;show_title=1&amp;js_api=1">'+'  <embed '+embedID+' width="'+obj.options.width+'" height="'+obj.options.height+'" type="application/x-shockwave-flash"'+'     src="http://vimeo.com/moogaloop.swf" allowscriptaccess="always" allowfullscreen="true" flashvars="autoplay='+autoplay+'&amp;loop=0&amp;clip_id='+clipId+'&amp;color=0&amp;fullscreen=1&amp;server=vimeo.com&amp;show_byline=1&amp;show_portrait=1&amp;show_title=1&amp;js_api=1">'+'  </embed>'+'</object></div>';return{options:obj.options,htmlID:wrapperID,playerID:playerID,autoplay:autoplay,mediaUrl:obj.vimeo,text:embedCode};};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.autoplay=create_obj.autoplay;rv.mediaUrl=create_obj.mediaUrl;rv.playerID=create_obj.playerID;rv.width=create_obj.options.width;rv.height=create_obj.options.height;}
return rv;}catch(e){}
return false;};this.microformat.read=function(found_obj){var obj={};var params=found_obj.html.getElementsByTagName('param');for(var i=0;i<params.length;i++){obj[params[i].getAttribute('name')]=params[i].getAttribute('value');}
obj.mediaUrl=obj.movie;return obj;};this.microformat.type=function(){return'vimeo';};this.microformat.update=function(obj,html_dom){return obj.vimeo==self.components.mediaUrl&&document.getElementById(self.components.playerID)&&self.media.ready();};window.vimeo_player_progress=function(seconds){if(self.state.seeking==true&&seconds>0.5){self.state.seeking=false;delete self.state.autoplay;if(self.state.starttime!=undefined){self.components.player.api_seekTo(self.state.starttime);delete self.state.starttime;}
if(self.state.endtime!=undefined){setTimeout(function(){self.media.pauseAt(self.state.endtime);delete self.state.endtime;},200);}}}
window.vimeo_player_loaded=function(playerID){self.components.player=document.getElementById(self.components.playerID);self.components.player.api_addEventListener("playProgress","vimeo_player_progress");self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj,{'autoplay':true});});var duration=self.media.duration();if(duration>1){self.events.signal(self,'duration',{duration:duration});}
self.media._ready=true;if(self.state.starttime!=undefined)
setTimeout(function(){self.media.seek(self.state.starttime,self.state.endtime,self.state.autoplay);},100);}
this.media.duration=function(){var duration=0;if(self.components.player){try{duration=self.components.player.api_getDuration();if(duration<0)
duration=0;}catch(e){}}
return duration;};this.media.pause=function(){if(self.components.player){try{self.components.player.api_pause();}catch(e){}}};this.media.play=function(){if(self.media.ready){try{self.components.player.api_play();}catch(e){}}};this.media.ready=function(){return self.media._ready;};this.media.isPlaying=function(){var playing=false;try{if(self.components.player)
playing=!self.components.player.api_paused();}catch(e){}
return playing;};this.media.seek=function(starttime,endtime,autoplay){if(!self.media.ready()){self.state.starttime=starttime;self.state.endtime=endtime;self.state.autoplay=autoplay;}else if(autoplay){self.state.starttime=starttime;self.state.endtime=endtime;self.state.seeking=true;if(!self.media.isPlaying())
self.components.player.api_play();}else{if(starttime!=undefined){self.components.player.api_seekTo(starttime);}
if(endtime!=undefined){setTimeout(function(){self.media.pauseAt(endtime);},200);}
delete self.state.starttime;delete self.state.endtime;delete self.state.autoplay;self.state.seeking=false;}};this.media.time=function(){var time=0;if(self.components.player){try{time=self.components.player.api_getCurrentTime();if(time<0)
time=0;}catch(e){}}
return time;};this.media.timestrip=function(){var w=self.components.width;return{w:w,trackX:96,trackWidth:w-283,visible:true};};this.media.state=function(){return 0;};this.media.url=function(){return self.components.player.api_getVideoUrl();};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.QuickTime){Sherd.Video.QuickTime=function(){var self=this;self._played=false;Sherd.Video.Base.apply(this,arguments);this.presentations={'small':{width:function(){return 310;},height:function(){return 220;}},'medium':{width:function(){return 540;},height:function(){return 383;}},'default':{width:function(){return 620;},height:function(){return 440;}}};this.microformat.create=function(obj,doc){var wrapperID=Sherd.Base.newID('quicktime-wrapper-');var playerID=Sherd.Base.newID('quicktime-player-');self._played=false;var opt={url:'',width:320,height:240,controller_height:20,autoplay:'false',controller:'true',errortext:'Error text.',mimetype:'video/quicktime',poster:false,loadingposter:false,extra:''};for(var a in opt){if(obj[a])opt[a]=obj[a];}
if(!obj.presentation_width){var presentation;switch(typeof obj.presentation){case'string':presentation=self.presentations[obj.presentation];break;case'object':presentation=obj.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
obj.presentation_width=presentation.width();obj.presentation_height=presentation.height();}
var full_height=obj.presentation_height+Number(opt.controller_height);opt.href='';opt.autohref='';if(!(/Macintosh.*Version\/[3-9][.0-9]+ Safari/.test(navigator.userAgent)||/Linux/.test(navigator.userAgent))){opt.mimetype='image/x-quicktime';opt.extra+='<param name="href" value="'+opt.url+'" />'
+'<param name="autohref" value="'+opt.autoplay+'" />'
+'<param name="target" value="myself" />';opt.controller='false';if(opt.loadingposter&&opt.autoplay=='true'){opt.url=opt.loadingposter;}else if(opt.poster){opt.url=opt.poster;}}
var clicktoplay="";if(opt.autoplay!='true'){clicktoplay+='<div id="clicktoplay">Click video to play</div>';}
return{htmlID:wrapperID,playerID:playerID,timedisplayID:'timedisplay'+playerID,currentTimeID:'currtime'+playerID,durationID:'totalcliplength'+playerID,object:obj,text:clicktoplay+'<div id="'+wrapperID+'" class="sherd-quicktime-wrapper">'
+'<div id="timedisplay'+playerID+'" style="visibility:hidden">'
+'<span id="currtime'+playerID+'">00:00:00</span>'
+'/<span id="totalcliplength'+playerID+'">00:00:00</span></div>'
+'<!--[if IE]>'
+'<object id="'+playerID+'" '
+'width="'+obj.presentation_width+'" height="'+full_height+'" '
+'style="behavior:url(#qt_event_source)"  '
+'codebase="http://www.apple.com/qtactivex/qtplugin.cab"  '
+'classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B">'
+'<![endif]-->'
+'<!--[if !IE]><-->'
+'    <object id="'+playerID+'" type="'+opt.mimetype+'" '
+'    data="'+opt.url+'" '
+'    width="'+obj.presentation_width+'" height="'+full_height+'">'
+'<!-- ><![endif]--> '
+'<param name="src" value="'+opt.url+'" />'
+'<param name="controller" value="'+opt.controller+'" />'
+'<param name="type" value="'+opt.mimetype+'" />'
+'<param name="enablejavascript" value="true" />'
+'<param name="autoplay" value="'+opt.autoplay+'" />'
+'<param name="width" value="'+obj.presentation_width+'">'
+'<param name="height" value="'+full_height+'">'
+'<param name="postdomevents" value="true" />'
+'<param name="scale" value="aspect" />'
+opt.extra+''
+opt.errortext+'</object></div>'};};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.player=document[create_obj.playerID]||document.getElementById(create_obj.playerID);rv.duration=document.getElementById(create_obj.durationID);rv.elapsed=document.getElementById(create_obj.currentTimeID);rv.timedisplay=document.getElementById(create_obj.timedisplayID);rv.autoplay=create_obj.object.autoplay=='true';rv.playerID=create_obj.playerID;rv.htmlID=create_obj.htmlID;rv.mediaUrl=create_obj.object.quicktime;}
return rv;}catch(e){}
return false;};this.microformat.find=function(html_dom){var found=[];var objects=((html_dom.tagName.toLowerCase()=='object')?[html_dom]:html_dom.getElementsByTagName('object'));for(var i=0;i<objects.length;i++){if(objects[i].getAttribute('classid')=='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B'||objects[i].getAttribute('type')=='video/quicktime')
found.push({'html':objects[i]});}
return found;};this.microformat.read=function(found_obj){var obj={url:'',quicktime:'',width:320,height:240,controller_height:20,autoplay:'false',controller:'true',errortext:'Error text.',type:'video/quicktime'};var params=found_obj.html.getElementsByTagName('param');for(var i=0;i<params.length;i++){obj[params[i].getAttribute('name')]=params[i].getAttribute('value');}
if(obj.src){obj.url=obj.src;delete obj.src;}else{obj.url=found_obj.html.getAttribute('data');}
obj.quicktime=obj.url;if(Number(found_obj.html.width))obj.width=Number(found_obj.html.width);if(Number(found_obj.html.height))obj.height=Number(found_obj.html.height);return obj;};this.microformat.type=function(){return'quicktime';};this.microformat.update=function(obj,html_dom){if(obj.quicktime&&self.components.player&&self.media.ready()){try{if(obj.quicktime!=self.components.mediaUrl){self.components.player.SetURL(obj.quicktime);self.components.mediaUrl=obj.quicktime;if(/MSIE/.test(navigator.userAgent)&&self.components.autoplay){window.setTimeout(function(){self.components.player.SetURL(self.components.mediaUrl);self.media.seek(self.components.starttime,self.components.endtime);},400);}}
self.microformat._startUpdateDisplayTimer();return true;}catch(e){}}
return false;};this.microformat._startUpdateDisplayTimer=function(create_obj){self.media._duration=0;self.events.queue('quicktime duration watcher & tick count',[{test:function(){var newDuration=self.media.duration();if(newDuration!=self.media._duration){self.media._duration=newDuration;self.components.duration.innerHTML=self.secondsToCode(newDuration);self.events.signal(self,'duration',{duration:newDuration});}
if(self.media.ready()){self.components.timedisplay.style.visibility='visible';self.media.resize(create_obj.object.presentation_width,create_obj.object.presentation_height,create_obj);}
self.media._updateTickCount();return false;},poll:500}]);};this.initialize=function(create_obj){self.media._duration=self.media.duration();self.events.queue('quicktime ready to seek',[{test:function(){ready=(self.media.ready()&&self.media.duration()>0&&(self.components.player.GetMaxTimeLoaded()/self.media.timescale())>self.components.starttime);return ready;},poll:500},{call:function(){setTimeout(function(){self.setState({"start":self.components.starttime,"end":self.components.endtime});},400);}}]);self.microformat._startUpdateDisplayTimer(create_obj);self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj);window.setTimeout(function(){self.media.play();},200);});};this.deinitialize=function(){self.events.clearTimers();if(self.media.isPlaying()){self.media.pause();}
if(self.components.timedisplay){self.components.timedisplay.style.display='none';}};this.media.duration=function(){var duration=0;try{if(self.components.player&&typeof self.components.player.GetDuration!='undefined'){var frame_duration=self.components.player.GetDuration();if(frame_duration<2147483647){duration=frame_duration/self.media.timescale();}}}catch(e){}
return duration;};this.media.pause=function(){if(self.components.player)
self.components.player.Stop();};this.media.play=function(){if(self.media.ready()){if(!self.media.swapPoster()){self.components.player.Play();}}else{self.events.queue('qt play',[{test:self.media.ready,poll:100},{call:self.media.play}]);}};this.media.swapPoster=function(){var p=self.components.player;var mimetype='';try{mimetype=p.GetMIMEType();}catch(e){}
var href=p.GetHREF();if(href&&!self._played&&/image/.test(mimetype)){p.SetURL(href);p.SetHREF('');self._played=true;return true;}else{return false;}};this.media.isPlaying=function(){var playing=false;try{playing=(self.components.player&&self.components.player.GetRate&&self.components.player.GetRate()>0);}catch(e){}
return playing;};this.media.ready=function(){var status;try{var p=self.components.player;if(p&&typeof p.GetPluginStatus!='undefined'){status=p.GetPluginStatus();}}catch(e){}
return(status=='Playable'||status=='Complete');};this.media.seek=function(starttime,endtime,autoplay){if(self.media.ready()){var p=self.components.player;if(starttime!==undefined){playRate=p.GetRate();if(playRate>0)
p.Stop();try{p.SetTime(starttime*self.media.timescale());}catch(e){}
if(autoplay||self.components.autoplay||playRate!==0){p.Play();}}
if(endtime){self.media.pauseAt(endtime);}}
self.components.starttime=starttime;self.components.endtime=endtime;};this.media.time=function(){var time=0;try{time=self.components.player.GetTime()/self.media.timescale();}catch(e){}
return time;};this.media.timescale=function(){var timescale=1;try{timescale=self.components.player.GetTimeScale();}catch(e){}
return timescale;};this.media.timestrip=function(){var w=self.components.player.width;return{w:w,trackX:40,trackWidth:w-92,visible:true};};this.media.isStreaming=function(){var url=self.components.player.GetURL();return(url&&/^rtsp/.test(url));};this.media.url=function(){return self.components.player.GetURL();};this.media._updateTickCount=function(){if(typeof self.components.player.GetRate!='undefined'&&self.components.player.GetRate()>0){self.components.elapsed.innerHTML=self.secondsToCode(self.media.time());}};this.media.resize=function(w,h,obj){if(!self.debug)return;var p=self.components.player;if(typeof p.SetRectangle!='undefined'){p.SetRectangle("0,0,"+w+","+h);}};};var conformProportions=function(mymovie,w,h){if(true)return;var cur_wh=mymovie.GetRectangle().split(',');oldW=parseInt(cur_wh[2],10)-parseInt(cur_wh[0],10);oldH=parseInt(cur_wh[3],10)-parseInt(cur_wh[1],10);var newH=w*oldH/oldW;mymovie.SetRectangle("0,0,"+w+","+newH);matrix=mymovie.GetMatrix().split(',');matrix[5]=Math.round(h-newH);mymovie.SetMatrix(matrix.join(','));};}
if(typeof Sherd=='undefined'){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Helpers){Sherd.Video.secondsToCode=function(seconds){var tc={};intTime=Math.floor(seconds);tc.hr=parseInt(intTime/3600,10);tc.min=parseInt((intTime%3600)/60,10);tc.sec=intTime%60;tc.fraction=seconds-intTime;if(tc.hr<10){tc.hr="0"+tc.hr;}
if(tc.min<10){tc.min="0"+tc.min;}
if(tc.sec<10){tc.sec="0"+tc.sec;}
return tc.hr+":"+tc.min+":"+tc.sec;};Sherd.Video.codeToSeconds=function(code){var mvscale=1;var t=code.split(':');var x=t.pop();var seconds=0;if(x.indexOf('.')>=0){x=parseInt(t.pop(),10);}
var timeUnits=1;while(x||t.length>0){seconds+=x*timeUnits*mvscale;timeUnits*=60;x=parseInt(t.pop(),10);}
return seconds;};Sherd.Video.Helpers=function(){this.secondsToCode=Sherd.Video.secondsToCode;this.codeToSeconds=Sherd.Video.codeToSeconds;};}
if(!Sherd.Video.Base){var noop=function(){};var unimplemented=function(){throw Error('unimplemented');};Sherd.Video.Base=function(options){var self=this;Sherd.Video.Helpers.apply(this,arguments);Sherd.Base.AssetView.apply(this,arguments);this.queryformat={find:function(str){var start_point=String(str).match(/start=([.\d]+)/);if(start_point!==null){var start=Number(start_point[1]);if(!isNaN(start)){return[{start:start}];}}
var videofragment=String(str).match(/t=([.\d]+)?,?([.\d]+)?/);if(videofragment!==null){var ann={start:Number(videofragment[1])||0,end:Number(videofragment[2])||undefined}
return[ann];}
return[];}};this.microformat={create:function(obj){return'';},components:unimplemented,find:function(html_dom){return[{html:html_dom}];},read:function(found_obj){var obj;return obj;},supports:function(){return[];},type:function(){var type;return type;},update:function(obj,html_dom){}};this.initialize=function(){};this.deinitialize=function(){if(self.media.isPlaying()){self.media.pause();}
self.events.clearTimers();};this.media={duration:unimplemented,pause:unimplemented,pauseAt:function(endtime){if(endtime){name=self.microformat.type()+' pause';self.events.killTimer(name);self.events.queue(name,[{test:function(){return self.media.time()>=endtime;},poll:500},{call:function(){self.media.pause();}}]);}},play:unimplemented,playAt:function(starttime){self.media.seek(starttime,false,true);},isPlaying:function(){return false;},seek:unimplemented,ready:unimplemented,time:unimplemented,timescale:function(){return 1;},timeCode:function(){return self.secondsToCode(self.media.time());},timeStrip:unimplemented};this.play=function(){this.media.play();};this.getState=function(){var state={};state['start']=self.media.time();state['default']=(!state.start);state['duration']=self.media.duration();state['timeScale']=self.media.timescale();return state;};this.setState=function(obj,options){if(typeof obj=='object'){if(obj===null)
this.media.seek(0,0.1);else
this.media.seek(obj.start,obj.end,(options&&options.autoplay||false));}};if(!this.events){this.events={};}
this.events._timers={};this.events.registerTimer=function(name,timeoutID){this._timers[name]=timeoutID;};this.events.killTimer=function(name){if(this._timers[name]){window.clearTimeout(this._timers[name]);delete this._timers[name];return true;}else{return false;}};this.events.clearTimers=function(){for(var name in this._timers){window.clearTimeout(this._timers[name]);}
this._timers={};};this.events.queue=function queue(name,plan){var current=-1;if(plan.length){var next;var cur;var pollID;var timeoutID;var advance=function(){if(pollID)
window.clearTimeout(pollID);if(timeoutID)
window.clearTimeout(timeoutID);++current;if(plan.length>current){cur=plan[current];next();}};next=function(){var fired=false;var curself=(cur.self)?cur.self:this;try{if(cur.call)
cur.call.apply(curself);}catch(e){if(cur.log)
cur.log.apply(curself,[e,'call failed']);}
function go(){if(fired){advance();return;}
var v=null;var rv=true;var data=(typeof cur.data!='undefined')?cur.data:'';try{if(cur.check)
v=cur.check.apply(curself,[data]);if(cur.test){rv=cur.test.apply(curself,[v,data]);}
if(cur.log)
cur.log.apply(curself,[[v,rv,data]]);if(rv){if(cur.callback){cur.callback.apply(curself,[rv,data]);}
fired=true;advance();}else if(cur.poll)
pollID=window.setTimeout(arguments.callee,cur.poll);}catch(e){if(cur.poll)
pollID=window.setTimeout(arguments.callee,cur.poll);if(cur.log)
cur.log.apply(curself,[e,data]);}
self.events.registerTimer(name,pollID);}
if(cur.check||cur.poll||cur.test){pollID=window.setTimeout(go,0);self.events.registerTimer(name,pollID);}else{advance();}
if(cur.timeout){timeoutID=window.setTimeout(function(){fired=true;advance();},cur.timeout);self.events.registerTimer(name+'timeout',timeoutID);}};advance();}};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Kaltura&&Sherd.Video.Base){Sherd.Video.Kaltura=function(){var self=this;Sherd.Video.Base.apply(this,arguments);this.presentations={'small':{width:function(){return 310;},height:function(){return 220;}},'medium':{width:function(){return 540;},height:function(){return 383;}},'default':{width:function(){return 620;},height:function(){return 440;}}};this.microformat.create=function(obj){var wrapperID=Sherd.Base.newID('Kaltura-wrapper-');var playerID=Sherd.Base.newID('Kaltura_player_');var autoplay=obj.autoplay?1:0;self.media._ready=false;if(!obj.options)
{var presentation;switch(typeof obj.presentation){case'string':presentation=self.presentations[obj.presentation];break;case'object':presentation=obj.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
obj.options={width:presentation.width(),height:presentation.height()};}
var url;var idx=obj.Kaltura.indexOf('?');if(idx>-1){url=obj.Kaltura.substr(0,idx);}else{url=obj.Kaltura;}
var objectID='';var embedID='';if(window.navigator.userAgent.indexOf("MSIE")>-1){objectID='id="'+playerID+'"';}else{embedID='id="'+playerID+'"';}
return{object:obj,htmlID:wrapperID,playerID:playerID,autoplay:autoplay,mediaUrl:url,text:'<div id="'+wrapperID+'" class="sherd-Kaltura-wrapper">'+'  <object width="'+obj.options.width+'" height="'+obj.options.height+'" '+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '+objectID+'>'+'  <param name="movie" value="'+url+'?version=3&fs=1&rel=0&egm=0&hd=0&enablejsapi=1&playerapiid='+playerID+'"></param>'+'  <param name="allowscriptaccess" value="always"/></param>'+'  <param name="autoplay" value="'+autoplay+'"></param>'+'  <param name="width" value="'+obj.options.width+'"></param>'+'  <param name="height" value="'+obj.options.height+'"></param>'+'  <param name="allowfullscreen" value="true"></param>'+'  <embed src="'+url+'?version=3&fs=1&rel=0&egm=0&hd=0&enablejsapi=1&playerapiid='+playerID+'"'+'    type="application/x-shockwave-flash"'+'    allowScriptAccess="always"'+'    autoplay="'+autoplay+'"'+'    width="'+obj.options.width+'" height="'+obj.options.height+'"'+'    allowfullscreen="true" '+embedID+'  </embed>'+'</object>'+'</div>'};};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.player=document[create_obj.playerID]||document.getElementById(create_obj.playerID);rv.autoplay=create_obj.autoplay;rv.mediaUrl=create_obj.mediaUrl;rv.playerID=create_obj.playerID;rv.presentation=create_obj.object.presentation;}
return rv;}catch(e){}
return false;};this.microformat.read=function(found_obj){var obj={};var params=found_obj.html.getElementsByTagName('param');for(var i=0;i<params.length;i++){obj[params[i].getAttribute('name')]=params[i].getAttribute('value');}
obj.mediaUrl=obj.movie;return obj;};this.microformat.type=function(){return'Kaltura';};this.microformat.update=function(obj,html_dom){if(obj.Kaltura&&document.getElementById(self.components.playerID)&&self.media.ready()){try{if(obj.Kaltura!=self.components.mediaUrl){self.components.mediaUrl=obj.Kaltura;self.components.player.cueVideoByUrl(self.components.mediaUrl,0);}
return true;}
catch(e){}}
return false;};this.initialize=function(create_obj){self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj);self.media.play();});};this.media.duration=function(){var duration=0;if(self.components.player){try{duration=self.components.player.getDuration();if(duration<0)
duration=0;}catch(e){}}
return duration;};this.media.pause=function(){if(self.components.player){try{self.components.player.pauseVideo();}catch(e){}}};this.media.play=function(){if(self.components.player){try{self.components.player.playVideo();}catch(e){}}};this.media.ready=function(){return self.media._ready;};this.media.isPlaying=function(){var playing=false;try{playing=self.media.state()==1;}catch(e){}
return playing;};this.media.seek=function(starttime,endtime,autoplay){if(self.media.ready()){if(starttime!=undefined){if(autoplay||self.components.autoplay){self.components.player.seekTo(starttime,true);}else{self.components.player.cueVideoByUrl(self.components.mediaUrl,starttime);}}
if(endtime){setTimeout(function(){self.media.pauseAt(endtime);},100);}}else{self.components.starttime=starttime;self.components.endtime=endtime;}};this.media.time=function(){var time=0;if(self.components.player){try{time=self.components.player.getCurrentTime();if(time<0)
time=0;}catch(e){}}
return time;};this.media.timestrip=function(){var w=self.components.player.width;return{w:w,trackX:3,trackWidth:w-2,visible:true};};this.media.state=function(){return self.components.player.getPlayerState();};this.media.url=function(){return self.components.player.getVideoUrl();};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Flowplayer&&Sherd.Video.Base){Sherd.Video.Flowplayer=function(){var self=this;this.state={starttime:0,endtime:0};Sherd.Video.Base.apply(this,arguments);this.presentations={'small':{width:function(){return 310;},height:function(){return 220;}},'medium':{width:function(){return 540;},height:function(){return 383;}},'default':{width:function(){return 620;},height:function(){return 440;}}};this.microformat.create=function(obj,doc){var wrapperID=Sherd.Base.newID('flowplayer-wrapper-');var playerID=Sherd.Base.newID('flowplayer-player-');var params=self.microformat._getPlayerParams(obj);if(!obj.options){var presentation;switch(typeof obj.presentation){case'string':presentation=self.presentations[obj.presentation];break;case'object':presentation=obj.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
obj.options={width:presentation.width(),height:presentation.height()};}
var create_obj={object:obj,htmlID:wrapperID,playerID:playerID,timedisplayID:'timedisplay'+playerID,currentTimeID:'currtime'+playerID,durationID:'totalcliplength'+playerID,playerParams:params,text:'<div id="timedisplay'+playerID+'" style="visibility:hidden;"><span id="currtime'+playerID+'">00:00:00</span>/<span id="totalcliplength'+playerID+'">00:00:00</span></div><div id="'+wrapperID+'" class="sherd-flowplayer-wrapper sherd-video-wrapper">'
+'<div class="sherd-flowplayer"'
+'style="display:block; width:'+obj.options.width+'px;'
+'height:'+obj.options.height+'px;" id="'+playerID+'">'
+'</div>'
+'</div>'};return create_obj;};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.width=create_obj.object.options.width;rv.playerID=create_obj.playerID;rv.mediaUrl=create_obj.playerParams.url;rv.presentation=create_obj.object.presentation;rv.autoplay=create_obj.object.autoplay?true:false;rv.timedisplay=document.getElementById(create_obj.timedisplayID);rv.elapsed=document.getElementById(create_obj.currentTimeID);rv.duration=document.getElementById(create_obj.durationID);}
return rv;}catch(e){}
return false;};this.microformat.find=function(html_dom){var found=[];var objects=((html_dom.tagName.toLowerCase()=='object')?[html_dom]:html_dom.getElementsByTagName('object'));for(var i=0;i<objects.length;i++){if(objects[i].getAttribute('id').search('flowplayer-player'))
found.push({'html':objects[i]});}
return found;};this.microformat.read=function(found_obj){var obj={};var params=found_obj.html.getElementsByTagName('param');for(var i=0;i<params.length;i++){obj[params[i].getAttribute('name')]=params[i].getAttribute('value');}
return obj;};this.microformat.type=function(){return'flowplayer';};this.microformat.update=function(obj,html_dom){rc=false;newUrl=self.microformat._getPlayerParams(obj);if(newUrl.url&&document.getElementById(self.components.playerID)&&self.media.state()>0){playlist=self.components.player.getPlaylist();if(playlist[0].url==newUrl.url){rc=true;}}
return rc;};this.microformat._getPlayerParams=function(obj){var rc={};if(obj.mp4_rtmp){var a=self.microformat._parseRtmpUrl(obj.mp4_rtmp);rc.url=a.url;rc.netConnectionUrl=a.netConnectionUrl;rc.provider='rtmp';}else if(obj.flv_rtmp){var a=self.microformat._parseRtmpUrl(obj.flv_rtmp);rc.url=a.url;rc.netConnectionUrl=a.netConnectionUrl;rc.provider='rtmp';}else if(obj.flv_pseudo){rc.url=obj.flv_pseudo;rc.provider='pseudo';}else if(obj.mp4_pseudo){rc.url=obj.mp4_pseudo;rc.provider='pseudo';}else if(obj.mp4){rc.url=obj.mp4;rc.provider='';}else if(obj.flv){rc.url=obj.flv;rc.provider='';}else if(obj.video_pseudo){rc.url=obj.video_pseudo;rc.provider='pseudo';}else if(obj.video_rtmp){var a=self.microformat._parseRtmpUrl(obj.video_rtmp);rc.url=a.url;rc.netConnectionUrl=a.netConnectionUrl;rc.provider='rtmp';}else if(obj.video){rc.url=obj.video;rc.provider='';}else if(obj.mp3){rc.url=obj.mp3;}
if(rc.provider=='pseudo'&&/\{start\}/.test(rc.url)){var pieces=rc.url.split('?');rc.queryString=escape('?'+pieces.pop());rc.url=pieces.join('?');}
return rc;};this.microformat._parseRtmpUrl=function(url){var rc={};idx=url.lastIndexOf('//');rc.netConnectionUrl=url.substring(0,idx);rc.url=url.substring(idx+2,url.length);return rc;};this.microformat._queueReadyToSeekEvent=function(){self.events.queue('flowplayer ready to seek',[{test:function(){if(self.media.state()>2){if(self.media.duration()>0){return true;}else if(self.media.isPlaying()&&self.components.player.getClip().type==='audio'){self.components.player.pause();self.components.player.play();}}
return(self.media.state()>2&&self.media.duration()>0);},poll:500},{call:function(){self.events.signal(self,'duration',{duration:self.media.duration()});self.setState({start:self.state.starttime,end:self.state.endtime});}}]);};this.initialize=function(create_obj){if(create_obj){var tracker;if(window._gat&&window._gaq_mediathread){tracker=_gat._getTracker(_gaq_mediathread);}
options={clip:{scaling:"fit",onPause:function(clip){self.state.last_pause_time=self.components.player.getTime();},onSeek:function(clip,target_time){self.state.last_pause_time=target_time;}},plugins:{pseudo:{url:'flowplayer.pseudostreaming-3.2.2.swf'},rtmp:{url:'flowplayer.rtmp-3.2.1.swf'},controls:{autoHide:false,volume:false,mute:false,time:false,fastForward:false,fullscreen:true}},playlist:[{url:create_obj.playerParams.url,autoPlay:create_obj.object.autoplay?true:false}]};if(create_obj.playerParams.provider){options.playlist[0].provider=create_obj.playerParams.provider;}
if(create_obj.playerParams.provider=='pseudo'){autoBuffering=true;if(create_obj.playerParams.queryString)
options.plugins.pseudo.queryString=create_obj.playerParams.queryString;}
if(create_obj.playerParams.provider=='rtmp'){autoBuffering=false;if(create_obj.playerParams.netConnectionUrl)
options.playlist[0].netConnectionUrl=create_obj.playerParams.netConnectionUrl;}
flowplayer(create_obj.playerID,flowplayer.swf_location||"http://releases.flowplayer.org/swf/flowplayer-3.2.2.swf",options);self.components.player=$f(create_obj.playerID);self.microformat._queueReadyToSeekEvent();self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'duration',function(obj){self.components.timedisplay.style.visibility='visible';self.components.duration.innerHTML=self.secondsToCode(obj.duration);});self.events.connect(self,'playclip',function(obj){self.components.player.seek(obj.start);setTimeout(function(){if(!self.media.isPlaying())self.media.play();if(obj.end)self.media.pauseAt(obj.end);},750);});self.events.queue('tick count',[{test:function(){self.components.elapsed.innerHTML=self.secondsToCode(self.media.time());},poll:1000}]);}};this.media.duration=function(){duration=0;if(self.components.player&&self.components.player.isLoaded()){fullDuration=self.components.player.getPlaylist()[0].fullDuration;if(fullDuration)
duration=fullDuration;}
return duration;};this.media.pause=function(){if(self.components.player)
self.components.player.pause();};this.media.play=function(){if(self.components.player){self.components.player.play();}};this.media.isPlaying=function(){var playing=false;try{playing=(self.media.state()==3);}catch(e){}
return playing;};this.media.ready=function(){ready=false;try{ready=self.media.state()>2;}catch(e){}
return ready;};this.media.seek=function(starttime,endtime,autoplay){if(!self.media.ready()){self.state.starttime=starttime;self.state.endtime=endtime;}else{if(starttime!==undefined){self.components.player.seek(starttime);}
if(endtime){self.media.pauseAt(endtime);}
delete self.state.starttime;delete self.state.endtime;if((autoplay||self.components.autoplay)&&self.media.state()!=3){setTimeout(function(){self.media.play();},100);}}};this.media.time=function(){var time=((self.media.isPlaying())?self.components.player.getTime():self.state.last_pause_time||0);if(time<1)
time=0;return time;};this.media.timestrip=function(){var w=self.components.width;return{w:w,trackX:43,trackWidth:w-85,visible:true};};this.media.state=function(){return((self.components.player)?self.components.player.getState():-1);};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.YouTube){Sherd.Video.YouTube=function(){var self=this;Sherd.Video.Base.apply(this,arguments);this.presentations={'small':{width:function(){return 310;},height:function(){return 220;}},'medium':{width:function(){return 540;},height:function(){return 383;}},'default':{width:function(){return 620;},height:function(){return 440;}}};this.microformat.create=function(obj){var wrapperID=Sherd.Base.newID('youtube-wrapper-');var playerID=Sherd.Base.newID('youtube_player_');var autoplay=obj.autoplay?1:0;self.media._ready=false;if(!obj.options)
{var presentation;switch(typeof obj.presentation){case'string':presentation=self.presentations[obj.presentation];break;case'object':presentation=obj.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
obj.options={width:presentation.width(),height:presentation.height()};}
var url;var idx=obj.youtube.indexOf('?');if(idx>-1){url=obj.youtube.substr(0,idx);}else{url=obj.youtube;}
var objectID='';var embedID='';if(window.navigator.userAgent.indexOf("MSIE")>-1){objectID='id="'+playerID+'"';}else{embedID='id="'+playerID+'"';}
return{object:obj,htmlID:wrapperID,playerID:playerID,autoplay:autoplay,mediaUrl:url,text:'<div id="'+wrapperID+'" class="sherd-youtube-wrapper">'+'  <object width="'+obj.options.width+'" height="'+obj.options.height+'" '+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '+objectID+'>'+'  <param name="movie" value="'+url+'?version=3&fs=1&rel=0&egm=0&hd=0&showinfo=0&probably_logged_in=0&modestbranding=1&enablejsapi=1&playerapiid='+playerID+'"></param>'+'  <param name="allowscriptaccess" value="always"/></param>'+'  <param name="autoplay" value="'+autoplay+'"></param>'+'  <param name="width" value="'+obj.options.width+'"></param>'+'  <param name="height" value="'+obj.options.height+'"></param>'+'  <param name="allowfullscreen" value="true"></param>'+'  <embed src="'+url+'?version=3&fs=1&rel=0&egm=0&hd=0&showinfo=0&probably_logged_in=0&modestbranding=1&enablejsapi=1&playerapiid='+playerID+'"'+'    type="application/x-shockwave-flash"'+'    allowScriptAccess="always"'+'    autoplay="'+autoplay+'"'+'    width="'+obj.options.width+'" height="'+obj.options.height+'"'+'    allowfullscreen="true" '+embedID+'  </embed>'+'</object>'+'</div>'};};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.player=document[create_obj.playerID]||document.getElementById(create_obj.playerID);rv.autoplay=create_obj.autoplay;rv.mediaUrl=create_obj.mediaUrl;rv.playerID=create_obj.playerID;rv.presentation=create_obj.object.presentation;}
return rv;}catch(e){}
return false;};this.microformat.read=function(found_obj){var obj={};var params=found_obj.html.getElementsByTagName('param');for(var i=0;i<params.length;i++){obj[params[i].getAttribute('name')]=params[i].getAttribute('value');}
obj.mediaUrl=obj.movie;return obj;};this.microformat.type=function(){return'youtube';};this.microformat.update=function(obj,html_dom){if(obj.youtube&&document.getElementById(self.components.playerID)&&self.media.ready()){try{if(obj.youtube!=self.components.mediaUrl){self.components.mediaUrl=obj.youtube;self.components.player.cueVideoByUrl(self.components.mediaUrl,0);}
return true;}
catch(e){}}
return false;};this.initialize=function(create_obj){self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj);self.media.play();});};window.onYouTubePlayerReady=function(playerID){if(unescape(playerID)==self.components.playerID){self.media._ready=true;self.setState({start:self.components.starttime,end:self.components.endtime});self.components.player.addEventListener("onStateChange",'onYTStateChange');}};window.onYTStateChange=function(newState){switch(newState){case 1:var duration=self.media.duration();if(duration>1){self.events.signal(self,'duration',{duration:duration});}
break;case 2:break;case 0:self.events.clearTimers();break;}};this.media.duration=function(){var duration=0;if(self.components.player){try{duration=self.components.player.getDuration();if(duration<0)
duration=0;}catch(e){}}
return duration;};this.media.pause=function(){if(self.components.player){try{self.components.player.pauseVideo();}catch(e){}}};this.media.play=function(){if(self.components.player){try{self.components.player.playVideo();}catch(e){}}};this.media.ready=function(){return self.media._ready;};this.media.isPlaying=function(){var playing=false;try{playing=self.media.state()==1;}catch(e){}
return playing;};this.media.seek=function(starttime,endtime,autoplay){if(self.media.ready()){if(starttime!==undefined){if(autoplay||self.components.autoplay){self.components.player.seekTo(starttime,true);}else{self.components.player.cueVideoByUrl(self.components.mediaUrl,starttime);}}
if(endtime){setTimeout(function(){self.media.pauseAt(endtime);},100);}}else{self.components.starttime=starttime;self.components.endtime=endtime;}};this.media.time=function(){var time=0;if(self.components.player){try{time=self.components.player.getCurrentTime();if(time<0)
time=0;}catch(e){}}
return time;};this.media.timestrip=function(){var w=self.components.player.width;return{w:w,trackX:3,trackWidth:w-2,visible:true};};this.media.state=function(){return self.components.player.getPlayerState();};this.media.url=function(){return self.components.player.getVideoUrl();};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Annotators){Sherd.Video.Annotators={};}
if(!Sherd.Video.Annotators.ClipForm){Sherd.Video.Annotators.ClipForm=function(){var secondsToCode=Sherd.Video.secondsToCode;var codeToSeconds=Sherd.Video.codeToSeconds;var self=this;Sherd.Base.AssetView.apply(this,arguments);this.attachView=function(view){this.targetview=view;};this.targetstorage=[];this.addStorage=function(stor){this.targetstorage.push(stor);};this.getState=function(){var duration=self.targetview.media.duration();var timeScale=self.targetview.media.timescale();var obj={'startCode':self.components.startField.value,'endCode':self.components.endField.value,'duration':duration,'timeScale':timeScale,'start':codeToSeconds(self.components.startField.value),'end':codeToSeconds(self.components.endField.value)};return obj;};this.setState=function(obj,options){if(typeof obj=='object'){if(obj==null){obj={};obj.start=0;obj.end=0;}
self.showForm();var start;if(obj.startCode){start=obj.startCode;}else if(obj.start!==undefined){start=secondsToCode(obj.start);}
var end;if(obj.endCode){end=obj.endCode;}else if(obj.end!=undefined){end=secondsToCode(obj.end);}else if(start){end=start;}
if(start!==undefined){if(self.components.startField)
self.components.startField.value=start;if(self.components.startFieldDisplay)
self.components.startFieldDisplay.innerHTML=start;self.components.start=start;self.events.signal(self.targetview,'clipstart',{start:codeToSeconds(start)});}
if(end!==undefined){if(self.components.endField)
self.components.endField.value=end;if(self.components.endFieldDisplay)
self.components.endFieldDisplay.innerHTML=end;self.components.end=end;self.events.signal(self.targetview,'clipend',{end:codeToSeconds(end)});}
if(options.mode=="browse"){if(self.components.startField)
self.components.startField.disabled=true;if(self.components.endField)
self.components.endField.disabled=true;if(self.components.startButton)
self.components.startButton.disabled=true;if(self.components.endButton)
self.components.endButton.disabled=true;if(self.components.clipcontrols){self.components.clipcontrols.style.display="none";self.components.clipcontrols_readonly.style.display="inline";}
if(self.components.instructions)
self.components.instructions.style.display="none";}else{if(self.components.startField)
self.components.startField.disabled=false;if(self.components.endField)
self.components.endField.disabled=false;if(self.components.startButton)
self.components.startButton.disabled=false;if(self.components.endButton)
self.components.endButton.disabled=false;if(self.components.clipcontrols){self.components.clipcontrols.style.display="inline";self.components.clipcontrols_readonly.style.display="none";}
if(self.components.instructions)
self.components.instructions.style.display="block";}}};this.storage={update:function(obj,just_downstream){if(!just_downstream){self.setState(obj);}
if(self.targetstorage){for(var i=0;i<self.targetstorage.length;i++){self.targetstorage[i].storage.update(obj);}}}};this.initialize=function(create_obj){self.events.connect(self.components.startButton,'click',function(evt){var movieTime=self.targetview.media.time();var movieTimeCode=secondsToCode(movieTime);self.components.startField.value=movieTimeCode;if(movieTime>codeToSeconds(self.components.endField.value)){self.components.endField.value=movieTimeCode;}
self.storage.update(self.getState(),false);});self.events.connect(self.components.endButton,'click',function(evt){if(self.targetview.media.pause){self.targetview.media.pause();}
var movieTime=self.targetview.media.time();var movieTimeCode=secondsToCode(movieTime);self.components.endField.value=movieTimeCode;if(movieTime<codeToSeconds(self.components.startField.value))
self.components.startField.value=movieTimeCode;self.storage.update(self.getState(),false);});self.events.connect(self.components.startField,'change',function(evt){var obj=self.getState();if(obj.end<obj.start){obj.end=obj.start;obj.endCode=obj.startCode;self.components.endField.value=obj.startCode;}
self.storage.update(obj,false);});self.events.connect(self.components.endField,'change',function(evt){var obj=self.getState();if(obj.end<obj.start){obj.start=obj.end;obj.startCode=obj.endCode;self.components.startField.value=obj.endCode;}
self.storage.update(obj,false);});self.events.connect(self.components.playClip,'click',function(evt){var obj=self.getState();self.events.signal(self.targetview,'playclip',{start:obj.start,end:obj.end});});self.events.connect(self.components.playClip2,'click',function(evt){var obj=self.getState();self.events.signal(self.targetview,'playclip',{start:obj.start,end:obj.end});});};this.showForm=function(){if(self.components.form)
self.components.form.style.display="inline";};this.hideForm=function(){if(self.components.form)
self.components.form.style.display="none";};this.microformat.create=function(obj){var htmlID='clipform';return{htmlID:htmlID,text:'<div id="'+htmlID+'" style="display: none">'
+'<div id="clipcontrols" class="sherd-clipform">'
+'<p id="instructions" class="sherd-instructions">Create a selection by clicking Start Time and End Time buttons as the video plays or by manually typing in times in the associated edit boxes. Add title, tags and notes. Click Save when you are finished.</p><br />'
+'<div class="cliptimeboxtable">'
+'<table>'
+'<tr class="sherd-clipform-editing">'
+'<td>'
+'<input type="button" class="regButton" value="start time" id="btnClipStart"/> '
+'</td>'
+'<td width="10px">&nbsp;</td>'
+'<td>'
+'<input type="button" class="regButton" value="end time" id="btnClipEnd"/> '
+'</td>'
+'<td>&nbsp;</td>'
+'</tr>'
+'<tr class="sherd-clipform-editing">'
+'<td>'
+'<input type="text" class="timecode" id="clipStart" value="'+self.components.start+'" />'
+'</td>'
+'<td width="10px">-</td>'
+'<td>'
+'<input type="text" class="timecode" id="clipEnd" value="'+self.components.end+'" />'
+'</td>'
+'<td class="sherd-clipform-play"><input type="button" class="regButton videoplay" value="Play Selection" id="btnPlayClip"/></td>'
+'</tr>'
+'</table>'
+'</div>'
+'</div>'
+'<div id="clipcontrols_readonly" class="sherd-clipform">'
+'<span id="clipStartDisplay">'+self.components.start+'</span> - <span id="clipEndDisplay">'+self.components.end+'</span>&nbsp;&nbsp;&nbsp;<input type="button" class="regButton videoplay" value="Play Selection" id="btnPlayClip2"/>'
+'</div>'
+''
+'</div>'};};this.microformat.components=function(html_dom,create_obj)
{return{'form':html_dom,'startButton':document.getElementById('btnClipStart'),'endButton':document.getElementById('btnClipEnd'),'startField':document.getElementById('clipStart'),'endField':document.getElementById('clipEnd'),'startFieldDisplay':document.getElementById('clipStartDisplay'),'endFieldDisplay':document.getElementById('clipEndDisplay'),'playClip':document.getElementById('btnPlayClip'),'playClip2':document.getElementById('btnPlayClip2'),'clipcontrols':document.getElementById('clipcontrols'),'clipcontrols_readonly':document.getElementById('clipcontrols_readonly'),'instructions':document.getElementById('instructions'),'start':"00:00:00",'end':"00:00:00"};};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Videotag){Sherd.Video.Videotag=function(){var self=this;Sherd.Video.Base.apply(this,arguments);this.microformat.create=function(obj,doc){var wrapperID=Sherd.Base.newID('videotag-wrapper-');var playerID=Sherd.Base.newID('videotag-player-');var controllerID=Sherd.Base.newID('videotag-controller-');var supported=self.microformat._getPlayerParams(obj);if(supported){if(!obj.options){obj.options={width:(obj.presentation=='small'?320:(obj.width||480)),height:(obj.presentation=='small'?240:(obj.height||360))};}
var create_obj={object:obj,htmlID:wrapperID,playerID:playerID,text:'<div id="'+wrapperID+'" class="sherd-videotag-wrapper sherd-video-wrapper" '
+'     style="width:'+obj.options.width+'px">'
+'<video id="'+playerID+'" controls="controls"'
+((obj.poster)?' poster="'+obj.poster+'" ':'')
+'       height="'+obj.options.height+'" width="'+obj.options.width+'"'
+'       type=\''+supported.mimetype+'\''
+'       src="'+supported.url+'">'
+'</video>'
+'</div>',provider:supported.provdier};return create_obj;}};this.microformat._getPlayerParams=function(obj){var types={ogg:'video/ogg; codecs="theora, vorbis"',webm:'video/webm; codecs="vp8, vorbis"',mp4:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'};var vid=document.createElement('video');var browser_supported=[];for(var a in types){switch(vid.canPlayType(types[a])){case'probably':browser_supported.unshift(a);break;case'maybe':browser_supported.push(a);break;}}
for(var i=0;i<browser_supported.length;i++){if(obj[browser_supported[i]]){return{'provider':browser_supported[i],'url':obj[browser_supported[i]],'mimetype':types[browser_supported[i]]};}}};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){rv.player=html_dom.getElementsByTagName('video')[0];rv.width=(create_obj.options&&create_obj.options.width)||rv.player.offsetWidth;rv.mediaUrl=create_obj.object[create_obj.provider];}
return rv;}catch(e){}
return false;};this.microformat.find=function(html_dom){throw Error("unimplemented");};this.microformat.read=function(found_obj){throw Error("unimplemented");};this.microformat.type=function(){return'videotag';};this.microformat.update=function(obj,html_dom){var supported=self.microformat._getPlayerParams(obj);if(supported&&self.components.player){try{self.components.player.type=supported.mimetype;self.components.player.src=supported.url;self.components.mediaUrl=supported.url;return true;}catch(e){}}
return false;};this.initialize=function(create_obj){self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj);self.media.play();});if(self.components.player){var signal_duration=function(){self.events.signal(self,'duration',{duration:self.media.duration()});};if(self.media.duration()>0)
signal_duration();else
self.events.connect(self.components.player,'loadedmetadata',signal_duration);}};this.media.duration=function(){var duration=0;if(self.components.player)
duration=self.components.player.duration||0;return duration;};this.media.pause=function(){if(self.components.player)
self.components.player.pause();};this.media.play=function(){if(self.components.player)
self.components.player.play();};this.media.isPlaying=function(){return(self.components.player&&!self.components.player.paused);};this.media.ready=function(){return(self.components.player&&self.components.player.readyState>2);};this.media.seek=function(starttime,endtime,autoplay){if(self.components.player){var c,d={};var _seek=function(evt){if(starttime!==undefined){try{self.components.player.currentTime=starttime;if(d.disconnect)d.disconnect();}catch(e){return{error:true};}}
if(endtime)
self.media.pauseAt(endtime);if(autoplay||self.components.autoplay)
self.media.play();return{};};if(_seek().error){var progress_triggers=0;d=self.events.connect(self.components.player,'progress',function(evt){progress_triggers=1;_seek(evt);});c=self.events.connect(self.components.player,'canplaythrough',function(evt){if(progress_triggers==1){c.disconnect();}else{if(!(progress_triggers--))d.disconnect();d=c;_seek(evt);}});}}};this.media.time=function(){return(!self.components.player||self.components.player.currentTime);};this.media.timescale=function(){return 1;};this.media.timestrip=function(){var w=self.components.player.width;return{w:w,trackX:40,trackWidth:w-140,visible:true};};this.media.isStreaming=function(){return false;};this.media.url=function(){return self.components.mediaUrl;};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.RealPlayer&&Sherd.Video.Base){Sherd.Video.RealPlayer=function(){var self=this;Sherd.Video.Base.apply(this,arguments);this.microformat.create=function(obj,doc){var wrapperID=Sherd.Base.newID('realplayer-wrapper-');var playerID=Sherd.Base.newID('realplayer-player-');var controllerID=Sherd.Base.newID('realplayer-controller-');var console='Console'+playerID;if(!obj.options){obj.options={width:(obj.presentation=='small'?320:(obj.width||480)),height:(obj.presentation=='small'?240:(obj.height||360))};}
var create_obj={object:obj,htmlID:wrapperID,playerID:playerID,currentTimeID:'currtime'+playerID,durationID:'totalcliplength'+playerID,text:'<div id="'+wrapperID+'" class="sherd-flowplayer-wrapper" '
+'     style="width:'+obj.options.width+'px">'
+'<object id="'+playerID+'" classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"'
+'        height="'+obj.options.height+'" width="'+obj.options.width+'">'
+'<param name="CONTROLS" value="ImageWindow">'
+'<param name="AUTOSTART" value="'+obj.autoplay+'">'
+'<param name="CONSOLE" value="'+console+'">'
+'<param name="SRC" value="'+obj.realplayer+'">'
+'<embed height="'+obj.options.height+'" width="'+obj.options.width+'"'
+'       NOJAVA="true" console="'+console+'" '
+'  controls="ImageWindow" '
+'  src="'+obj.realplayer+'" '
+'  type="audio/x-pn-realaudio-plugin" '
+'  autostart="'+obj.autoplay+'" > '
+'</embed>'
+'</object>'
+'<object id="'+controllerID+'" classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"'
+'        height="36" width="'+obj.options.width+'">'
+'<param name="CONTROLS" value="ControlPanel">'
+'<param name="CONSOLE" value="'+console+'">'
+'<embed src="'+obj.realplayer+'" type="audio/x-pn-realaudio-plugin" controls="ControlPanel" '
+'    console="'+console+'" '
+'    width="'+obj.options.width+'" '
+'    height="36">'
+'</embed>'
+'</object>'
+'<div class="time-display"><span id="currtime'+playerID+'">00:00:00</span>/<span id="totalcliplength'+playerID+'">00:00:00</span></div>'
+'</div>'};return create_obj;};this.microformat.components=function(html_dom,create_obj){try{var rv={};if(html_dom){rv.wrapper=html_dom;}
if(create_obj){var objs=html_dom.getElementsByTagName('object');var embs=html_dom.getElementsByTagName('embed');if(embs.length){rv.player=rv.playerNetscape=embs[0];rv.controllerNetscape=embs[1];}else{rv.player=rv.playerIE=objs[0];rv.controllerIE=objs[1];}
rv.width=(create_obj.options&&create_obj.options.width)||rv.player.offsetWidth;rv.mediaUrl=create_obj.realplayer;rv.duration=document.getElementById(create_obj.durationID);rv.elapsed=document.getElementById(create_obj.currentTimeID);}
return rv;}catch(e){}
return false;};this.microformat.find=function(html_dom){throw Error("unimplemented");};this.microformat.read=function(found_obj){throw Error("unimplemented");};this.microformat.type=function(){return'realplayer';};this.microformat.update=function(obj,html_dom){return false;};this.initialize=function(create_obj){self.events.connect(self,'seek',self.media.playAt);self.events.connect(self,'playclip',function(obj){self.setState(obj,{autoplay:true});self.media.play();});self.events.queue('realplayer tick-tock',[{poll:1000,test:function(){self.components.duration.innerHTML=self.secondsToCode(self.media.duration());self.components.elapsed.innerHTML=self.secondsToCode(self.media.time());}}]);};this.deinitialize=function(){};this.media.duration=function(){var duration=0;try{if(self.components.player&&typeof self.components.player.GetLength!='undefined'){duration=self.components.player.GetLength()/1000;self.events.signal(self,'duration',{duration:duration});}}catch(e){}
return duration;};this.media.pause=function(){if(self.components.player)
self.components.player.DoPause();};this.media.play=function(){if(self.media.ready()){self.components.player.DoPlay();}else{self.events.queue('real play',[{test:self.media.ready,poll:100},{call:self.media.play}]);}};this.media.isPlaying=function(){var playing=false;try{playing=(self.components.player&&self.components.player.GetPlayState&&self.components.player.GetPlayState()==3);}catch(e){}
return playing;};this.media.ready=function(){var status;try{var p=self.components.player;return(p&&typeof p.GetPlayState!='undefined');}catch(e){return false;}};this.media.seekable=function(){try{var s=self.components.player.GetPlayState();return(self.media.ready()&&s>1&&s<5);}catch(e){return false;}};var seek_last=0;this.media.seek=function(starttime,endtime,play){var my_seek=++seek_last;var p=self.components.player;if(self.media.seekable()){if(starttime!==undefined){p.SetPosition(starttime*1000);if(play)self.media.play();}
if(endtime){self.media.pauseAt(endtime);}}else{self.events.queue('realplayer ready to seek',[{poll:500,test:self.media.seekable},{test:function(){return(seek_last==my_seek);}},{call:function(){self.media.seek(starttime,endtime,play);}}]);}
self.components.starttime=starttime;self.components.endtime=endtime;};this.media.time=function(){var time=0;try{time=self.components.player.GetPosition()/1000;}catch(e){}
return time;};this.media.timescale=function(){return 1;};this.media.timestrip=function(){var w=self.components.player.width;return{w:w,trackX:110,trackWidth:w-220,visible:true};};this.media.isStreaming=function(){return true;};this.media.url=function(){throw Error("unimplemented function media.url");};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Annotators){Sherd.Video.Annotators={};}
if(!Sherd.Video.Annotators.ClipStrip){Sherd.Video.Annotators.ClipStrip=function(){var self=this;var CLIP_MARKER_WIDTH=7;Sherd.Video.Base.apply(this,arguments);this.attachView=function(view){this.targetview=view;self.events.connect(view,'duration',self.setClipDuration);self.events.connect(view,'clipstart',self.setClipStart);self.events.connect(view,'clipend',self.setClipEnd);};this.getState=function(){var obj={};obj.starttime=self.components.starttime;obj.endtime=self.components.endtime;obj.duration=self.components.duration;obj.timestrip=self.components.timestrip;return obj;};this.setState=function(obj){if(typeof obj=='object'){var c=self.components;if(obj===null){c.starttime=c.endtime=c.duration=0;}else{c.starttime=obj.start||0;c.endtime=obj.end||c.starttime;if(obj.duration>1){c.duration=obj.duration;self.microformat._resize();}else{self.events.queue('quicktime has duration',[{test:function(){return self.targetview.media.duration();},poll:500},{call:function(){c.duration=self.targetview.media.duration();self.microformat._resize();}}]);}}
return true;}};this.setClipDuration=function(obj){if(obj.duration>1){self.components.duration=obj.duration;self.microformat._resize();}};this.setClipStart=function(obj){if(typeof obj.start!='undefined'&&self.components.duration){self.components.starttime=obj.start;self.microformat._resize();}};this.setClipEnd=function(obj){if(obj.end!==undefined&&self.components.duration){self.components.endtime=obj.end;self.microformat._resize();}};this.initialize=function(create_obj){self.events.connect(self.components.clipStartMarker,'click',function(evt){self.events.signal(self.targetview,'seek',self.components.starttime);});self.events.connect(self.components.clipEndMarker,'click',function(evt){self.events.signal(self.targetview,'seek',self.components.endtime);});self.events.connect(self.components.clipRange,'click',function(evt){var obj=self.getState();self.events.signal(self.targetview,'playclip',{start:obj.starttime,end:obj.endtime});});self.microformat._resize();};this.microformat.create=function(obj){var htmlID='clipStrip';timestrip=self.targetview.media.timestrip();return{htmlID:htmlID,timestrip:timestrip,text:'<div id="clipStrip" style="width: '+timestrip.w+'px">'
+'<div id="clipStripTrack"  style="width: '+timestrip.trackWidth+'px; left: '+timestrip.trackX+'px">'
+'<div id="clipStripStart" class="clipSlider" onmouseover="return escape(\'Go to note start time\')" style="display:none"></div>'
+'<div id="clipStripRange" class="clipStripRange" style="display:none"></div>'
+'<div id="clipStripEnd" class="noteStripEnd" onmouseover="return escape(\'Go to note end time\')" style="display:none"></div>'
+'</div>'
+'</div>'};};this.microformat.components=function(html_dom,create_obj){try{return{clipStrip:document.getElementById('clipStrip'),clipStartMarker:document.getElementById('clipStripStart'),clipRange:document.getElementById('clipStripRange'),clipEndMarker:document.getElementById('clipStripEnd'),timestrip:create_obj.timestrip,starttime:0,endtime:0,duration:0,layers:{}};}catch(e){}
return false;};this.microformat._resize=function(){left=self.microformat._timeToPixels(self.components.starttime,self.components.duration,self.components.timestrip.trackWidth);right=self.microformat._timeToPixels(self.components.endtime,self.components.duration,self.components.timestrip.trackWidth);width=right-left;if(width<0)width=0;self.components.clipStartMarker.style.left=(left-CLIP_MARKER_WIDTH)+'px';self.components.clipEndMarker.style.left=right+'px';self.components.clipRange.style.left=left+"px";self.components.clipRange.style.width=width+'px';self.components.clipStartMarker.style.display='block';self.components.clipRange.style.display='block';self.components.clipEndMarker.style.display='block';for(var layerName in self.components.layers){var layer=self.components.layers[layerName];for(var annotationName in layer._anns){var annotation=layer._anns[annotationName];left=self.microformat._timeToPixels(annotation.starttime,self.components.duration,self.components.timestrip.trackWidth);right=self.microformat._timeToPixels(annotation.endtime,self.components.duration,self.components.timestrip.trackWidth);width=(right-left);if(width<0)width=0;jQuery("#"+annotation.htmlID).css("left",left);jQuery("#"+annotation.htmlID).css("width",width);}}};this.microformat._timeToPixels=function(seconds,duration,width){if(duration>0){var ratio=width/duration;return ratio*seconds;}else{return 0;}};this.Layer=function(){};this.Layer.prototype={create:function(name,opts){this.name=name;this.htmlID='clipStripLayer_'+name;this.title=(opts&&opts['title'])||this.name;this._anns={};var html='<div class="clipStripLayerContainer" id="'+this.htmlID+'" style="z-index:'+opts.zIndex+'">'
+'<div class="clipStripLayerTitle" style="left: '+(self.components.timestrip.trackX-98)+'px">'+this.title+'&nbsp;</div>'
+'<div class="clipStripLayer"'
+' style="left: '+self.components.timestrip.trackX+'px; '
+' width: '+self.components.timestrip.trackWidth+'px;">'
+'</div>'
+'</div>';var inserted=false;if(opts.zIndex!==undefined){jQuery(".clipStripLayerContainer").each(function(index,value){var zindex=jQuery(this).css("z-index");if((zindex&&opts.zIndex>zindex)||(zindex===undefined||zindex==="auto")){jQuery(this).before(html);inserted=true;return false;}});}
if(!inserted)
jQuery("#"+self.components.clipStrip.id).append(html);self.components.layers[name]=this;if(opts.onmouseenter)
self.onmouseenter=opts.onmouseenter;if(opts.onmouseleave)
self.onmouseleave=opts.onmouseleave;if(opts.onclick)
self.onclick=opts.onclick;return this;},destroy:function(){this.removeAll();jQuery("#"+this.htmlID).remove();delete self.components.layers[name];},add:function(ann,opts){if(ann.duration!==undefined&&ann.duration>1&&self.components.duration<1)
self.components.duration=ann.duration;this._anns[opts.id]={starttime:ann.start,endtime:ann.end,htmlID:this.name+'_annotation_'+opts.id,duration:ann.duration};jQuery("#"+this.htmlID).children(".clipStripLayer").append('<div class="annotationLayer" id="'+this._anns[opts.id].htmlID+'"></div>');if(opts.color)
jQuery("#"+this._anns[opts.id].htmlID).css("background-color",opts.color);jQuery("#"+this._anns[opts.id].htmlID).hover(function enter(){if(self.onmouseenter){self.onmouseenter(opts.id,this.name);}},function leave(){if(self.onmouseleave){self.onmouseleave(opts.id,this.name);}});jQuery("#"+this._anns[opts.id].htmlID).click(function(){if(self.onclick){self.onclick(opts.id,this.name);}});self.microformat._resize();},remove:function(ann_id){if(ann_id in this._anns){jQuery("#"+this._anns[ann_id].htmlID).remove();delete this._anns[ann_id];}},removeAll:function(){for(var ann_id in this._anns){this.remove(ann_id);delete this._anns[ann_id];}},show:function(){jQuery("#"+this.htmlID).show();},hide:function(){jQuery("#"+this.htmlID).hide();}};};}
if(!Sherd){Sherd={};}
if(!Sherd.Image){Sherd.Image={};}
if(!Sherd.Image.Annotators){Sherd.Image.Annotators={};}
if(!Sherd.Image.Annotators.OpenLayers){Sherd.Image.Annotators.OpenLayers=function(){var self=this;Sherd.Base.AssetView.apply(this,arguments);this.attachView=function(view){self.targetview=view;};this.targetstorage=[];this.addStorage=function(stor){this.targetstorage.push(stor);};this.getState=function(){return{};};this.setState=function(obj,options){if(typeof obj=='object'){self.mode=null;if(self.openlayers.editingtoolbar){if(!options||!options.mode||options.mode=='browse'){self.openlayers.editingtoolbar.deactivate();if(self.components.instructions)
self.components.instructions.style.display='none';self.mode="browse";}else{self.openlayers.editingtoolbar.activate();if(self.components.instructions)
self.components.instructions.style.display='block';self.mode=options.mode;}}}};this.initialize=function(create_obj){if(!self.openlayers.editingtoolbar){self.openlayers.editingtoolbar=new self.openlayers.CustomEditingToolbar(self.targetview.openlayers.vectorLayer.getLayer());self.targetview.openlayers.map.addControl(self.openlayers.editingtoolbar);self.openlayers.editingtoolbar.deactivate();OpenLayers.Control.prototype.activate.call(self.openlayers.editingtoolbar.sherd.navigation);}
self.openlayers.editingtoolbar.featureAdded=function(feature){var current_state=self.targetview.getState();var geojson=self.targetview.openlayers.feature2json(feature);for(var a in geojson){current_state[a]=geojson[a];}
geojson.preserveCurrentFocus=true;self.targetview.setState(geojson);self.storage.update(current_state);};self.events.connect(self.components.center,'click',function(evt){self.targetview.setState({feature:self.targetview.currentfeature});});};this.openlayers={CustomEditingToolbar:OpenLayers.Class(OpenLayers.Control.EditingToolbar,{initialize:function(layer,options){var self=this;OpenLayers.Control.Panel.prototype.initialize.apply(this,[options]);this.sherd={};this.sherd.navigation=new OpenLayers.Control.Navigation({autoActivate:true});this.sherd.pointHandler=new OpenLayers.Control.DrawFeature(layer,OpenLayers.Handler.Point,{'displayClass':'olControlDrawFeaturePoint'});this.sherd.polygonHandler=new OpenLayers.Control.DrawFeature(layer,OpenLayers.Handler.Polygon,{'displayClass':'olControlDrawFeaturePolygon'});this.sherd.squareHandler=new OpenLayers.Control.DrawFeature(layer,OpenLayers.Handler.RegularPolygon,{'displayClass':'olControlDrawFeatureSquare','handlerOptions':{sides:4,irregular:true}});function featureAdded(){if(typeof self.featureAdded=='function'){self.featureAdded.apply(self,arguments);}}
this.sherd.pointHandler.featureAdded=featureAdded;this.sherd.polygonHandler.featureAdded=featureAdded;this.sherd.squareHandler.featureAdded=featureAdded;this.addControls([this.sherd.navigation,this.sherd.pointHandler,this.sherd.squareHandler,this.sherd.polygonHandler]);}})};this.storage={'update':function(obj,just_downstream){if(!just_downstream){self.setState(obj,{'mode':self.mode});}
for(var i=0;i<self.targetstorage.length;i++){self.targetstorage[i].storage.update(obj);}}};this.microformat={'create':function(){var id=Sherd.Base.newID('openlayers-annotator');return{htmlID:id,text:'<div id="'+id+'">'+'   <p id="instructions" class="sherd-instructions">Choose a drawing tool, located on the upper, right-hand side of the image. '+'   The polygon tool works by clicking on the points of the polygon and then double-clicking the last point.</p>'+'</div>'};},'components':function(html_dom,create_obj){return{'top':html_dom,'center':document.getElementById("btnCenter"),'instructions':document.getElementById("instructions")};}};};}
if(!Sherd){Sherd={};}
if(!Sherd.Image){Sherd.Image={};}
if(!Sherd.Image.FSIViewer){Sherd.Image.FSIViewer=function(){var self=this;Sherd.Base.AssetView.apply(this,arguments);this.ready=false;this.current_state={type:'fsiviewer'};this.intended_states=[];this.getState=function(){return self.current_state;};this._setState=function(obj){try{if(obj&&obj.set&&obj.top){var clip_string=self.obj2arr(obj).join(', ');self.components.top.SetVariable('FSICMD','Goto:'+clip_string);}else{self.components.top.SetVariable('FSICMD','Reset');}}catch(e){}};this.setState=function(obj){if(obj)for(var a in obj){self.current_state[a]=obj[a];}
self.intended_states.push(obj);if(self.ready){this._setState(obj);}};window.saveToImageGroup=function(clip_string,maybe_name,clip_embed_url){};window.saveImage=function(clip_embed_url){};window.printImage=function(clip_embed_url){};this.obj2arr=function(o){return[o.set,o.scene,o.left,o.top,o.right,o.bottom,o.rotation];};this.arr2obj=function(a){return{'set':a[0],'scene':a[1],'left':a[2],'top':a[3],'right':a[4],'bottom':a[5],'rotation':a[6]};};this.presentations={'thumb':{height:function(){return'100px';},width:function(){return'100px';},extra:'CustomButton_buttons=&amp;NoNav=true&amp;MenuAlign=TL&amp;HideUI=true',initialize:function(obj,presenter){}},'default':{height:function(obj,presenter){return Sherd.winHeight()+'px';},width:function(obj,presenter){return'100%';},extra:'CustomButton_buttons=&amp;NoNav=undefined&amp;MenuAlign=TL',initialize:function(obj,presenter){self.events.connect(window,'resize',function(){var top=presenter.components.top;top.setAttribute('height',Sherd.winHeight()+'px');self.current_state.wh_ratio=(top.offsetWidth/(top.offsetHeight-30));});}},'medium':{height:function(){return'383px';},width:function(){return'100%';},initialize:function(){}},'small':{height:function(){return'240px';},width:function(){return'320px';},extra:'CustomButton_buttons=&amp;NoNav=undefined&amp;MenuAlign=BL',initialize:function(){}}};this.initialize=function(create_obj){var presentation;switch(typeof create_obj.object.presentation){case'string':presentation=self.presentations[create_obj.object.presentation];break;case'object':presentation=create_obj.object.presentation;break;case'undefined':presentation=self.presentations['default'];break;}
presentation.initialize(create_obj.object,self);var top=self.components.top;self.current_state.wh_ratio=(top.offsetWidth/(top.offsetHeight-30));var state_listener=function(fsi_event,params){switch(fsi_event){case'View':if(self.ready){var o=self.arr2obj(params.split(', '));for(var a in o){self.current_state[a]=o[a];}}
break;case'ImageUrl':if(self.ready)
self.current_state.imageUrl=params;break;case'LoadingComplete':self.ready=true;var s;if(self.intended_states.length){setTimeout(function(){self._setState(self.intended_states[self.intended_states.length-1]);},100);}
break;case'InitComplete':case'Zoom':case'Reset':case'LoadProgress':case'TooTip':}};window[create_obj.htmlID+'_DoFSCommand']=state_listener;window[create_obj.htmlID+'_embed_DoFSCommand']=state_listener;if(self.components.top.attachEvent){var script=document.createElement('script');script.setAttribute('type','text/javascript');script.setAttribute('event','FSCommand(command,args)');script.setAttribute('for',create_obj.htmlID);script.text=create_obj.htmlID+'_DoFSCommand(command,args);';document.getElementsByTagName('head')[0].appendChild(script);}};this.microformat={};this.microformat.components=function(html_dom,create_obj){return{'top':html_dom};};this.microformat.create=function(obj,doc){var fsi_object_id=Sherd.Base.newID('fsiviewer_wrapper');var broken_url=obj.image_fpx.split('/');var presentation=self.presentations[obj.presentation||'default'];obj.image_fpx_base=broken_url.slice(0,3).join('/')+'/';obj.image_fpx_src=broken_url.slice(3).join('/');var fpx=obj["image_fpx-metadata"];var full_fpx_url=obj.fsiviewer
+'?FPXBase='+obj.image_fpx_base
+'&amp;FPXSrc='+obj.image_fpx_src
+'&amp;FPXWidth='+fpx.width
+'&amp;FPXHeight='+fpx.height+'&amp;'+presentation.extra;var html='<object width="'+presentation.width()+'" height="'+presentation.height()+'" '
+'type="application/x-shockwave-flash" data="'+full_fpx_url+'" '
+((/MSIE/.test(navigator.userAgent))?' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ':'')
+'id="'+fsi_object_id+'" name="'+fsi_object_id+'">'
+'<param name="wmode" value="opaque"/><param name="allowScriptAccess" value="always"/><param name="swliveconnect" value="true"/><param name="menu" value="false"/><param name="quality" value="high"/><param name="scale" value="noscale"/><param name="salign" value="LT"/><param name="bgcolor" value="FFFFFF"/>'
+'<param name="Movie" value="'+full_fpx_url+'" />'
+'</object>';return{object:obj,htmlID:fsi_object_id,text:html};};};}
if(!Sherd){Sherd={};}
if(!Sherd.Video){Sherd.Video={};}
if(!Sherd.Video.Annotators){Sherd.Video.Annotators={};}
if(!Sherd.Video.Annotators.ClipForm){Sherd.Video.Annotators.ClipForm=function(){var secondsToCode=Sherd.Video.secondsToCode;var codeToSeconds=Sherd.Video.codeToSeconds;var self=this;Sherd.Base.AssetView.apply(this,arguments);this.attachView=function(view){this.targetview=view;};this.targetstorage=[];this.addStorage=function(stor){this.targetstorage.push(stor);};this.getState=function(){var duration=self.targetview.media.duration();var timeScale=self.targetview.media.timescale();var obj={'startCode':self.components.startField.value,'endCode':self.components.endField.value,'duration':duration,'timeScale':timeScale,'start':codeToSeconds(self.components.startField.value),'end':codeToSeconds(self.components.endField.value)};return obj;};this.setState=function(obj,options){if(typeof obj=='object'){if(obj==null){obj={};obj.start=0;obj.end=0;}
self.showForm();var start;if(obj.startCode){start=obj.startCode;}else if(obj.start!==undefined){start=secondsToCode(obj.start);}
var end;if(obj.endCode){end=obj.endCode;}else if(obj.end!=undefined){end=secondsToCode(obj.end);}else if(start){end=start;}
if(start!==undefined){if(self.components.startField)
self.components.startField.value=start;if(self.components.startFieldDisplay)
self.components.startFieldDisplay.innerHTML=start;self.components.start=start;self.events.signal(self.targetview,'clipstart',{start:codeToSeconds(start)});}
if(end!==undefined){if(self.components.endField)
self.components.endField.value=end;if(self.components.endFieldDisplay)
self.components.endFieldDisplay.innerHTML=end;self.components.end=end;self.events.signal(self.targetview,'clipend',{end:codeToSeconds(end)});}
if(options&&options.mode=="browse"){if(self.components.startField)
self.components.startField.disabled=true;if(self.components.endField)
self.components.endField.disabled=true;if(self.components.startButton)
self.components.startButton.disabled=true;if(self.components.endButton)
self.components.endButton.disabled=true;if(self.components.clipcontrols){self.components.clipcontrols.style.display="none";self.components.clipcontrols_readonly.style.display="inline";}
if(self.components.instructions)
self.components.instructions.style.display="none";}else{if(self.components.startField)
self.components.startField.disabled=false;if(self.components.endField)
self.components.endField.disabled=false;if(self.components.startButton)
self.components.startButton.disabled=false;if(self.components.endButton)
self.components.endButton.disabled=false;if(self.components.clipcontrols){self.components.clipcontrols.style.display="inline";self.components.clipcontrols_readonly.style.display="none";}
if(self.components.instructions)
self.components.instructions.style.display="block";}}};this.storage={update:function(obj,just_downstream){if(!just_downstream){self.setState(obj);}
if(self.targetstorage){for(var i=0;i<self.targetstorage.length;i++){self.targetstorage[i].storage.update(obj);}}}};this.initialize=function(create_obj){self.events.connect(self.components.startButton,'click',function(evt){var movieTime=self.targetview.media.time();var movieTimeCode=secondsToCode(movieTime);self.components.startField.value=movieTimeCode;if(movieTime>codeToSeconds(self.components.endField.value)){self.components.endField.value=movieTimeCode;}
self.storage.update(self.getState(),false);});self.events.connect(self.components.endButton,'click',function(evt){if(self.targetview.media.pause){self.targetview.media.pause();}
var movieTime=self.targetview.media.time();var movieTimeCode=secondsToCode(movieTime);self.components.endField.value=movieTimeCode;if(movieTime<codeToSeconds(self.components.startField.value))
self.components.startField.value=movieTimeCode;self.storage.update(self.getState(),false);});self.events.connect(self.components.startField,'change',function(evt){var obj=self.getState();if(obj.end<obj.start){obj.end=obj.start;obj.endCode=obj.startCode;self.components.endField.value=obj.startCode;}
self.storage.update(obj,false);});self.events.connect(self.components.endField,'change',function(evt){var obj=self.getState();if(obj.end<obj.start){obj.start=obj.end;obj.startCode=obj.endCode;self.components.startField.value=obj.endCode;}
self.storage.update(obj,false);});self.events.connect(self.components.playClip,'click',function(evt){var obj=self.getState();self.events.signal(self.targetview,'playclip',{start:obj.start,end:obj.end});});self.events.connect(self.components.playClip2,'click',function(evt){var obj=self.getState();self.events.signal(self.targetview,'playclip',{start:obj.start,end:obj.end});});};this.showForm=function(){if(self.components.form)
self.components.form.style.display="inline";};this.hideForm=function(){if(self.components.form)
self.components.form.style.display="none";};this.microformat.create=function(obj){var htmlID='clipform';return{htmlID:htmlID,text:'<div id="'+htmlID+'" style="display: none">'
+'<div id="clipcontrols" class="sherd-clipform">'
+'<p id="instructions" class="sherd-instructions">Create a selection by clicking Start Time and End Time buttons as the video plays or by manually typing in times in the associated edit boxes. Add title, tags and notes. Click Save when you are finished.</p><br />'
+'<table>'
+'<tr class="sherd-clipform-editing">'
+'<td>'
+'<input type="button" class="regButton" value="start time" id="btnClipStart"/> '
+'</td>'
+'<td width="10px">&nbsp;</td>'
+'<td>'
+'<input type="button" class="regButton" value="end time" id="btnClipEnd"/> '
+'</td>'
+'<td>&nbsp;</td>'
+'</tr>'
+'<tr class="sherd-clipform-editing">'
+'<td>'
+'<input type="text" class="timecode" id="clipStart" value="'+self.components.start+'" />'
+'</td>'
+'<td width="10px">-</td>'
+'<td>'
+'<input type="text" class="timecode" id="clipEnd" value="'+self.components.end+'" />'
+'</td>'
+'<td class="sherd-clipform-play"><input type="button" class="regButton videoplay" value="Play Selection" id="btnPlayClip"/></td>'
+'</tr>'
+'</table>'
+'</div>'
+'<div id="clipcontrols_readonly" class="sherd-clipform">'
+'<span id="clipStartDisplay">'+self.components.start+'</span> - <span id="clipEndDisplay">'+self.components.end+'</span>&nbsp;&nbsp;&nbsp;<input type="button" class="regButton videoplay" value="Play Selection" id="btnPlayClip2"/>'
+'</div></div>'};};this.microformat.components=function(html_dom,create_obj)
{return{'form':html_dom,'startButton':document.getElementById('btnClipStart'),'endButton':document.getElementById('btnClipEnd'),'startField':document.getElementById('clipStart'),'endField':document.getElementById('clipEnd'),'startFieldDisplay':document.getElementById('clipStartDisplay'),'endFieldDisplay':document.getElementById('clipEndDisplay'),'playClip':document.getElementById('btnPlayClip'),'playClip2':document.getElementById('btnPlayClip2'),'clipcontrols':document.getElementById('clipcontrols'),'clipcontrols_readonly':document.getElementById('clipcontrols_readonly'),'instructions':document.getElementById('instructions'),'start':"00:00:00",'end':"00:00:00"};};};}