// World Cup API get from http://worldcup.sfg.io/
// Flags API get from http://countryflags.io

/**
 * Lay du lieu teams, games, bang dau tu API tren mang
 * @param {string} endpoint endpoint of API
 * @param { Function } callback hàm callback(err, data) sau khi nhận được data
 * @return { json } { err: string|false, msg : string, data: json}
 */
async function getWCData(endpoint)
{
	const res = await fetch("https://world-cup-json.herokuapp.com/" + endpoint);
	
	if (!res.ok) {
		return {
			err: true,
			msg: res
		};
	}

	const json = await res.json().catch(err=>{
		return {
			err: true,
			msg: err
		};
	});

	return {
		err: false,
		data: json
	}
}

/**
 * get teams infomations
 */
async function getTeamsData()
{
	const teamList = {};

	const rawData = await getWCData('teams');
	if (rawData.err)
	{
		console.log(rawData.msg);
		return null;
	}

	for (const team of rawData.data)
	{
		teamList[team.fifa_code] = team;
	}

	return teamList;
}

/**
 * get group standing info
 */
async function getGroupInfo()
{
	const rawGroupList = await getWCData('teams/group_results');
	const groupInfo = {};

	if (rawGroupList.err)
	{
		console.log(rawGroupList.msg);
		return null;
	}

	for (const group of rawGroupList.data)
	{
		let info = group.group;

		let pos = 1;
		for (let teamInfo of info.teams)
		{
			teamInfo.team['pos'] = pos++;
		}

		let name = info.letter;
		groupInfo[name] = info;
	}

	return groupInfo;
}

async function getMyISOLookup()
{
	const res = await fetch('/worldcup2018/api/FifaCodeToISOCode.json');
	const json = res.json();
	return json;
}

async function getAllFlags(teamsData)
{
	const flags_team = {};
	const lookupISOCode = await getMyISOLookup();

	for (const code of Object.keys(teamsData))
	{
		let isoCode = code;

		if (lookupISOCode.hasOwnProperty(isoCode))
		{
			isoCode = lookupISOCode[isoCode];
		}
		else {
			isoCode = isoCode.slice(0,-1);
		}

		flags_team[code] = "https://countryflags.io/"+isoCode+"/flat/64.png";
	}

	return flags_team;
}


async function getGames()
{
	const rawGroupList = await getWCData('matches/');
	let gamesList = [];

	if (rawGroupList.err)
	{
		console.log(rawGroupList.msg);
		return null;
	}

	gamesList = rawGroupList.data;

	return gamesList;
}$.fn.wcGroupTable = function(groupData, opt)
{	
	const groupBody = $("<div/>").addClass('wc-table-body');
	const groupTable = makeGroupWrap()
							.appendTo(groupBody);
	const groupTHEAD = makeGroupHeader(opt)
							.appendTo(groupTable);
	const groupTBody = makeGroupTBody(groupData, opt)
							.appendTo(groupTable);

	this.children().remove();
	this.append(groupBody);
	return this;
}

function makeGroupWrap()
{
	return $("<table/>");
}

function makeGroupHeader(opt)
{
	const header = $("<thead/>");
	const trHead = $("<tr/>").appendTo(header);

	for (let col of opt.columns)
	{
		$('<th/>').text(col.title)
				.appendTo(trHead);
	}

	return header;
}

function makeGroupTBody(groupData, opt)
{
	let groupTBody = $("<tbody/>");
	for (const team of groupData.teams)
	{
		const row = makeGroupRow(team, opt);
		row.appendTo(groupTBody);
	}

	return groupTBody;
}

function makeGroupRow(values, opt)
{
	const row = $("<tr/>");
	for (let colInfo of opt.columns)
	{
		let cell = $('<td/>');
		if (!!colInfo.class) cell.addClass(colInfo.class);
		cell.text(values.team[colInfo.value]);
		cell.attr('data-code', values.team.fifa_code);
		cell.appendTo(row);
	}

	return row;
}/*
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