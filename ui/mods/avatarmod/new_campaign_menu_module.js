NewCampaignMenuModule.prototype.avatarMod = function ()
{	
	var self = this;
	var contentContainer = this.mDialogContainer.findDialogContentContainer();
	
	//TODO: third panel add option to not use avatar mod
	var columns = $(this.mThirdPanel).find(".column");
	var thirdPanelRightColumn = $(columns[1]);
	var row = $('<div class="row" />');
	thirdPanelRightColumn.append(row);
	
	var title = $('<div class="title title-font-big font-color-title">Avatar Mode</div>');
	row.append(title);

	var avatarControl = $('<div class="control ironman-control"/>');
	row.append(avatarControl);
	this.mAvatarCheckbox = $('<input type="checkbox" id="cb-avatar-check" checked/>');
	avatarControl.append(this.mAvatarCheckbox);
	this.mAvatarCheckboxLabel = $('<label class="text-font-normal font-color-subtitle" for="cb-iron-man">Avatar</label>');
	avatarControl.append(this.mAvatarCheckboxLabel);
	this.mAvatarCheckbox.iCheck({
		checkboxClass: 'icheckbox_flat-orange',
		radioClass: 'iradio_flat-orange',
		increaseArea: '30%'
	});
	
	this.mAvatarCheckbox.on("ifToggled", function ()
	{
		self.handleAvatarPanels();
	});
	
	//on click
	
	//FOURTH PANEL
	
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

		var inputLayout = $('<div class="l-text-area"/>');
		
		row.append(inputLayout);
		var outline = $('<div class="avatar-history-border"/>')
		inputLayout.append(outline);
		
		this.avatarHistory = $('<textarea class="history-input"/>')
		outline.append(this.avatarHistory);
		this.textAreaSanitizer(this.avatarHistory);
		
		var row = $('<div class="row" />');
		rightColumn.append(row);
		
		var title = $('<div class="title title-font-big font-color-title">Appearance Mode</div>');
		//row.append(title);

		var appearanceControl = $('<div class="control ironman-control"/>');
		row.append(appearanceControl);
		this.mAppearanceCheckbox = $('<input type="checkbox" id="cb-appearance-check" checked/>');
		appearanceControl.append(this.mAppearanceCheckbox);
		this.mAppearanceCheckboxLabel = $('<label class="text-font-normal font-color-subtitle" for="cb-iron-man">Edit appearance</label>');
		appearanceControl.append(this.mAppearanceCheckboxLabel);
		this.mAppearanceCheckbox.iCheck({
			checkboxClass: 'icheckbox_flat-orange',
			radioClass: 'iradio_flat-orange',
			increaseArea: '30%'
		});
	
		this.mAppearanceCheckbox.on("ifToggled", function ()
		{
			self.handleAvatarPanels();
		});
			
		
	//fifth panel
	this.mFifthPanel = $('<div class="display-none fifth-panel"/>');
	contentContainer.append(this.mFifthPanel);
	this.appearanceModule = new AvatarAppearanceModule( this.mSQHandle);
	this.appearanceModule.createDIV(this.mFifthPanel);
	
		
	this.panels = [this.mFirstPanel, this.mSecondPanel, this.mThirdPanel, this.mFourthPanel, this.mFifthPanel];
	this.currentPanel = 0;
		
	
	this.mStartButton.unbind("click");
	this.mStartButton.on("click", function ()
	{
		if (self.currentPanel == 0)
		{
			self.notifyBackendOriginSelected();
		}
		
		if(self.currentPanel == (self.panels.length -1))
		{
			self.notifyBackendStartButtonPressed()
			return;
		}
		self.currentPanel++;
		self.updatePanels();
		
			
	});
	
	this.mCancelButton.unbind("click");
	this.mCancelButton.on("click", function ()
    {
		if (self.currentPanel == 0)
		{
			self.notifyBackendCancelButtonPressed();
		}
		else
		{
			self.currentPanel--;
		}
		
		self.updatePanels();
		
    	
    });
}

