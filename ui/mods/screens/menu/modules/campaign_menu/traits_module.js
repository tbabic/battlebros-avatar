var NONE_TRAIT = {
	name : "None"
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
		this.getTraitModules().forEach(t => t.refreshButtons());
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
		let image = $('<img class="trait-img"/>');
		image.attr('src', Path.GFX + this.selectedTrait.icon);
		this.display.append(image);
	} else {
		this.display.text(this.selectedTrait.name);
	}
	
	
	
	this.parentModule.refreshAllButtons();
}

TraitModule.prototype.refreshButtons = function() {
	let anyAvailable = this.anyAvailableTrait();
	this.leftButton.enableButton(anyAvailable);
	this.rightButton.enableButton(anyAvailable);
}

TraitModule.prototype.getNextTrait = function(direction) {
	let currentIndex = this.parentModule.traits.indexOf(this.selectedTrait);
	let newTrait = this.selectedTrait;
	do {
		currentIndex += +direction; //-1 or +1
		currentIndex = (this.parentModule.traits.length + currentIndex) % this.parentModule.traits.length;
		newTrait = this.parentModule.traits[currentIndex];
	} while(!this.isTraitAvailable(newTrait));
	return newTrait;
	
}

TraitModule.prototype.chooseNextTrait = function(direction) {
	let trait = this.getNextTrait(direction);
	if (trait != this.selectedTrait) {
		this.selectedTrait = trait;
		this.refresh();
	}
	
}

TraitModule.prototype.anyAvailableTrait = function() {
	return this.getNextTrait(+1) != this.selectedTrait;
}

TraitModule.prototype.isTraitAvailable = function(trait) {
	if (trait == NONE_TRAIT) {
		return true;
	}
	let selectedTraits = this.parentModule.getTraitModules()
				.filter(module => module != this && module.selectedTrait != NONE_TRAIT)
				.map(module => module.selectedTrait);
				
	return selectedTraits.indexOf(trait) == -1;
}
