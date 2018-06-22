console.log('Hello');
async function _group_Loading() {
	$("#group-content").hide();

	const groups = await getGroupInfo();
	const matches = await getGames();

	$("#group-loading").fadeOut(500);
	$("#group-content").fadeIn(500);
	// const flags = await getAllFlags();
	reloadGroupTable('A');

	function reloadGroupTable(name)
	{
		$("#group-display").wcGroupTable(groups[name], {
			columns: [
				{title: "#", value: "pos"},
				{title: "Tên Đội", value: "country", class: 'wc-table-team'},
				{title: "ST", value: "games_played"},
				{title: "T", value: "wins"},
				{title: "H", value: "draws"},
				{title: "B", value: "losses"},
				{title: "TG", value: "goals_for"},
				{title: "TH", value: "goals_against"},
				{title: "HS", value: "goal_differential"},
				{title: "Điểm", value: "points"}
			]
		});

		const teamCodeList = [];
		for (const team of groups[name].teams) {
			teamCodeList.push(team.team.fifa_code);
		}
		console.log(teamCodeList);

		createMatchList($('#group-matches').get(0), matches, teamCodeList);
	}

	$("#group-name").on('change', function() {
		const name = $(this).val();
		reloadGroupTable(name);
	});

	
}
_group_Loading();