NewCampaignMenuModule.prototype.updatePanels = function()
{	

	if(this.currentPanel == 0)
	{
		this.mCancelButton.changeButtonText("Cancel");
	}
	else
	{
		this.mCancelButton.changeButtonText("Previous");
	}
	
	if(this.currentPanel == 1)
	{
		this.mStartButton.enableButton(this.mCompanyName.getInputTextLength() >= 1);
	}
	
	if (this.currentPanel == (this.panels.length -1))
	{
		this.mStartButton.changeButtonText("Start");
	}
	else
	{
		this.mStartButton.changeButtonText("Next");
	}
	
	for(var i = 0; i < this.panels.length; i++)
	{
		if(i == this.currentPanel)
		{
			this.panels[i].addClass('display-block').removeClass('display-none');
		}
		else
		{
			this.panels[i].removeClass('display-block').addClass('display-none');
		}
	}
}

NewCampaignMenuModule.prototype.handleAvatarPanels = function()
{	
	if (this.panels.length > 3)
	{
		this.panels.splice(3);
	}
	
	var avatarActive = this.mAvatarCheckbox.is(':checked');
	if(avatarActive)
	{
		this.panels.push(this.mFourthPanel);
		var appearanceActive = this.mAppearanceCheckbox.is(':checked');
		if (appearanceActive)
		{
			
			this.panels.push(this.mFifthPanel);
		}
	}
	
	this.updatePanels();
}



var AvatarMod = {};

AvatarMod.show = NewCampaignMenuModule.prototype.show;
NewCampaignMenuModule.prototype.show = function()
{
	this.currentPanel = 0;
	AvatarMod.show.call(this);
	this.updatePanels();
}

AvatarMod.collectSettings = NewCampaignMenuModule.prototype.collectSettings;
NewCampaignMenuModule.prototype.collectSettings = function ()
{
	var settings = AvatarMod.collectSettings.call(this);
	settings.push(this.collectAvatarSettings());
	return settings;
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
	
	this.background = settings.backgrounds[0];
	this.backgroundIndex = 0;
	this.backgroundList = settings.backgrounds;
	this.backgroundImage.attr('src', Path.GFX + this.background.icon);
	this.backgroundImage.bindTooltip({ contentType: 'verbatim', 
		tooltip : [{
			id: 1,
			type : "title",
			text : this.background.name }]
	});
	this.startingLevel = settings.characterInfo.startingLevel;
	
	this.avatarName.setInputText(settings.characterInfo.characterName);
	this.avatarHistory.val(settings.characterInfo.characterHistory);
	this.pointsModule.totalPoints = settings.totalPoints;
	this.pointsModule.changePoints(0);
	this.pointsModule.totalTalents = settings.totalTalents;
	this.pointsModule.changeTalents(0);
	this.pointsModule.currentPoints = 0;
	this.traitsModule.resetTraits();
	
	this.backgroundPrev.enableButton(this.backgroundList.length > 1);
	this.backgroundNext.enableButton(this.backgroundList.length > 1);

	
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
    
	this.pointsModule = new AvatarPointsModule(parentDiv);
	//this.pointsModule.initialize(parentDiv);
	
	
	
	this.avatarSkills = {};

	$.each(skillConfigs, function(_skill, _skillConfig)
	{
		self.avatarSkills[_skill] = new AvatarAttributesModule(parentDiv, _skill, _skillConfig, self.pointsModule);
		//self.avatarSkills[_skill].initialize(parentDiv);
	});

    

    return;
};



NewCampaignMenuModule.prototype.createTraitsContent = function (parentDiv) {
	this.traitsModule = new AvatarTraitsModule(parentDiv, this.pointsModule);
}


