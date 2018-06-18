$.fn.wcGroupTable = function(groupData, opt)
{	
	const groupBody = $("<div/>").addClass('wc-table-body');
	const groupTable = makeGroupWrap()
							.appendTo(groupBody);
	const groupTHEAD = makeGroupHeader(opt)
							.appendTo(groupTable);
	const groupTBody = makeGroupTBody(groupData, opt)
							.appendTo(groupTable);

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
		cell.attr('data-id', values.team.id);
		cell.appendTo(row);
	}

	return row;
}