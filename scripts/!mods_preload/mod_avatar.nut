// a namespace for your mod where you can put stuff like a Const table in
::AvatarMod <- {};

::mods_registerMod("mod_avatar", 0.8.4, "Avatar");
//for some reason, it breaks if MSU is present
::mods_queue(null, ">mod_msu", function()
{
	::mods_registerCSS("avatarmod/avatar_menu.css");
	// a file that runs first to set up table and later perhaps const variables or something
	::mods_registerJS("avatarmod/avatar_setup.js");
	::mods_registerJS("avatarmod/avatar_points_module.js");
	::mods_registerJS("avatarmod/avatar_attributes_module.js");
	::mods_registerJS("avatarmod/avatar_traits_module.js");
    ::mods_registerJS("avatarmod/new_campaign_menu_module.js");

    //include the config file
    ::include("AvatarMod/const/avatar_globals");

    //put the manager in the namespace
    ::AvatarMod.AvatarManager <- this.new("scripts/scenarios/avatar_manager");

	::mods_hookNewObject("ui/screens/menu/modules/new_campaign_menu_module", function(o) {

		o.onCampaignOriginSelected <- function( selectedScenarioId )
		{
			local settings = ::AvatarMod.AvatarManager.getSettings(selectedScenarioId);
			this.m.JSHandle.asyncCall("avatarSettings", settings)
		};
		
		// we can set the settings in the manager directly
		local onStartButtonPressed = o.onStartButtonPressed;
		o.onStartButtonPressed = function(_settings)
		{
			::AvatarMod.AvatarManager.m.AvatarSettings <- _settings[11];
			return onStartButtonPressed(_settings);
		}
	});
	
	// No need for the previous, complicated hook you had, mods_getMember already gets the parent function if the child doesn't have it
	::mods_hookBaseClass("scenarios/world/starting_scenario", function(o) {
		local onCombatFinished = ::mods_getMember(o, "onCombatFinished");
		::mods_override(o, "onCombatFinished", function() {

			if (!this.World.Statistics.getFlags().get("AvatarMod_AvatarCreated")) {
				return onCombatFinished();
			}

			local roster = this.World.getPlayerRoster().getAll();
			foreach( bro in roster )
			{
				if (bro.getFlags().get("IsPlayerCharacterAvatar"))
				{
					return true;
				}
			}
			return false;
		});
	});
	
	::mods_hookNewObjectOnce("states/world/asset_manager", function(o) {

		local setCampaignSettings = o.setCampaignSettings;
		::mods_override(o, "setCampaignSettings", function(_settings) {
			setCampaignSettings(_settings);
			::AvatarMod.AvatarManager.setAvatar(); // no need to pass settings anymore, the function has them in the Manager
		});
		
	});
	
	


});

