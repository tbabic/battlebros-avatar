// a namespace for your mod where you can put stuff like a Const table in
::AvatarMod <- {};

::mods_registerMod("mod_avatar", 1.0.2, "Avatar");
//for some reason, it breaks if MSU is present
::mods_queue(null, ">mod_msu", function()
{
	::mods_registerCSS("avatarmod/avatar_menu.css");
	// a file that runs first to set up table and later perhaps const variables or something
	::mods_registerJS("avatarmod/avatar_setup.js");
	::mods_registerJS("avatarmod/avatar_points_module.js");
	::mods_registerJS("avatarmod/avatar_attributes_module.js");
	::mods_registerJS("avatarmod/avatar_traits_module.js");
	::mods_registerJS("avatarmod/avatar_appearance_module.js");
    ::mods_registerJS("avatarmod/new_campaign_menu_module.js");

    //include the config file
    ::include("AvatarMod/const/avatar_globals");
	::include("AvatarMod/utils/appearance_manager"); //??

    //put the manager in the namespace
    ::AvatarMod.AvatarManager <- this.new("scripts/scenarios/avatar_manager");
	::AvatarMod.AppearanceManager <- this.new("AvatarMod/utils/appearance_manager");
	
	::mods_hookNewObject("ui/screens/menu/modules/new_campaign_menu_module", function(o) {
		
				
		o.onCampaignOriginSelected <- function( selectedScenarioId )
		{
			local settings = ::AvatarMod.AvatarManager.getSettings(selectedScenarioId);
			this.m.JSHandle.asyncCall("avatarSettings", settings);			
			
		};
		
		o.getBackgroundSettings <- function( params )
		{
			logInfo("getBackgroundSettings:" + params.background + ";" + params.scenarioID);
			return ::AvatarMod.AvatarManager.getBackgroundSettings(params.background, params.scenarioID);	
			
		};
		
		// we can set the settings in the manager directly
		local onStartButtonPressed = o.onStartButtonPressed;
		o.onStartButtonPressed = function(_settings)
		{
			::AvatarMod.AvatarManager.m.AvatarSettings <- _settings[11];
			return onStartButtonPressed(_settings);
		};
		
		o.getAppearanceOptions <- function(param = null)
		{
			//logInfo("getAppearanceOptions");
			local options = ::AvatarMod.AppearanceManager.getAppearanceOptions();
			return options;
		};
		
		o.updateAppearance <- function(data)
		{
			//logInfo("updateAppearance");
			return ::AvatarMod.AppearanceManager.updateAllLayers(data);
			local value = ::AvatarMod.AppearanceManager.updateAllLayers(data);
			logInfo("update all layers:" + value);
			return value;
		}
		
		o.updateAppearanceLayer <- function(params)
		{
			//logInfo("updateAppearanceLayer");
			local value = ::AvatarMod.AppearanceManager.updateLayer(params.layer, params.data);
			logInfo("update layer:" + value);
			return value;
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
		
		local onSpawnPlayer = ::mods_getMember(o, "onSpawnPlayer")
		::mods_override(o, "onSpawnPlayer", function() {
			onSpawnPlayer();
			::AvatarMod.AvatarManager.setAvatar(); // no need to pass settings anymore, the function has them in the Manager
		});
	});
	


});

