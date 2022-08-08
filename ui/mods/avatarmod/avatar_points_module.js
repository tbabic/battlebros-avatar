var AvatarPointsModule = function(parentDiv) {
	
	this.totalPoints = 100;
	this.currentPoints = 0;
	
	this.totalTalents = 9;
	this.currentTalents = 0;
	
	var row = $('<div class="row" />');
	parentDiv.append(row);
	var title = $('<div class="title-font-big font-color-title"></div>');
	row.append(title);
	this.pointsDiv = $('<label style="margin-right: 2rem"/>');
	this.pointsDiv.text('Points: ' + this.currentPoints + '/'+ this.totalPoints);
	title.append(this.pointsDiv);
	
	
	this.talentsDiv = $('<label/>');
	this.talentsDiv.text('Talents: ' + this.currentTalents + '/'+ this.totalTalents);
	title.append(this.talentsDiv);
	
	
	
}

AvatarPointsModule.prototype.changePoints = function(value) {
	this.currentPoints+=+value;
	this.pointsDiv.text('Points: ' + this.currentPoints + '/'+ this.totalPoints);
	$(window).trigger("pointsModule.changed");
	
};

AvatarPointsModule.prototype.availablePoints = function() {
	return this.totalPoints - this.currentPoints;
};

AvatarPointsModule.prototype.changeTalents = function(value) {
	this.currentTalents+=value;
	this.talentsDiv.text('Talents: ' + this.currentTalents + '/'+ this.totalTalents);
	$(window).trigger("pointsModule.changed");
};

AvatarPointsModule.prototype.availableTalents = function() {
	return this.totalTalents - this.currentTalents;
};