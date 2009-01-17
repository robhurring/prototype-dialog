/* START applesearch object */

var applesearch;
if (!applesearch)	applesearch = {};

applesearch.init = function ()
{
	// add applesearch css for non-safari, dom-capable browsers
	if ( navigator.userAgent.toLowerCase().indexOf('safari') < 0  && document.getElementById )
	{
		this.clearBtn = false;
		var dummy = document.getElementById("dummy_css");
		if (dummy)	dummy.href = "/stylesheets/applesearch.css";
	}
}


// called when on user input - toggles clear fld btn
applesearch.onChange = function (fldID, btnID)
{
	// check whether to show delete button
	var fld = document.getElementById( fldID );
	var btn = document.getElementById( btnID );
	if (fld.value.length > 0 && !this.clearBtn)
	{
		btn.style.background = "url('../images/search/search-right-x.gif') no-repeat top left";
		btn.fldID = fldID; // btn remembers it's field
		btn.onclick = this.clearBtnClick;
		this.clearBtn = true;
	} else if (fld.value.length == 0 && this.clearBtn)
	{
		btn.style.background = "url('../images/search/search-right.gif') no-repeat top left";
		btn.onclick = null;
		this.clearBtn = false;
	}
}


// clears field
applesearch.clearFld = function (fldID,btnID)
{
	var fld = document.getElementById( fldID );
	fld.value = "";
	this.onChange(fldID,btnID);
}

// called by btn.onclick event handler - calls clearFld for this button
applesearch.clearBtnClick = function ()
{
	applesearch.clearFld(this.fldID, this.id);
}

/* END applesearch object */