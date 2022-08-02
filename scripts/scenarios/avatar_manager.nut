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
			startingLevel = 1
		};
		
		this.m.globalSettings.traits <- getTraitSettingsForBackground(defaultBackground);
		
		this.m.globalSettings.totalPoints <- this.Const.Avatar.TotalPoints;
		
		this.m.globalSettings.totalTalents <- this.Const.Avatar.TotalTalents;
		
		
	}
	
	
	function getBackground( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in this.Const.Avatar.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		return this.Const.Avatar.ScenarioBackgrounds[_selectedScenarioId].Background;
	}
	
	function getBackgroundStartingLevel( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in this.Const.Avatar.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		if ("StartingLevel" in this.Const.Avatar.ScenarioBackgrounds[_selectedScenarioId]) {
			return this.Const.Avatar.ScenarioBackgrounds[_selectedScenarioId].StartingLevel;
		}
		return 1;
		
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
				local trait = this.new(traitArray[1]);
				local traitCost = 0;
				if (trait.m.ID in this.Const.Avatar.TraitCosts) {
					traitCost = this.Const.Avatar.TraitCosts[trait.m.ID];
				}
				
				
				traits.push({
					id = trait.m.ID,
					name = trait.m.Name,
					icon = trait.m.Icon,
					fileName = traitArray[1],
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
		if (backgroundObj.m.ID == "background.barbarian") {
			name = this.Const.Strings.BarbarianNames[this.Math.rand(0, this.Const.Strings.BarbarianNames.len() - 1)]);
		}
		
		this.logInfo("avatar: " + scenarioId + " " + name);
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
				startingLevel = this.getBackgroundStartingLevel(_scenarioId)
			},
			traits = traits,
			totalPoints = this.Const.Avatar.TotalPoints,
			totalTalents = this.Const.Avatar.TotalTalents
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
		for( local i = 0; i < bros.len(); i++ )
		{
			local bro = bros[i];
			if (bro.getSkills().hasSkill("trait.player")) {
				avatarBro = bro;
				logInfo("avatar - found bro");
				break;
			}
		}
		//or create new one
		if (avatarBro == null) {
			logInfo("avatar - new bro");
			avatarBro = roster.create("scripts/entity/tactical/player");
			avatarBro.setStartValuesEx([
				_settings.background.fileName
			]);
			avatarBro.getSkills().add(this.new("scripts/skills/traits/player_character_trait"));
			
		}
		
		foreach (key, value in avatarBro.m.Background) {
			logInfo(key + " = " + value);
		}
		
		// set background if different
		if (!avatarBro.getSkills().hasSkill(_settings.background.id)) {
			logInfo("avatar - set background");
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
		for( local i = 0; i < _settings.traits.len(); i++ ) {
			local trait = this.new(_settings.traits[i].fileName);
			
			if (trait != null) {
				avatarBro.getSkills().add(trait);
			}
		}
		
		// set attributes and talents
		local baseProperties = avatarBro.getBaseProperties();
		local talents = avatarBro.getTalents();
		foreach (key, attribute in _settings.attributes) {
			baseProperties[key] = attribute.value;
			if (key == "Stamina") { 
				// what the hell, why is this sometimes referred as fatigue and sometimes as stamina. 
				// I can not tell you just how infuriating this is.
				talents[this.Const.Attributes["Fatigue"]] = attribute.talents;
			} else {
				talents[this.Const.Attributes[key]] = attribute.talents;
			}
			
			
		}
		avatarBro.getSkills().update();
		
		// set history and name
		
		avatarBro.getBackground().m.RawDescription = _settings.background.characterHistory;
		avatarBro.getBackground().buildDescription(true);
		avatarBro.setName(_settings.background.characterName);
		
		if ("startingLevel" in _settings.background) {
			this.logInfo("avatar starting level: " + _settings.background.startingLevel)
			avatarBro.m.PerkPoints = _settings.background.startingLevel -1;
			avatarBro.m.LevelUps = _settings.background.startingLevel - 1;
			avatarBro.m.Level = _settings.background.startingLevel;
		} else {
			avatarBro.m.PerkPoints = 0;
			avatarBro.m.LevelUps = 0;
			avatarBro.m.Level = 1;
		}
		
		
		avatarBro.getFlags().set("IsPlayerCharacter", true);
		avatarBro.getFlags().set("IsPlayerCharacterAvatar", true);
		
	}
}