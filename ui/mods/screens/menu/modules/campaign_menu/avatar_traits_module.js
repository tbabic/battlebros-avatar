var NONE_TRAIT = {
	name : "None",
	cost : 0,
}

var MultipleTraitsModule = function(parentDiv, pointsControl) {
	var row = $('<div class="row" />');
	parentDiv.append(row);
	row.append($('<div class="title-font-big font-color-title ">Traits: </label>'));
	this.traits = [NONE_TRAIT];
	
	
	this.traitModule1 = new TraitModule(parentDiv, this, pointsControl);
	this.traitModule2 = new TraitModule(parentDiv, this, pointsControl);
	
	this.getTraitModules = function() {
		return [this.traitModule1, this.traitModule2];
	}
	
	this.setTraitsCollection = function(traits) {
		this.traits = [NONE_TRAIT].concat(traits);
	}
	
	this.refreshAllButtons = function() {
		this.getTraitModules().forEach(function(t) { t.refreshButtons(); });
	}
}

var TraitModule = function(parentDiv, parentModule, pointsControl) {
	var self = this;
	this.selectedTrait = NONE_TRAIT;
	this.parentModule = parentModule;
	this.pointsControl = pointsControl;
	
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
	
	
	
	this.parentModule.refreshAllButtons();
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
		this.pointsControl.changePoints(cost);
	}
	
}

TraitModule.prototype.anyAvailableTrait = function() {
	return this.getNextTrait(+1) != this.selectedTrait;
}

TraitModule.prototype.isTraitAvailable = function(trait) {
	if (trait == NONE_TRAIT) {
		return true;
	}
	var self = this;
	var selectedTraits = this.parentModule.getTraitModules()
				.filter(function (module) { 
					return module != self && module.selectedTrait != NONE_TRAIT;
				})
				.map(function(module) {return module.selectedTrait;} );
				
	return selectedTraits.indexOf(trait) == -1;
}

TraitModule.prototype.isSelected = function() {
	return this.selectedTrait != NONE_TRAIT;
}
