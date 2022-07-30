NewCampaignMenuModule.prototype.avatarMod = function ()
{	
	var self = this;
	var contentContainer = this.mDialogContainer.findDialogContentContainer();
	
	this.mFourthPanel = $('<div class="display-none fourth-panel"/>');
	contentContainer.append(this.mFourthPanel);

		var leftColumn = $('<div class="column" />');
		this.mFourthPanel.append(leftColumn);
		
		
		
		

		this.createSkillsContent(leftColumn);
		this.createTraitsContent(leftColumn);
		
		
		var rightColumn = $('<div class="column" />');
		this.mFourthPanel.append(rightColumn);
		
		this.createBackgroundContent(rightColumn);
		
		//AVATAR NAME
		
		var row = $('<div class="row" />');
		rightColumn.append(row);
		var title = $('<div class="title-font-big font-color-title">Name:</div>');
		row.append(title);

		var inputLayout = $('<div class="l-input"/>');
		row.append(inputLayout);
		this.avatarName = inputLayout.createInput('Avatar', 0, 32, 1, undefined, 'title-font-big font-bold font-color-brother-name'); 
		this.avatarName.setInputText('Avatar');
		
		//AVATAR BACKGROUND TEXT
		
		var row = $('<div class="row" />');
		rightColumn.append(row);
		var title = $('<div class="title-font-big font-color-title">History:</div>');
		row.append(title);

		var inputLayout = $('<div class="l-input"/>');
		row.append(inputLayout);
		var outline = $('<div class="avatar-history-border"/>')
		inputLayout.append(outline);
		this.avatarHistory = $('<input class="avatar-history title-font-normal"  ></input>'); 
		this.avatarHistory.val('Write your history here...');
		outline.append(this.avatarHistory);
		this.avatarHistory.focus(function() {
			outline.addClass("focused");
		});
		this.avatarHistory.focusout(function() {
			outline.removeClass("focused");
		});
		this.avatarHistoryPasteEvent = false;
		this.avatarHistory.on("paste",function(e) {
			var text = e.originalEvent.clipboardData.getData('Text');
			console.log(text);
			e.preventDefault();
			if(self.avatarHistoryPasteEvent) {
				return;
			}
			self.avatarHistoryPasteEvent = true;
			event = e;
			setTimeout(function() {
				self.avatarHistory.val(event.originalEvent.clipboardData.getData('Text'));
				self.avatarHistoryPasteEvent = false;
			}, 1000);
	   });

	
		
	
	this.mStartButton.unbind("click");
	this.mStartButton.on("click", function ()
	{
		
		if(self.mFirstPanel.hasClass('display-block'))
		{
			self.mFirstPanel.removeClass('display-block').addClass('display-none');
			self.mSecondPanel.addClass('display-block').removeClass('display-none');
			self.mCancelButton.changeButtonText("Previous");
			self.mStartButton.enableButton(self.mCompanyName.getInputTextLength() >= 1);
			self.notifyBackendOriginSelected();
		}
		else if(self.mSecondPanel.hasClass('display-block'))
		{
			self.mSecondPanel.removeClass('display-block').addClass('display-none');
			self.mThirdPanel.addClass('display-block').removeClass('display-none');
		}
		else if(self.mThirdPanel.hasClass('display-block'))
		{
			self.mThirdPanel.removeClass('display-block').addClass('display-none');
			self.mFourthPanel.addClass('display-block').removeClass('display-none');
			self.mStartButton.changeButtonText("Start");
		}
		else
		{
			self.notifyBackendStartButtonPressed();
		}    	
	});
	
	this.mCancelButton.unbind("click");
	this.mCancelButton.on("click", function ()
    {
    	if(self.mFirstPanel.hasClass('display-block'))
    	{
            self.notifyBackendCancelButtonPressed();
        }
        else if(self.mThirdPanel.hasClass('display-block'))
        {
            self.mSecondPanel.addClass('display-block').removeClass('display-none');
            self.mThirdPanel.removeClass('display-block').addClass('display-none');
            self.mStartButton.changeButtonText("Next");
            self.mCancelButton.changeButtonText("Previous");
        }
		else if(self.mFourthPanel.hasClass('display-block'))
        {
            self.mThirdPanel.addClass('display-block').removeClass('display-none');
            self.mFourthPanel.removeClass('display-block').addClass('display-none');
            self.mStartButton.changeButtonText("Next");
            self.mCancelButton.changeButtonText("Previous");
        }
    	else
    	{
			self.mFirstPanel.addClass('display-block').removeClass('display-none');
			self.mSecondPanel.removeClass('display-block').addClass('display-none');
			self.mStartButton.changeButtonText("Next");
            self.mCancelButton.changeButtonText("Cancel");
            self.mStartButton.enableButton(true);
    	}    	
    });
}

