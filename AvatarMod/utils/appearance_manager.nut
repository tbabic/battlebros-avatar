this.appearance_manager <- {
	
	m = {
		Actor = null,
		Data = {
			Head = "bust_head_01",
			Body = "bust_naked_body_00",
			HairColor = "brown",
			Tattoo = "",
			Hair = "",
			Beard = ""
		},
		
		HeadList = [],
		BodyList = [],
		HairList = [],
		BeardList = [],
		HairColorList = [],
		TattooList = []
	},
	
	function create()
	{
		this.addToArray(this.m.HeadList, this.Const.Faces.Barber);
		this.addToArray(this.m.BodyList, this.Const.Bodies.Barber);
		this.addToArray(this.m.HairList, this.Const.Hair.Barber);
		this.addToArray(this.m.BeardList, this.Const.Beards.Barber);
		this.addToArray(this.m.HairColorList, this.Const.HairColors.All);
		this.addToArray(this.m.TattooList, this.Const.Tattoos.All);
		
		local tempRoster = this.World.getTemporaryRoster();
		this.m.Actor = tempRoster.create("scripts/entity/tactical/human");
		this.m.Actor.setDirty(true);
		//tempRoster.clear();
		this.m.Actor.getImagePath();
		
		this.updateAllLayers(this.m.Data);
		
	}
	
	function getAppearanceOptions()
	{
		local options = {
			Head = this.m.HeadList,
			Body = this.m.BodyList,
			Hair = this.m.HairList,
			Beard = this.m.BeardList,
			HairColor = this.m.HairColorList,
			Tattoo = this.m.TattooList
		}
		local data = this.m.Data;
		return {
			options = options,
			data = data
		};
	}
	
	function addToArray(array1, array2)
	{
		foreach(e in array2)
		{
			array1.push(e);
		}
	}
	
	function updateAllLayers(data = null, actor = null)
	{
		if (data == null)
		{
			logInfo("all layers data is null");
			data = this.m.Data;
		}
		if (actor == null)
		{
			actor = this.m.Actor;
		}
		if (actor == null || !this.checkActorAlive(actor))
		{
			logInfo("all layers actor null");
			this.initializeActor();
			actor = this.m.Actor;
		}
		
		this.updateLayer("head", data, actor);
		this.updateLayer("body", data, actor);
		this.updateLayer("hairColor", data, actor);
		return this.updateLayer("tattoo", data, actor);
	}
	
	function updateActor(actor)
	{
		updateAllLayers(this.m.Data, actor);
	}
	
	function updateLayer( layer, data = null, actor = null)
	{
		logInfo("updateLayer: " + layer);
	
		if (data == null)
		{
			logInfo("layer data is null");
			data = this.m.Data;
		}
		local temp = actor;
		if (temp == null)
		{
			temp = this.m.Actor;
		}
		if (temp == null || !this.checkActorAlive(temp))
		{
			logInfo("layer actor null");
			this.initializeActor();
			temp = this.m.Actor;
			return this.updateAllLayers(data, temp);
		}
		
		local color = data.HairColor;
		
		if(layer == "hairColor")
		{
			this.m.Data.HairColor = data.HairColor;
			this.updateLayer("hair", data, temp);
			this.updateLayer("beard", data, temp);
		}
		else if(layer == "tattoo")
		{
			this.m.Data.Tattoo = data.Tattoo;
			
			local bodyName = temp.getSprite("body").getBrush().Name;
			local tattooBodyBrush = data.Tattoo + "_" + bodyName;
			
			
			local headName = temp.getSprite("head").getBrush().Name;
			local tattooHeadBrush = data.Tattoo + "_head";
			if (data.Tattoo == "")
			{
				tattooBodyBrush = "";
				tattooHeadBrush = "";
			}
			else if (tattooHeadBrush == "scar_01_head")
			{
				tattooHeadBrush = "";
			}
			this.updateSprite(temp, tattooBodyBrush, "tattoo_body");
			this.updateSprite(temp, tattooHeadBrush, "tattoo_head");
		}
		
		else if(layer == "beard")
		{
			this.m.Data.Beard = data.Beard;
			
			local brushName = "beard_" + data.HairColor + "_" + data.Beard;
			if(data.Beard == "")
			{
				brushName = "";
			}
			this.updateSprite(temp, brushName, "beard");
			
			if (temp.getSprite("beard").HasBrush && this.doesBrushExist(temp.getSprite("beard").getBrush().Name + "_top"))
			{
				temp.getSprite("beard_top").setBrush(temp.getSprite("beard").getBrush().Name + "_top");
			}
			else
			{
				temp.getSprite("beard_top").resetBrush();
			}
		}
		
		else if(layer == "hair")
		{
		
			this.m.Data.Hair = data.Hair;
			
			local brushName = "hair_" + data.HairColor + "_" + data.Hair;
			if(data.Hair == "")
			{
				brushName = "";
			}
			this.updateSprite(temp, brushName, "hair");
		}
		
		else if(layer == "head")
		{
			this.m.Data.Head = data.Head;
		
			local brushName = data.Head;
			this.updateSprite(temp, brushName, "head");
		}

		else if(layer == "body")
		{
			this.m.Data.Body = data.Body;
			
			local brushName = data.Body;
			this.updateSprite(temp, brushName, "body");
		}
		if(temp == null)
		{
			logInfo("temp is null");
		}
		temp.setDirty(true);
		return temp.getImagePath();
	}
	
	
	function updateSprite(actor, brushName, spriteName)
	{
		if (actor == null)
		{
			logInfo("updateSprite actor null");
			return;
		}
		
		local sprite = actor.getSprite(spriteName);
		//logInfo(spriteName + ":" + brushName);
		if (sprite == null)
		{
			//logInfo("sprite " + spriteName + " is null")
			return;
		}
		if(brushName == "")
		{
			sprite.resetBrush();
		}
		else
		{
			sprite.setBrush(brushName);
		}
		
		//actor.setDirty(true);
		return actor.getImagePath();
	}
	
	function initializeActor()
	{
		local tempRoster = this.World.getTemporaryRoster();
		tempRoster.clear();
		this.m.Actor = tempRoster.create("scripts/entity/tactical/human");
		this.m.Actor.setDirty(true);
	}
	
	
	function clear()
	{
		local tempRoster = this.World.getTemporaryRoster();
		tempRoster.clear();
		this.m.Actor = null;
	}
	
	function checkActorAlive(actor)
	{
		local sprites = ["head", "body", "hair", "beard", "tattoo_head", "tattoo_body"];
		foreach(spriteName in sprites) {
			local sprite = actor.getSprite(spriteName);
			if(sprite == null) {
				return false;
			}	
		}

		return true;
	}
	
	function checkSpriteAlive(actor, sprite)
	{
		sprites = ["head", "body", "hair", "beard", "tattoo_head", "tattoo_body"];
		local sprite = actor.getSprite(spriteName);
		if(sprite == null) {
			this.initializeActor();
			return this.updateAllLayers();
			
		}	
		return true;
	}
	
	function logSprites(actor)
	{
		logInfo("logging sprites");
		logSprite(actor, "head");
		logSprite(actor, "body");
		logSprite(actor, "hair");
		logSprite(actor, "beard");
		logSprite(actor, "tattoo_head");
		logSprite(actor, "tattoo_body");
	}
	
	
	function logSprite(actor, spriteName)
	{
		local brush = actor.getSprite(spriteName).getBrush();
		local brushName = "none";
		if (brush != null)
		{
			 brushName = actor.getSprite(spriteName).getBrush().Name;
		}
		logInfo(spriteName + ":" + brushName);
	}
};