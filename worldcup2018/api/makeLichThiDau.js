function createMatchPanel(info)
{
	const group = info.group;
	const status = info.status;
	const time = new Date(info.time);
	const dateStr = time.toLocaleDateString('vi-VN');
	const timeStr = time.toLocaleTimeString();

	const hometeam = info.hometeam;
	const awayteam = info.awayteam;
	const link = info.link

	const infoDiv = $('<div/>').addClass('wc-match-info').text('Bảng '+group);
	const dateDiv = $('<div/>').addClass('wc-match-date').text(dateStr);
	const timeDiv = $('<div/>').addClass('wc-match-time').text(timeStr);

	const scoreDiv = $('<tr/>').addClass('wc-match-score');
	const homeDiv = $('<td/>').addClass('wc-match-name').html(hometeam.name);
	const homeGoals = $('<td/>').addClass('wc-match-goals').text(hometeam.goals);
	const awayDiv = $('<td/>').addClass('wc-match-name').text(awayteam.name);
	const awayGoals = $('<td/>').addClass('wc-match-goals').text(awayteam.goals);

	scoreDiv.append(homeDiv).append(homeGoals).append(awayGoals).append(awayDiv);

	if (hometeam.goals > awayteam.goals) {
		homeDiv.addClass('wc-match-win');
	}
	else if (awayteam.goals > hometeam.goals) {
		awayDiv.addClass('wc-match-win');
	}

	const mainDiv = $("<a/>").addClass('wc-match-panel').attr('href', link).attr('target', '_blank');
	mainDiv
		.append(infoDiv)
		.append(dateDiv)
		.append(timeDiv)
		.append(scoreDiv);

	now = new Date();
	if (time.getDate() == now.getDate()) {
		mainDiv.addClass('now');
		dateDiv.text('Hôm nay');
	}
	else if (time.getDate() == now.getDate() + 1) {
		dateDiv.text('Ngày mai');
		homeGoals.text('-');
		awayGoals.text('-');
	}
	else if (time.getDate() < now.getDate()) {
		mainDiv.addClass('past');
	}
	else {
		//future
		homeGoals.text('-');
		awayGoals.text('-');
	}

	if (status == 'completed') {
		timeDiv.text('FT');
	}
	

	return mainDiv;
}