NewCampaignMenuModule.prototype.createBackgroundContent = function (parentDiv) {
	
	var row = $('<div class="row background" />');
	parentDiv.append(row);
	var span = $('<span class="background-control" />');
	
	
	this.backgroundImage = $('<img/>');
	this.backgroundLabel = $('<label class="background-title title-font-big font-color-title ">Background: </label>');
	row.append(this.backgroundLabel);
	row.append(span);
	
	var wrapper = span;
	
	var self = this;
	this.backgroundPrev = wrapper.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function ()
	{
		self.backgroundIndex--;
		self.backgroundIndex = (self.backgroundIndex + self.backgroundList.length ) % self.backgroundList.length;
		self.background = self.backgroundList[self.backgroundIndex];
		self.backgroundImage.attr('src', Path.GFX + self.background.icon);
		self.backgroundImage.bindTooltip({ contentType: 'verbatim', 
			tooltip : [{
				id: 1,
				type : "title",
				text : self.background.name }]
		});
		//self.backgroundLabel.text(self.background.name);
		self.getBackgroundSettings();
	}, 'avatar-arrow-button', 6);
	
	wrapper.append(this.backgroundImage);
	
	this.backgroundNext = wrapper.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function ()
	{
		self.backgroundIndex++;
		self.backgroundIndex = (self.backgroundIndex + self.backgroundList.length ) % self.backgroundList.length;
		self.background = self.backgroundList[self.backgroundIndex];
		self.backgroundImage.attr('src', Path.GFX + self.background.icon);
		self.backgroundImage.bindTooltip({ contentType: 'verbatim', 
			tooltip : [{
				id: 1,
				type : "title",
				text : self.background.name }]
		});
		//self.backgroundLabel.text(self.background.name);
		self.getBackgroundSettings();
	}, 'avatar-arrow-button', 6);
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
	var avatarActive = this.mAvatarCheckbox.is(':checked');
	var appearanceActive = this.mAppearanceCheckbox.is(':checked');
	
	
	var avatarSettings = {
		active : avatarActive,
		attributes : attributes,
		background : this.background,
		traits : traits,
		characterName : characterName,
		characterHistory : characterHistory,
		startingLevel : this.startingLevel,
		setAppearance : appearanceActive
	};
	return avatarSettings;
}


NewCampaignMenuModule.prototype.getBackgroundSettings = function() {
	var self = this;
	
	if (this.mSQHandle !== null)
	{
		SQ.call(this.mSQHandle, 'getBackgroundSettings', 
			{background: this.background.fileName, scenarioID: this.mScenarios[this.mSelectedScenario].ID},
		function(settings){
			
			self.traitsModule.setTraitsCollection(settings.traits);
			self.traitsModule.resetTraits();
			self.pointsModule.currentPoints = 0;
			self.pointsModule.changePoints(0);
			for(skill in settings.attributes) {
				var attr = settings.attributes[skill];
				self.avatarSkills[skill].setValues(attr.value, attr.min, attr.max, attr.baseValue, attr.pointsWeight);

			}
			
			
			
		});
	}
}

NewCampaignMenuModule.prototype.textAreaSanitizer = function (_element)
{
	var data = { denyMultiProcess: false }
	_element.on('keydown.input', null, _element, function (_event)
	{
		
		var self = _event.data;
        var data = self.data('input');
		var code = _event.which || _event.keyCode;
		if (code === KeyConstants.Tabulator ||
            code === KeyConstants.ArrowLeft ||
            code === KeyConstants.ArrowRight ||
            code === KeyConstants.ArrowUp ||
            code === KeyConstants.ArrowDown
            )
        {
           	if(data.denyMultiProcess)
			{
				self.data('input', data);
				return false;
			}
			data.denyMultiProcess = true;
			self.data('input', data);
			return true;
        }

        var self = _event.data;
        var data = self.data('input');		
		
		if(_event.ctrlKey && code == KeyConstants.V)
		{
			if(data.denyMultiProcess)
			{
				self.data('input', data);
				return false;
			}
			data.denyMultiProcess = true;
			self.data('input', data);

		}

        self.data('input', data);

        return true;
    });
	
	_element.on('keyup.input', null, _element, function (_event)
	{
        var self = _event.data;
		var data = self.data('input');

		data.denyMultiProcess = false;

        self.data('input', data);
    });
	
	_element.data('input', data);
}


Screens["MainMenuScreen"].mNewCampaignModule.avatarMod();
