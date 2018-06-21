/*
* Để sử dụng các hàm bên dưới, cần sử dụng thư viện JQuery
*/

/**
 * 
 * @param {*} info 
 */
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

/**
 * 
 * @param {HTMLElement} rootEl 
 */
function createMatchList(rootEl, matchList, teamCodeList = [])
{
	$(rootEl).children().remove();

	if (teamCodeList.length === 0)
	for (let match of matchList) {
		if (match.home_team.code == "TBD") continue;

		$(rootEl).append(_createMatchRow(match));
	}

	else
	for (let match of matchList) {
		if (teamCodeList.indexOf(match.home_team.code) < 0) continue;
		$(rootEl).append(_createMatchRow(match));
	}
}

/**
 * 
 * @param {*} matchInfo 
 */
function _createMatchRow(matchInfo)
{
	const datetime = new Date(matchInfo.datetime);
	const dateStr = datetime.toLocaleDateString('vi-VN');
	const timeStr = datetime.getHours()+"h";


	const status = matchInfo.status;

	const hometeam = matchInfo.home_team;
	const awayteam = matchInfo.away_team;
	const homeGoals = hometeam.goals;
	const awayGoals = awayteam.goals;

	const mainRow = $('<tr/>').addClass('wc-match-row');

	const dateDiv = $('<td/>').addClass('wc-match-date').text(dateStr).appendTo(mainRow);
	const timeDiv = $('<td/>').addClass('wc-match-time').text(timeStr).appendTo(mainRow);
	const homeDiv = $('<td/>').addClass('wc-match-team').text(hometeam.country).appendTo(mainRow);
	const homeGoalsDiv = $('<td/>').addClass('wc-match-goals').text(homeGoals).appendTo(mainRow);
	const awayGoalsDiv = $('<td/>').addClass('wc-match-goals').text(awayGoals).appendTo(mainRow);
	const awayDiv = $('<td/>').addClass('wc-match-team').text(awayteam.country).appendTo(mainRow);

	if (homeGoals > awayGoals) {
		homeDiv.addClass('win');
		homeGoalsDiv.addClass('win');
	}
	else if (homeGoals < awayGoals) {
		awayDiv.addClass('win');
		awayGoalsDiv.addClass('win');
	}

	const now = new Date();
	const tomorrow = (new Date(now.getTime() + 24*3600*1000));

	if (now.getDate() == datetime.getDate()) {
		dateDiv.text("Hôm nay");
		mainRow.addClass('now');
	}
	else if (tomorrow.getDate() == datetime.getDate())
	{
		dateDiv.text("Ngày mai");
	}
	else if (now.getDate() > datetime.getDate()) {
		mainRow.addClass('past');
	}

	if (status != "future") {
		timeDiv.text( timeDiv.text() + "- " + matchInfo.time );
	}

	return mainRow;
}