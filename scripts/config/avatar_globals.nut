local gt = this.getroottable();

if (!("Avatar" in gt.Const))
{
	gt.Const.Avatar <- {};
}

if (!("ScenarioBackgrounds" in gt.Const.Avatar))
{
	gt.Const.Avatar.ScenarioBackgrounds <- {};
}

gt.Const.Avatar.ScenarioBackgrounds["scenario.anatomists"] <- { 
	Background = "anatomist_background",
	Description = "Fueled by an unquenchable thirst for knowledge, the Anatomists have spent years dissecting the exoctic and the alien. With social mores dogging their research, however, they\'ve turned to you to form a mercenary company and provide them a new source of fresh specimens."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.beast_hunters"] <- { 
	Background = "beast_hunter_background",
	Description = "You and your men make your living by hunting down the many beasts that beset villages on the fringes of civilization. It\'s dangerous work, but it pays well enough, and there\'s always a bigger beast to slay and more crowns to earn."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.cultists"] <- { 
	Background = "cultist_background",
	Description = "Davkul awaits..."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.deserters"] <- { 
	Background = "deserter_background",
	Description = "For too long have you been dragged from one bloody battle to another at the whim of lords sitting in high towers. Until you decided to abandon the camp."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.early_access"] <- { 
	Background = "sellsword_background",
	Description = "After years of bloodying your sword for meager pay, you\'ve saved enough crowns to start your very own mercenary company."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.gladiators"] <- { 
	Background = "gladiator_background",
	Description = "You\'ve fought in the arenas of the south for years. First for your freedom, then for crowns, and finally to become immortal. What else does fate have in stock for you?"
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.lone_wolf"] <- { 
	Background = "hedge_knight_background",
	Description = "A wandering hedge knight, you were a veteran of jousting and sparring tournaments. You were also a veteran of victory. Tis a scary thought for many, but if it were anything at all that turned your eye toward mercenary work it was boredom. Outwardly you state it is for the coin, but a part of you knows it\'s also for the company."
	StartingLevel = 4,
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.manhunters"] <- { 
	Background = "manhunter_background",
	Description = "Constant conflict between city states and nomads makes for good business. The bulk of your outfit are captives, forced to fight to earn their freedom, and their ranks grow after each battle."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.militia"] <- { 
	Background = "militia_background",
	Description = "It started as a ragtag militia made up of anyone brave or desperate enough to volunteer for defending their homes, but has grown into a small army. Somewhow, you were chosen to lead that army."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.paladins"] <- { 
	Background = "paladin_background",
	Description = "You are an Oathtaker, a knightly warrior beholden not to liege lords, but to the ideals and teachings of their founder, Young Anselm. The order now finds itself in dire straits, and they\'ve turned to you to reverse their fortunes."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.raiders"] <- { 
	Background = "barbarian_background",
	Description = "For all your adult life you\'ve been raiding and pillaging in these lands. But with the local peasantry poor as mice, you may want to finally expand into the profitable field of mercenary work."
	StartingLevel = 3,
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.rangers"] <- { 
	Background = "hunter_background",
	Description = "For years you\'ve made a decent living by poaching in the local woods, evading your lord\'s men by being quick on your feet. But pickings have become slimmer and slimmer, and you\'re faced with a decision - how to make a living when all you know is how to use a bow?"
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.southern_quickstart"] <- { 
	Background = "companion_ranged_southern_background",
	Description = "You and your small band of mercenaries have done the dirty work of small-time merchants for years, yet you\'re barely a step above brigands. You want to be bigger than that. You want it all. And the Gilder will reveal to you the way."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.trader"] <- { 
	Background = "peddler_background",
	Description = "You\'re running a small trading caravan and have most of your crowns invested into trading goods. But the roads have become dangerous - brigands and greenskins lay in ambush, and there\'s rumors of even worse things out there."
};
gt.Const.Avatar.ScenarioBackgrounds["scenario.tutorial"] <- { 
	Background = "sellsword_background",
	Description = "You were second-in-command in a mercenary company that has been tracking a brigand named Hoggart for some time now. An unexpected turn of events left the company in shatters, and you in charge to rebuild it to its former glory."
};

if (!("TraitCosts" in gt.Const.Avatar))
{
	gt.Const.Avatar.TraitCosts <- {};
}

gt.Const.Avatar.TraitCosts["trait.eagle_eyes"] <- 10;
gt.Const.Avatar.TraitCosts["trait.tough"] <- 40;
gt.Const.Avatar.TraitCosts["trait.strong"] <- 40;
gt.Const.Avatar.TraitCosts["trait.quick"] <- 30;
gt.Const.Avatar.TraitCosts["trait.fearless"] <- 40;
gt.Const.Avatar.TraitCosts["trait.bright"] <- 5;
gt.Const.Avatar.TraitCosts["trait.drunkard"] <- 25;
gt.Const.Avatar.TraitCosts["trait.determined"] <- 30;
gt.Const.Avatar.TraitCosts["trait.deathwish"] <- 20;
gt.Const.Avatar.TraitCosts["trait.optimist"] <- 10;
gt.Const.Avatar.TraitCosts["trait.paranoid"] <- 30;
gt.Const.Avatar.TraitCosts["trait.brave"] <- 20;
gt.Const.Avatar.TraitCosts["trait.dexterous"] <- 30;
gt.Const.Avatar.TraitCosts["trait.sure_footing"] <- 30;
gt.Const.Avatar.TraitCosts["trait.iron_lungs"] <- 40;
gt.Const.Avatar.TraitCosts["trait.spartan"] <- 1;
gt.Const.Avatar.TraitCosts["trait.athletic"] <- 10;
gt.Const.Avatar.TraitCosts["trait.iron_jaw"] <- 15;
gt.Const.Avatar.TraitCosts["trait.survivor"] <- 20;
gt.Const.Avatar.TraitCosts["trait.impatient"] <- 5;
gt.Const.Avatar.TraitCosts["trait.swift"] <- 15;
gt.Const.Avatar.TraitCosts["trait.night_owl"] <- 8;
gt.Const.Avatar.TraitCosts["trait.huge"] <- 25;
gt.Const.Avatar.TraitCosts["trait.lucky"] <- 10;
gt.Const.Avatar.TraitCosts["trait.weasel"] <- 10;
gt.Const.Avatar.TraitCosts["trait.teamplayer"] <- 25;
gt.Const.Avatar.TraitCosts["trait.hate_greenskins"] <- 15;
gt.Const.Avatar.TraitCosts["trait.hate_undead"] <- 15;
gt.Const.Avatar.TraitCosts["trait.hate_beasts"] <- 15;


if (!("SkillWeights" in gt.Const.Avatar))
{
	gt.Const.Avatar.SkillWeights <- {};
}

gt.Const.Avatar.SkillWeights["MeleeSkill"] <- 6;
gt.Const.Avatar.SkillWeights["MeleeDefense"] <- 6;

gt.Const.Avatar.SkillWeights["Hitpoints"] <- 4;
gt.Const.Avatar.SkillWeights["Bravery"] <- 4;
gt.Const.Avatar.SkillWeights["Stamina"] <- 4;
gt.Const.Avatar.SkillWeights["RangedSkill"] <- 4;

gt.Const.Avatar.SkillWeights["RangedDefense"] <- 3;
gt.Const.Avatar.SkillWeights["Initiative"] <- 3;


