var AvatarAppearanceModule = function(mSQHandle)
{
    this.mParent = null;

    // event listener
    this.mEventListener = null;

	// generic containers
	this.mContainer = null;
    this.mDialogContainer = null;
    this.mListContainer = null;
    this.mListScrollContainer = null;
    this.mDetailsPanel = {
        Container: null,
        CharacterImage: null,
        CharacterName: null,
        HireButton: null
    };

	// controls
	this.mAppearanceOptions =
	{
		Hair:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'hair',
			List : [""],
			Selected : 0
		},

		Beard:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'beard',
			List : [""],
			Selected : 0
		},

		HairColor:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'hairColor',
			List : ["brown"],
			Selected : 0
		},

		Head:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'head',
			List : ["bust_head_01", "bust_head_02"],
			Selected : 0
		},

		Body:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'body',
			List : ["bust_naked_body_00"],
			Selected : 0
		},

		Tattoo:
		{
			DownButton: null,
			UpButton: null,
			LayerID: 'tattoo',
			List : [""],
			Selected : 0
		}
	};
	
	this.mSelectedEntry = null;
	this.mSQHandle = mSQHandle;
	
	this.getAppearanceOptions();
}


AvatarAppearanceModule.prototype.createDIV = function (_parentDiv)
{
    var self = this;
	
	
	
	
    // create: containers (init hidden!)
    this.mContainer = $('<div class="avatar-appearance world-town-screen"/>');
    _parentDiv.append(this.mContainer);
    this.mDialogContainer = $('<div class="avatar-appearance world-town-screen"/>');

    // create tabs
    var tabButtonsContainer = $('<div class="l-tab-container"/>');
    //this.mDialogContainer.findDialogTabContainer().append(tabButtonsContainer);

	// create assets
	//this.mAssets.createDIV(tabButtonsContainer);

    // create content
    var content = this.mContainer;

    // right column
    var column = $('<div class="column single" />');
    content.append(column);
	
	
	var row = $('<div class="row"></div>');
	this.createAppearanceControlDIV("Hair Color", 'color-control', this.mAppearanceOptions.HairColor, row);
	this.createAppearanceControlDIV("Hair", 'hair-control', this.mAppearanceOptions.Hair, row);
	column.append(row);
	
	var row = $('<div class="row"></div>');
	this.createAppearanceControlDIV("Head", 'color-control', this.mAppearanceOptions.Head, row);
	this.createAppearanceControlDIV("Beard", 'hair-control', this.mAppearanceOptions.Beard, row);
	column.append(row);
	
	//character portrait
	
	var row = $('<div class="row"></div>');
	this.createAppearanceControlDIV("Body", 'color-control', this.mAppearanceOptions.Body, row);
	this.createAppearanceControlDIV("Tattoo", 'hair-control', this.mAppearanceOptions.Tattoo, row);
	column.append(row);
	
	
	
	//END
	var row = $('<div class="row"></div>');
	column.append(row);
	
	
	var wrapperElement = $('<div class="image-wrapper"></div>');
	row.append(wrapperElement);
	

    this.mDetailsPanel.CharacterImage = wrapperElement.createImage();
    
	
	this.updateAppearance();

};

AvatarAppearanceModule.prototype.createAppearanceControlDIV = function (_label, _class, _definition, _parentDiv)
{
    var self = this;

	var control = $('<div class="appearance-control ' + _class + '"></div>');
	_parentDiv.append(control);


    layout = control;
    _definition.DownButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ARROW_LEFT, function ()
	{
		_definition.Selected--;
		_definition.Selected = (_definition.Selected +  _definition.List.length) % _definition.List.length;
		self.updateAppearanceLayer(_definition);
    }, 'avatar-arrow-button', 6);

    _definition.Label = $('<span class="ui-control text text-font-normal font-color-value font-bottom-shadow">' + _label + '</span>');
	control.append(_definition.Label);
;
    control.append(layout);
    _definition.UpButton = layout.createImageButton(Path.GFX + Asset.BUTTON_ARROW_RIGHT, function ()
	{
		_definition.Selected++;
		_definition.Selected = (_definition.Selected +  _definition.List.length) % _definition.List.length;
        self.updateAppearanceLayer(_definition);
    }, 'avatar-arrow-button', 6);
};

AvatarAppearanceModule.prototype.updateAppearanceLayer = function (_definition)
{	
	var self = this;
	var data = {};
	
	for (key in this.mAppearanceOptions)
	{
		var index = this.mAppearanceOptions[key].Selected;
		var list = this.mAppearanceOptions[key].List;
		data[key] = list[index] ;
	}
	
    SQ.call(this.mSQHandle, 'updateAppearanceLayer', {
		layer : _definition.LayerID,
		data : data
	}, function(imagePath){
		self.mDetailsPanel.CharacterImage.attr('src', Path.PROCEDURAL + imagePath);
	});
};


AvatarAppearanceModule.prototype.updateAppearance = function ()
{	
	var self = this;
	var data = {};
	
	for (key in this.mAppearanceOptions)
	{
		var index = this.mAppearanceOptions[key].Selected;
		var list = this.mAppearanceOptions[key].List;
		data[key] = list[index] ;
	}
	
    SQ.call(this.mSQHandle, 'updateAppearance', data, function(imagePath){
		self.mDetailsPanel.CharacterImage.attr('src', Path.PROCEDURAL + imagePath);
	});
};

AvatarAppearanceModule.prototype.getAppearanceOptions = function ()
{	
	var self = this;
    SQ.call(this.mSQHandle, 'getAppearanceOptions', [], function(options){
		for(var key in options.options) {
			var brush = options.data[key];
			var list = options.options[key];
			self.mAppearanceOptions[key].List = list;
			var index = list.indexOf(brush);
			if(index >= 0) {
				self.mAppearanceOptions[key].Selected = index;
			}
		}

	});
};

AvatarAppearanceModule.prototype.logging = function(s)
{
	SQ.call(this.mSQHandle, 'logging', s);
}