::mods_registerMod("mod_avatar", 0.1, "Avatar");
::mods_queue(null, null, function()
{
	::mods_registerCSS("screens/menu/modules/campaign_menu/avatar_menu.css");
    ::mods_registerJS("screens/menu/modules/campaign_menu/new_campaign_menu_module.js");
});



