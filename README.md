# battlebros-avatar

This mod adds a character creater for all origins. All Vanilla origins have a preselected background (Barbarian for Northern raiders, Hunter for Poachers etc.). For additional origins (provided by mods) a default background will be Sellsword (if someone wants a different origin, modifying avatar_global.nut should be simple enough). Character created with this origin will be your avatar and if he dies it's game over.

If the origin already has an avatar character (such as Lone wolf) that character will be replaced by the one created. If it doesn't a new avatar character will be added. 

The character has 9 talents and 40 attribute points to distribute in a point buy system.

Starting values are average (rounded down) for each background.

Each attribute has a base cost of points to increase. 

Melee attack and Melee defense cost 6 points initally.
Initiative costs 3 points.
Everything else 4 points.

The more an attribute is increased, the more points it will cost.

For example: increasing hitpoints from 55 to 56 costs base 4 points, as well as increasing from 56 to 57. However increasing from 57 to 58 and 58 to 59 costs 5 points. If the background has more than average hitpoints then even inital cost migh be higher than base.

Traits also cost points, with more powerful traits costing more and weaker traits costing less or nothing.

Current version is considered a beta playtest, although I'm convinced there shouldn't be major bugs (most of the work is done UI of the main menu). The reason it's beta is because there might be more balancing changes in the future.

Known bugs:
History field can break in new lines in the middle of the word. That's because textarea is not supported by the game UI, so a hack had to be made to make an input field multiline. I don't expect this to be ever fixed.


Future roadmap if the mod turns to be popular
1) option to not use it, basically skip the setting, also making savegame compatible with saves not using the mod.
2) setting appearance like with barber
3) rebalancing point buy ssytem.



