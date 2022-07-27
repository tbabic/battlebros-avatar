NewCampaignMenuModule.prototype.avatarMod = function ()
{	
	var self = this;
	var contentContainer = this.mDialogContainer.findDialogContentContainer();
	
	this.mFourthPanel = $('<div class="display-none fourth-panel"/>');
	contentContainer.append(this.mFourthPanel);

		var leftColumn = $('<div class="column" />');
		this.mFourthPanel.append(leftColumn);
		
		// var row = $('<div class="row" />');
		// leftColumn.append(row);
		// var title = $('<div class="title title-font-big font-color-title">Company Name</div>');
		// row.append(title);

		// var inputLayout = $('<div class="l-input"/>');
		// row.append(inputLayout);
		// this.avatarName = inputLayout.createInput('Battle Brothers', 0, 32, 1, function (_input)
		// {
			// if(self.mStartButton !== null) self.mStartButton.enableButton(_input.getInputTextLength() >= 1);
		// }, 'title-font-big font-bold font-color-brother-name'); 
		// this.avatarName.setInputText('Battle Brothers');
		
		

		this.createSkillsContent(leftColumn);
		
		
		var rightColumn = $('<div class="column" />');
		this.mFourthPanel.append(rightColumn);
		
		this.createBackgroundContent(rightColumn);
	
		
	
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

NewCampaignMenuModule.prototype.notifyBackendOriginSelected = function() {
	if (this.mSQHandle !== null)
	{
		if (this.mScenarios != null) {
			var selectedScenario = this.mScenarios[this.mSelectedScenario];
			SQ.call(this.mSQHandle, 'onCampaignOriginSelected', selectedScenario.ID);
		}
		
		
	}
}

NewCampaignMenuModule.prototype.avatarData = function(data) {
	//TODO: data from backend about background for selected origin
	this.backgroundData = data;
	
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
			defaultMin : 50,
			defaultMax : 60,
			defaultValue: 55,
			pointsWeight: 4
        },

		Fatigue:
		{
            IconPath: Path.GFX + Asset.ICON_FATIGUE,
            StyleName: ProgressbarStyleIdentifier.Fatigue,
            TooltipId: TooltipIdentifier.CharacterStats.MaximumFatigue,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.Fatigue,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.FatigueMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.FatigueIncrease,
            TalentIdentifier: 'fatigueTalent',
			defaultMin : 90,
			defaultMax : 100,
			defaultValue: 95,
			pointsWeight: 4
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
			defaultMin : 30,
			defaultMax : 40,
			defaultValue: 35,
			pointsWeight: 4
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
			defaultMin : 100,
			defaultMax : 110,
			defaultValue: 105,
			pointsWeight: 3
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
			defaultMin : 47,
			defaultMax : 57,
			defaultValue: 52,
			pointsWeight: 6
        },

		RangeSkill:
		{
            IconPath: Path.GFX + Asset.ICON_RANGE_SKILL,
            StyleName: ProgressbarStyleIdentifier.RangeSkill,
            TooltipId: TooltipIdentifier.CharacterStats.RangeSkill,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.RangeSkill,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.RangeSkillMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.RangeSkillIncrease,
            TalentIdentifier: 'rangeSkillTalent',
			defaultMin : 32,
			defaultMax : 42,
			defaultValue: 37,
			pointsWeight: 4
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
			defaultMin : 0,
			defaultMax : 5,
			defaultValue: 2,
			pointsWeight: 6
        },

		RangeDefense:
		{
            IconPath: Path.GFX + Asset.ICON_RANGE_DEFENCE,
            StyleName: ProgressbarStyleIdentifier.RangeDefense,
            TooltipId: TooltipIdentifier.CharacterStats.RangeDefense,
            ProgressbarValueIdentifier: ProgressbarValueIdentifier.RangeDefense,
            ProgressbarValueIdentifierMax: ProgressbarValueIdentifier.RangeDefenseMax,
            StatValueIdentifier: CharacterScreenIdentifier.Entity.Character.LevelUp.RangeDefenseIncrease,
            TalentIdentifier: 'rangeDefenseTalent',
			defaultMin : 0,
			defaultMax : 5,
			defaultValue: 2,
			pointsWeight: 4
        }
    };
    
	this.pointsControl = new PointsControl();
	this.pointsControl.initialize(parentDiv);
	
	
	
	this.avatarSkills = {};

	$.each(skillConfigs, function(_skill, _skillConfig)
	{
		self.avatarSkills[_skill] = new AvatarSkillModule(_skill, _skillConfig, self.pointsControl);
		self.avatarSkills[_skill].initialize(parentDiv);
	});

    

    return;
};

var PointsControl = function() {
	
	this.totalPoints = 100;
	this.currentPoints = 0;
	
	this.totalTalents = 9;
	this.currentTalents = 0;
	
	
	
	
	this.initialize = function(parentDiv) {
		
		var row = $('<div class="row" />');
		parentDiv.append(row);
		var title = $('<div class="title title-font-big font-color-title"></div>');
		row.append(title);
		this.pointsDiv = $('<label style="margin-right: 2rem"/>');
		this.changePoints(0);
		title.append(this.pointsDiv);
		
		
		this.talentsDiv = $('<label/>');
		this.changeTalents(0);
		title.append(this.talentsDiv);
		
	};
	
	this.changePoints = function(value) {
		this.currentPoints+=value;
		this.pointsDiv.text('Points: ' + this.currentPoints + '/'+ this.totalPoints)
	};
	
	this.availablePoints = function() {
		return this.totalPoints - this.currentPoints;
	};
	
	this.changeTalents = function(value) {
		this.currentTalents+=value;
		this.talentsDiv.text('Talents: ' + this.currentTalents + '/'+ this.totalTalents)
	};
	
	this.availableTalents = function() {
		return this.totalTalents - this.currentTalents;
	};
}

NewCampaignMenuModule.prototype.createBackgroundContent = function (parentDiv) {
}





Screens["MainMenuScreen"].mNewCampaignModule.avatarMod();