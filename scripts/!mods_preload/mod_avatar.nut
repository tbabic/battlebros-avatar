::mods_registerMod("mod_avatar", 0.1, "Avatar");
::mods_queue(null, null, function()
{
	::mods_registerCSS("screens/menu/modules/campaign_menu/avatar_menu.css");
	::mods_registerJS("screens/menu/modules/campaign_menu/avatar_points_module.js");
	::mods_registerJS("screens/menu/modules/campaign_menu/avatar_attributes_module.js");
	::mods_registerJS("screens/menu/modules/campaign_menu/avatar_traits_module.js");
    ::mods_registerJS("screens/menu/modules/campaign_menu/new_campaign_menu_module.js");

	::mods_hookNewObject("ui/screens/menu/modules/new_campaign_menu_module", function(o) {

		o.onCampaignOriginSelected <- function( selectedScenarioId )
		{

			if(!("AvatarManager" in this.Const)) {
				this.Const.AvatarManager <- this.new("scripts/scenarios/avatar_manager");
			}
			
			local settings = this.Const.AvatarManager.getSettings(selectedScenarioId);
			
			this.m.JSHandle.asyncCall("avatarSettings", settings)
		};
		
		::mods_override(o, "onStartButtonPressed", function(_settings) {
			local settings = {
				Name = _settings[0],
				Banner = _settings[1],
				Difficulty = _settings[2],
				EconomicDifficulty = _settings[3],
				BudgetDifficulty = _settings[4],
				Ironman = _settings[5],
				ExplorationMode = _settings[6],
				GreaterEvil = _settings[7],
				PermanentDestruction = _settings[8],
				Seed = _settings[9],
				StartingScenario = _settings[10],
				avatarSettings = _settings[11]
			};

			if (this.m.OnStartButtonPressedListener != null)
			{
				this.m.OnStartButtonPressedListener(settings);
			}
		});
		
		
		
	});
	
	::mods_hookNewObjectOnce("states/world/asset_manager", function(o) {

		local setCampaignSettings = o.setCampaignSettings;
		//::mods_addHook("asset_manager.setCampaignSettings", func )
		
		::mods_override(o, "setCampaignSettings", function(_settings) {
			logInfo("logging settings");
			foreach (key, value in _settings) {
				logInfo(key + " = " + value);
			}
			setCampaignSettings(_settings);
			this.Const.AvatarManager.setAvatar(_settings.avatarSettings);

		});
		
	});
	
	


});