NewCampaignMenuModule.prototype.notifyBackendStartButtonPressed = function ()
{
	if (this.mSQHandle !== null)
	{
		var settings = this.collectSettings();
		settings["avatarSettings"] = this.collectAvatarSettings();
		SQ.call(this.mSQHandle, 'onStartButtonPressed', settings);
	}
};

NewCampaignMenuModule.prototype.notifyBackendOriginSelected = function() {
	if (this.mSQHandle !== null)
	{
		if (this.mScenarios != null) {
			var selectedScenario = this.mScenarios[this.mSelectedScenario];
			SQ.call(this.mSQHandle, 'onCampaignOriginSelected', selectedScenario.ID);
		}
		
		
	}
}

NewCampaignMenuModule.prototype.avatarSettings = function(settings) {
	
	
	this.setAvatarSettings(settings.global);
	this.setAvatarSettings(settings.scenario);

	
}

NewCampaignMenuModule.prototype.setAvatarSettings = function(settings) {
	
	

	
	for(skill in settings.attributes) {
		var attr = settings.attributes[skill];
		this.avatarSkills[skill].setValues(attr.value, attr.min, attr.max, attr.baseValue, attr.pointsWeight);
	}
	
	this.traitsModule.setTraitsCollection(settings.traits);
	
	this.background = settings.background;
	this.backgroundImage.attr('src', Path.GFX + settings.background.icon);
	
	this.avatarName.setInputText(settings.background.characterName);
	this.avatarHistory.val(settings.background.characterHistory);
	this.pointsControl.totalPoints = settings.totalPoints;
	this.pointsControl.changePoints(0);
	this.pointsControl.totalTalents = settings.totalTalents;
	this.pointsControl.changeTalents(0);
	

	
}

NewCampaignMenuModule.prototype.createSkillsContent = function (parentDiv)
{
    var self = this;
	
	skillConfigs =
	{
		Hitpoints:
		{
            IconPath: Path.GFX + Asset.ICON_HEALTH,
            StyleName: ProgressbarStyleIdentifier.Hitpoints,
            TooltipId: TooltipIdentifier.CharacterStats.Hitpoints,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.Hitpoints,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.HitpointsMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.HitpointsIncrease,
			TalentIdentifier: 'hitpointsTalent',
        },

		Stamina:
		{
            IconPath: Path.GFX + Asset.ICON_FATIGUE,
            StyleName: ProgressbarStyleIdentifier.Fatigue,
            TooltipId: TooltipIdentifier.CharacterStats.MaximumFatigue,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.Fatigue,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.FatigueMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.FatigueIncrease,
            TalentIdentifier: 'fatigueTalent',
        },

		Bravery:
		{
			IconPath: Path.GFX + Asset.ICON_BRAVERY,
			StyleName: ProgressbarStyleIdentifier.Bravery,
			TooltipId: TooltipIdentifier.CharacterStats.Bravery,
			ProgressbarValueIdentifier: ProgressbarValueIdentifier.Bravery,
			ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.BraveryMax,
			StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.BraveryIncrease,
			TalentIdentifier: 'braveryTalent',
		},

		Initiative:
		{
            IconPath: Path.GFX + Asset.ICON_INITIATIVE,
            StyleName: ProgressbarStyleIdentifier.Initiative,
            TooltipId: TooltipIdentifier.CharacterStats.Initiative,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.Initiative,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.InitiativeMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.InitiativeIncrease,
            TalentIdentifier: 'initiativeTalent',
        },
		MeleeSkill:
		{
            IconPath: Path.GFX + Asset.ICON_MELEE_SKILL,
            StyleName: ProgressbarStyleIdentifier.MeleeSkill,
            TooltipId: TooltipIdentifier.CharacterStats.MeleeSkill,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.MeleeSkill,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.MeleeSkillMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.MeleeSkillIncrease,
            TalentIdentifier: 'meleeSkillTalent',
        },

		RangedSkill:
		{
            IconPath: Path.GFX + Asset.ICON_RANGE_SKILL,
            StyleName: ProgressbarStyleIdentifier.RangeSkill,
            TooltipId: TooltipIdentifier.CharacterStats.RangeSkill,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.RangeSkill,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.RangeSkillMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.RangeSkillIncrease,
            TalentIdentifier: 'rangeSkillTalent',
        },

		MeleeDefense:
		{
            IconPath: Path.GFX + Asset.ICON_MELEE_DEFENCE,
            StyleName: ProgressbarStyleIdentifier.MeleeDefense,
            TooltipId: TooltipIdentifier.CharacterStats.MeleeDefense,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.MeleeDefense,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.MeleeDefenseMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.MeleeDefenseIncrease,
            TalentIdentifier: 'meleeDefenseTalent',
        },

		RangedDefense:
		{
            IconPath: Path.GFX + Asset.ICON_RANGE_DEFENCE,
            StyleName: ProgressbarStyleIdentifier.RangeDefense,
            TooltipId: TooltipIdentifier.CharacterStats.RangeDefense,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.RangeDefense,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.RangeDefenseMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.RangeDefenseIncrease,
            TalentIdentifier: 'rangeDefenseTalent',
        }
    };
    
	this.pointsControl = new PointsControl(parentDiv);
	//this.pointsControl.initialize(parentDiv);
	
	
	
	this.avatarSkills = {};

	$.each(skillConfigs, function(_skill, _skillConfig)
	{
		self.avatarSkills[_skill] = new AvatarSkillModule(parentDiv, _skill, _skillConfig, self.pointsControl);
		//self.avatarSkills[_skill].initialize(parentDiv);
	});

    

    return;
};

