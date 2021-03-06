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
}