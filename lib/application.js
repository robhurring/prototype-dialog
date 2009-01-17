document.observe("dom:loaded", function()
{
	if($('flash'))
		show_flash();	
	applesearch.init();

	$$('a.tooltip').each(function(t)
	{
		t.observe('click', function(e){ Event.stop(e); return false; });
	});

	if(toggle_box = $('toggle_box'))
	{
		toggle_box.observe('click', function(e){
			$$('input.checkbox[id!=toggle_box]').each(function(elem){ elem.checked = !elem.checked; });
		});
	}
});

// commafy for pricing requests
String.prototype.commafy = function () {
	return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
		return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
	});
}

Number.prototype.commafy = function () {
	return String(this).commafy();
}

function show_flash()
{
	_box = $('box');
	if(_box)
		if((width = _box.getWidth()) <= 740)	// nil size will blow flash out
			$('flash').setStyle({width:width+'px' });
	new Effect.Appear('flash');
}

// auto complete callbacks

function apple_search_handler(t,l)
{
	type = l.title;
	id = l.id;
	if(type && id)
	{
		t.value = 'redirecting...';
		path = '/' + type + '/' + id;
		location = path;
	}else{
		// clicked on a heading
		t.value = '';
		return false;
	}
}

function update_sale_client_id(text, li)
{
	$('sale_client_id').value = li.id;
	strip_live_from_client_name('client_name');
}

function update_search_client_id(text, li)
{	
	$('search_client_id').value = li.id;
	strip_live_from_client_name('client_name');
}

function strip_live_from_client_name(input_id)
{
	if(input = $(input_id))
		input.value = input.value.gsub(/\s*live$/, '');
}

function update_pricing(price)
{
	pq = $('pricing_quote');
 	price = parseInt(pq.innerHTML.gsub(/\D/, '')) + price;
	pq.innerHTML = price.commafy();
}

function aop_keyword_box_toggle(show)
{
	if(show)
	{
		$('keyword_code').show();
		$('not_keyword_code').hide();
	}else{
		$('keyword_code').hide();
		$('not_keyword_code').show();
	}
}

function list_to_textarea(element)
{
	ta_id = element+'_textarea';		
	if($(element).visible())
	{
		element_data = [];
		$$('ul#' + element + ' li').each(function(e)
		{
			element_data.push(e.innerHTML.gsub(/\s?<tt>.+<\/tt>/, ''));
		});
		html = "<textarea id='"+ta_id +"' class='stylize_noimg' rows='25' style='display:none;'>" + element_data.join("\n") + "</textarea>";
		if(!$(ta_id))
			insertion_point = new Insertion.Before(element, html);	
	}
	$(element).toggle();
	$(ta_id).toggle();
}

function seo_packages()
{
	fp = $('form_packages');
	
	$('pricing_package_id').selectedIndex = 0;
	$('pricing_aop_id').selectedIndex = 0;
	$('form_aop').toggle();
	fp.toggle();
	if(fp.visible())
		plih = 'Use AOP Keyword Boxes'
	else
		plih = 'Use SEO Packages'
	$('packages_link').innerHTML = plih;
	
}
