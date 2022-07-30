this.avatar_manager <- {
	m = {
		globalSettings = {},
		scenarioSettingsMap = {},
	},
	
	function create()
	{
		local a = {
			Hitpoints = [
				50,
				60
			],
			Bravery = [
				30,
				40
			],
			Stamina = [
				90,
				100
			],
			MeleeSkill = [
				47,
				57
			],
			RangedSkill = [
				32,
				42
			],
			MeleeDefense = [
				0,
				5
			],
			RangedDefense = [
				0,
				5
			],
			Initiative = [
				100,
				110
			]
		};

		this.m.globalSettings.attributes <- {};
		foreach(key, value in a)
		{
			local avg = this.Math.floor((value[0] + value[1])/2);
			this.m.globalSettings.attributes[key] <- {};
			this.m.globalSettings.attributes[key].min <- value[0];
			this.m.globalSettings.attributes[key].max <- value[1];
			this.m.globalSettings.attributes[key].value <- avg;
			this.m.globalSettings.attributes[key].baseValue <- avg;
			this.m.globalSettings.attributes[key].pointsWeight <- this.Const.Avatar.SkillWeights[key];
		}
		
		
		local defaultBackground = this.new("scripts/skills/backgrounds/sellsword_background" );
				
		this.m.globalSettings.background <- {
			id = defaultBackground.m.ID,
			name = defaultBackground.m.Name,
			icon = defaultBackground.m.Icon,
			fileName = "sellsword_background",
			characterName = "Sigurd",
			characterHistory = "Write your history here...",
		};
		
		this.m.globalSettings.traits <- getTraitSettingsForBackground(defaultBackground);
		
		this.m.globalSettings.totalPoints <- 50;
		
		this.m.globalSettings.totalTalents <- 9;
		
		
	}
	
	
	function getBackground( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in this.Const.Avatar.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		return this.Const.Avatar.ScenarioBackgrounds[_selectedScenarioId].Background;
	}
	
	function getBackgroundDescription( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in this.Const.Avatar.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		return this.Const.Avatar.ScenarioBackgrounds[_selectedScenarioId].Description;
	}
	
	function getTraitSettingsForBackground( _background) {
		local traits = [];
			
		for( local i = 0; i < this.Const.CharacterTraits.len(); i = ++i )
		{
			local traitArray = this.Const.CharacterTraits[i];
			if (!_background.isExcluded(traitArray[0])) {
				local trait = this.new(traitArray[0]);
				local traitCost = 0;
				if (trait.m.ID in this.Const.Avatar.TraitCosts) {
					traitCost = this.Const.Avatar.TraitCosts[trait.m.ID];
				}
				
				
				traits.push({
					id = trait.m.ID,
					name = trait.m.Name,
					icon = trait.m.Icon,
					fileName = traitArray[0];
					tooltip = trait.getTooltip(),
					excluded = trait.m.Excluded,
					cost = traitCost
				});
			}
		}
		return traits;
	}
	

	
	
	
	function getScenarioSettings(_scenarioId) {
		if(_scenarioId in this.m.scenarioSettingsMap) {
			return this.m.scenarioSettingsMap[_scenarioId];
		}
		
		local backgroundFileName = this.getBackground(_scenarioId);
		local backgroundObj = this.new("scripts/skills/backgrounds/" + backgroundFileName);
	
		local scenarioAttributes = {};
		local attributeChanges = backgroundObj.onChangeAttributes();
		foreach(key, value in this.m.globalSettings.attributes)
		{
			scenarioAttributes[key] <- {};
			scenarioAttributes[key].min <- value.min + attributeChanges[key][0];
			scenarioAttributes[key].max <- value.max + attributeChanges[key][1];
			scenarioAttributes[key].value <- this.Math.floor((scenarioAttributes[key].min + scenarioAttributes[key].max)/2);
			scenarioAttributes[key].baseValue <- value.baseValue;
			scenarioAttributes[key].pointsWeight <- value.pointsWeight;

		}
		
		
		local name = backgroundObj.m.Names[this.Math.rand(0, backgroundObj.m.Names.len() - 1)];
		local description = this.getBackgroundDescription(_scenarioId);
		
		
		local traits = getTraitSettingsForBackground(backgroundObj);
		
		
		this.m.scenarioSettingsMap[_scenarioId] <- {
			attributes = scenarioAttributes,
			background = {
				id = backgroundObj.m.ID,
				name = backgroundObj.m.Name,
				icon = backgroundObj.m.Icon,
				fileName = backgroundFileName,
				characterName = name,
				characterHistory = description,
			},
			traits = traits,
			totalPoints = 50,
			totalTalents = 9
		};
		
		return this.m.scenarioSettingsMap[_scenarioId];
	}
	
	function addScenarioSettings(_scenarioId, _scenarioSettings) {
		if(_scenarioId in this.m.scenarioSettingsMap) {
			this.m.scenarioSettingsMap[_scenarioId] = _scenarioSettings;
		} else {
			this.m.scenarioSettingsMap[_scenarioId] <- _scenarioSettings;
		}
	}
	
	function getSettings(_scenarioId) {
		local settings = {};
		settings.global <- this.m.globalSettings;
		settings.scenario <- this.getScenarioSettings(_scenarioId);
		return settings;
	}
	
	function setAvatar(_settings) {
		this.logInfo("settingAvatar");
		local roster = this.World.getPlayerRoster();
		local bros = roster.getAll();
		
		local avatarBro = null;
		local addEquipment = false;
		local oldItems = {};
		//find existing avatar
		for( local i = 0; i < roster.length; i++ )
		{
			local bro;
			if (bro.getSkills().hasSkill("trait.player")) {
				avatarBro = bro;
				
				break;
			}
		}
		//or create new one
		if (avatarBro == null) {
			avatarBro = roster.create("scripts/entity/tactical/player");
			bro.setStartValuesEx([
				_settings.background.fileName
			]);
			
		}
		
		// set background if different
		if (avatarBro.m.Background.ID != _settings.background.id) {
			local background = this.new("scripts/skills/backgrounds/" + _backgrounds[this.Math.rand(0, _backgrounds.len() - 1)]);
			avatarBro.m.Skills.add(background);
			avatarBro.m.Background = background;
			avatarBro.m.Ethnicity = avatarBro.m.Background.getEthnicity();
		}
		
		// remove existing traits
		foreach( trait in this.Const.CharacterTraits ) {
			avatarBro.getSkills().removeByID(trait[0]);
		}
		
		// set traits
		for( local i = 0; i < _settings.traits.length; i++ ) {
			local trait = this.new("scripts/skills/traits" + _settings.traits[i].fileName);
			
			if (trait != null) {
				avatarBro.getSkills().add(trait);
			}
		}
		
		// set attributes and talents
		local baseProperties = avatarBro.getBaseProperties();
		local talents = avatarBro.getTalents();
		foreach (key, attribute in _settings.attributes) {
			baseProperties[key] = attribute.value;
			talents[key] = attribute.talents;
		}
		avatarBro.getSkills().update();
		
		// set history and name
		
		avatarBro.getBackground().m.RawDescription = _settings.background.characterHistory;
		avatarBro.getBackground().buildDescription(true);
		avatarBro.setName(_settings.background.characterName);		
		
	}
}