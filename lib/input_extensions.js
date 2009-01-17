Object.extend(HTMLInputElement.prototype, {
	make_self_clearing:function()
	{
		this.original_value = this.value
		Event.observe(this, 'focus', function(){ if(this.value == this.original_value) this.value = '';	});
		Event.observe(this, 'blur', function(){ if(this.value == '') this.value = this.original_value; });
	},
	reset_text:function()
	{
		this.value = this.original_value || ''
	}
});