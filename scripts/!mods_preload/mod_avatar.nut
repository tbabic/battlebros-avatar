::mods_registerMod("mod_avatar", 0.1, "Avatar");
::mods_queue(null, null, function()
{
    ::mods_registerJS("screens/menu/modules/campaign_menu/new_campaign_menu_module.js");
	//::mods_registerJS("screens/avatar_screen_loader.js");
});



