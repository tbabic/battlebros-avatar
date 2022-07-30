::mods_registerMod("mod_avatar", 0.1, "Avatar");
::mods_queue(null, null, function()
{
	::mods_registerCSS("screens/menu/modules/campaign_menu/avatar_menu.css");
	::mods_registerJS("screens/menu/modules/campaign_menu/avatar_skill_module.js");
	::mods_registerJS("screens/menu/modules/campaign_menu/traits_module.js");
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
	});
	
	::mods_hookNewObjectOnce("states/world/asset_manager", function(o) {

		local setCampaignSettings = o.setCampaignSettings;
		//::mods_addHook("asset_manager.setCampaignSettings", func )
		
		::mods_override(o, "setCampaignSettings", function(_settings) {

			setCampaignSettings(_settings);
			this.Const.AvatarManager.setAvatar(_settings.avatarSettings);

		});
		
	});

});

