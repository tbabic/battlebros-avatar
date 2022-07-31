var AvatarAttributesModule = function(_parentDiv, name, skillConfig, pointsModule) {
	this.name = name;
	this.config = skillConfig;
	this.pointsModule = pointsModule;
	

	
	this.maxValue = 100;
	this.minValue = 0;
	this.value = 50;
	this.base = 50;
	this.talents = 0;
	this.pointsWeight = 4;
	
	var self = this;


	var row = $('<div class="row"/>');
	_parentDiv.append(row);
	

	var image = $('<img/>');
	image.attr('src', this.config.IconPath);
	row.append(image);
	
	//TODO: talents
	this.talentStars = $('<img class="talent" src="' + Path.GFX + 'ui/icons/talent_' + this.talents + '.png"/>');
	this.talentStars.css({ 'width': '3.6rem', 'height': '1.8rem' });
	row.append(this.talentStars);

	var progressbarLayout = $('<div class="l-progressbar-container"/>');
	row.append(progressbarLayout);
	this.progressbar = progressbarLayout.createProgressbar(true, this.config.StyleName);
	this.progressbar.bindTooltip({ contentType: 'ui-element', elementId: this.config.TooltipId });
	
	this.progressbar.changeProgressbarNormalWidth(this.value-this.minValue, this.maxValue-this.minValue, true);
	this.progressbar.changeProgressbarLabel('' + this.value);
	

	var buttonLayout = $('<div class="l-increase-button-container"/>');
	row.append(buttonLayout);
	this.decreaseSkillButton = buttonLayout.createTextButton("-", function() {
		self.decreaseSkill();
	}, 'next-banner-button', 8);
	
	var buttonLayout = $('<div class="l-increase-button-container"/>');
	row.append(buttonLayout);
	this.increaseSkillButton = buttonLayout.createTextButton("+", function() {
		self.increaseSkill();
	}, 'next-banner-button', 8);

	
	//talent buttons
	
	var buttonLayout = $('<div class="l-increase-button-container"/>');
	row.append(buttonLayout);
	var inButtonLayout = $('<img class="talent-button" src="' + Path.GFX + 'ui/icons/talent_1.png"/><span class="talent-button label" >-</>');
	this.decreaseTalentButton = buttonLayout.createCustomButton(inButtonLayout, function() {
		self.decreaseTalents();
	},'next-banner-button', 8);
	this.decreaseTalentButton.enableButton(false);

	var buttonLayout = $('<div class="l-increase-button-container"/>');
	row.append(buttonLayout);
	var inButtonLayout = $('<img class="talent-button" src="' + Path.GFX + 'ui/icons/talent_1.png"/><span class="talent-button label" >+</>');
	this.increaseTalentButton = buttonLayout.createCustomButton(inButtonLayout, function() {
		self.increaseTalents();
	},'next-banner-button', 8);
	
	$(window).on("pointsModule.changed", function() {
		self.visualizeSkillButtons();
		self.visualizeTalentButtons();
	})
	

}
AvatarAttributesModule.prototype.initialize = function(_parentDiv) {

}

AvatarAttributesModule.prototype.setValues = function(value, min, max, base, pointsWeight) {
	this.value = +value;
	this.minValue = +min;
	this.maxValue = +max;
	this.base = +base;
	this.pointsWeight = +pointsWeight;
	this.visualizeSkillValue();
}
AvatarAttributesModule.prototype.increaseSkill = function() {
	if (this.value >= this.maxValue) {
		return;
	}
	var cost = this.skillIncreaseCost();
	if (cost > this.pointsModule.availablePoints()) {
		return;
	}
	this.value++;
	this.pointsModule.changePoints(cost);
	this.visualizeSkillValue();
	
}
AvatarAttributesModule.prototype.decreaseSkill = function() {
	if (this.value <= this.minValue) {
		return;
	}
	var cost = this.skillDecreaseCost();
	this.value--;
	this.pointsModule.changePoints(-cost);
	this.visualizeSkillValue();
	
}

AvatarAttributesModule.prototype.increaseTalents = function() {
	if (this.talents >= 3 || this.pointsModule.availableTalents() <= 0) {
		return;
	}
	
	this.talents++;
	this.pointsModule.changeTalents(1);
	this.visualizeTalents();
	
}
AvatarAttributesModule.prototype.decreaseTalents = function() {
	if (this.talents <= 0) {
		return;
	}
	this.talents--;
	this.pointsModule.changeTalents(-1);
	this.visualizeTalents();
}
AvatarAttributesModule.prototype.visualize = function() {
	this.visualizeSkillValue();
	this.visualizeTalents();
}
AvatarAttributesModule.prototype.visualizeSkillValue = function() {
	this.progressbar.changeProgressbarNormalWidth(this.value-this.minValue, this.maxValue-this.minValue, true);
	this.progressbar.changeProgressbarLabel('' + this.value);
	
	this.visualizeSkillButtons();
	
}

AvatarAttributesModule.prototype.visualizeSkillButtons = function() {
	
	
	var increaseCost = this.skillIncreaseCost();
	if (this.value >= this.maxValue || increaseCost > this.pointsModule.availablePoints()) {
		this.increaseSkillButton.enableButton(false);
	} else {
		this.increaseSkillButton.enableButton(true);
	}
	
	if (this.value <= this.minValue) {
		this.decreaseSkillButton.enableButton(false);
	} else {
		this.decreaseSkillButton.enableButton(true);
	}
	
}


AvatarAttributesModule.prototype.visualizeTalents = function() {
	this.talentStars.attr("src",Path.GFX + 'ui/icons/talent_' + this.talents + '.png')
	
	this.visualizeTalentButtons();
}

AvatarAttributesModule.prototype.visualizeTalentButtons = function() {
	this.talentStars.attr("src",Path.GFX + 'ui/icons/talent_' + this.talents + '.png')
	
	if (this.talents >= 3 || this.pointsModule.availableTalents() <= 0) {
		this.increaseTalentButton.enableButton(false);
	} else {
		this.increaseTalentButton.enableButton(true);
	}
	
	if (this.talents <= 0) {
		this.decreaseTalentButton.enableButton(false);
	} else {
		this.decreaseTalentButton.enableButton(true);
	}
}

AvatarAttributesModule.prototype.skillIncreaseCost = function() {
	var baseCost = this.pointsWeight;
	var currentRanks = this.value - this.base;
	var extraCost = Math.ceil((currentRanks+1)/2) -1;
	
	var cost = Math.max(baseCost, baseCost+extraCost);
	return cost;
	
}
AvatarAttributesModule.prototype.skillDecreaseCost = function() {
	
	
	var baseCost = this.pointsWeight;
	var currentRanks = this.value - this.base;
	var extraCost = Math.ceil((currentRanks)/2) -1;
	
	var cost = Math.max(baseCost, baseCost+extraCost);
	return cost;
}


