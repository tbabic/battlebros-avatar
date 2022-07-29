var AvatarSkillModule = function(name, skillConfig, pointsControl) {
	this.name = name;
	this.config = skillConfig;
	this.pointsControl = pointsControl;
	
	this.maxDefaultValue = skillConfig.defaultMax;
	this.minDefaultValue = skillConfig.defaultMin;
	this.defaultValue = skillConfig.defaultValue;
	
	this.maxValue = skillConfig.defaultMax;
	this.minValue = skillConfig.defaultMin;
	this.value = skillConfig.defaultValue;
	this.talents = 0;
	this.pointsWeight = skillConfig.pointsWeight;
	
	
	
	

}

AvatarSkillModule.prototype.initialize = function(_parentDiv) {
	
	

	
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

	
	
}

AvatarSkillModule.prototype.setValues = function(value, min, max) {
	this.value = value;
	this.minValue = min;
	this.maxValue = max;
	this.visualizeSkillValue();
}

AvatarSkillModule.prototype.increaseSkill = function() {
	if (this.value >= this.maxValue) {
		return;
	}
	var cost = this.skillIncreaseCost();
	if (cost > this.pointsControl.availablePoints()) {
		return;
	}
	this.value++;
	this.pointsControl.changePoints(cost);
	this.visualizeSkillValue();
	
}

AvatarSkillModule.prototype.decreaseSkill = function() {
	if (this.value <= this.minValue) {
		return;
	}
	var cost = this.skillDecreaseCost();
	this.value--;
	this.pointsControl.changePoints(-cost);
	this.visualizeSkillValue();
	
}


AvatarSkillModule.prototype.increaseTalents = function() {
	if (this.talents >= 3 || this.pointsControl.availabvaralents() <= 0) {
		return;
	}
	
	this.talents++;
	this.pointsControl.changeTalents(1);
	this.visualizeTalents();
	
}

AvatarSkillModule.prototype.decreaseTalents = function() {
	if (this.talents <= 0) {
		return;
	}
	this.talents--;
	this.pointsControl.changeTalents(-1);
	this.visualizeTalents();
}

AvatarSkillModule.prototype.visualize = function() {
	this.visualizeSkillValue();
	this.visualizeTalents();
}

AvatarSkillModule.prototype.visualizeSkillValue = function() {
	this.progressbar.changeProgressbarNormalWidth(this.value-this.minValue, this.maxValue-this.minValue, true);
	this.progressbar.changeProgressbarLabel('' + this.value);
	
	var increaseCost = this.skillIncreaseCost();
	if (this.value >= this.maxValue || increaseCost > this.pointsControl.availablePoints()) {
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

AvatarSkillModule.prototype.visualizeTalents = function() {
	this.talentStars.attr("src",Path.GFX + 'ui/icons/talent_' + this.talents + '.png')
	
	if (this.talents >= 3 || this.pointsControl.availabvaralents() <= 0) {
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


AvatarSkillModule.prototype.skillIncreaseCost = function() {
	var baseCost = this.pointsWeight;
	var currentRanks = this.value - this.defaultValue;
	var extraCost = Math.ceil((currentRanks+1)/2) -1;
	
	var cost = Math.max(baseCost, baseCost+extraCost);
	return cost;
	
}

AvatarSkillModule.prototype.skillDecreaseCost = function() {
	
	
	var baseCost = this.pointsWeight;
	var currentRanks = this.value - this.defaultValue;
	var extraCost = Math.ceil((currentRanks)/2) -1;
	
	var cost = Math.max(baseCost, baseCost+extraCost);
	return cost;
}


