var Dialog = {};
Dialog.Box = Class.create();
Object.extend(Dialog.Box.prototype, {
  initialize: function(id, options) {		
		this.options = Object.extend({
			overlay_color:'#000',
			duration:0.1,
			opacity_from:0.0,
			opacity_to:0.3,
			reset_form:true,
			hide_select_boxes:(/msie/i.test(navigator.userAgent))
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
  },

  create_overlay:function()
	{
    if(!this.overlay)
		{
      this.overlay = document.createElement('div');
      this.overlay.id = this.overlay_id;
			this.overlay.setStyle({
      	position: 'absolute',
      	top: 0,
      	left: 0,
      	zIndex: 90,
      	width: '100%',
      	backgroundColor: this.options.overlay_color,
      	display: 'none'
			});
      document.body.insertBefore(this.overlay, document.body.childNodes[0]);
    }
  },

	// overrides the element's toggle method to bind to here
	toggle:function()
	{
		this.dialog_box.visible() ? this.hide() : this.show();
	},

	// show(true) will disable hiding (persistant showing)
	// useful if you _must_ get data from the dialog and want to block the page until then
  show:function()
	{
		this.overlay.setStyle({height:this.window_width()+'px'});
		if(!arguments[0])
    	this.overlay.onclick = this.hide.bind(this);
    	
		if(this.options.hide_select_boxes)
    	this.select_boxes('hide');

    new Effect.Appear(this.overlay, {duration: this.options.duration, from: this.options.opacity_from, to: this.options.opacity_to});
		
    var e_dims = Element.getDimensions(this.dialog_box);
		var scroll_offset = document.viewport.getScrollOffsets()[1];
		
		this.dialog_box.setStyle({
			display:'', 
			left:((this.window_width()/2) - (e_dims.width)/2) + 'px',
			top:scroll_offset + ((document.viewport.getHeight() / 2) - e_dims.height) + 'px'
		});
  },

	// convenience method
	persistent_show:function(){ this.show(true);	},

  hide:function()
	{
		if(this.options.hide_select_boxes)
			this.select_boxes('show');
			
    new Effect.Fade(this.overlay, {duration: this.options.duration});
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

  window_width: function() { return document.viewport.getWidth() },
	window_height: function() { return document.viewport.getHeight() + document.viewport.getScrollOffsets().last(); }

}); 