var PointsControl = function(parentDiv) {
	
	this.totalPoints = 100;
	this.currentPoints = 0;
	
	this.totalTalents = 9;
	this.currentTalents = 0;
	
	var row = $('<div class="row" />');
	parentDiv.append(row);
	var title = $('<div class="title-font-big font-color-title"></div>');
	row.append(title);
	this.pointsDiv = $('<label style="margin-right: 2rem"/>');
	this.pointsDiv.text('Points: ' + this.currentPoints + '/'+ this.totalPoints);
	title.append(this.pointsDiv);
	
	
	this.talentsDiv = $('<label/>');
	this.talentsDiv.text('Talents: ' + this.currentTalents + '/'+ this.totalTalents);
	title.append(this.talentsDiv);
	
	
	this.initialize = function(parentDiv) {

	};
	
	this.changePoints = function(value) {
		this.currentPoints+=+value;
		this.pointsDiv.text('Points: ' + this.currentPoints + '/'+ this.totalPoints);
	};
	
	this.availablePoints = function() {
		return this.totalPoints - this.currentPoints;
	};
	
	this.changeTalents = function(value) {
		this.currentTalents+=value;
		this.talentsDiv.text('Talents: ' + this.currentTalents + '/'+ this.totalTalents);
	};
	
	this.availableTalents = function() {
		return this.totalTalents - this.currentTalents;
	};
}

NewCampaignMenuModule.prototype.createTraitsContent = function (parentDiv) {
	this.traitsModule = new MultipleTraitsModule(parentDiv, this.pointsControl);
}


NewCampaignMenuModule.prototype.createBackgroundContent = function (parentDiv) {
	
	var row = $('<div class="row" />');
	parentDiv.append(row);
	this.backgroundImage = $('<img/>');
	row.append($('<label class="background-title title-font-big font-color-title ">Background: </label>'));
	row.append(this.backgroundImage);
}



NewCampaignMenuModule.prototype.collectAvatarSettings = function(){
	
	var attributes = {};
	for(attributeName in this.avatarSkills) {
		attributes[attributeName] = {
			value : this.avatarSkills[attributeName].value,
			talents : this.avatarSkills[attributeName].talents
		}
	}
	
	var traits = [];
	if (this.traitsModule.traitModule1.isSelected()) {
		traits.push(this.traitsModule.traitModule1.selectedTrait);
	}
	if (this.traitsModule.traitModule2.isSelected()) {
		traits.push(this.traitsModule.traitModule2.selectedTrait);
	}
	
	var characterName = this.avatarName.getInputText();
	var characterHistory = this.avatarHistory.val();
	var avatarSettings = {
		attributes : attributes,
		background : this.background,
		traits : traits,
		characterName : characterName,
		characterHistory : characterHistory
	};
	return avatarSettings;
}


Screens["MainMenuScreen"].mNewCampaignModule.avatarMod();