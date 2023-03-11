this.avatar_manager <- {
	m = {
		globalSettings = {},
		scenarioSettingsMap = {},
		AvatarSettings = null,
		backgroundInstances = {},
	},
	
	function create()
	{
		this.m.allTraits <- clone this.Const.CharacterTraits;
	
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
			this.m.globalSettings.attributes[key].pointsWeight <- ::AvatarMod.Const.SkillWeights[key];
		}
		
		
		local defaultBackground = this.getBackgroundObject("sellsword_background");
				
		this.m.globalSettings.backgrounds <- [{
			id = defaultBackground.m.ID,
			name = defaultBackground.m.Name,
			icon = defaultBackground.m.Icon,
			fileName = "sellsword_background",
			
		}];
		
		this.m.globalSettings.characterInfo <- {
			characterName = "Sigurd",
			characterHistory = "Write your history here...",
			startingLevel = 1
		};
		
		this.m.globalSettings.traits <- getTraitSettingsForBackground(defaultBackground);
		
		this.m.globalSettings.totalPoints <- ::AvatarMod.Const.TotalPoints;
		
		this.m.globalSettings.totalTalents <- ::AvatarMod.Const.TotalTalents;
		
	}
	
	function addAdditionalTraits(traits) {
		foreach(t in traits)
		{
			this.m.allTraits.push(t);
		}
	}
	
	function getBackgroundObject(fileName)
	{

		if (!(fileName in this.m.backgroundInstances))
		{
			this.m.backgroundInstances[fileName] <- this.new("scripts/skills/backgrounds/" + fileName);
		}
		return this.m.backgroundInstances[fileName];
	}
	
	function getBackground( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in ::AvatarMod.Const.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		return ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId].Background;
	}
	
	function getAltBackgrounds( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in ::AvatarMod.Const.ScenarioBackgrounds)) {
			return [];
		}
		return ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId].AlternativeBackgrounds;
	}
	
	function getBackgroundStartingLevel( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in ::AvatarMod.Const.ScenarioBackgrounds)) {
			return 1;
		}
		if ("StartingLevel" in ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId]) {
			return ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId].StartingLevel;
		}
		return 1;
		
	}
	
	function getBackgroundDescription( _selectedScenarioId )
	{
		if (!(_selectedScenarioId in ::AvatarMod.Const.ScenarioBackgrounds)) {
			return "sellsword_background";
		}
		return ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId].Description;
	}
	
	function getTraitSettingsForBackground( _background) {
		local traits = [];
			
		for( local i = 0; i < this.m.allTraits.len(); i = ++i )
		{
			local traitArray = this.m.allTraits[i];
			if (!_background.isExcluded(traitArray[0])) {
				local trait = this.new(traitArray[1]);
				local traitCost = 0;
				if (trait.m.ID in ::AvatarMod.Const.TraitCosts) {
					traitCost = ::AvatarMod.Const.TraitCosts[trait.m.ID];
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
	
	function getTraitsForScenario(_selectedScenarioId)
	{
		//TODO:
		local traits = [];
		logInfo("checking extra traits:" + _selectedScenarioId);
		if ("Traits" in ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId])
		{
			logInfo("foundExtraTraits")
			foreach(t in ::AvatarMod.Const.ScenarioBackgrounds[_selectedScenarioId].Traits) 
			{
				logInfo("found:" + t);
				local trait = this.new(t);
				
				local traitCost = 0;
				if (trait.m.ID in ::AvatarMod.Const.TraitCosts) {
					traitCost = ::AvatarMod.Const.TraitCosts[trait.m.ID];
				}
				
				traits.push({
					id = trait.m.ID,
					name = trait.m.Name,
					icon = trait.m.Icon,
					fileName = t,
					tooltip = trait.getTooltip(),
					excluded = trait.m.Excluded,
					cost = traitCost
				});
			}
		}
		
		
		return traits;
	}
	

	function getBackgroundSettings(_background, _scenarioId) 
	{
		local backgroundObj = this.getBackgroundObject(_background);
		local traits = getTraitSettingsForBackground(backgroundObj);
		local extraTraits = getTraitsForScenario(_scenarioId);
		foreach (t in extraTraits)
		{
			traits.push(t);
		}
		
		
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
		
		return {
			traits = traits,
			attributes = scenarioAttributes
		}
	}
	
	
	function getScenarioSettings(_scenarioId) {
		if(_scenarioId in this.m.scenarioSettingsMap) {
			return this.m.scenarioSettingsMap[_scenarioId];
		}
		
		local backgroundFileName = this.getBackground(_scenarioId);
		local backgroundObj = this.getBackgroundObject(backgroundFileName);
	
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
			name = this.Const.Strings.BarbarianNames[this.Math.rand(0, this.Const.Strings.BarbarianNames.len() - 1)];
		}
		
		this.logInfo("avatar: " + _scenarioId + " " + name);
		local description = this.getBackgroundDescription(_scenarioId);
		
		
		local traits = getTraitSettingsForBackground(backgroundObj);
		local extraTraits = getTraitsForScenario(_scenarioId);
		foreach (t in extraTraits)
		{
			traits.push(t);
		}
		
		
		local startingLevel = this.getBackgroundStartingLevel(_scenarioId);
		local characterInfo = {
			characterName = name,
			characterHistory = description,
			startingLevel = startingLevel
		}
		
		this.m.scenarioSettingsMap[_scenarioId] <- {
			attributes = scenarioAttributes,
			backgrounds = [{
				id = backgroundObj.m.ID,
				name = backgroundObj.m.Name,
				icon = backgroundObj.m.Icon,
				fileName = backgroundFileName,
			}],
			characterInfo = characterInfo,
			traits = traits,
			totalPoints = ::AvatarMod.Const.TotalPoints,
			totalTalents = ::AvatarMod.Const.TotalTalents
		};
		
		local scenarioSettings = this.m.scenarioSettingsMap[_scenarioId];
		local defaultBackground = scenarioSettings.backgrounds[0];
		
		
		
		if(::AvatarMod.Const.BackgroundChoice == "ALT")
		{
			local altBackgrounds = this.getAltBackgrounds(_scenarioId);
			foreach (b in altBackgrounds)
			{
				scenarioSettings.backgrounds.push(this.backgroundToUI(b));
			}
		}
		else if(::AvatarMod.Const.BackgroundChoice == "ALL")
		{
			local allBackgrounds = this.Const.CharacterBackgrounds;
			foreach (b in allBackgrounds)
			{
				if (backgroundFileName == b)
				{
					continue;
				}
			
				scenarioSettings.backgrounds.push(this.backgroundToUI(b));
			}
		}
		logInfo("backgrounds");
		foreach(b in scenarioSettings.backgrounds)
		{
			logInfo("b: " + b.name + "; i: " + b.icon);
		}
		
		return scenarioSettings;
	}
	
	function backgroundToUI(backgroundFileName)
	{
		local bObj = this.getBackgroundObject(backgroundFileName);
		return {
			id = bObj.m.ID,
			name = bObj.m.Name,
			icon = bObj.m.Icon,
			fileName = backgroundFileName
		}
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
	
	function setAvatar() {
		local settings = this.m.AvatarSettings;
		if(!settings.active)
		{
			return;
		}
		
		this.World.Statistics.getFlags().set("AvatarMod_AvatarCreated", true);
	
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
				settings.background.fileName
			]);
	
			avatarBro.getSkills().add(this.new("scripts/skills/traits/player_character_trait"));
			
		}
		
		// set background if different
		if (!avatarBro.getSkills().hasSkill(settings.background.id)) {
			logInfo("avatar - set background");
			local background = this.new("scripts/skills/backgrounds/" + _backgrounds[this.Math.rand(0, _backgrounds.len() - 1)]);
			avatarBro.m.Skills.add(background);
			avatarBro.m.Background = background;
			avatarBro.m.Ethnicity = avatarBro.m.Background.getEthnicity();
		}
		
		
		
		logInfo(avatarBro.getBackground().getContainer().getActor().getName());
		
		// remove existing traits
		foreach( trait in this.Const.CharacterTraits ) {
			avatarBro.getSkills().removeByID(trait[0]);
		}
		local traitsToRemove = [];
		foreach(s in avatarBro.getSkills().m.Skills) {
			if (s.getID() == "trait.player")
			{
				continue;
			}
			else if(this.String.contains(s.getID(), "trait"))
			{
				traitsToRemove.push(s.getID());
			}
		}
		foreach( trait in traitsToRemove ) {
			avatarBro.getSkills().removeByID(trait);
		}
		
		// set traits
		for( local i = 0; i < settings.traits.len(); i++ ) {
			local trait = this.new(settings.traits[i].fileName);
			
			if (trait != null) {
				avatarBro.getSkills().add(trait);
			}
		}
		
		// set attributes and talents
		local baseProperties = avatarBro.getBaseProperties();
		local talents = avatarBro.getTalents();
		foreach (key, attribute in settings.attributes) {
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
		avatarBro.m.Attributes = [];
		avatarBro.fillAttributeLevelUpValues(this.Const.XP.MaxLevelWithPerkpoints - 1);
		
		
		// set history and name
		
		avatarBro.getBackground().m.RawDescription = settings.characterHistory;
		logInfo("avatar background");
		logInfo(avatarBro.getBackground().m.ID);
		
		logInfo(avatarBro.getBackground().getContainer().getActor().getName());
		avatarBro.getBackground().buildDescription(true);
		this.logInfo(settings.characterName);
		avatarBro.setName(settings.characterName);
		
		
		if ("startingLevel" in settings) {
			this.logInfo("avatar starting level: " + settings.startingLevel)
			avatarBro.m.PerkPoints = settings.startingLevel -1;
			avatarBro.m.LevelUps = settings.startingLevel - 1;
			avatarBro.m.Level = settings.startingLevel;
		} else {
			avatarBro.m.PerkPoints = 0;
			avatarBro.m.LevelUps = 0;
			avatarBro.m.Level = 1;
		}
		
		avatarBro.m.XP = this.Const.LevelXP[avatarBro.m.Level-1];
		
		
		avatarBro.getFlags().set("IsPlayerCharacter", true);
		avatarBro.getFlags().set("IsPlayerCharacterAvatar", true);
		
		if (this.World.Assets.getOrigin().getID() == "scenario.manhunters" && avatarBro.getBackground().getID() != "background.slave")
		{
			avatarBro.getSkills().add(this.new("scripts/skills/actives/whip_slave_skill"));
		}
		
		if(settings.setAppearance)
		{
			logInfo("settingAppearance");
			::AvatarMod.AppearanceManager.updateActor(avatarBro);
			::AvatarMod.AppearanceManager.logSprites(avatarBro);
		}
		
		::AvatarMod.AppearanceManager.clear();
		
	}
	
	
}
