var NONE_TRAIT = {
	name : "None",
	cost : 0,
	excludes : [],
}

var AvatarTraitsModule = function(parentDiv, pointsModule) {
	var row = $('<div class="row" />');
	parentDiv.append(row);
	row.append($('<div class="title-font-big font-color-title ">Traits: </label>'));
	this.traits = [NONE_TRAIT];
	var self = this;
	
	this.traitModule1 = new TraitModule(parentDiv, this, pointsModule);
	this.traitModule2 = new TraitModule(parentDiv, this, pointsModule);
	
	this.getTraitModules = function() {
		return [this.traitModule1, this.traitModule2];
	}
	
	this.setTraitsCollection = function(traits) {
		this.traits = [NONE_TRAIT].concat(traits);
	}
	
	this.refreshAllButtons = function() {
		this.getTraitModules().forEach(function(t) { t.refreshButtons(); });
	}
	
	this.resetTraits = function() {
		this.traitModule1.selectedTrait = NONE_TRAIT;
		this.traitModule1.refresh();
		this.traitModule2.selectedTrait = NONE_TRAIT;
		this.traitModule2.refresh();
	}
	
	$(window).on("pointsModule.changed", function() {
		self.refreshAllButtons();
	})
}

var TraitModule = function(parentDiv, parentModule, pointsModule) {
	var self = this;
	this.selectedTrait = NONE_TRAIT;
	this.parentModule = parentModule;
	this.pointsModule = pointsModule;
	
	var row = $('<div class="row" />');
	parentDiv.append(row);
	
	
	this.leftButton = row.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function ()
	{
		self.chooseNextTrait(-1);
	}, 'avatar-arrow-button', 6);
	
	
	this.display = $('<span class="trait text-font-normal font-color-subtitle"/>');
	this.display.text(this.selectedTrait.name);
	row.append(this.display);

	this.rightButton = row.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function ()
	{
		self.chooseNextTrait(+1)
	}, 'avatar-arrow-button', 6);
	
	
	

	
	
}

TraitModule.prototype.refresh = function() {
	
	this.display.empty();
	if (this.selectedTrait.icon != null) {
		var image = $('<img class="trait-img"/>');
		image.attr('src', Path.GFX + this.selectedTrait.icon);
		image.bindTooltip({ contentType: 'verbatim', tooltip : this.selectedTrait.tooltip })
		this.display.append(image);
	} else {
		this.display.text(this.selectedTrait.name);
	}
	
	
	
	//this.parentModule.refreshAllButtons();
}

TraitModule.prototype.refreshButtons = function() {
	var anyAvailable = this.anyAvailableTrait();
	this.leftButton.enableButton(anyAvailable);
	this.rightButton.enableButton(anyAvailable);
}

TraitModule.prototype.getNextTrait = function(direction) {
	var currentIndex = this.parentModule.traits.indexOf(this.selectedTrait);
	var newTrait = this.selectedTrait;
	do {
		currentIndex += +direction; //-1 or +1
		currentIndex = (this.parentModule.traits.length + currentIndex) % this.parentModule.traits.length;
		newTrait = this.parentModule.traits[currentIndex];
	} while(!this.isTraitAvailable(newTrait));
	return newTrait;
	
}

TraitModule.prototype.chooseNextTrait = function(direction) {
	var trait = this.getNextTrait(direction);
	if (trait != this.selectedTrait) {
		var cost = trait.cost - this.selectedTrait.cost;
		this.selectedTrait = trait;
		this.refresh();
		this.pointsModule.changePoints(cost);
	}
	
}

TraitModule.prototype.anyAvailableTrait = function() {
	return this.getNextTrait(+1) != this.selectedTrait;
}

TraitModule.prototype.isTraitAvailable = function(trait) {
	if (trait == NONE_TRAIT) {
		return true;
	}
	if ((trait.cost - this.selectedTrait.cost) > this.pointsModule.availablePoints()) {
		return false;
	}
	
	var self = this;
	// find traits selected in other modules
	var selectedTraits = this.parentModule.getTraitModules()
				.filter(function (module) { 
					return module != self && module.selectedTrait != NONE_TRAIT;
				})
				.map(function(module) {return module.selectedTrait;} );
	
	// check if trait belongs to alrady selected traits
	if (selectedTraits.indexOf(trait) != -1) {
		return false;
	}
	
	// check if traits are excluding
	for (var i = 0; i < selectedTraits.length; i++) {
		if (selectedTraits[i].excluded != null && selectedTraits[i].excluded.indexOf(trait.id) != -1) {
			return false;
		}
		
		if(trait.excluded != null && trait.excluded.indexOf(selectedTraits[i].id) != -1) {
			return false;
		}
	}
	
	return true;
}

TraitModule.prototype.isSelected = function() {
	return this.selectedTrait != NONE_TRAIT;
}
