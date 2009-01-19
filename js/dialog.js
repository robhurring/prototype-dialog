/*
  Simple prototype based dialog box
  Author:: Rob Hurring <rob@zerobased.com>
  Homepage:: http://github.com/robhurring
  Date:: 1/17/09
  Credits:: Based on http://snippets.dzone.com/posts/show/3411
  
  ==Options
  use_overlay:     if you want the overlay to show or not -- setting to false means manually hiding() the dialog
  hide_on_key:     if set we will listen for this key code and hide on it, set to +FALSE+ if you don't want this       
  overlay_color:   sets the color of the overlay(unless using a custom one)
  duration:        how long the overlay (or dialog if you use fade_dialog) takes to appear/fade
  opacity_from:    appear/fade from this opacity -- you will probably never use this
  opacity_to:      what opacity should the overlay get (doesn't work for dialog itself)
  reset_form:      should we clear the dialog's input fields when hidden? useful for login forms
  hide_select_boxes:  should we hide select boxes when transitioning? default is true for IE only
  persistent:      keeps the dialog up until you explicitly tell it to hide()
  fade_dialog:     should we fade in/out the dialog along with the overlay?

  ==Usage
  new Dialog.Box(element_id);
  new Dialog.Box(element_id, {overlay_color:'#500'});
  new Dialog.Box(element_id, {persistent:true});
  
  Use the regular show() hide() toggle() methods to show or hide the dialog.
  Use persistent_show() to create a dialog that stays up until you
    specify it be hidden. Or set the {persistent:true} option.
    
  ==Dependencies
  written against Prototype 1.6.0.1 and script.aculo.us 1.8.2
*/
var Dialog = {};
Dialog.Box = Class.create();
Object.extend(Dialog.Box.prototype, {
  initialize: function(id, options) {
		this.options = Object.extend({
		  use_overlay:true,
		  hide_on_key:Event.KEY_ESC,
			overlay_color:'#000',
			duration:0.1,
			opacity_from:0.0,
			opacity_to:0.3,
			reset_form:true,
			hide_select_boxes:(/msie/i.test(navigator.userAgent)),
			persistent:false,
			fade_dialog:true
		}, options || {});		

    this.dialog_box = (typeof id == 'string' ? $(id) : id);
    this.dialog_box.show = this.show.bind(this);
		this.dialog_box.toggle = this.toggle.bind(this);
    this.dialog_box.persistent_show = this.persistent_show.bind(this);
    this.dialog_box.hide = this.hide.bind(this);

		this.overlay_id = this.dialog_box.id + '_overlay';
		this.overlay = $(this.overlay_id);
    this.create_overlay();

    var e_dims = Element.getDimensions(this.dialog_box);
    var b_dims = Element.getDimensions(this.overlay);

		this.dialog_box.setStyle({
			position:'absolute',
			left:((b_dims.width/2) - (e_dims.width/2)) + 'px',
			top:((this.window_width() - (e_dims.width/2))/4) + 'px',
			zIndex:this.overlay.style.zIndex + 1
		});
		
		if(this.options.hide_on_key != false)
		  document.observe('keypress', function(e)
		  { 
		    if(e.keyCode == this.options.hide_on_key && this.dialog_box.visible() && !this.options.persistent) 
		      this.hide(); 
		  }.bind(this));
  },

  create_overlay:function()
	{
    if(!this.overlay)
		{
      this.overlay = document.createElement('div');
      document.body.insertBefore(this.overlay, document.body.childNodes[0]);
			$(this.overlay).setStyle({
			  id: this.overlay_id,
      	position: 'absolute',
      	top: 0,
      	left: 0,
      	zIndex: 99,
      	backgroundColor: this.options.overlay_color,
      	display: 'none'
			});
    }
  },

	// overrides the element's toggle method to bind to here
	toggle:function()
	{
		this.dialog_box.visible() ? this.hide() : this.show();
	},

	// show(true) will disable hiding (persistent showing)
	// useful if you _must_ get data from the dialog and want to block the page until then
  show:function()
	{ 
		this.overlay.setStyle({height:this.window_height()+'px', width:'100%'});

		if(arguments[0]) this.options.persistent = true
		if(!this.options.persistent)
  	  this.overlay.observe('click', this.hide.bind(this));
  	  
		if(this.options.hide_select_boxes)
    	this.select_boxes('hide');

    if(this.options.use_overlay)
      new Effect.Appear(this.overlay, {duration: this.options.duration, from: this.options.opacity_from, to: this.options.opacity_to});
		
    var e_dims = Element.getDimensions(this.dialog_box);
		var scroll_offset = document.viewport.getScrollOffsets()[1];
		
		this.dialog_box.setStyle({
      display:'', 
			left:((this.window_width()/2) - (e_dims.width)/2) + 'px',
			top:scroll_offset + ((document.viewport.getHeight()/2) - (e_dims.height/2)) + 'px'
		});
		if(this.options.fade_dialog)
		{
		  this.dialog_box.setStyle({opacity:0});
      new Effect.Appear(this.dialog_box,{
        duration:this.options.duration,
        beforeSetup:function(effect){/* must override this since the default function uses show() and will cause an endless loop */} 
      });
    }
  },

	// convenience method for show(true)
	persistent_show:function(){ this.show(true);	},

  hide:function()
	{
		if(this.options.hide_select_boxes)
			this.select_boxes('show');

		if(this.options.use_overlay)
      new Effect.Fade(this.overlay, {duration: this.options.duration});

		if(this.options.fade_dialog)
		  new Effect.Fade(this.dialog_box, {
		    duration:this.options.duration,
		    afterFinishInternal:function(effect){
		      // override the default again since it uses hide() and the endless loop and yadda yadda
		      effect.element.setStyle({display:'none'});
		    }
		  });
    else
      this.dialog_box.setStyle({display:'none'});
		
		if(this.options.reset_form)
			this.reset_form();
  },

	reset_form:function()
	{
    $A(this.dialog_box.getElementsByTagName('input')).each(function(e){if(e.type!='submit')e.value=''});
	},

  select_boxes:function(what)
	{
    $A(document.getElementsByTagName('select')).each(function(select) {
      Element[what](select);
    });

    if(what == 'hide')
      $A(this.dialog_box.getElementsByTagName('select')).each(function(select){Element.show(select)})
  },

  window_width:function(){ return document.viewport.getWidth() },
	window_height:function(){ return document.viewport.getHeight() + document.viewport.getScrollOffsets().last(); }

}); 
