NewCampaignMenuModule.prototype.avatarMod = function ()
{	
	var self = this;
	var contentContainer = this.mDialogContainer.findDialogContentContainer();
	
	this.mFourthPanel = $('<div class="display-none fourth-panel"/>');
	contentContainer.append(this.mFourthPanel);

		var leftColumn = $('<div class="column" />');
		this.mFourthPanel.append(leftColumn);
		
		var row = $('<div class="row" />');
		leftColumn.append(row);
		var title = $('<div class="title title-font-big font-color-title">Company Name</div>');
		row.append(title);

		var inputLayout = $('<div class="l-input"/>');
		row.append(inputLayout);
		this.mCompanyName = inputLayout.createInput('Battle Brothers', 0, 32, 1, function (_input)
		{
			if(self.mStartButton !== null) self.mStartButton.enableButton(_input.getInputTextLength() >= 1);
		}, 'title-font-big font-bold font-color-brother-name'); 
		this.mCompanyName.setInputText('Battle Brothers');
		

		this.createSkillsContent(leftColumn);
	
		
	
	this.mStartButton.unbind("click");
	this.mStartButton.on("click", function ()
	{
		
		if(self.mFirstPanel.hasClass('display-block'))
		{
			self.mFirstPanel.removeClass('display-block').addClass('display-none');
			self.mSecondPanel.addClass('display-block').removeClass('display-none');
			self.mCancelButton.changeButtonText("Previous");
			self.mStartButton.enableButton(self.mCompanyName.getInputTextLength() >= 1);
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

NewCampaignMenuModule.prototype.createSkillsContent = function (parentDiv)
{
    var self = this;
	
	statsRows =
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
            Progressbar: null,
			Talent: null,
            Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
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
			Progressbar: null,
			Talent: null,
			Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
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
            Progressbar: null,
            Talent: null,
            Button: null
        }
    };
    


	$.each(statsRows, function(_skill, _skillValue)
	{
		self.createSkillsContentRow(_skill, _skillValue, parentDiv);
	});

    

    return;
};


NewCampaignMenuModule.prototype.createSkillsContentRow = function (_skill, _skillValue, _parentDiv)
{
    var self = this;


	var row = $('<div class="row"/>');
	_parentDiv.append(row);
	// row.bindTooltip({ contentType: 'ui-element', elementId: _skillValue.TooltipId });

	// var image = $('<img/>');
	// image.attr('src', _skillValue.IconPath);
	// row.append(image);
	
	//TODO: talents
	//_skillValue.Talent = $('<img class="talent" src="' + Path.GFX + 'ui/icons/talent_' + _stats[_skillValue.TalentIdentifier] + '.png"/>');
	//_skillValue.Talent.css({ 'width': '3.6rem', 'height': '1.8rem' });
	//row.append(_skillValue.Talent);

	var progressbarLayout = $('<div class="l-progressbar-container"/>');
	row.append(progressbarLayout);
	_skillValue.Progressbar = progressbarLayout.createProgressbar(true, _skillValue.StyleName);
	
	_skillValue.Progressbar.changeProgressbarNormalWidth(50, 100, true);
	_skillValue.Progressbar.changeProgressbarLabel('' + 50);
	

	// var buttonLayout = $('<div class="banner-container"/>');
	// row.append(buttonLayout);

	// _skillValue.Button = buttonLayout.createTextButton("+", function(_button)
	// _skillValue.Button = buttonLayout.createTextButton("+", function(_button)
	// {
	//	/*skill value button clicked*/
	// }, 'next-banner-button', 8);
	
	// todo: check if I need this data
	//_skillValue.Button.data('stat', _skill);
	//_skillValue.Button.data('isIncreased', false);

};


Screens["MainMenuScreen"].mNewCampaignModule.avatarMod();