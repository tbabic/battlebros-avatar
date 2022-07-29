::mods_registerMod("mod_avatar", 0.1, "Avatar");
::mods_queue(null, null, function()
{
	::mods_registerCSS("screens/menu/modules/campaign_menu/avatar_menu.css");
	::mods_registerJS("screens/menu/modules/campaign_menu/avatar_skill_module.js");
	::mods_registerJS("screens/menu/modules/campaign_menu/traits_module.js");
    ::mods_registerJS("screens/menu/modules/campaign_menu/new_campaign_menu_module.js");
	
	::mods_hookNewObject("scenarios/scenario_manager", function(o) {
		o.m.avatarBackgrounds <- {
		};

		o.m.avatarBackgrounds["scenario.anatomists"] <- "anatomist_background";
		o.m.avatarBackgrounds["scenario.beast_hunters"] <- "beast_hunter_background";
		o.m.avatarBackgrounds["scenario.cultists"] <- "cultist_background";
		o.m.avatarBackgrounds["scenario.deserters"] <- "deserter_background";
		o.m.avatarBackgrounds["scenario.early_access"] <- "sellsword_background";
		o.m.avatarBackgrounds["scenario.gladiators"] <- "gladiator_background";
		o.m.avatarBackgrounds["scenario.lone_wolf"] <- "hedge_knight_background";
		o.m.avatarBackgrounds["scenario.manhunters"] <- "manhunter_background";
		o.m.avatarBackgrounds["scenario.militia"] <- "militia_background";
		o.m.avatarBackgrounds["scenario.paladins"] <- "paladin_background";
		o.m.avatarBackgrounds["scenario.raiders"] <- "barbarian_background";
		o.m.avatarBackgrounds["scenario.rangers"] <- "hunter_background";
		o.m.avatarBackgrounds["scenario.southern_quickstart"] <- "sellsword_background";
		o.m.avatarBackgrounds["scenario.trader"] <- "caravan_hand_background";
		o.m.avatarBackgrounds["scenario.tutorial"] <- "sellsword_background";

	

		o.getAvatarBackground <- function( selectedScenarioId )
		{
			local background = this.m.avatarBackgrounds[selectedScenarioId];
			if (background == null) {
				return "sellsword_background";
			}
			return background;
		};
	});

	::mods_hookNewObject("ui/screens/menu/modules/new_campaign_menu_module", function(o) {
		
		o.onCampaignOriginSelected <- function( selectedScenarioId )
		{

			local backgroundString = this.Const.ScenarioManager.getAvatarBackground(selectedScenarioId);
			logInfo("chosen background " + backgroundString);
			local backgroundObj = this.new("scripts/skills/backgrounds/" + backgroundString);
			local c = backgroundObj.onChangeAttributes();

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
			
			local attributes = {};
			local defaultAttributes = {};
			
			local name = backgroundObj.m.Names[this.Math.rand(0, backgroundObj.m.Names.len() - 1)];
			local vars = [];
			vars.push([
				"name",
				name
			]);
			local description = this.buildTextFromTemplate(backgroundObj.onBuildDescription(), [["name",name], ["fullname", name]]);

			foreach(key, value in a)
			{
				attributes[key] <- {};
				attributes[key].min <- value[0] + c[key][0];
				attributes[key].max <- value[1] + c[key][1];
				attributes[key].avg <- this.Math.floor((attributes[key].min + attributes[key].max)/2);

			}
			
			local traits = [];
			
			for( local i = 0; i < this.Const.CharacterTraits.len(); i = ++i )
			{
				local traitArray = this.Const.CharacterTraits[i];
				if (!backgroundObj.isExcluded(traitArray[0])) {
					local trait = this.new(traitArray[1]);
					traits.push({
						id = trait.m.ID,
						name = trait.m.Name,
						icon = trait.m.Icon,
						tooltip = trait.getTooltip(),
						cost = 25
					});
				}
			}
			
	

			local backgroundData = {
				id = backgroundObj.m.ID,
				name = backgroundObj.m.Name,
				icon = backgroundObj.m.Icon,
				//description = this.buildTextFromTemplate(this.onBuildDescription(), vars)
				attributes = attributes,
				characterName = name,
				characterHistory = description,
				traits = traits,
				
			}
			this.m.JSHandle.asyncCall("avatarData", backgroundData)
		};
	});

});



